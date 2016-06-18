'use strict';
const Cheerio = require('cheerio');

const background_color = (html, callback) => {

  const $ = Cheerio.load(html);

  const msTileColor = $('meta[name=msapplication-TileColor]').attr('content');

  const backgroundColor = msTileColor || 'transparent';

  if (callback) {
    callback(null, backgroundColor);
  }

  return backgroundColor;
};

module.exports = background_color;
