'use strict';
const IsURL = require('valid-url').is_web_uri;
const Url = require('url');

const scope = (url, callback) => {

  let _scope;

  if (url && !IsURL(url)) {
    // if the url exists and is not a valid wbe url (e.g. /foo), then
    // its probably the scope we want to use
    _scope = url;
  }
  else if (IsURL(url)) {
    // if we have a valid url, then its more liekly that we were given the homepage
    // for the app. So the path is the most liekly canidate for the scope
    _scope = Url.parse(url).path;
  }
  else {
    // I can't think of a better default
    _scope = '/';
  }

  if (callback) {
    callback(null, _scope);
  }

  return _scope;
};

module.exports = scope;
