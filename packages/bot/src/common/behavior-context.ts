import { User } from "@rollem/common";

export type ParserVersion = 'v1' | 'v1-beta' | 'v2';

/** The retrieved context for a behavior. */
export interface BehaviorContext {
  /** The stored user object. */
  user: User;

  /** Options configured by setting bot roles. */
  roleConfiguredOptions: RoleConfiguredOptions;

  /** Options configured by inspecting the message. */
  messageConfiguredOptions: MessageConfiguredOptions;
}

/** Options configured by setting bot roles. */
export interface RoleConfiguredOptions {
  whichParser: ParserVersion,
  requiredPrefix: string;
}

/** Options configured by inspecting the message. */
export interface MessageConfiguredOptions {
  /** True when the message came in as a prefixed command. */
  isPrefixed: boolean;
}