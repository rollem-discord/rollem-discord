import DiscordOauth2 from "discord-oauth2";

const config = {
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  db_connection: process.env.DB_CONNECTION_STRING,
};

// console.log(config);

export const oauth = new DiscordOauth2(config);