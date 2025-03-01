'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var crypto = require('crypto');

var request = require('request');

var Promise = require('bluebird');

var debug = require("debug")("service");

module.exports =
/*#__PURE__*/
function () {
  function ServiceLine(channel_id, channel_secret, channel_access_token) {
    _classCallCheck(this, ServiceLine);

    this._channel_id = channel_id;
    this._channel_secret = channel_secret;
    this._channel_access_token = channel_access_token;
  }

  _createClass(ServiceLine, [{
    key: "send",
    value: function send(to, messages) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + _this._channel_access_token
        };
        var body = {
          to: to,
          messages: messages
        };
        var url = 'https://api.line.me/v2/bot/message/push';
        request({
          url: url,
          method: 'POST',
          headers: headers,
          body: body,
          json: true
        }, function (error, response, body) {
          if (error) {
            debug(error);
            return reject(error);
          }

          if (response.statusCode != 200) {
            debug(body.message);
            return reject(body.message || "Failed to send.");
          }

          debug("send succeeded");
          resolve();
        });
      });
    }
  }, {
    key: "reply",
    value: function reply(reply_token, messages) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + _this2._channel_access_token
        };
        var body = {
          replyToken: reply_token,
          messages: messages
        };
        var url = 'https://api.line.me/v2/bot/message/reply';
        request({
          url: url,
          method: 'POST',
          headers: headers,
          body: body,
          json: true
        }, function (error, response, body) {
          if (error) {
            debug(error);
            return reject(error);
          }

          if (response.statusCode != 200) {
            debug(body.message);
            return reject(body.message || "Failed to reply.");
          }

          debug("reply succeeded");
          resolve();
        });
      });
    }
  }, {
    key: "validate_signature",
    value: function validate_signature(signature, raw_body) {
      // Signature Validation
      var hash = crypto.createHmac('sha256', this._channel_secret).update(raw_body).digest('base64');

      if (hash != signature) {
        return false;
      }

      return true;
    }
  }]);

  return ServiceLine;
}();