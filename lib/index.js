'use strict';

const Request = require('request');
const Async = require('async');

const Dir = require('./scrapers/dir');
const Lang = require('./scrapers/lang');
const Name = require('./scrapers/name');
const Icons = require('./scrapers/icons');
const Scope = require('./scrapers/scope');
const Display = require('./scrapers/display');
const Start_url = require('./scrapers/start_url');
const Short_name = require('./scrapers/short_name');
const Theme_color = require('./scrapers/theme_color');
const Description = require('./scrapers/description');
const Orientation = require('./scrapers/orientation');
const Background_color = require('./scrapers/background_color');
const Related_applications = require('./scrapers/related_applications');
const Prefer_related_applications = require('./scrapers/prefer_related_applications');

const Manifestation = (opts, callback) => {

  // we just want to do all of our work off of an HTML string, so if we are
  // given a URL, go and download it, then restart with the result

  if (!opts.html && opts.url) {
    Request({
      url: opts.url,
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2763.0 Safari/537.36'
      }
    }, (err, response, body) => {

      if (err) {
        return callback(err);
      }

      opts.url = response.request.href;

      if (!body.length) {
        callback(new Error('empty body recieved for ' + opts.url + '. nothing to build from.'));
      }

      Manifestation({ url: opts.url, html: body }, callback);
    });
  }
  else if (opts.html) {
    // we have the url, and the html - lets do this thing
    const manifest = {};

    Async.parallel([
      (cb) => {

        Dir(opts.html, (e, r) => {

          manifest.dir = r;
          cb(e, r);
        });
      },
      (cb) => {

        Lang(opts.html, (e, r) => {

          manifest.lang = r;
          cb(e, r);
        });
      },
      (cb) => {

        Name(opts.html, (e, r) => {

          manifest.name = r;
          cb(e, r);
        });
      },
      (cb) => {

        Short_name(opts.html, (e, r) => {

          manifest.short_name = r;
          cb(e, r);
        });
      },
      (cb) => {

        Description(opts.html, (e, r) => {

          manifest.description = r;
          cb(e, r);
        });
      },
      (cb) => {

        Scope(opts.url, (e, r) => {

          manifest.scope = r;
          cb(e, r);
        });
      },
      (cb) => {

        Icons(opts, (e, r) => {

          manifest.icons = r;
          cb(e, r);
        });
      },
      (cb) => {

        Display(opts.html, (e, r) => {

          manifest.display = r;
          cb(e, r);
        });
      },
      (cb) => {

        Orientation(opts.html, (e, r) => {

          manifest.orientation = r;
          cb(e, r);
        });
      },
      (cb) => {

        Start_url(opts, (e, r) => {

          manifest.start_url = r;
          cb(e, r);
        });
      },
      (cb) => {

        Theme_color(opts.html, (e, r) => {

          manifest.theme_color = r;
          cb(e, r);
        });
      },
      (cb) => {

        Related_applications(opts.html, (e, r) => {

          manifest.related_applications = r;
          cb(e, r);
        });
      },
      (cb) => {

        Prefer_related_applications(opts.html, (e, r) => {

          manifest.prefer_related_applications = r;
          cb(e, r);
        });
      },
      (cb) => {

        Background_color(opts.html, (e, r) => {

          manifest.background_color = r;
          cb(e, r);
        });
      }
    ], (e) => callback(e, manifest) );

  }
  else {
    callback(new Error('Need a URL or HTML in order to work'));
  }
};

module.exports = Manifestation;
