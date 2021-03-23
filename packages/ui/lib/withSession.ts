import { NextApiRequest } from 'next';

export interface DiscordSessionData {
  access_token: string;
  refresh_token: string;
  expires_at: Date;
  user_id: string;
  scope: string;

  display_name: string;
  display_avatar: string;
}

export type ApiRequest<T> = NextApiRequest & {
  session: { commit(): Promise<void> } & T
};