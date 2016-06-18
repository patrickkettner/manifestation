'use strict';
const Cheerio = require('cheerio');
const IsURL = require('valid-url').is_web_uri;
const Url = require('url');

const start_url = (opts, callback) => {

  const $ = Cheerio.load(opts.html);
  const url = opts.url;

  let startUrl = $('link[rel=start]').attr('href');

  if (!startUrl) {
    startUrl = $('[name=msapplication-starturl]').attr('content');
  }

  if (!startUrl) {
    if (url && !IsURL(url)) {
      // if the url exists and is not a valid wbe url (e.g. /foo), then
      // its probably the start_url we want to use
      startUrl = url;
    }
    else if (IsURL(url)) {
      // if we have a valid url, then its more likely that we were given the homepage
      // for the app. So the path is the most likely canidate for the start_url
      startUrl = Url.parse(url).path;
    }
    else {
      // I can't think of a better default
      startUrl = '/';
    }
  }

  if (callback) {
    callback(null, startUrl);
  }

  return startUrl;
};

module.exports = start_url;
