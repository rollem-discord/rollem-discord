import { NextApiRequest, NextApiResponse } from "next";
import { RollemApiRequest, RollemSessionData } from "@rollem/ui/lib/withSession";
import { storage, storageInitialize$ } from "@rollem/ui/lib/storage";
import { withSession } from "next-session";
import { oauth } from "@rollem/ui/lib/configured-discord-oauth";

export default withSession(
  async (req: RollemApiRequest<RollemSessionData>, res: NextApiResponse) => {
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
      await req.session.commit();

      const userData = await storage.getOrCreateUser(user.id /* Discord ID */);
      const userConnections = await storage.getOrCreateUserConnections({
        id: userData.id, /** Rollem ID */
      });

      req.session.discord = req.session.discord || {} as any;
      req.session.discord.auth = response;
      req.session.discord.expires_at = new Date(
        Date.now() + response.expires_in
      );
      req.session.discord.user = user;
      req.session.discord.guilds = guilds;
      req.session.data = req.session.data || {} as any;
      req.session.data.user = userData;
      req.session.data.userConnections = userConnections;

      res.redirect(
        `/account`
      );
    } catch (ex) {
      console.error(ex);
      res.status(500);
    }
  }
);
