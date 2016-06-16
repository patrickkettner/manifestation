'use strict';
var Cheerio = require('cheerio');

function background_color(html, callback) {
  var $ = Cheerio.load(html);

  var msTileColor = $('meta[name=msapplication-TileColor]').attr('content');

  var backgroundColor = msTileColor || 'transparent';

  if (callback) {
    callback(null, backgroundColor);
  }

  return backgroundColor;
}

module.exports = background_color;
