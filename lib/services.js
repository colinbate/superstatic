'use strict';
var availableServices = {
  proxy: require('superstatic-proxy')
};
module.exports = function(spec) {
  var config = spec.config || {};
  var debug = spec.debug;
  return function(req, res, next) {
    var pathValues = req.url.split('/');
    pathValues.shift();
    if (pathValues.length < 2 || pathValues[0] !== '__' ||
      !(pathValues[1] in availableServices)) {
      return next();
    }
    req.service = {
      config: config[pathValues[1]],
      path: pathValues.join('/').substr(2)
    };
    if (debug) {
      console.log('Using service ' + pathValues[1] + ' for ' + req.url);
    }
    return availableServices[pathValues[1]]()(req, res, next);
  };
};
