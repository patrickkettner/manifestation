'use strict';
const Cheerio = require('cheerio');

const display = (obj, callback) => {

  const $ = Cheerio.load(obj.html);

  //fullscreen
  const qqFullScreen = $('[name=x5-fullscreen][content=true]');
  const ucFullScreen = $('meta[name=full-screen][content=yes]');

  const fullscreen = !!$().add(qqFullScreen).add(ucFullScreen).length;

  //standalone
  const qqStandalone = $('[name=x5-page-mode][content="app"]');
  const ucStandalone = $('[name=browsermode][content=application]');
  const iosStandalone = $('[name=apple-mobile-web-app-capable][content=yes]');
  const androidStandalone = $('[name=mobile-web-app-capable][content=yes]');


  const standalone = !!$().add(qqStandalone).add(ucStandalone).add(iosStandalone).add(androidStandalone).length;

  //minimal-ui
  const minimal = !!$('[name=viewport][content*=minimal-ui]').length;


  const _display = (fullscreen && 'fullscreen')
    || (standalone && 'standalone')
    || (minimal && 'minimal-ui')
    || 'browser';

  if (callback) {
    callback(null, _display);
  }

  return _display;
};

module.exports = display;
