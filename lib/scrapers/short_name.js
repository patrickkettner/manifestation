'use strict';
var Cheerio = require('cheerio');
var XRegExp = require('xregexp');
var util = require('../utils');

var name = require('./name');

function shortName(html, callback) {
  var $ = Cheerio.load(html);
  var appName = $('meta[name="application-name"]').attr('content');
  var iosAppLinkTitle = $('meta[apple-mobile-web-app-title]').attr('content');
  var appLinkName = $('meta[property="al:ios:app_name"], meta[property="al:android:app_name"]').attr('content');
  var ogSiteName = $('meta[property="og:site_name"]').attr('content');
  var schemaName = $('meta[itemprop="name"]').attr('content');
  var title = $('title').text();
  var shortestName;

  var longName = name(html);

  var longNames = [
    iosAppLinkTitle,
    longName,
    appName,
    appLinkName,
    ogSiteName,
    schemaName,
    title
  ];

  // strip out combining characters to get a more accurate symbol count
  var longNameLength = util.realLength(longName);

  if (longNameLength <= 15) {

    // we don't need a second shortname if longName is 15 chars are less
    callback(null, longName);

  } else {

    // the name is too long, so we try to find the shortest version of available names
    longNames = longNames.sort(function(a, b) {
      return a.length > b.length ? 1 : -1;
    });

    // if the shortest of the names if 15 or less, we use that
    shortestName = longNames.filter(function(name) {
      return name && util.realLength(name) <= 15;
    })[0];


    // Otherwise we just punt, and take the shortest of the options, and truncate
    // it to 15
    if (!shortestName) {
      shortestName = longNames[0].match(XRegExp('(\\pS|\\p{L}\\p{M}|[A-Za-z0-9\\s]|[\\!\\"\\#\\$\\%\\&\'\\(\\)\\*\\+\\,\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\]\\^\\_\\{\\|\\}\\~]){0,15}', 'xA'))[0];
    }

    callback(null, shortestName);
  }
}

module.exports = shortName;
