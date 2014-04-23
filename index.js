
/**
 * Module dependencies.
 */

var Me = require('./lib/me');
var Site = require('./lib/site');
var debug = require('debug')('wpcom');

/**
 * WordPress.com REST API class.
 *
 * @api public
 */

function WPCOM(request){
  if (!(this instanceof WPCOM)) return new WPCOM(request);
  if ('function' !== typeof request) {
    throw new TypeError('a `request` WP.com function must be passed in');
  }
  this.request = request;
}

/**
 * Get me object instance
 *
 * @api public
 */

WPCOM.prototype.me = function(){
  return new Me(this);
};

/**
 * Get site object instance
 *
 * @param {String} id
 * @api public
 */

WPCOM.prototype.site = function(id){
  return new Site(id, this);
};

/**
 * List Freshly Pressed Posts
 *
 * @param {Object} params (optional)
 * @param {Function} fn callback function
 * @api public
 */

WPCOM.prototype.freshlyPressed = function(params, fn){
  this.sendRequest('freshly-pressed.get', null, params, fn);
};

/**
 * Request to WordPress REST API
 *
 * @param {String||Object} options 
 * @param {Object} [query]
 * @param {Object} [body]
 * @param {Function} fn
 * @api private
 */

WPCOM.prototype.sendRequest = function (options, query, body, fn){
  // params request object
  var params = {};

  if ('string' == typeof options) {
    options = { path: options };
  }

  debug('sendRequest("%s")', options.path);

  // token
  if (options.token) {
    params.authToken = options.token;
  }

  // set method and path request
  params.method = (options.method || 'get').toUpperCase();
  params.path = options.path;

  // query parameter is optional
  if ('function' == typeof query) {
    fn = query;
    query = {};
  }

  // body parameter is optional
  if ('function' == typeof body) {
    fn = body;
    query = {};
  }

  // pass query and/or body object to request params
  if (query) params.query = query;
  if (body) params.body = body;

  // callback function is optional
  if (!fn) fn = function(err){ if (err) throw err; };

  // request method
  this.request(params, fn);
};

/**
 * Expose `WPCOM` module
 */

module.exports = WPCOM;
