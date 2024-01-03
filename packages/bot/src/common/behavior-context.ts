import { User } from "@rollem/common";
import { has } from "lodash";

export type ParserVersion = 'v1' | 'v1-beta' | 'v2';

/** The content of database requests when they fail. */
export interface DatabaseFailure {
  error: string,
}

/** True if `something` is a DatabaseFailure object. */
export function isDatabaseFailure(something: DatabaseFailure | object | undefined): something is DatabaseFailure {
  return has(something, 'error');
}

/** The retrieved context for a behavior. */
export interface BehaviorContext {
  /** The stored user object. */
  user: User | DatabaseFailure | undefined;

  /** Options configured by setting bot roles. */
  roleConfiguredOptions: RoleConfiguredOptions;

  /** Options configured by inspecting the message. */
  messageConfiguredOptions: MessageConfiguredOptions;

  /** Per-message context info. */
  messageContext: MessageContext;
}

/** Options configured by setting bot roles. */
export interface RoleConfiguredOptions {
  whichParser: ParserVersion,
  requiredPrefix: string;
}

/** Options configured by inspecting the message. */
export interface MessageConfiguredOptions {
  /** How this message was originally interpreted by the adapter. */
  prefixStyle: PrefixStyle;
}

/** Context determined per-message, but not configuration. */
export interface MessageContext {
  /** True when the message was sent by a tupper-bot. */
  isTupperBot: boolean;
}

/** The way this command was initiated */
export enum PrefixStyle {
  /** Prefix is not known */
  Unknown,
  /** Prefix Required and Not Provided */
  Missing,
  /** A prefixed roll ( eg /roll 2d20dl1 ) */
  ProvidedOrNotRequired,
  /** A @ping-prefixed message  */
  DirectPing,
}

/** True if any known prefix style was provided. */
export function isKnownPrefix(style: PrefixStyle): boolean {
  switch (style) {
    case PrefixStyle.Unknown:
    case PrefixStyle.Missing:
      return false;
    default:
      return true;
  }
}