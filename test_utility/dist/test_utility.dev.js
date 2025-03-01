'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

module.exports =
/*#__PURE__*/
function () {
  function Test_Utility() {
    _classCallCheck(this, Test_Utility);
  }

  _createClass(Test_Utility, null, [{
    key: "create_options",
    value: function create_options() {
      var oneoff_options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = {
        memory_retention: oneoff_options.memory_retention || 60000,
        // This is optional but required for this testing since test does not go through index.js which sets default parameter.
        skill_path: "../../sample_skill/",
        enable_ask_retry: oneoff_options.enable_ask_retry || false,
        message_to_ask_retry: oneoff_options.message_to_ask_retry || "ごめんなさい、もうちょっと正確にお願いできますか？",
        line_channel_id: process.env.LINE_CHANNEL_ID,
        line_channel_secret: process.env.LINE_CHANNEL_SECRET,
        line_channel_access_token: process.env.LINE_CHANNEL_ACCESS_TOKEN,
        facebook_app_secret: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
        facebook_page_access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
        apiai_client_access_token: process.env.APIAI_CLIENT_ACCESS_TOKEN,
        default_intent: oneoff_options.default_intent || "input.unknown",
        // This is optional but required for this testing since test does not go through index.js which sets default parameter.
        default_skill: oneoff_options.default_skill || null,
        beacon_skill: oneoff_options.beacon_skill || null
      };
      return options;
    }
  }, {
    key: "create_req",
    value: function create_req(message_platform, event_type, user_id, message_type, payload) {
      return Test_Utility[message_platform + "_create_req"](event_type, user_id, message_type, payload);
    }
  }, {
    key: "line_create_req",
    value: function line_create_req(event_type, user_id, message_type, payload) {
      var req = {
        body: {
          events: [{
            "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
            "type": event_type == "unsupported" ? "follow" : event_type,
            "timestamp": 1462629479859,
            "source": {
              "type": "user",
              "userId": user_id
            }
          }]
        },
        get: function get(param) {
          var header = {
            "X-Line-Signature": "dummy_signature"
          };
          return header[param];
        }
      };
      req.body.events[0][event_type] = Test_Utility["line_create_" + event_type + "_event_payload"](message_type, payload);
      return req;
    }
  }, {
    key: "facebook_create_req",
    value: function facebook_create_req(event_type, user_id, message_type, payload) {
      var req = {
        body: {
          object: "page",
          entry: [{
            messaging: [{
              sender: {
                id: user_id
              },
              recipient: {
                id: "dummy_recipient_id"
              }
            }]
          }]
        },
        get: function get(param) {
          var header = {
            "X-Hub-Signature": "dummy_signature"
          };
          return header[param];
        }
      };
      req.body.entry[0].messaging[0][event_type] = Test_Utility["facebook_create_" + event_type + "_event_payload"](message_type, payload);
      return req;
    }
  }, {
    key: "unsupported_create_req",
    value: function unsupported_create_req(event_type, user_id, message_type, payload) {
      var req = {
        body: {},
        get: function get(param) {
          var header = {};
          return header[param];
        }
      };
      return req;
    }
  }, {
    key: "line_create_message_event_payload",
    value: function line_create_message_event_payload(message_type, payload) {
      var event_payload;

      if (typeof payload == "string") {
        event_payload = {
          type: "text",
          text: payload
        };
      } else if (_typeof(payload) == "object") {
        event_payload = payload;
      }

      return event_payload;
    }
  }, {
    key: "facebook_create_message_event_payload",
    value: function facebook_create_message_event_payload(message_type, payload) {
      var event_payload;

      if (typeof payload == "string") {
        event_payload = {
          text: payload
        };
      } else if (_typeof(payload) == "object") {
        event_payload = payload;
      }

      return event_payload;
    }
  }, {
    key: "line_create_postback_event_payload",
    value: function line_create_postback_event_payload(message_type, payload) {
      return {
        data: payload
      };
    }
  }, {
    key: "facebook_create_postback_event_payload",
    value: function facebook_create_postback_event_payload(message_type, payload) {
      return {
        payload: payload
      };
    }
  }, {
    key: "line_create_beacon_event_payload",
    value: function line_create_beacon_event_payload(message_type, payload) {
      var event_payload;
      event_payload = payload || {
        "hwid": "d41d8cd98f",
        "type": "enter"
      };
      return event_payload;
    }
  }, {
    key: "facebook_create_beacon_event_payload",
    value: function facebook_create_beacon_event_payload(message_type, payload) {
      return {};
    }
  }, {
    key: "line_create_unsupported_event_payload",
    value: function line_create_unsupported_event_payload(message_type, payload) {
      return null;
    }
  }, {
    key: "facebook_create_unsupported_event_payload",
    value: function facebook_create_unsupported_event_payload(message_type, payload) {
      return null;
    }
    /*
    static create_req_from_line(user_id, event_type, message = null){
        let req = {
            body: {
                events: [{
                    "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
                    "type": (event_type == "unsupported") ? "follow" : event_type,
                    "timestamp": 1462629479859,
                    "source": {
                      "type": "user",
                      "userId": user_id
                    }
                }]
            },
            get: function(param){
                let header = {
                    "X-Line-Signature": "dummy_signature"
                };
                return header[param];
            }
        }
        switch(event_type){
            case "message":
                if (typeof message == "string"){
                    req.body.events[0].message = {
                        type: "text",
                        text: message
                    }
                } else if (typeof message == "object"){
                    req.body.events[0].message = message;
                }
            break;
            case "postback":
                req.body.events[0].postback = {
                    data: message
                }
            break;
            case "unsupported":
                // no data.
            break;
        }
        return req;
    }
      static create_req_from_facebook(user_id, event_type, message = null){
        let req = {
            body: {
                object: "page",
                entry: [{
                    messaging: [{
                        sender: {
                            id: user_id
                        },
                        recipient: {
                            id: "dummy_recipient_id"
                        }
                    }]
                }]
            },
            get: function(param){
                let header = {
                    "X-Hub-Signature": "dummy_signature"
                };
                return header[param];
            }
        }
        switch(event_type){
            case "message":
                if (typeof message == "string"){
                    req.body.entry[0].messaging[0].message = {
                        text: message
                    };
                } else if (typeof message == "object"){
                    req.body.entry[0].messaging[0].message = message;
                }
            break;
            case "postback":
                req.body.entry[0].messaging[0].postback = {
                    payload: message
                };
            break;
            case "unsupported":
                // no data.
            break;
        }
        return req;
    }
    */

  }, {
    key: "create_req_to_clear_memory",
    value: function create_req_to_clear_memory(user_id) {
      var req = {
        clear_memory: user_id
      };
      return req;
    }
  }]);

  return Test_Utility;
}();