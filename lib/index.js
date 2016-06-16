'use strict';

var Request = require('request');
var Async = require('async');

var dir = require('./scrapers/dir');
var lang = require('./scrapers/lang');
var name = require('./scrapers/name');
var icons = require('./scrapers/icons');
var scope = require('./scrapers/scope');
var display = require('./scrapers/display');
var start_url = require('./scrapers/start_url');
var short_name = require('./scrapers/short_name');
var theme_color = require('./scrapers/theme_color');
var description = require('./scrapers/description');
var orientation = require('./scrapers/orientation');
var background_color = require('./scrapers/background_color');
var related_applications = require('./scrapers/related_applications');
var prefer_related_applications = require('./scrapers/prefer_related_applications');

var Manifestation = function(opts, callback) {

  // we just want to do all of our work off of an HTML string, so if we are
  // given a URL, go and download it, then restart with the result

  if (!opts.html && opts.url) {
    Request(opts.url, function fetchPage(err, response, body) {
      if (err) {
        return callback(err);
      }

      Manifestation({url: opts.url, html: body}, callback);
    });
  } else if (opts.html) {
    // we have the url, and the html - lets do this thing
    var manifest = {};

    Async.parallel([
      function(cb) {
        dir(opts.html, function(e, r) {
          manifest.dir = r;
          cb(e, r);
        });
      },
      function(cb) {
        lang(opts.html, function(e, r) {
          manifest.lang = r;
          cb(e, r);
        });
      },
      function(cb) {
        name(opts.html, function(e, r) {
          manifest.name = r;
          cb(e, r);
        });
      },
      function(cb) {
        short_name(opts.html, function(e, r) {
          manifest.short_name = r;
          cb(e, r);
        });
      },
      function(cb) {
        short_name(opts.html, function(e, r) {
          manifest.short_name = r;
          cb(e, r);
        });
      },
      function(cb) {
        description(opts.html, function(e, r) {
          manifest.description = r;
          cb(e, r);
        });
      },
      function(cb) {
        scope(opts.url, function(e, r) {
          manifest.scope = r;
          cb(e, r);
        });
      },
      function(cb) {
        icons(opts, function(e, r) {
          manifest.icons = r;
          cb(e, r);
        });
      },
      function(cb) {
        display(opts.html, function(e, r) {
          manifest.display = r;
          cb(e, r);
        });
      },
      function(cb) {
        orientation(opts.html, function(e, r) {
          manifest.orientation = r;
          cb(e, r);
        });
      },
      function(cb) {
        start_url(opts, function(e, r) {
          manifest.start_url = r;
          cb(e, r);
        });
      },
      function(cb) {
        theme_color(opts.html, function(e, r) {
          manifest.theme_color = r;
          cb(e, r);
        });
      },
      function(cb) {
        theme_color(opts.html, function(e, r) {
          manifest.theme_color = r;
          cb(e, r);
        });
      },
      function(cb) {
        related_applications(opts.html, function(e, r) {
          manifest.related_applications = r;
          cb(e, r);
        });
      },
      function(cb) {
        prefer_related_applications(opts.html, function(e, r) {
          manifest.prefer_related_applications = r;
          cb(e, r);
        });
      },
      function(cb) {
        background_color(opts.html, function(e, r) {
          manifest.background_color = r;
          cb(e, r);
        });
      }
    ], function(e) {
      callback(e, manifest);
    });

  } else {
    callback(new Error('Need a URL or HTML in order to work'));
  }
};

module.exports = Manifestation;
