import { DiscordBehaviorBase } from "./discord-behavior-base";
import { Parsers } from "@bot/lib/parsers";
import { Config } from "@bot/config";
import { Client, Message, TextChannel, GuildMember } from "discord.js";
import { Logger } from "@bot/logger";
import { Injectable } from "injection-js";
import { ContainerV1 } from "@language-v1/container";
import { default as NodeCache } from "node-cache";
import { RepliedMessageCache } from "@bot/lib/replied-message-cache";
import { Storage } from "@rollem/common";

// TODO: more fine-grained per-guild handlers with caching and all that

/** A base for classes that involve parsing and message handling. */
@Injectable()
export abstract class RollBehaviorBase extends DiscordBehaviorBase {
  constructor(
    protected readonly parsers: Parsers,
    protected readonly config: Config,
    protected readonly storage: Storage,
    protected readonly repliedMessageCache: RepliedMessageCache,
    client: Client,
    logger: Logger,
  ) { super(client, logger); }

  protected getRelevantRoleNames(message: Message, prefix: string) {
    if (!message.guild) { return []; }
    const me = message.guild.members.cache.get(this.client.user?.id || "0");
    if (!me) { return []; }
    const roleNames = me.roles.cache.map(r => r.name);
    const roles = roleNames.filter(rn => rn.startsWith(prefix));
    return roles;
  }

  protected getPrefix(message: Message) {
    const prefixRolePrefix = 'rollem:prefix:';
    const prefixRoles = this.getRelevantRoleNames(message, prefixRolePrefix);
    if (prefixRoles.length === 0) { return ""; }
    const prefix = prefixRoles[0].substring(prefixRolePrefix.length);
    return prefix;
  }

  /** Checks for the role 'rollem:v2' being applied to rollem. */
  protected shouldUseNewParser(message: Message) {
    const prefixRolePrefix = 'rollem:v2';
    if (!message.guild) { return false; } // DMs never use the new parser. For now.
    const prefixRoles = this.getRelevantRoleNames(message, prefixRolePrefix);
    if (prefixRoles.length === 0) { return false; }
    return true;
  }

  protected async shouldDefer(message: Message) {
    if (!message.guild) { return false; }
    if (!message.channel) { return false; }
    if (!(message.channel instanceof TextChannel)) { return false; }

    const channel = await message.channel.fetch();
    const members = channel.members;
    if (!members) { return false; }
    
    const deferToMembers =
      this.config.deferToClientIds.filter(userId => {
        const member = members.get(userId);
        const isOnline = member?.presence && member.presence.status === 'online';
        return isOnline;
      }).map(id => members.get(id) as GuildMember);

    if (deferToMembers.length > 0) {
      const names = deferToMembers.map(member => `${member.user.username} (${member.user.id})`).join(", ");
      this.logger.trackMessageEvent('deferral to ' + names, message);
      return true;
    }

    return false;
  }

  // TODO: Handle response type of rollem parser
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
      result.value = result.value ? "**Success!**" : "**Failure!**";
    }

    //spacing out along with a nice formatting of the role number. 
    response += '` ' + result.value + ' `' + ' ⟵ ' + result.pretties.split(']').join('] ');

    return response;
  }

  /**
   * Attempts to roll many dice from the given content
   * @returns The response message(s) or null
   */
  protected rollMany(message: Message, logTag: string, content: string, hasPrefix: boolean, requireDice: boolean): string[] | null {
    let parserVersion = "unknown";
    try {
      const shouldUseNewParser = this.shouldUseNewParser(message);
      if (shouldUseNewParser) {
        parserVersion = "v2";
        return this.rollManyV2(message, logTag, content, hasPrefix, requireDice);
      } else {
        parserVersion = "v1";
        return this.rollManyV1(message, logTag, content, hasPrefix, requireDice);
      }
    } catch (ex) {
      this.logger.trackMessageError(`Roll Many, ${logTag}: ${content}`, message);
      throw ex;
    }
  }

  protected rollManyV2(message: Message, logTag: string, content: string, hasPrefix: boolean, requireDice: boolean): string[] | null {
    return ["the v2 parser is not yet ready"];
  }

  protected rollManyV1(message: Message, logTag: string, content: string, hasPrefix: boolean, requireDice: boolean): string[] | null {
    let count = 1;
    const match = content.match(/(?:(\d+)#\s*)?(.*)/);
    const countRaw = match ? match[1] : false;
    if (countRaw) {
      count = parseInt(countRaw, 10);
      if (count > 100) { return null; }
      if (count < 1) { return null; }
    }

    count = count || 1;
    const contentAfterCount = match ? match[2] : content;

    const lines: string[] = [];
    for (let i = 0; i < count; i++) {
      const result = this.parsers.v1.tryParse(contentAfterCount);
      if (!result) { return null; }

      const shouldReply = hasPrefix || (result.depth > 1 && result.dice > 0); // don't be too aggressive with the replies
      if (!shouldReply) { return null; }

      const response = this.buildMessage(result, requireDice);

      if (response && shouldReply) {
        lines.push(response);
      }
    }

    if (lines.length > 0) {
      this.logger.trackMessageEvent(`Roll Many v1, ${logTag}: ${content}`, message);
    }

    return lines;
  }

  /** 
   * Replies to the message and logs, if necessary.
   * @param logTag The tag for this log path.
   * @param lines The grouped replies, or null.
   * @returns True if a response was sent.
   */
  protected async replyAndLog(message: Message, logTag: string, lines: string[] | null): Promise<boolean> {
    if (lines && lines.length > 0) {

      const response = "\n" + lines.join("\n");

      await message.reply(response).catch(rejected => this.handleSendRejection(message));

      if (lines.length === 1) { this.logger.trackMessageEvent(`${logTag}`, message); }
      else { this.logger.trackMessageEvent(`${logTag}, repeated`, message); }

      return true;
    }

    return false;
  }
}