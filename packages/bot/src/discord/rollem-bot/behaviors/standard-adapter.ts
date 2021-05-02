import { Client, Message } from "discord.js";
import { Logger } from "@bot/logger";
import { Inject, Injectable } from "injection-js";
import { BehaviorBase } from "@common/behavior.base";
import { Config } from "../config";
import { RepliedMessageCache } from "../lib/replied-message-cache";
import { BehaviorContext } from "@common/behavior-context";
import { Storage } from "@rollem/common";
import { DiscordBehaviorBase as DiscordBehaviorBase } from './discord-behavior-base';
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
    this.logger.trackSimpleEvent(`Registering Behavior: ${this.constructor.name}`)
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

    return {
      user: user,
    }
  }

  private async prepareMessage(message: Message): Promise<{ content: string, isPrefixed: boolean }> {
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

    // pass thru the "match" variable for Guilds
    return { content: strippedContent, isPrefixed: !!match };
  }

  private async handleAll(message: Message, context: BehaviorContext): Promise<void> {
    const preparedMessage = await this.prepareMessage(message);

    for (const behavior of this.behaviors) {
      const result =
        preparedMessage.isPrefixed
        ? await behavior.onTaggedMessage(message, preparedMessage.content, context)
        : await behavior.onUntaggedMessage(message, preparedMessage.content, context);
      if (result) {
        message.reply(result.response).catch(rejected => this.handleSendRejection(message));
      }
    }
  }
}