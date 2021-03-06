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

      const userCount = await storage.userCount();

      const schema =
        req.headers["x-forwarded-proto"]
          ? "https"
          : "http";
      const reconstructedUri = `${schema}://${req.headers.host}`;

      res
        .status(200)
        .json({
          userCount,
          reconstructedUri,
        });
    } catch (ex) {
      console.error(ex);
      res.status(500);
    }
  }
);
