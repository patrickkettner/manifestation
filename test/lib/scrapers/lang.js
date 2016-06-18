'use strict';
const Fs = require('fs');
const Expect = require('expect');

const ReadFile = function (fileName) {

  return Fs.readFileSync(`${__dirname}/../../mocks/lib/scrapers/lang/${fileName}.html`).toString();
};

const Lang = require('../../../lib/scrapers/lang');

describe('lang', () => {

  describe('declared attribute', () => {

    it('returns the lang attr from the HTML element when declared', (done) => {

      Lang(ReadFile('htmlLang'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('zh');
        done();
      });
    });

    it('returns the xml:lang attr from the HTML element when declared', (done) => {

      Lang(ReadFile('xhtmlLang'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('ru');
        done();
      });
    });

    it('falls back to the meta langauge tag when declared', (done) => {

      Lang(ReadFile('metaLang'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('en');
        done();
      });
    });

    it('falls back to the dublin core language attr when declared', (done) => {

      Lang(ReadFile('dublinCoreLang'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('he');
        done();
      });
    });
  });

  describe('inferred', () => {

    it('still detects the language if none is declared', (done) => {

      Lang(ReadFile('cldLang'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('lb');
        done();
      });
    });

    it('returns nothing when CLD is not confident', (done) => {

      Lang(ReadFile('nonIdentifiedLang'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toNotExist();
        done();
      });
    });
  });
});
