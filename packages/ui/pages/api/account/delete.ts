import DiscordOauth2 from "discord-oauth2";
import util from "util";

const config = {
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  redirectUri: process.env.DISCORD_REDIRECT_URI,
  db_connection: process.env.DB_CONNECTION_STRING,
};
console.log(config);
const oauth = new DiscordOauth2(config);
import { storage, storageInitialize$ } from "@rollem/ui/lib/storage";

import { NextApiRequest, NextApiResponse } from "next";
import {
  RollemApiRequest,
  RollemSessionData,
} from "@rollem/ui/lib/api/old.withSession";
import { apiHandleErrors } from "@rollem/ui/lib/api/errors.middleware";
import { withSession, withSessionRequired } from "@rollem/ui/lib/api/session.middleware";
import { Session } from "next-session/lib/types";
import { withDatabase } from "@rollem/ui/lib/api/database.middleware";


export default
  apiHandleErrors(withSession(withSessionRequired(withDatabase(
    async (req: NextApiRequest, res: NextApiResponse, session: Session<RollemSessionData>) => {
      try {
        // console.log(util.inspect(session, true, null, true));
        const user = await oauth.getUser(session.discord.auth.access_token);

        await storage.forgetUser(user.id /** Discord User ID */)

        await session.commit();
        await session.destroy();
      } catch (ex) {
        console.error(ex);
        return res.status(500).json({"error": { "code": "storage/unknown" }});
      }

      res.redirect(`/account/after-delete`);
    }
  ))));