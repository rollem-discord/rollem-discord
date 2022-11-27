import { login, MastoClient, Notification, Status, Account, CreateStatusParams } from 'masto';
import { App } from "./app";
import { default as LRUCache } from "lru-cache";
import { ContainerV1, RollemParserV1, RollemParserV1Beta, RollemParserV2 } from "@rollem/language";

import { transform, getFonts, revertTransform } from 'convert-unicode-fonts';
const fonts = getFonts();

enum CombiningSymbols {
  ShortStrikethru = '\u0335',
  LongStrikethru = '\u0336',
  ShortSlash = '\u0337',
  LongSlash = '\u0338',
}

function zipWithSymbol(text: string, symbol: CombiningSymbols) {
  return text.split('').join(symbol) + symbol;
}

interface CWResponse {
  header: string;
  belowFold: string;
}

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
  private handledPostsCache: LRUCache<string, Status>;

  constructor(masto: MastoClient) {
    this.masto = masto;
    this.parser = new RollemParserV1();
    this.handledPostsCache = new LRUCache<string, Status>({
      max: 500,
      ttl: 5 * 60 * 1000, // 5 minutes
    });
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
    
    if (status.account.id === this.me?.id) {
      return;
    }

    if (status.account.bot) {
      return;
    }

    if (this.handledPostsCache.has(status.id)) {
      return;
    }

    this.handledPostsCache.set(status.id, status);

    console.log(`|${followTag}| ${status.account.username}: ${status.content}`);

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
    const realResponses = responses.filter(r => !!r) as CWResponse[];
    if (realResponses.length > 0) {
      console.log(realResponses);
      let headerBody = realResponses.map(r => r.header).join(", ");
      let belowFold = realResponses.map(r => r.belowFold).join("\n")

      // apply bold-strikethru
      belowFold = belowFold.replace(/\*\*\~\~(.+?)\~\~\*\*/g, s => {
        const snipped = s.substring(4, s.length - 4);
        const zipped = zipWithSymbol(snipped, CombiningSymbols.ShortStrikethru);
        const transformed = transform(zipped, fonts['sansSerifBold']);
        return transformed;
      });
      belowFold = belowFold.replace(/\~\~\*\*(.+?)\*\*\~\~/g, s => {
        const snipped = s.substring(4, s.length - 4);
        return zipWithSymbol(snipped, CombiningSymbols.ShortStrikethru);
      });

      // apply bold
      belowFold = belowFold.replace(/\*\*(.+?)\*\*/g, s => {
        const snipped = s.substring(2, s.length - 2);
        const transformed = transform(snipped, fonts['sansSerifBold']);
        console.log(s, snipped, transformed);
        return transformed;
      });

      // apply strikethru
      belowFold = belowFold.replace(/\~\~(.+?)\~\~/g, s => {
        const snipped = s.substring(2, s.length - 2);
        return zipWithSymbol(snipped, CombiningSymbols.LongStrikethru);
      });

      // remove code ticks
      belowFold = belowFold.replace(/`/g, '');

      // responseBody = `𝗨𝗻𝗶𝗰𝗼𝗱𝗲?\n` + responseBody;
      const config: CreateStatusParams = {
        spoilerText: headerBody,
        status: belowFold,
        inReplyToId: status.id,
        visibility: 'unlisted',
      };

      console.log(config);
      await this.masto.statuses.create(config);
    }
  };

  protected buildMessage(result: ContainerV1 | false, requireDice = true): CWResponse | false {
    if (result === false) { return false; }
    if (result.error) { return { header: "error", belowFold: result.error }; }
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

    return {
      header: `${result.value} ${result.label}`,
      belowFold: response,
    };
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
      console.log(`Followed by ${notification.account.acct}. Following back`);
      await this.masto.accounts.follow(notification.account.id);
    }

    if (notification.type === 'follow_request') {
      console.log(`Followed by ${notification.account.acct}. Following back`);
      await this.masto.accounts.follow(notification.account.id);
    }
  };
}

// main
RollemMastodon.init().catch((error) => {
  throw error;
});

const app = new App();
