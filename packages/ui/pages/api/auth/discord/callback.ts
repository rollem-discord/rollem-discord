import { NextApiRequest, NextApiResponse } from "next";
import { RollemSessionData, SessionError } from "@rollem/ui/lib/api/old.withSession";
import { storage, storageInitialize$ } from "@rollem/ui/lib/storage";
import { oauth } from "@rollem/ui/lib/configured-discord-oauth";
import * as util from 'util';
import { apiHandleErrors } from "@rollem/ui/lib/api/errors.middleware";
import { withSession, withSessionRequired } from "@rollem/ui/lib/api/session.middleware";
import { Session } from "next-session/lib/types";
import { withDatabase } from "@rollem/ui/lib/api/database.middleware";
import OAuth from "discord-oauth2";

function wrapError(ex: unknown): SessionError {
  if (ex instanceof Error) {
    return {
      name: ex.name,
      message: ex.message, 
    };
  } else {
    return {
      name: "unknown",
      message: "unknown",
    };
  }
}

export default
  apiHandleErrors(withSession(withSessionRequired(withDatabase(
    async (req: NextApiRequest, res: NextApiResponse, session: Session<RollemSessionData>) => {
    util.inspect(req, true, null, true);
    const code = req.query["code"] as string;

    let response: OAuth.TokenRequestResult;
    try {
      response = await oauth.tokenRequest({
        code: code,
        scope: "identify guilds",
        grantType: "authorization_code",
        redirectUri: process.env.DISCORD_REDIRECT_URI,
      });
    } catch (ex) {
      console.error(ex);
      console.error(util.inspect(ex?.response, true, 100, false));
      res.status(500).json({"error": { "code": "auth/login/unknown" }});
    }

    try {
      const user = await oauth.getUser(response.access_token);
      const guilds = await oauth.getUserGuilds(response.access_token);

      session.discord = session.discord || {} as any;
      session.discord.auth = response;
      session.discord.expires_at = new Date(
        Date.now() + response.expires_in
      );
      session.discord.user = user;
      session.discord.guilds = guilds;
    } catch (ex) {
      console.error(ex);
      console.error(util.inspect(ex?.response, true, 100, false));
      session.errors = session.errors || [];
      session.errors.push(wrapError(ex));
    } finally {
      await session.commit();
    }

    try {
      const userData = await storage.getOrCreateUser(session.discord.user.id /* Discord ID */);
      session.data = session.data || {} as any;
      session.data.user = userData;
    } catch (ex) {
      console.error(ex);
      console.error(util.inspect(ex?.response, true, 100, false));
      session.errors = session.errors || [];
      session.errors.push(wrapError(ex));
    } finally {
      await session.commit();
    }

    res.redirect(`/account`);
  }))));
