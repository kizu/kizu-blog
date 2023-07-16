import { MASTODON_URL } from '@consts';

export const getMastodonPostLink = (id?: string) =>
  `${MASTODON_URL}${id ? `/${id}` : ''}`;
