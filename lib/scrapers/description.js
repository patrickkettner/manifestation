'use strict';
var Cheerio = require('cheerio');

function description(html, callback) {
    var $ = Cheerio.load(html);
    var desc = $('meta[name="description"]').attr('content');
    var abstract = $('meta[name="abstract"]').attr('content');
    var topic = $('meta[name="topic"]').attr('content');
    var summary = $('meta[name="summary"]').attr('content');
    var subj = $('meta[name="subject"]').attr('content');
    var dcDesc = $('meta[name="dc.description"]').attr('content');
    var ogDesc = $('meta[property="og:description"]').attr('content');
    var twitterDesc = $('meta[property="twitter:description"]').attr('content');
    var schemaDesc = $('meta[itemprop="description"]').attr('content');
    var msToolTip = $('meta[name=msapplication-tooltip]').attr('content');

    desc = desc || dcDesc || subj || abstract || summary || ogDesc || twitterDesc || schemaDesc || msToolTip || topic || '';

    if (callback) {
        callback(null, desc);
    }

    return desc;
}

module.exports = description;
