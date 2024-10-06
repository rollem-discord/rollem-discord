import { NextApiRequest, NextApiResponse } from "next";
import { RollemSessionData } from "@rollem/ui/lib/api/old.withSession";
import { storage } from "@rollem/ui/lib/storage";
import { oauth } from "@rollem/ui/lib/configured-discord-oauth";
import { withDatabase } from "@rollem/ui/lib/api/database.middleware";
import { apiHandleErrors } from "@rollem/ui/lib/api/errors.middleware";
import { withSession, withSessionRequired } from "@rollem/ui/lib/api/session.middleware";
import { Session } from "next-session/lib/types";

export default
  apiHandleErrors(withSession(withSessionRequired(withDatabase(
    async (req: NextApiRequest, res: NextApiResponse, session: Session<RollemSessionData>) => {
      // console.log(util.inspect(req, true, null, true));
      try {
        const user = await oauth.getUser(session.discord.auth.access_token);
        const guilds = await oauth.getUserGuilds(session.discord.auth.access_token);
        await session.commit();

        const userData = await storage.getOrCreateUser(user.id /* discord id */);

        session.discord = session.discord || {} as any;
        session.discord.auth = session.discord.auth;
        session.discord.expires_at = session.discord.expires_at;
        session.discord.user = user;
        session.discord.guilds = guilds;
        session.data = session.data || {} as any;
        session.data.user = userData;

        res.redirect(
          `/account/summary`
        );
      } catch (ex) {
        console.error(ex);
        return res.status(500).json({"error": { "code": "storage/unknown" }});
      }
    }
  ))));
