import { login, MastoClient, Notification, Status, Account, CreateStatusParams } from 'masto';
import { App } from "./app";
import { ContainerV1, RollemParserV1, RollemParserV1Beta, RollemParserV2 } from "@rollem/language";

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

class RollemMastodon {
  private masto: MastoClient;

  private me?: Account = undefined;
  private followersLookup: Map<string, Account> = new Map<string, Account>();
  private lastFollowerLookupTime?: Date = undefined;
  private parser: RollemParserV1;

  constructor(masto: MastoClient) {
    this.masto = masto;
    this.parser = new RollemParserV1();
  }

  static async init() {
    const settings = getSettings();
  
    console.log("pre-login", settings);
    const masto = await login({
      url: settings.uri,
      accessToken: settings.token,
    });
    await new RollemMastodon(masto).subscribe();
  }

  private async updateFollowerCache() {
    const me = await this.masto.accounts.verifyCredentials();
    this.me = me;

    const result = this.masto.accounts.getFollowersIterable(me.id, {});
    const followers: Account[] = [];
    let page = await result.next();
    followers.push(...page.value as Account[]);
    while (!page.done) {
      page = await result.next();
      if (page.value) {
        followers.push(...page.value as Account[]);
      }
    }

    const newLookup = new Map<string, Account>();
    for (const follower of followers) {
      newLookup.set(follower.acct, follower);
    }

    this.followersLookup = newLookup;
    this.lastFollowerLookupTime = new Date(Date.now());
    
    console.log(`${newLookup.size} followers (${this.lastFollowerLookupTime.toISOString()})`);
  }

  private async subscribe() {
    await this.updateFollowerCache();
    const updateCacheDelayInMs = 60 * 1_000;
    setInterval(() => this.updateFollowerCache(), updateCacheDelayInMs);

    const timeline = await this.masto.stream.streamUser();

    // Add handlers
    timeline.on('update', this.handleUpdate);
    timeline.on('notification', this.handleNotification);
  }

  private handleUpdate = async (status: Status) => {
    const followsUs = !!this.followersLookup.get(status.account.acct);
    const mentionedUs = status.mentions.some(m => m.id === this.me?.id);
    const followTag = mentionedUs
      ? '@mention'
      : followsUs
      ? 'follower'
      : '-REMOVE-';
    console.log(`|${followTag}| ${status.account.username}: ${status.content}`);
    
    if (status.account.id === this.me?.id) {
      return;
    }

    if (status.account.bot) {
      return;
    }

    if (!followsUs && mentionedUs) {
      this.masto.accounts.unfollow(status.account.id);
      console.log(`Unfollowed ${status.account.acct}. No longer follows us.`);
    }

    if (!followsUs && !mentionedUs) {
      console.log("no follow or mention");
      console.log(status.mentions);
      return;
    }

    // handle inline matches
    let last: RegExpExecArray | null = null;
    let matches: string[] = [];
    let regex = /\[(.+?)\]/g;
    while (last = regex.exec(status.content)) {
      matches.push(last[1]);
    }

    const results = matches.map(m => this.parser.tryParse(m));
    const responses = results.map(r => this.buildMessage(r, false));
    var realResponses = responses.filter(r => !!r);
    if (realResponses.length > 0) {
      console.log(realResponses);
      const responseBody = realResponses.join("\n");
      const config: CreateStatusParams = {
        status: responseBody,
        inReplyToId: status.id,
        visibility: 'unlisted',

      };
      console.log(config)
      await this.masto.statuses.create(config);
    }
  };

  protected buildMessage(result: ContainerV1 | false, requireDice = true) {
    if (result === false) { return false; }
    if (result.error) { return result.error; }
    if (result.depth <= 1) { return false; }
    if (requireDice && result.dice < 1) { return false; }

    let response = "";

    if (result.label && result.label !== "") {
      response += "'" + result.label + "', ";
    }

    if (typeof (result.value) === "boolean") {
      // special case for boolean results
      result.value = result.value ? "**Success!**" : "**Failure!**";
      response += result.value + ' ⟵ ' + result.pretties.split(']').join('] ');
    } else {
      //spacing out along with a nice formatting of the role number, for all other results
      response += '` ' + result.value + ' `' + ' ⟵ ' + result.pretties.split(']').join('] ');
    }

    return response;
  }

  private handleNotification = async (notification: Notification) => {
    // When your status got favourited, log
    if (notification.type === 'favourite') {
      console.log(`${notification.account.username} favourited your status!`);
    }

    // When you got a mention, reply
    if (notification.type === 'mention' && notification.status) {
      await this.handleUpdate(notification.status);
    }

    // When you got followed, follow them back
    if (notification.type === 'follow') {
      console.log("Following back", notification.account.acct);
      await this.masto.accounts.follow(notification.account.id);
    }
  };
}

// main
RollemMastodon.init().catch((error) => {
  throw error;
});

const app = new App();
