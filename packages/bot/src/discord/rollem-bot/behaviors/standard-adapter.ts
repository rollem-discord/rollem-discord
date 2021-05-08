import { Client, Message } from "discord.js";
import { Logger, LoggerCategory } from "@bot/logger";
import { Inject, Injectable } from "injection-js";
import { BehaviorBase } from "@common/behavior.base";
import { Config } from "../config";
import { RepliedMessageCache } from "../lib/replied-message-cache";
import { BehaviorContext, ParserVersion } from "@common/behavior-context";
import { Storage } from "@rollem/common";
import { DiscordBehaviorBase } from './discord-behavior-base';

/** A base for behaviors to be applied to a discord client. */
@Injectable()
export class StandardAdapter extends DiscordBehaviorBase {
  constructor(
    client: Client,
    logger: Logger,
    private readonly config: Config,
    private readonly storage: Storage,
    private readonly repliedMessageCache: RepliedMessageCache,
    @Inject(BehaviorBase) private readonly behaviors: BehaviorBase[],
  ) {
    super(client, logger);
    const behaviorNames = behaviors.map(b => b.constructor.name);
    console.log("Found Standard Behaviors", behaviorNames);
  }
  /** Applies the behavior to the given client. */
  public async apply(): Promise<void> {
    this.logger.trackSimpleEvent(LoggerCategory.BehaviorRegistration, `Registering Behavior: ${this.constructor.name}`)
    await this.register();
  }

  /** Called on initialization to register any callbacks with the discord client. */
  

  protected async register() {
    this.client.on('message', async message => {
      // ignore bots to avoid loops
      if (message.author.bot) { return; }

      // ignore re-delivered messages
      if (this.repliedMessageCache.hasSeenMessageBefore(message, "adapter")) { return; }

      const context = await this.buildContext(message);

      await this.handleAll(message, context);
    });
  }

  private async buildContext(message: Message): Promise<BehaviorContext> {
    const user = await this.storage.getOrCreateUser(message.author.id);

    const whichParser = this.selectParser(message);
    const requiredPrefix = this.getPrefix(message);

    return {
      user: user,
      roleConfiguredOptions: {
        whichParser,
        requiredPrefix,
      },
      messageConfiguredOptions: {
        isPrefixed: false,
      }
    }
  }

  /** Returns the processed content or null (if it should not be handled). */
  private async prepareMessage(message: Message, context: BehaviorContext): Promise<{ content: string, isPrefixed: boolean } | null> {
    let content = message.content;

    // ignore without prefix
    const match = content.match(this.config.mentionRegex);
    let strippedContent = content;
    if (match) {
      strippedContent = content.substring(match[0].length).trim();
    }

    // treat all DMs as prefixed messages
    if (!message.guild) {
      return { content: strippedContent, isPrefixed: true };
    }

    // if we are pinged, pass that through
    if (!!match) {
      return { content: strippedContent, isPrefixed: true };
    }

    if (context.roleConfiguredOptions.requiredPrefix) {
      const startsWithPrefix = strippedContent.startsWith(context.roleConfiguredOptions.requiredPrefix);

      if (!startsWithPrefix) {
        // if a prefix is required and not provided, do not handle at all
        return null;
      } else {
        // if a prefix is required and provided, treat it as unpinged
        const finalContent = strippedContent.substr(context.roleConfiguredOptions.requiredPrefix.length).trim();
        return { content: finalContent, isPrefixed: false };
      }
    }

    // otherwise assume we were not pinged
    return { content: strippedContent, isPrefixed: false };
  }

  private async handleAll(message: Message, context: BehaviorContext): Promise<void> {
    console.log({context})
    const preparedMessage = await this.prepareMessage(message, context);
    if (!preparedMessage) { return; }

    context.messageConfiguredOptions = { isPrefixed: preparedMessage.isPrefixed }

    console.log({event: 'handleAll-1', context, preparedMessage});

    for (const behavior of this.behaviors) {
      const result =
        preparedMessage.isPrefixed
        ? await behavior.onTaggedMessage(message, preparedMessage.content, context)
        : await behavior.onUntaggedMessage(message, preparedMessage.content, context);

      console.log({event: 'handleAll-2', label: behavior.label, context, preparedMessage, behavior});
      if (result) {
        this.logger.trackMessageEvent(LoggerCategory.BehaviorEvent, `${behavior.label}`, message, { result });
        message.reply(result.response).catch(rejected => this.handleSendRejection(message));
      }
    }
  }

  private getRelevantRoleNames(message: Message, prefix: string) {
    if (!message.guild) { return []; }
    const me = message.guild.members.cache.get(this.client.user?.id || "0");
    if (!me) { return []; }
    const roleNames = me.roles.cache.map(r => r.name);
    const roles = roleNames.filter(rn => rn.startsWith(prefix));
    console.log({roles})
    return roles;
  }

  private getPrefix(message: Message) {
    const prefixRolePrefix = 'rollem:prefix:';
    const prefixRoles = this.getRelevantRoleNames(message, prefixRolePrefix);
    if (prefixRoles.length === 0) { return ""; }
    const prefix = prefixRoles[0].substring(prefixRolePrefix.length);
    return prefix;
  }

  /** Checks for the role 'rollem:v2' being applied to rollem. */
  private selectParser(message: Message): ParserVersion {
    const v1BetaRole = 'rollem:beta';
    const v2Role = 'rollem:v2';
    if (!message.guild) { return 'v1'; } // DMs never use the new parser. For now.
    if (this.getRelevantRoleNames(message, v1BetaRole).length > 0) { return 'v1-beta'; }
    if (this.getRelevantRoleNames(message, v2Role).length > 0) { return 'v2'; }

    return 'v1';
  }
}