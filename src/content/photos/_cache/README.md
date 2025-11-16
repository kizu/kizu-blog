# API Fail Workaround

If the API fails to access the info to build the cache, these files can be build manually by opening the corresponding pages in the browser and running

```js
(() => {
  const photo = document.querySelector('.card-img-top');
	const data = {
    url: document.URL,
    "content": document.querySelector('.status-text')?.textContent,
    "created_at": document.querySelector('.media-body .timestamp')?.title,
    "reblogs_count": Number(document.querySelector('button:has(.fa-retweet)')?.textContent.trim() || 0),
    "favourites_count": parseInt(document.querySelector('button:has(.fa-heart)')?.textContent.trim(), 10),
    "edited_at": null,
    "replies_count": parseInt(document.querySelector('button:has(.fa-comment)')?.textContent.trim(), 10),
    	"location": document.querySelector('.location')?.textContent.trim(),
    "photos": [
			{
        "url": document.querySelector('.card-img-top')?.src,
        "preview_url": photo?.src.replace('.jpg', '_thumb.jpg'),
					"width": Number(photo?.getAttribute('width')),
					"height": Number(photo?.getAttribute('height')),
					"alt": photo?.alt,
      },
		]
  };
  const fileName = `${document.URL.match(/\d+$/g)[0]}.json`;
	const blob = new Blob([JSON.stringify(data, null, 4)], {
    type: 'application/json'
	});

  const pseudoLink = document.createElement("a");
  pseudoLink.href = URL.createObjectURL(blob);
  pseudoLink.download = fileName;
  pseudoLink.click();

  return blob;
})();
```
