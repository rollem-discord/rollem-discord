import DiscordOauth2 from "discord-oauth2";
import { withSession } from "next-session";

const config = {
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  redirectUri: process.env.DISCORD_REDIRECT_URI,
  db_connection: process.env.DB_CONNECTION_STRING,
};
console.log(config);
const oauth = new DiscordOauth2(config);
import { Storage } from "@rollem/common/src/storage/storage";

import { NextApiRequest, NextApiResponse } from "next";
import { ApiRequest, DiscordSessionData } from "@rollem/ui/lib/withSession";

const storage = new Storage();
const storageInitialize$ = storage.initialize();

export default withSession(
  async (req: ApiRequest<DiscordSessionData>, res: NextApiResponse) => {
    await storageInitialize$;
    // console.log(util.inspect(req, true, null, true));
    const code = req.query["code"] as string;
    try {
      const response = await oauth.tokenRequest({
        code: code,
        scope: "identify guilds",
        grantType: "authorization_code",
      });

      const user = await oauth.getUser(response.access_token);
      const guilds = await oauth.getUserGuilds(response.access_token);

      req.session.access_token = response.access_token;
      req.session.refresh_token = response.refresh_token;
      req.session.scope = response.scope;
      req.session.expires_at = new Date(
        Date.now() + response.expires_in
      );
      req.session.user_id = user.id;
      await req.session.commit();

      const userData = await storage.getOrCreateUser(user.id /* discord id */);
      const userConnections = await storage.getOrCreateUserConnections({
        id: userData.id,
      });
      userConnections.discord_access_token = response.access_token;
      userConnections.discord_expires_at = new Date(
        Date.now() + response.expires_in
      );
      userConnections.discord_refresh_token = response.refresh_token;
      userConnections.discord_scope = response.scope;
      userConnections.discord_token_type = response.token_type;
      await storage.updateUserConnections(userConnections);

      res.redirect(
        `/api/auth/discord/getData`
      );
    } catch (ex) {
      console.error(ex);
      res.status(500);
    }
  }
);
