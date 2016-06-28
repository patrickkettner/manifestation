'use strict';
const Url = require('url');
const Async = require('async');
const IcoJS = require('icojs');
const Cheerio = require('cheerio');
const Request = require('request');
const ImgSize = require('image-size');
const ImgType = require('image-type');
const Mime = require('mime-types').lookup;
const FileType = require('file-type');
const _flatten = require('lodash/flattenDeep');
const _filter = require('lodash/filter');

const Util = require('../utils');

const isIco = (url) => {

  return url.match(/\.ico$/);
};

const imgInfo = (url, callback) => {

  Request.get({ url, encoding: null }, (err, response, imgBuffer) => {

    let result;

    if (err || response.statusCode !== 200) {
      callback();
      return console.error(err || new Error('Response code for ' + url + ' was ' + response.statusCode));
    }

    if (imgBuffer && FileType(imgBuffer) !== null) {
      const dimensions = ImgSize(imgBuffer);

      result = {
        src: Url.parse(url).href,
        type: ImgType(imgBuffer).mime,
        sizes: dimensions.width + 'x' + dimensions.height
      };
    }

    callback(null, result);
  });
};

const icoInfo = (url, callback) => {

  Request.get({ url, encoding: null }, (err, response, imgBuffer) => {

    if (err || response.statusCode !== 200) {
      callback();
      return console.log(err || new Error('response code for ' + url + ' was ' + response.statusCode));
    }

    const icoBuffer = Util.toArrayBuffer(imgBuffer);

    try {
      IcoJS.parse(icoBuffer).then((imgs) => {

        const sizes = imgs.map((img) => {

          const dim = ImgSize(Util.toBuffer(img.buffer));
          return dim.width + 'x' + dim.height;
        }).join(' ');

        return callback(null, {
          src: Url.parse(url).path,
          sizes: sizes
        });
      }).catch((e) => {

        if (e.toString() === 'Error: buffer is not ico') {
          imgInfo(url, callback);
        }
        else {
          callback(e, []);
        }
      });
    }
    catch (e) {
      console.error(e);
      console.error(url);
      callback();
    }
  });
};

const processAppConfig = (url, callback) => {

  Request.get({ url }, (err, response, body) => {

    if (err) {
      callback(err);
    }

    const $ = Cheerio.load(body);
    let appConfigIcons = [
      $('square70x70logo'),
      $('square150x150logo'),
      $('square310x310logo'),
      $('wide310x150logo')
    ];

    appConfigIcons = appConfigIcons
      .filter((arr) => arr.length)
      .map(($icon) => {

        const src = $icon.attr('src');
        let size = $icon.prop('tagName');
        size = size.toLowerCase().match(/\d+x\d+/)[0];

        return {
          sizes: size,
          src: src,
          type: Mime(src)
        };
      });

    callback(null, appConfigIcons);
  });
};

const processFavicon = (url, callback) => {

  if (isIco(url)) {
    icoInfo(url, callback);
  }
  else {
    imgInfo(url, callback);
  }
};


const icons = (obj, iconsCallback) => {

  const $ = Cheerio.load(obj.html);

  const favicon = $('[rel="shortcut icon"]').attr('href') || '/favicon.ico';
  const msAppConfig = $('[name=msapplication-config]').attr('content') || '/browserconfig.xml';
  const windowsTile = $('[name=msapplication-TileImage]').attr('content');
  const iosIcons = $('[rel=icon], [rel=apple-touch-icon], [rel=apple-touch-icon-precomposed]').map((i, elm) => ({
    href: $(elm).attr('href'),
    sizes: $(elm).attr('sizes')
  }));

  const processIcons = (icon, cb) => {

    const href = icon.href;
    const sizes = icon.sizes;
    const url = Url.resolve(obj.url, href);

    if (icon.sizes) {
      cb(null, {
        src: href,
        sizes: sizes,
        type: Mime(href)
      });
    }
    else {
      return isIco(url) ? icoInfo(url, cb) : imgInfo(url, cb);
    }
  };

  const toProcess = [{
    type: windowsTile,
    func: imgInfo
  }, {
    type: favicon,
    func: processFavicon
  }, {
    type: msAppConfig,
    func: processAppConfig
  }].filter((icon) => icon.type && icon.type.length);

  Async.parallel([
    (parallelCb) => {

      Async.map(toProcess, (iconType, cb) => {

        const url = Url.resolve(obj.url, iconType.type);
        iconType.func(url, cb);
      }, parallelCb);
    },
    (parallelCb) => {

      Async.map(iosIcons, processIcons, parallelCb);
    }
  ], (err, results) => {

    iconsCallback(err, _filter(_flatten(results)));
  });
};

module.exports = icons;
