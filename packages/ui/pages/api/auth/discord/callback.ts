import { NextApiRequest, NextApiResponse } from "next";
import { RollemApiRequest, RollemSessionData } from "@rollem/ui/lib/withSession";
import { storage, storageInitialize$ } from "@rollem/ui/lib/storage";
import { withSession } from "next-session";
import { oauth } from "@rollem/ui/lib/configured-discord-oauth";
import * as util from 'util';

export default withSession(
  async (req: RollemApiRequest<RollemSessionData>, res: NextApiResponse) => {
    await storageInitialize$;
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
        redirectUri: `${schema}://${req.headers.host}`
      });

      const user = await oauth.getUser(response.access_token);
      const guilds = await oauth.getUserGuilds(response.access_token);
      await req.session.commit();

      const userData = await storage.getOrCreateUser(user.id /* Discord ID */);

      req.session.discord = req.session.discord || {} as any;
      req.session.discord.auth = response;
      req.session.discord.expires_at = new Date(
        Date.now() + response.expires_in
      );
      req.session.discord.user = user;
      req.session.discord.guilds = guilds;
      req.session.data = req.session.data || {} as any;
      req.session.data.user = userData;

      res.redirect(
        `/account`
      );
    } catch (ex) {
      console.error(ex);
      console.error(util.inspect(ex?.response, true, 100, false));
      res.status(500);
    }
  }
);
