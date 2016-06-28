'use strict';

const Request = require('request');
const Async = require('async');

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

    const funcs = [
      'Dir',
      'Lang',
      'Name',
      'Icons',
      'Scope',
      'Display',
      'Start_url',
      'Short_name',
      'Theme_color',
      'Description',
      'Orientation',
      'Background_color',
      'Related_applications',
      'Prefer_related_applications'
    ].map((name) => {

      return (cb) => {

        require('./scrapers/' + name)(opts, (e, r) => {

          manifest[name.toLowerCase()] = r;
          cb(e, r);
        });
      };
    });

    Async.parallel(funcs, (e) => callback(e, manifest) );

  }
  else {
    callback(new Error('Need a URL or HTML in order to work'));
  }
};

module.exports = Manifestation;
