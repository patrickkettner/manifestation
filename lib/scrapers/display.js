'use strict';
var Cheerio = require('cheerio');

function display(html, callback) {
  var $ = Cheerio.load(html);

  //fullscreen
  var qqFullScreen = $('[name=x5-fullscreen][content=true]');
  var ucFullScreen = $('meta[name=full-screen][content=yes]');

  var fullscreen = !!$().add(qqFullScreen).add(ucFullScreen).length;

  //standalone
  var qqStandalone = $('[name=x5-page-mode][content="app"]');
  var ucStandalone = $('[name=browsermode][content=application]');
  var iosStandalone = $('[name=apple-mobile-web-app-capable][content=yes]');
  var androidStandalone = $('[name=mobile-web-app-capable][content=yes]');


  var standalone = !!$().add(qqStandalone).add(ucStandalone).add(iosStandalone).add(androidStandalone).length;

  //minimal-ui
  var minimal = !!$('[name=viewport][content*=minimal-ui]').length;


  var _display = fullscreen || standalone || minimal || 'browser';

  if (callback) {
    callback(null, _display);
  }

  return _display;
}

module.exports = display;
