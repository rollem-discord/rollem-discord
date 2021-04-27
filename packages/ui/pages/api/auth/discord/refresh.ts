import { NextApiRequest, NextApiResponse } from "next";
import { RollemApiRequest, RollemSessionData } from "@rollem/ui/lib/withSession";
import { storage, storageInitialize$ } from "@rollem/ui/lib/storage";
import { withSession } from "next-session";
import { oauth } from "@rollem/ui/lib/configured-discord-oauth";

export default withSession(
  async (req: RollemApiRequest<RollemSessionData>, res: NextApiResponse) => {
    await storageInitialize$;
    // console.log(util.inspect(req, true, null, true));
    try {
      const user = await oauth.getUser(req.session.discord.auth.access_token);
      const guilds = await oauth.getUserGuilds(req.session.discord.auth.access_token);
      await req.session.commit();

      const userData = await storage.getOrCreateUser(user.id /* discord id */);
      const userConnections = await storage.getOrCreateUserConnections({
        id: userData.id,
      });

      req.session.discord = req.session.discord || {} as any;
      req.session.discord.auth = req.session.discord.auth;
      req.session.discord.expires_at = req.session.discord.expires_at;
      req.session.discord.user = user;
      req.session.discord.guilds = guilds;
      req.session.data = req.session.data || {} as any;
      req.session.data.user = userData;

      res.redirect(
        `/account/summary`
      );
    } catch (ex) {
      console.error(ex);
      res.status(500);
    }
  }
);
