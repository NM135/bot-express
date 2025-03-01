'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var request = require('request');

var Promise = require('bluebird');

var MAKER_URL_PREFIX = 'https://maker.ifttt.com/trigger/';
var MAKER_KEY = process.env.MAKER_KEY;

module.exports =
/*#__PURE__*/
function () {
  function Hue() {
    _classCallCheck(this, Hue);
  }

  _createClass(Hue, null, [{
    key: "change_color",
    value: function change_color(color) {
      return new Promise(function (resolve, reject) {
        var url = MAKER_URL_PREFIX + 'wfc_change_light_color/with/key/' + MAKER_KEY;
        var body = {
          value1: color
        };
        request({
          method: "POST",
          url: url,
          body: body,
          json: true
        }, function (error, response, body) {
          error ? reject(error) : resolve(body);
        });
      });
    }
  }, {
    key: "turn_on",
    value: function turn_on() {
      return new Promise(function (resolve, reject) {
        var url = MAKER_URL_PREFIX + 'wfc_turn_on_light/with/key/' + MAKER_KEY;
        request({
          method: "POST",
          url: url,
          json: true
        }, function (error, response, body) {
          error ? reject(error) : resolve(body);
        });
      });
    }
  }, {
    key: "turn_off",
    value: function turn_off() {
      return new Promise(function (resolve, reject) {
        var url = MAKER_URL_PREFIX + 'wfc_turn_off_light/with/key/' + MAKER_KEY;
        request({
          method: "POST",
          url: url,
          json: true
        }, function (error, response, body) {
          error ? reject(error) : resolve(body);
        });
      });
    }
  }]);

  return Hue;
}();