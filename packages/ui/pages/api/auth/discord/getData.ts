import DiscordOauth2 from "discord-oauth2";
import { withSession } from "next-session";
import util from 'util';

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
import { ApiRequest, DiscordSessionData } from "@rollem/ui/lib/withSession";

export default withSession(
  async (req: ApiRequest<DiscordSessionData>, res: NextApiResponse) => {
  try {
    await storageInitialize$;

    const user = await oauth.getUser(req.session.access_token);
    const guilds = await oauth.getUserGuilds(req.session.access_token);

    const userData = await storage.getOrCreateUser(user.id /* discord id */);
    const userConnections = await storage.getOrCreateUserConnections({
      id: userData.id,
    });

    console.log(util.inspect(req.session, true, null, true));

      res.status(200).json({ user: user, session: req.session, userData: userData, userConnections: userConnections, guilds: guilds });
    } catch (ex) {
      console.error(ex);
      res.status(500);
    }
  }
);
