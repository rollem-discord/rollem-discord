import DiscordOauth2 from "discord-oauth2";

const config = {
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  redirectUri: process.env.DISCORD_REDIRECT_URI,
  db_connection: process.env.DB_CONNECTION_STRING,
};

console.log(config);

export const oauth = new DiscordOauth2(config);