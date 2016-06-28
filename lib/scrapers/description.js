'use strict';
const Cheerio = require('cheerio');

const description = (obj, callback) => {

  const $ = Cheerio.load(obj.html);
  let desc = $('meta[name="description"]').attr('content');
  const abstract = $('meta[name="abstract"]').attr('content');
  const topic = $('meta[name="topic"]').attr('content');
  const summary = $('meta[name="summary"]').attr('content');
  const subj = $('meta[name="subject"]').attr('content');
  const dcDesc = $('meta[name="dc.description"]').attr('content');
  const ogDesc = $('meta[property="og:description"]').attr('content');
  const twitterDesc = $('meta[property="twitter:description"]').attr('content');
  const schemaDesc = $('meta[itemprop="description"]').attr('content');
  const msToolTip = $('meta[name=msapplication-tooltip]').attr('content');

  desc = desc || dcDesc || subj || abstract || summary || ogDesc || twitterDesc || schemaDesc || msToolTip || topic || '';

  if (callback) {
    callback(null, desc);
  }

  return desc;
};

module.exports = description;
