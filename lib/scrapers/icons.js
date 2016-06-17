'use strict';
var Url = require('url');
var Async = require('async');
var IcoJS = require('icojs');
var Cheerio = require('cheerio');
var Request = require('request');
var ImgSize = require('image-size');
var ImgType = require('image-type');
var Mime = require('mime-types').lookup;
var _flatten = require('lodash/flattenDeep');

var util = require('../utils');

function isIco (url) {
  return url.match(/\.ico$/);
}

function imgInfo (tileUrl, callback) {
  Request({ uri: tileUrl, encoding: null }, function (err, response, imgBuffer) {
    if (err || response.statusCode !== 200) {
      return callback(err || new Error('Response code for ' + tileUrl + ' was ' + response.statusCode));
    }

    var dimensions = ImgSize(imgBuffer);

    callback(null, {
      src: Url.parse(tileUrl).href,
      type: ImgType(imgBuffer).mime,
      sizes: dimensions.width + 'x' + dimensions.height
    });
  });
}

function icoInfo (url, callback) {

  Request({ uri: url, encoding: null }, function (err, response, imgBuffer) {
    if (err || response.statuscode !== 200) {
      return console.log(err || 'response code for ' + url + ' was ' + response.statuscode);
    }

    var icoBuffer = util.toArrayBuffer(imgBuffer);

    IcoJS.parse(icoBuffer).then(function(imgs) {

      var sizes = imgs.map(function(img) {
        var dim = ImgSize(util.toBuffer(img.buffer));
        return dim.width + 'x' + dim.height;
      }).join(' ');

      return callback(null, {
        src: Url.parse(url).path,
        sizes: sizes
      });
    }).catch(callback);

  });
}

function processAppConfig(url, callback) {
  Request(url, function(err, response, body) {
    if (err) {
      callback(err);
    }

    var $ = Cheerio.load(body);
    var icons = [
      $('square70x70logo'),
      $('square150x150logo'),
      $('square310x310logo'),
      $('wide310x150logo')
    ];

    icons = icons.filter(function(arr) {
      return arr.length;
    }).map(function($icon) {
      var src = $icon.attr('src');
      var size = $icon.prop('tagName');
      size = size.toLowerCase().match(/\d+x\d+/)[0];

      return {
        sizes: size,
        src: src,
        type: Mime(src)
      };
    });

    callback(null, icons);
  });
}

function processFavicon(url, callback) {
  if (isIco(url)) {
    icoInfo(url, callback);
  } else {
    imgInfo(url, callback);
  }
}


function icons(obj, iconsCallback) {
  var $ = Cheerio.load(obj.html);

  var favicon = $('[rel="shortcut icon"]').attr('href');
  var msAppConfig = $('[name=msapplication-config]').attr('content');
  var windowsTile = $('[name=msapplication-TileImage]').attr('content');
  var icons = Array.prototype.slice.call($('[rel=icon], [rel=apple-touch-icon], [rel=apple-touch-icon-precomposed]'));

  function processIcons(icon, cb) {
    var $icon = Cheerio(icon);
    var href = $icon.attr('href');
    var sizes = $icon.attr('sizes');
    var url = Url.resolve(obj.url, href);


    if (!sizes) {
      if (isIco(url)) {
        return icoInfo(url, cb);
      } else {
        return imgInfo(url, cb);
      }
    } else {
      cb(null, {
        src: href,
        sizes: sizes,
        type: Mime(href)
      });
    }
  }

  var toProcess = [{
      type: windowsTile,
      func: imgInfo
    }, {
      type: favicon,
      func: processFavicon
    }, {
      type: msAppConfig,
      func: processAppConfig
  }].filter(function(icon) {
    return icon.type && icon.type.length;
  });

  Async.parallel([
    function(parallelCb) {
      Async.map(toProcess, function(iconType, cb) {
        var url = Url.resolve(obj.url, iconType.type);
        iconType.func(url, cb);
      }, parallelCb);
    },
    function(parallelCb) {
      Async.map(icons, processIcons, parallelCb);
    }
  ], function(err, results) {
    iconsCallback(err, _flatten(results));
  });
}

module.exports = icons;
