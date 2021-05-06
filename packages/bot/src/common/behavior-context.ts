import { User } from "@rollem/common";

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
  shouldUseNewParser: boolean;
  requiredPrefix: string;
}

/** Options configured by inspecting the message. */
export interface MessageConfiguredOptions {
  /** True when the message came in as a prefixed command. */
  isPrefixed: boolean;
}