'use strict';
const Cheerio = require('cheerio');
const XRegExp = require('xregexp');

const Util = require('../utils');

const getName = (html, callback) => {

  const $ = Cheerio.load(html);
  const appName = $('meta[name="application-name"]').attr('content');
  const appLinkName = $('meta[property="al:ios:app_name"], meta[property="al:android:app_name"]').attr('content');
  const ogSiteName = $('meta[property="og:site_name"]').attr('content');
  const schemaName = $('meta[itemprop="name"]').attr('content');
  const title = $('title').text();

  let name = appName || appLinkName || schemaName || ogSiteName || title;

  if (Util.realLength(name) > 45) {
    // name has a max length of 45 characters. if we are greater than that, strip
    // down to 44 chars, and add a unicode ellipsis
    name = name.match(XRegExp('(\\pS|\\p{L}\\p{M}|[A-Za-z0-9\\s]|[\\!\\"\\#\\$\\%\\&\'\\(\\)\\*\\+\\,\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\]\\^\\_\\{\\|\\}\\~]){0,44}', 'xA'))[0] + '…';
  }

  if (callback) {
    callback(null, name);
  }

  return name;
};

module.exports = getName;
