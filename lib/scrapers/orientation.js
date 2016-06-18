'use strict';
const Cheerio = require('cheerio');

const orientation = (html, callback) => {

  const $ = Cheerio.load(html);

  //fullscreen
  const qqFullScreen = $('[name=x5-orientation]').attr('content');
  const ucFullScreen = $('[name=screen-orientation]').attr('content');

  const _orientation = qqFullScreen || ucFullScreen || 'any';

  if (callback) {
    callback(null, _orientation);
  }

  return _orientation;
};

module.exports = orientation;
