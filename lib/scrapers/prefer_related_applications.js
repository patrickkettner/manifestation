'use strict';
const RelatedApplications = require('./related_applications');

const prefer_related_applications = (obj, callback) => {

  const preferRelatedApplications = !!RelatedApplications(obj).length;

  if (callback) {
    callback(null, preferRelatedApplications);
  }

  return preferRelatedApplications;
};

module.exports = prefer_related_applications;
