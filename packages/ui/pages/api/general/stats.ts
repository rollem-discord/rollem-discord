import DiscordOauth2 from "discord-oauth2";

const config = {
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  redirectUri: process.env.DISCORD_REDIRECT_URI,
  db_connection: process.env.DB_CONNECTION_STRING,
};
console.log("config", config);
const oauth = new DiscordOauth2(config);
import { storage, storageInitialize$ } from "@rollem/ui/lib/storage";

import { NextApiRequest, NextApiResponse } from "next";
import {
  RollemSessionData,
} from "@rollem/ui/lib/api/old.withSession";
import { withDatabase } from "@rollem/ui/lib/api/database.middleware";
import { apiHandleErrors } from "@rollem/ui/lib/api/errors.middleware";
import { withSession, withSessionRequired } from "@rollem/ui/lib/api/session.middleware";
import { Session } from "next-session/lib/types";

export default
  apiHandleErrors(withSession(withSessionRequired(withDatabase(
    async (req: NextApiRequest, res: NextApiResponse, session: Session<RollemSessionData>) => {
    try {
      const userCount = await storage.userCount();

      const schema =
        req.headers["x-forwarded-proto"]
          ? "https"
          : "http";
      const reconstructedUri = `${schema}://${req.headers.host}`;

      return res
        .status(200)
        .json({
          userCount,
          reconstructedUri,
        });
    } catch (ex) {
      console.error(ex);
      return res.status(500).json({"error": { "code": "storage/unknown" }});
    }
  }
))));
