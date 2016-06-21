## Manifestation

Kickstart your Progressive Web App journey with the information your site alredy contains. Manifestation downloads and scans the HTML of your site or app to try and build the most comprehensive [Wep App Manifest](https://www.w3.org/TR/appmanifest/) possible.

## Usage

```js
npm install manifestation
```

```js
const Manifestation = require('manifestation');

Manifestation({url: 'http://www.example.com'}, (err, manifest) => {

  if (err) throw err;

  console.log(manifest);

});
```

## Fields include

```js
  // outputs....
  // {
  //  "lang": "en",
  //  "dir": "ltr",
  //  "name": "Super Racer 2000",
  //  "description": "The ultimate futuristic racing game from the future!",
  //  "short_name": "Racer2K",
  //  "icons": [{
  //   "src": "icon/lowres.webp",
  //   "sizes": "64x64",
  //   "type": "image/webp"
  //    },{
  //      "src": "icon/lowres.png",
  //      "sizes": "64x64"
  //    }, {
  //      "src": "icon/hd_hi",
  //      "sizes": "128x128"
  //  }],
  //  "scope": "/racer/",
  //  "start_url": "/racer/start.html",
  //  "display": "fullscreen",
  //  "orientation": "landscape",
  //  "theme_color": "aliceblue",
  //  "background_color": "red",
  //  "related_applications": [{
  //        "platform": "play",
  //        "url": "https://play.google.com/store/apps/details?id=com.example.app1",
  //        "id": "com.example.app1"
  //    }, {
  //        "platform": "itunes",
  //        "url": "https://itunes.apple.com/app/example-app1/id123456789",
  //  }]
  //  "prefer_related_applications": false
  // }

});
```
