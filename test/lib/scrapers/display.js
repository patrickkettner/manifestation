'use strict';
const Fs = require('fs');
const Expect = require('expect');
const Display = require('../../../lib/scrapers/display');

const ReadFile = function (fileName) {

  return {
    html: Fs.readFileSync(`${__dirname}/../../mocks/lib/scrapers/display/${fileName}.html`)
  };
};

describe('display', () => {

  describe('fullscreen', () => {

    it('when "x5-fullscreen" found in markup it returns "fullscreen"', (done) => {

      Display(ReadFile('fullscreen1'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('fullscreen');
        done();
      });
    });

    it('when "full-screen" found in markup it returns "fullscreen"', (done) => {

      Display(ReadFile('fullscreen2'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('fullscreen');
        done();
      });
    });
  });

  describe('standalone', () => {

    it('when "x5-page-model" found in markup it returns "standalone"', (done) => {

      Display(ReadFile('standalone1'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('standalone');
        done();
      });
    });

    it('when "browsermode" found in markup it returns "standalone"', (done) => {

      Display(ReadFile('standalone2'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('standalone');
        done();
      });
    });

    it('when "apple-mobile-web-app-capable" found in markup it returns "standalone"', (done) => {

      Display(ReadFile('standalone3'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('standalone');
        done();
      });
    });

    it('when "mobile-web-app-capable" found in markup it returns "standalone"', (done) => {

      Display(ReadFile('standalone4'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('standalone');
        done();
      });
    });
  });

  describe('minimal-ui', () => {

    it('when "minimal-ui" found in markup it returns "minimal-ui"', (done) => {

      Display(ReadFile('minimal'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('minimal-ui');
        done();
      });
    });
  });

  describe('browser', () => {

    it('when no info is found it returns "browser"', (done) => {

      Display(ReadFile('browser'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('browser');
        done();
      });
    });
  });
});
