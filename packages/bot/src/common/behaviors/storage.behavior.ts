import { Logger } from "@bot/logger";
import { BehaviorContext } from "@common/behavior-context";
import { BehaviorResponse } from "@common/behavior-response";
import { BehaviorBase, Trigger } from "@common/behavior.base";
import { Storage } from "@rollem/common";
import { Injectable } from "injection-js";

/** Storage commands tree. */
@Injectable()
export class StorageBehavior extends BehaviorBase {
  public label = 'storage';

  constructor(
    private readonly storage: Storage,
    logger: Logger,
  ) {
    super(logger);
  }

  public async onTaggedMessage(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    var commands = content.split(/\s+/);
    var i = 0;
    console.log({source: this.label, trigger, content, context});
    if (commands[i].toLowerCase() !== "storage") { return null; }

    switch (commands[++i]) {
      case "dump":
        const dumpResponse = ["```json", JSON.stringify(context.user, undefined, " "), "```"].join('\n');
        return { response: dumpResponse };

      case "forget":
        await this.storage.forgetUser(context.user.discordUserId);
        return { response: "You are forgotten." };

      case "":
      default:
        const defaultResponse = 
          [ `Unrecognized commands:`,
            "```",
            `${commands}`,
            "```",
            "Format:",
            "```",
            `storage <subcommand>`,
            "```",
            "`dump` - print everything we know about you",
            "`forget` - delete everything we know about you"
          ].join('\n');
        return { response: defaultResponse };
    }
  }

  public async onUntaggedMessage(trigger: Trigger, content: string, context: BehaviorContext): Promise<BehaviorResponse | null> {
    return null;
  }
}