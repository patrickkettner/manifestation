'use strict';
const Cheerio = require('cheerio');

const theme_color = (html, callback) => {

  const $ = Cheerio.load(html);

  const androidThemeColor = $('meta[name=theme-color]').attr('content');
  // since folks seem to use tilecolor and TileColor, we have toLowerCase to get a case insensitive match
  const msTileColor = $('meta[name]').filter((i, e) => $(e).attr('name').toLowerCase() === 'msapplication-tilecolor').attr('content');
  let iosStatusStyling = $('meta[name=apple-mobile-web-app-status-bar-style]').attr('content');

  if (iosStatusStyling && iosStatusStyling === 'black-translucent') {
    iosStatusStyling = 'rgba(0,0,0,0.5)';
  }

  const themeColor = androidThemeColor || iosStatusStyling || msTileColor || 'transparent';

  if (callback) {
    callback(null, themeColor);
  }

  return themeColor;
};

module.exports = theme_color;
