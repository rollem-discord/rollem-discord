import { RollemParser } from "@language/rollem";
import { BehaviorBase } from "./behavior-base";
import { Config } from "@bot/config";
import { Client, Message, TextChannel, GuildMember } from "discord.js";
import { Logger } from "@bot/logger";
import { Injectable } from "injection-js";

// TODO: more fine-grained per-guild handlers with caching and all that

/** A base for classes that involve parsing and message handling. */
@Injectable()
export abstract class RollBehaviorBase extends BehaviorBase {
  constructor(
    protected readonly parser: RollemParser,
    protected readonly config: Config,
    client: Client,
    logger: Logger,
  ) { super(client, logger); }

  protected getRelevantRoleNames(message: Message, prefix: string) {
    if (!message.guild) { return []; }
    let me = message.guild.members.get(this.client.user.id);
    if (!me) { return []; }
    let roleNames = me.roles.map(r => r.name);
    let roles = roleNames.filter(rn => rn.startsWith(prefix));
    return roles;
  }
  
  protected getPrefix(message: Message) {
    let prefixRolePrefix = 'rollem:prefix:';
    let prefixRoles = this.getRelevantRoleNames(message, prefixRolePrefix);
    if (prefixRoles.length == 0) { return ""; }
    let prefix = prefixRoles[0].substring(prefixRolePrefix.length);
    return prefix;
  }
  
  protected shouldDefer(message: Message) {
    if (!message.guild) { return false; }
    if (!message.channel) { return false; }
    if (!(message.channel instanceof TextChannel)) { return false; }
  
    let members = message.channel && message.channel.members;
    if (!members) { return false; }
  
    let deferToMembers =
      this.config.deferToClientIds.filter(id => {
        let member = members.get(id);
        let isOnline = member && member.presence && member.presence.status == 'online';
        return isOnline;
      }).map(id => members.get(id) as GuildMember);
  
    if (deferToMembers.length > 0) {
      let names = deferToMembers.map(member => `${member.user.username} (${member.user.id})`).join(", ");
      this.logger.trackMessageEvent('deferral to ' + names, message);
      return true;
    }
  
    return false;
  }
  
  // TODO: Handle response type of rollem parser
  protected buildMessage(result: any, requireDice = true) {
    if (result === false) { return false; }
    if (typeof (result) === "string") { return result; }
    if (result.depth <= 1) { return false; }
    if (requireDice && result.dice < 1) { return false; }
  
    var response = "";
  
    if (result.label && result.label != "") {
      response += "'" + result.label + "', ";
    }
    if (typeof (result.value) === "boolean") {
      result.value = result.value ? "**Success!**" : "**Failure!**";
    }
  
    response += result.value + ' ⟵ ' + result.pretties;
  
    return response;
  }

  /**
   * Attempts to roll many dice from the given content 
   * @returns The response message(s) or null
   */
  protected rollMany(content: string, hasPrefix: boolean, requireDice: boolean): string[] | null {
    let count = 1;
    let match = content.match(/(?:(\d+)#\s*)?(.*)/);
    let countRaw = match ? match[1] : false;
    if (countRaw) {
      count = parseInt(countRaw);
      if (count > 100) { return null; }
      if (count < 1) { return null; }
    }
  
    count = count || 1;
    let contentAfterCount = match ? match[2] : content;
  
    var lines: string[] = [];
    for (let i = 0; i < count; i++) {
      var result = this.parser.tryParse(contentAfterCount);
      if (!result) { return null; }
  
      let shouldReply = hasPrefix || (result.depth > 1 && result.dice > 0); // don't be too aggressive with the replies
      if (!shouldReply) { return null; }
  
      let response = this.buildMessage(result, requireDice);
  
      if (response && shouldReply) {
        lines.push(response);
      }
    }

    return lines;
  }

  /**
   * Replies to the message and logs, if necessary.
   * @param logTag The tag for this log path.
   * @param lines The grouped replies, or null.
   * @returns True if a response was sent.
   */
  protected replyAndLog(message: Message, logTag: string, lines: string[] | null): boolean {
    if (lines && lines.length > 0) {
      let response = "\n" + lines.join("\n");
      message.reply(response).catch(rejected => this.handleSendRejection(message));

      if (lines.length === 1) { this.logger.trackMessageEvent(`${logTag}`, message); }
      else { this.logger.trackMessageEvent(`${logTag}, repeated`, message); }

      return true;
    }

    return false;
  }
}