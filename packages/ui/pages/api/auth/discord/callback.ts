import { NextApiRequest, NextApiResponse } from "next";
import { RollemSessionData } from "@rollem/ui/lib/api/old.withSession";
import { storage, storageInitialize$ } from "@rollem/ui/lib/storage";
import { oauth } from "@rollem/ui/lib/configured-discord-oauth";
import * as util from 'util';
import { apiHandleErrors } from "@rollem/ui/lib/api/errors.middleware";
import { withSession, withSessionRequired } from "@rollem/ui/lib/api/session.middleware";
import { Session } from "next-session/lib/types";
import { withDatabase } from "@rollem/ui/lib/api/database.middleware";

export default
  apiHandleErrors(withSession(withSessionRequired(withDatabase(
    async (req: NextApiRequest, res: NextApiResponse, session: Session<RollemSessionData>) => {
    // console.log(util.inspect(req, true, null, true));
    const code = req.query["code"] as string;
    try {
      const schema =
        req.headers["x-forwarded-proto"]
          ? "https"
          : "http";
      const response = await oauth.tokenRequest({
        code: code,
        scope: "identify guilds",
        grantType: "authorization_code",
        redirectUri: `${schema}://${req.headers.host}/api/auth/discord/callback`
      });

      const user = await oauth.getUser(response.access_token);
      const guilds = await oauth.getUserGuilds(response.access_token);
      await session.commit();

      const userData = await storage.getOrCreateUser(user.id /* Discord ID */);

      session.discord = session.discord || {} as any;
      session.discord.auth = response;
      session.discord.expires_at = new Date(
        Date.now() + response.expires_in
      );
      session.discord.user = user;
      session.discord.guilds = guilds;
      session.data = session.data || {} as any;
      session.data.user = userData;

      res.redirect(`/account`);
    } catch (ex) {
      console.error(ex);
      console.error(util.inspect(ex?.response, true, 100, false));
      res.status(500).json({"error": { "code": "auth/login/unknown" }});
    }
  }))));
