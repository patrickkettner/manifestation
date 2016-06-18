'use strict';
const Fs = require('fs');
const Expect = require('expect');
const Sinon = require('sinon');
const Request = require('request');

const ReadFile = (fileName) => Fs.readFileSync(`${__dirname}/../../mocks/lib/scrapers/icons/${fileName}.html`).toString();
const ReadIcoFile = (fileName) => Fs.readFileSync(`${__dirname}/../../mocks/lib/scrapers/icons/${fileName}.ico`);

const Icons = require('../../../lib/scrapers/icons');

describe('icons', () => {

  describe('favicons', () => {

    it('Loads from /favicon.ico when no icon is declared in markup', (done) => {

      Sinon.stub(Request, 'get').yields(null, { statusCode: 200 }, ReadIcoFile('favicon'));

      Icons({ url: '', html:  ReadFile('index') }, (e, result) => {

        Expect(e).toNotExist();
        Expect(Request.get.calledWith({ url: '/favicon.ico', encoding: null })).toBe(true);

        done();
      });

    });

    it('Can process an ico favicon without throwing', (done) => {

      Sinon.stub(Request, 'get').yields(null, { statusCode: 200 }, ReadIcoFile('favicon'));

      Icons({ url: '', html:  ReadFile('index') }, (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual([{ src: '/favicon.ico', sizes: '32x32' }]);

        done();
      });
    });

    it('Can process a png favicon without throwing', (done) => {

      Sinon.stub(Request, 'get').yields(null, { statusCode: 200 }, ReadIcoFile('png'));

      Icons({ url: '', html:  ReadFile('index') }, (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual([{ src: '/favicon.ico', type: 'image/png', sizes: '64x64' }]);

        done();
      });
    });

    it('Will use a link rel attr when it exists', (done) => {

      Sinon.stub(Request, 'get').yields(null, { statusCode: 200 }, ReadIcoFile('favicon'));

      Icons({ url: '', html:  ReadFile('preferRel') }, (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual([{ src: '/notDefaultFavicon.ico', sizes: '32x32' }]);

        done();
      });
    });

    it('can handle a corrupt ico file', (done) => {

      Sinon.stub(Request, 'get').yields(null, { statusCode: 200 }, ReadIcoFile('corrupt'));

      Icons({ url: '', html:  ReadFile('preferRel') }, (e, result) => {

        console.log(e);
        Expect(e).toNotExist();
        Expect(result).toEqual([]);

        done();
      });
    });

    it('Can handle a 404', (done) => {

      Sinon.stub(Request, 'get').yields(null, { statusCode: 404 }, '');

      Icons({ url: '', html:  ReadFile('index') }, (e, result) => {

        Expect(e).toNotExist();
        Expect(Request.get.calledWith({ url: '/favicon.ico', encoding: null })).toBe(true);
        Expect(result).toEqual([]);
        done();
      });

    });

    it('Can handle a 404 disguised as a 200', (done) => {

      Sinon.stub(Request, 'get').yields(null, { statusCode: 200 }, ReadFile('index'));

      Icons({ url: '', html:  ReadFile('index') }, (e, result) => {

        Expect(e).toNotExist();
        Expect(Request.get.calledWith({ url: '/favicon.ico', encoding: null })).toBe(true);
        Expect(result).toEqual([]);
        done();
      });

    });

    afterEach(() => Request.get.restore());
  });
});
