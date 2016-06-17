'use strict';
var Cheerio = require('cheerio');

function theme_color(html, callback) {
    var $ = Cheerio.load(html);

    var androidThemeColor = $('meta[name=theme-color]').attr('content');
    var msTileColor = $('meta[name=msapplication-TileColor]').attr('content');
    var iosStatusStyling = $('meta[name=apple-mobile-web-app-status-bar-style]').attr('content');

    if (iosStatusStyling && iosStatusStyling === 'black-translucent') {
        iosStatusStyling = 'rgba(0,0,0,0.5)';
    }

    var themeColor = androidThemeColor || iosStatusStyling || msTileColor || 'transparent';

    if (callback) {
        callback(null, themeColor);
    }

    return themeColor;
}

module.exports = theme_color;
