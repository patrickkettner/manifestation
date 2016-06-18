'use strict';
const RelatedApplications = require('./related_applications');

const prefer_related_applications = (html, callback) => {

  const preferRelatedApplications = !!RelatedApplications(html).length;

  if (callback) {
    callback(null, preferRelatedApplications);
  }

  return preferRelatedApplications;
};

module.exports = prefer_related_applications;
