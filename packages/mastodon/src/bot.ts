import { login } from 'masto';

function getSettings() {
  if (!process.env.MASTODON_URI) {
    throw new Error("Missing Mastodon URI");
  }

  if (!process.env.MASTODON_ACCESS_TOKEN) {
    throw new Error("Missing Mastodon URI");
  }
  const uri: string = process.env.MASTODON_URI;
  const token: string = process.env.MASTODON_ACCESS_TOKEN;

  return {
    uri,
    token,
  };
}

async function main() {
  const settings = getSettings();

  console.log("pre-login", settings);
  const masto = await login({
    url: settings.uri,
    accessToken: settings.token,
  });

  console.log("pre-toot");

  await masto.statuses.create({
    status: 'Hello Mastodon!',
    visibility: 'direct',
  });

  console.log("post-toot");
}

main().catch((error) => {
  console.error(error);
});