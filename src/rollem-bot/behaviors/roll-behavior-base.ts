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
      this.logger.trackEvent('deferral to ' + names);
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
}