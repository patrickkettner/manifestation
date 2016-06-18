'use strict';
const Cheerio = require('cheerio');
const XRegExp = require('xregexp');
const Util = require('../utils');

const Name = require('./name');

const shortName = (html, callback) => {

  const $ = Cheerio.load(html);
  const appName = $('meta[name="application-name"]').attr('content');
  const iosAppLinkTitle = $('meta[apple-mobile-web-app-title]').attr('content');
  const appLinkName = $('meta[property="al:ios:app_name"], meta[property="al:android:app_name"]').attr('content');
  const ogSiteName = $('meta[property="og:site_name"]').attr('content');
  const schemaName = $('meta[itemprop="name"]').attr('content');
  const title = $('title').text();
  let shortestName;

  const longName = Name(html);

  let longNames = [
    iosAppLinkTitle,
    longName,
    appName,
    appLinkName,
    ogSiteName,
    schemaName,
    title
  ];

  // strip out combining characters to get a more accurate symbol count
  const longNameLength = Util.realLength(longName);

  if (longNameLength <= 15) {

    // we don't need a second shortname if longName is 15 chars are less
    callback(null, longName);

  }
  else {

    // the name is too long, so we try to find the shortest version of available names
    longNames = longNames.sort((a, b) => {

      a.length > b.length ? 1 : -1;
    });

    // if the shortest of the names if 15 or less, we use that
    shortestName = longNames.filter((name) => name && Util.realLength(name) <= 15)[0];


    // Otherwise we just punt, and take the shortest of the options, and truncate
    // it to 15
    if (!shortestName) {
      shortestName = longNames[0].match(XRegExp('(\\pS|\\p{L}\\p{M}|[A-Za-z0-9\\s]|[\\!\\"\\#\\$\\%\\&\'\\(\\)\\*\\+\\,\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\]\\^\\_\\{\\|\\}\\~]){0,15}', 'xA'))[0];
    }

    callback(null, shortestName);
  }
};

module.exports = shortName;
