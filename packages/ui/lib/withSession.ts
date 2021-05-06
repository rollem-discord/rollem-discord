import { User, UserConnections } from '@rollem/common';
import { IncomingMessage } from 'http';
import { NextApiRequest } from 'next';
import { Session, SessionCookieData } from 'next-session/dist/types';
import { DiscordTokenRequestResult, DiscordUser, DiscordPartialGuild } from './discord-oauth';

export interface DiscordSessionData {
  auth: DiscordTokenRequestResult;
  user: DiscordUser,
  guilds: DiscordPartialGuild[];
  expires_at: Date,
}

export interface RollemData {
  user: User,
  userConnections: UserConnections,
}

export interface RollemSessionData {
  discord: DiscordSessionData;
  data: RollemData,
}

export interface SessionThin {
  id: string;
  commit(): Promise<void>;
  destroy(): Promise<void>;
  isNew: boolean;
  cookie: SessionCookieData;
}

export type RollemApiRequest<T> = NextApiRequest & {
  session: SessionThin & T
};

export type RollemIncomingMessage<T> = IncomingMessage & {
  session?: SessionThin & T
};