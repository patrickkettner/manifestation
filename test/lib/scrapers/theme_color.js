'use strict';
const Fs = require('fs');
const Expect = require('expect');

const ReadFile = function (fileName) {

  return Fs.readFileSync(`${__dirname}/../../mocks/lib/scrapers/theme_color/${fileName}.html`).toString();
};

const ThemeColor = require('../../../lib/scrapers/theme_color');

describe('theme_color', () => {

  it('detects the meta theme-color tag', (done) => {

    ThemeColor(ReadFile('metaThemeColor'), (e, result) => {

      Expect(e).toNotExist();
      Expect(result).toEqual('#B4D455');
      done();
    });
  });

  it('falls back to msapplication-TileColor', (done) => {

    ThemeColor(ReadFile('tileColorThemeColor'), (e, result) => {

      Expect(e).toNotExist();
      Expect(result).toEqual('#000FFF');
      done();
    });
  });

  it('msapplication-tilecolor works, too', (done) => {

    ThemeColor(ReadFile('lowerCaseTileColorThemeColor'), (e, result) => {

      Expect(e).toNotExist();
      Expect(result).toEqual('#123456');
      done();
    });
  });

  it('apple-mobile-web-app-status-bar black passes through', (done) => {

    ThemeColor(ReadFile('iosWebAppStatusBarBlackThemeColor'), (e, result) => {

      Expect(e).toNotExist();
      Expect(result).toEqual('black');
      done();
    });
  });

  it('apple-mobile-web-app-status-bar black-trancslucent gets translated', (done) => {

    ThemeColor(ReadFile('iosWebAppStatusBarTranslucentThemeColor'), (e, result) => {

      Expect(e).toNotExist();
      Expect(result).toEqual('rgba(0,0,0,0.5)');
      done();
    });
  });

});
