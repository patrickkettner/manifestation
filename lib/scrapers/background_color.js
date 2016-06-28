'use strict';
const Cheerio = require('cheerio');

const background_color = (obj, callback) => {

  const $ = Cheerio.load(obj.html);

  const msTileColor = $('meta[name=msapplication-TileColor]').attr('content');

  const backgroundColor = msTileColor || 'transparent';

  if (callback) {
    callback(null, backgroundColor);
  }

  return backgroundColor;
};

module.exports = background_color;
