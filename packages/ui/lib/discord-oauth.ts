export interface DiscordPartialGuild {
	id: string;
	name: string;
	icon: string | null | undefined;
	owner?: boolean;
	permissions?: number;
	features: string[];
	permissions_new?: string;
}

export interface DiscordTokenRequestResult {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
}

export interface DiscordUser {
	id: string;
	username: string;
	discriminator: string;
	avatar: string | null | undefined;
	mfa_enabled?: true;
	locale?: string;
	verified?: boolean;
	email?: string | null | undefined;
	flags?: number;
	premium_type?: number;
	public_flags?: number;
}