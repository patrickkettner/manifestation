'use strict';
const Fs = require('fs');
const Expect = require('expect');

const ReadFile = function (fileName) {

  return Fs.readFileSync(`${__dirname}/../../mocks/lib/scrapers/name/${fileName}.html`);
};

const Name = require('../../../lib/scrapers/name');

describe('name', () => {

  describe('element search functions', () => {

    it('returns meta application-name when present', (done) => {

      Name(ReadFile('appName'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('appName Test');
        done();
      });
    });

    it('returns app links ios name when present', (done) => {

      Name(ReadFile('alIosAppName'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('alIosAppName Test');
        done();
      });
    });

    it('returns app links android name when present', (done) => {

      Name(ReadFile('alAndroidAppName'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('alAndroidAppName Test');
        done();
      });
    });

    it('returns the ios app link when both are defined', (done) => {

      Name(ReadFile('alBothAppName'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('alIosAppName Test');
        done();
      });
    });

    it('returns the open graph site name when it is defined', (done) => {

      Name(ReadFile('ogSiteName'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('ogSiteName Test');
        done();
      });
    });

    it('returns the title when all else fails', (done) => {

      Name(ReadFile('title'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('Title Test');
        done();
      });
    });

  });

  describe('regex', () => {

    it('truncates and ellipsisises names longer than 45 character', (done) => {

      Name(ReadFile('tooLonglatin'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('Long app name that goes over the 45 characte…');
        done();
      });
    });


    it('does not count unicode combining marks as seperate characters' , (done) => {

      Name(ReadFile('justRightUnicode'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('ñññññññññññññññññññññññññññññññññññññññññññññ');
        done();
      });
    });

    it('removes character along with combining mark when truncating' , (done) => {

      Name(ReadFile('tooLongUnicode'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('ññññññññññññññññññññññññññññññññññññññññññññ…');
        done();
      });
    });

    it('counts emoji as a single character' , (done) => {

      Name(ReadFile('tooLongEmoji'), (e, result) => {

        Expect(e).toNotExist();
        Expect(result).toEqual('💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩');
        done();
      });
    });
  });
});
