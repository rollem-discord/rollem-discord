import DiscordOauth2 from 'discord-oauth2';
import util from 'util';
const oauth = new DiscordOauth2({
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  redirectUri: process.env.DISCORD_REDIRECT_URI,
});

import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(util.inspect(req, true, null, true));
  const code = req.query['code'] as string;
  console.log(code);
  try {
    const response = await oauth.tokenRequest({
      code: code,
      scope: 'identify guilds',
      grantType: 'authorization_code'});
    
    console.log(util.inspect(res, true, null, true))
    const user = await oauth.getUser(response.access_token);
    const guilds = await oauth.getUserGuilds(response.access_token);
    res.status(200).json({ user: user, guilds: guilds })
  } catch(ex) {
    console.error(util.inspect(ex, true, null, true));
    res.status(500);
  }
}
