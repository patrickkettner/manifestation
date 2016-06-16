'use strict';
var Cheerio = require('cheerio');

function related_applications(html, callback) {
  var $ = Cheerio.load(html);
  var relatedApplications = [];

  // iOS
  var iosAppLink = $('[rel=alternate][href*="ios-app://"]').attr('content');
  var appLinksIosId = $('[property="al:ios:app_store_id"]').attr('content');
  var appleItunesApp = $('meta[name="apple-itunes-app"]').attr('content');
  var appLinksIosUrl = $('[property="al:ios:url"]').attr('content');

  if (appleItunesApp || iosAppLink || appLinksIosId) {
    var itunesId;
    if (appleItunesApp) {
      itunesId = appleItunesApp.match(/(app-id\s*=)\s*([^,\s]*)/)[2];
    } else if (iosAppLink) {
      itunesId = iosAppLink.match(/ios-app\:\/\/([^/]*)\/[\s\S]*$/);
      itunesId = itunesId && itunesId[1];
    } else {
      itunesId = appLinksIosId;
    }

    var itunesUrl = appLinksIosUrl || 'https://itunes.apple.com/app/id' + itunesId;

    relatedApplications.push({
      'platform': 'itunes',
      'url': itunesUrl
    });
  }

  // android
  var appLinksAndroidId = $('[property="al:android:package"]').attr('content');
  var androidAppLink = $('[rel=alternate][href*="android-app://"]').attr('content');

  if (androidAppLink || appLinksAndroidId) {
    var androidId;

    if (androidAppLink) {
      androidId = androidAppLink;
    } else if (androidAppLink) {
      androidId = androidAppLink.match(/android-app\:\/\/([^/]*)\/[\s\S]*$/);
      androidId = androidId && androidId[1];
    }

    relatedApplications.push({
      platform: 'play',
      url: 'https://play.google.com/store/apps/details?id=' + androidId,
      id: androidId
    });
  }

  // windows
  var windowsId = $('meta[name=msApplication-PackageFamilyName]').attr('content');

  if (windowsId) {
    relatedApplications.push({
      'platform': 'windows',
      'url': 'ms-windows-store://pdp?PFN=' + windowsId
    });
  }

  if (callback) {
    callback(null, relatedApplications);
  }

  return relatedApplications;
}

module.exports = related_applications;
