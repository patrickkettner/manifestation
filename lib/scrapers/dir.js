'use strict';
var Cheerio = require('cheerio');

var lang = require('./lang');

var rtlLangs = [
    'ar', //Arabic
    'az', //Azerbaijani
    'dv', //Divehi, Dhivehi, Maldivian
    'fa', //Persian
    'he', //Hebrew
    'jv', //Javanese
    'kk', //Kazakh
    'ks', //Kashmiri
    'ku', //Kurdish
    'ml', //Malayalam
    'ms', //Malay
    'pa', //Panjabi, Punjabi
    'ps', //Pushto, Pashto
    'sd', //Sindhi
    'so', //Somali
    'tk', //Turkmen
    'ug', //Uighur, Uyghur
    'ur', //Urdu
    'yi'  //Yiddish
];

function direction(html, callback) {
    var $ = Cheerio.load(html);

  // do the cheap check up front. If they declare it, we use it
    var declaredDir = $('html[dir]').attr('dir');

    if (declaredDir) {
        callback(null, declaredDir);
    } else {
    // if they did not declare a dir attr, we check to see if most of characters
    // in the page's corpus are known RTL unicode characters

    // we want the text of the body, which includes the text of <scripts>, which
    // throws off the calculation since JS is latin chars. So we strip them out
        var $body = $('body').clone();
        $body.find('script').remove();

    // strip out whitespace too
        var text = $body.text().replace(/\s/g, '');

        var rtlRegex = /[\u0590-\u083F]|[\u08A0-\u08FF]|[\uFB1D-\uFDFF]|[\uFE70-\uFEFF]/mg;
        var rtlChars = text.match(rtlRegex);
        var mostlyRtl;
        if (rtlChars) {
            mostlyRtl = rtlChars.length / text.length > 0.4;
        }

        if (mostlyRtl) {
            callback(null, 'rtl');
        } else {
      // if we aren't sure that it is RTL, we finally check the for the language
      // of the page, then return the result based off of that country code

            lang(html, function (err, result) {
                if (result) {
                    var dir = rtlLangs.indexOf(result) > -1 ? 'rtl' : 'ltr';
                    callback(err, dir);
                }
            });
        }
    }
}

module.exports = direction;
