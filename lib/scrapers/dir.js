'use strict';
const Cheerio = require('cheerio');

const Lang = require('./lang');

const rtlLangs = [
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

const direction = (obj, callback) => {

  const html = obj.html;
  const $ = Cheerio.load(html);

  // do the cheap check up front. If they declare it, we use it
  const declaredDir = $('html[dir]').attr('dir');

  if (declaredDir) {
    callback(null, declaredDir);
  }
  else {
    // if they did not declare a dir attr, we check to see if most of characters
    // in the page's corpus are known RTL unicode characters

    // we want the text of the body, which includes the text of <scripts>, which
    // throws off the calculation since JS is latin chars. So we strip them out
    const $body = $('body').clone();
    $body.find('script').remove();

    // strip out whitespace too
    const text = $body.text().replace(/\s/g, '');

    const rtlRegex = /[\u0590-\u083F]|[\u08A0-\u08FF]|[\uFB1D-\uFDFF]|[\uFE70-\uFEFF]/mg;
    const rtlChars = text.match(rtlRegex);
    let  mostlyRtl;

    if (rtlChars) {
      mostlyRtl = rtlChars.length / text.length > 0.4;
    }

    if (mostlyRtl) {
      callback(null, 'rtl');
    }
    else {
      // if we aren't sure that it is RTL, we finally check the for the language
      // of the page, then return the result based off of that country code

      Lang(obj, (err, result) => {

        if (result) {
          const dir = rtlLangs.indexOf(result) > -1 ? 'rtl' : 'ltr';
          callback(err, dir);
        }
      });
    }
  }
};

module.exports = direction;
