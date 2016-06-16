'use strict';
var Cheerio = require('cheerio');
var Cld = require('cld');

function language(html, callback) {
  var $ = Cheerio.load(html);
  var declaredLang = $('html[lang]').attr('lang');

  if (!declaredLang) {
    declaredLang = $('meta[name="language"]').attr('content');
  }

  if (!declaredLang) {
    declaredLang = $('meta[name="dc.language"]').attr('content');
  }

  // if they declare the lang attr, we assume they know what they are talking about
  if (declaredLang) {
    callback(null, declaredLang);
  } else {
    var lang;
    var options = {
      isHTML: true
    };

    // otherwise, we load the page, and use Google's cld to try to detect it
    Cld.detect(html, options, function(err, result) {
      if (!err && result.reliable) {
        lang = result.languages[0].code;
      }

      // if we were unable to identify the language, or the results are not
      // considered reliable, re return undefined

      callback(err, lang);
    });
  }
}

module.exports = language;
