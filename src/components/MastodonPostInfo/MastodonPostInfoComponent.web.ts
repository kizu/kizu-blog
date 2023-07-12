type Data = Record<string, unknown>;

const postsCache = new Map<string, Data>();

const pluralized = {
  replies: {
    one: 'reply',
    other: 'replies',
  },
  reblogs: {
    one: 'boost',
    other: 'boosts',
  },
  favourites: {
    one: 'favorite',
    other: 'favorites',
  },
}

export default class MastodonPostInfoComponent extends HTMLElement {
  constructor() {
    super();
      this.attachShadow({ mode: 'open' });
      const template = document.getElementById('mastodon-post-info-template');
      if (!(template instanceof HTMLTemplateElement)) {
        return;
      }
      this.shadowRoot?.appendChild(template?.content.cloneNode(true));
  }

  updateContent(data: Data) {
    const fields = this.shadowRoot?.querySelectorAll('[data-field]');
    if (!fields) {
      return;
    }
    for (const field of Array.from(fields)) {
      if (!(field instanceof HTMLElement)) {
        continue;
      }
      const name = field.dataset.field as keyof typeof pluralized;
      const count = data[`${name}_count`] as number | undefined;
      if (!count) {
        continue;
      }
      const label = pluralized[name][new Intl.PluralRules("en").select(count) as 'one' | 'other'];
      field.textContent = `${count} ${label}`;
    }
  }

  connectedCallback() {
    const link = this.querySelector('a');
    if (!link) {
      return;
    }
    const url = new URL(link.href);
    const instance = url.origin;
    const postId = url.pathname.split('/').pop();
    const currentURL = new URL(document.URL);
    let shouldLookup = false;
    // Id was not provided
    if (!postId || postId === '@kizu') {
      if (currentURL.pathname === '/') {
        return;
      }
      shouldLookup = true;
    }
    if (postId && !shouldLookup) {
      const cachedData = postsCache.get(postId);
      if (cachedData) {
        this.updateContent(cachedData);
        return;
      }
    }

    const observer = new IntersectionObserver((entries, self) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (shouldLookup) {
            // TODO: save the account id somewhere?
            fetch(`${instance}/api/v1/accounts/109298881215298619/statuses`)
              .then(response => response.json())
              .then((data: Data[]) => {
                const foundPost = data.filter(d => (d.content as string).includes(currentURL.pathname))[0];
                if (!foundPost) {
                  return;
                }
                postsCache.set(foundPost.id as string, foundPost);
                this.updateContent(foundPost);
              })
              .catch(error => {
                console.error('Failed to fetch Mastodon post information:', error);
              });
          } else {
            fetch(`${instance}/api/v1/statuses/${postId}`)
            .then(response => response.json())
            .then((data: Data) => {
              if (!postId) {
                return;
              }
              postsCache.set(postId, data);
              this.updateContent(data);
            })
            .catch(error => {
              console.error('Failed to fetch Mastodon post information:', error);
            });
          }
          self.disconnect();
        }
      }
    }, {});
    observer.observe(link);
  }
}

customElements.define('mastodon-post-info', MastodonPostInfoComponent);
