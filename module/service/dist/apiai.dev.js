'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Apiai = require("apiai");

var Promise = require("bluebird");

var debug = require("debug")("service");

module.exports =
/*#__PURE__*/
function () {
  function Apiai_promised(client_access_token) {
    var language = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "ja";

    _classCallCheck(this, Apiai_promised);

    this._client_access_token = client_access_token;
    this._language = language;
  }

  _createClass(Apiai_promised, [{
    key: "identify_intent",
    value: function identify_intent(session_id, text) {
      var ai_instance = Apiai(this._client_access_token, {
        language: this._language
      });
      var ai_request = ai_instance.textRequest(text, {
        sessionId: session_id
      });
      var promise_got_intent = new Promise(function (resolve, reject) {
        ai_request.on('response', function (response) {
          resolve(response);
        });
        ai_request.end();
      });
      return promise_got_intent;
    }
  }]);

  return Apiai_promised;
}();