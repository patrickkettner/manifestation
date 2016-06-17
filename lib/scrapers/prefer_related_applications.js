'use strict';
var relatedApplications = require('./related_applications');

function prefer_related_applications(html, callback) {
    var preferRelatedApplications = !!relatedApplications(html).length;

    if (callback) {
        callback(null, preferRelatedApplications);
    }

    return preferRelatedApplications;
}

module.exports = prefer_related_applications;
