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
  function ServiceFacebook(app_secret, page_access_token) {
    _classCallCheck(this, ServiceFacebook);

    this._app_secret = app_secret;
    this._page_access_token = page_access_token;
  }

  _createClass(ServiceFacebook, [{
    key: "send",
    value: function send(recipient, messages) {
      var _this = this;

      var all_sent = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var message = _step.value;
          all_sent.push(new Promise(function (resolve, reject) {
            var headers = {
              'Content-Type': 'application/json'
            };
            var body = {
              recipient: recipient,
              message: message
            };
            var url = "https://graph.facebook.com/v2.8/me/messages?access_token=" + _this._page_access_token;
            request({
              url: url,
              method: 'POST',
              headers: headers,
              body: body,
              json: true
            }, function (error, response, body) {
              if (error) {
                return reject(error);
              }

              if (response.statusCode != 200) {
                debug(body.error.message);
                return reject(body.error.message);
              }

              resolve();
            });
          }));
        };

        for (var _iterator = messages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return Promise.all(all_sent).then(function (response) {
        debug("send succeeded");
        return;
      }, function (response) {
        debug("send failed");
        return Promise.reject(response);
      });
    }
  }, {
    key: "validate_signature",
    value: function validate_signature(signature, raw_body) {
      // Signature Validation
      var hash = "sha1=" + crypto.createHmac("sha1", this._app_secret).update(raw_body).digest("hex");

      if (hash != signature) {
        return false;
      }

      return true;
    }
  }]);

  return ServiceFacebook;
}();