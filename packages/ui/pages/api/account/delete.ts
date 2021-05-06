import DiscordOauth2 from "discord-oauth2";
import { withSession } from "next-session";
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
} from "@rollem/ui/lib/withSession";

export default withSession(
  async (req: RollemApiRequest<RollemSessionData>, res: NextApiResponse) => {
    try {
      await storageInitialize$;
      // console.log(util.inspect(req.session, true, null, true));
      const data = req.session as RollemSessionData;
      const user = await oauth.getUser(req.session.discord.auth.access_token);

      await storage.forgetUser(user.id /** Discord User ID */)

      await req.session.commit();
      await req.session.destroy();

      res.redirect(
        `/account/after-delete`
      );
    } catch (ex) {
      console.error(ex);
      res.status(500);
    }
  }
);
