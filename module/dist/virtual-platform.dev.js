'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Line = require("./service/line");

var Facebook = require("./service/facebook");

module.exports =
/*#__PURE__*/
function () {
  function VirtualPlatform(options) {
    _classCallCheck(this, VirtualPlatform);

    this.type = options.message_platform_type;
    this.options = options;
    this.service = this.instantiate_service();
    this.context = null; // Will be set later in webhook;
  }

  _createClass(VirtualPlatform, [{
    key: "instantiate_service",
    value: function instantiate_service() {
      return this["_".concat(this.type, "_instantiate_service")]();
    }
  }, {
    key: "_line_instantiate_service",
    value: function _line_instantiate_service() {
      return new Line(this.options.line_channel_id, this.options.line_channel_secret, this.options.line_channel_access_token);
    }
  }, {
    key: "_facebook_instantiate_service",
    value: function _facebook_instantiate_service() {
      return new Facebook(this.options.facebook_app_secret, this.options.facebook_page_access_token);
    }
  }, {
    key: "validate_signature",
    value: function validate_signature(req) {
      return this["_".concat(this.type, "_validate_signature")](req);
    }
  }, {
    key: "_line_validate_signature",
    value: function _line_validate_signature(req) {
      return this.service.validate_signature(req.get('X-Line-Signature'), req.raw_body);
    }
  }, {
    key: "_facebook_validate_signature",
    value: function _facebook_validate_signature(req) {
      return this.service.validate_signature(req.get('X-Hub-Signature'), req.raw_body);
    }
  }, {
    key: "extract_events",
    value: function extract_events(body) {
      return this["_".concat(this.type, "_extract_events")](body);
    }
  }, {
    key: "_line_extract_events",
    value: function _line_extract_events(body) {
      return body.events;
    }
  }, {
    key: "_facebook_extract_events",
    value: function _facebook_extract_events(body) {
      var events = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = body.entry[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var entry = _step.value;
          events = events.concat(entry.messaging);
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

      return events;
    }
  }, {
    key: "extract_event_type",
    value: function extract_event_type(bot_event) {
      return this["_".concat(this.type, "_extract_event_type")](bot_event);
    }
  }, {
    key: "_line_extract_event_type",
    value: function _line_extract_event_type(bot_event) {
      return bot_event.type;
    }
  }, {
    key: "_facebook_extract_event_type",
    value: function _facebook_extract_event_type(bot_event) {
      var event_type;

      if (bot_event.message) {
        if (bot_event.message.quick_reply) {
          // This is Quick Reply
          event_type = "quick_reply";
        } else if (bot_event.message.text) {
          // This is Text Message
          event_type = "text_message";
        }
      } else if (bot_event.postback) {
        // This is Postback
        event_type = "postback;";
      }

      return event_type;
    }
  }, {
    key: "extract_beacon_event_type",
    value: function extract_beacon_event_type(bot_event) {
      return this["_".concat(this.type, "_extract_beacon_event_type")](bot_event);
    }
  }, {
    key: "_line_extract_beacon_event_type",
    value: function _line_extract_beacon_event_type(bot_event) {
      var beacon_event_type = false;

      if (bot_event.beacon.type == "enter") {
        beacon_event_type = "enter";
      } else if (bot_event.beacon.type == "leave") {
        beacon_event_type = "leave";
      }

      return beacon_event_type;
    }
  }, {
    key: "_facebook_extract_beacon_event_type",
    value: function _facebook_extract_beacon_event_type(bot_event) {
      var beacon_event_type = false;
      return beacon_event_type;
    }
  }, {
    key: "extract_memory_id",
    value: function extract_memory_id(bot_event) {
      return this["_".concat(this.type, "_extract_memory_id")](bot_event);
    }
  }, {
    key: "_line_extract_memory_id",
    value: function _line_extract_memory_id(bot_event) {
      return bot_event.source.userId;
    }
  }, {
    key: "_facebook_extract_memory_id",
    value: function _facebook_extract_memory_id(bot_event) {
      return bot_event.sender.id;
    }
  }, {
    key: "check_supported_event_type",
    value: function check_supported_event_type(flow, bot_event) {
      return this["_".concat(this.type, "_check_supported_event_type")](flow, bot_event);
    }
  }, {
    key: "_line_check_supported_event_type",
    value: function _line_check_supported_event_type(flow, bot_event) {
      switch (flow) {
        case "beacon":
          if (bot_event.type == "beacon") {
            return true;
          }

          return false;
          break;

        case "start_conversation":
          if (bot_event.type == "message" && bot_event.message.type == "text") {
            return true;
          }

          return false;
          break;

        case "reply":
          if (bot_event.type == "message" || bot_event.type == "postback") {
            return true;
          }

          return false;
          break;

        case "change_intent":
          if (bot_event.type == "message" && bot_event.message.type == "text") {
            return true;
          }

          return false;
          break;

        case "change_parameter":
          if (bot_event.type == "message" || bot_event.type == "postback") {
            return true;
          }

          return false;
          break;

        case "no_way":
          if (bot_event.type == "message" && bot_event.message.type == "text") {
            return true;
          }

          return false;
          break;

        default:
          return false;
          break;
      }
    }
  }, {
    key: "_facebook_check_supported_event_type",
    value: function _facebook_check_supported_event_type(flow, bot_event) {
      switch (flow) {
        case "beacon":
          return false;
          break;

        case "start_conversation":
          if (bot_event.message && bot_event.message.text) {
            return true;
          }

          return false;
          break;

        case "reply":
          if (bot_event.message || bot_event.postback) {
            return true;
          }

          return false;
          break;

        case "change_intent":
          if (bot_event.message && bot_event.message.text) {
            return true;
          }

          return false;
          break;

        case "change_parameter":
          if (bot_event.message || bot_event.postback) {
            return true;
          }

          return false;
          break;

        case "no_way":
          if (bot_event.message && bot_event.message.text) {
            return true;
          }

          return false;
          break;

        default:
          return false;
          break;
      }
    }
  }, {
    key: "extract_session_id",
    value: function extract_session_id(bot_event) {
      return this["_".concat(this.type, "_extract_session_id")](bot_event);
    }
  }, {
    key: "_line_extract_session_id",
    value: function _line_extract_session_id(bot_event) {
      return bot_event.source.userId;
    }
  }, {
    key: "_facebook_extract_session_id",
    value: function _facebook_extract_session_id(bot_event) {
      return bot_event.sender.id;
    }
  }, {
    key: "extract_param_value",
    value: function extract_param_value(bot_event) {
      return this["_".concat(this.type, "_extract_param_value")](bot_event);
    }
  }, {
    key: "_line_extract_param_value",
    value: function _line_extract_param_value(bot_event) {
      var param_value;

      switch (bot_event.type) {
        case "message":
          if (bot_event.message.type == "text") {
            param_value = bot_event.message.text;
          } else {
            param_value = bot_event.message;
          }

          break;

        case "postback":
          param_value = bot_event.postback.data;
          break;
      }

      return param_value;
    }
  }, {
    key: "_facebook_extract_param_value",
    value: function _facebook_extract_param_value(bot_event) {
      var param_value;

      if (bot_event.message) {
        if (bot_event.message.quick_reply) {
          // This is Quick Reply
          param_value = bot_event.message.quick_reply.payload;
        } else if (bot_event.message.attachments) {
          // This is Attachment
          param_value = bot_event.message;
        } else if (bot_event.message.text) {
          // This is Text Message
          param_value = bot_event.message.text;
        }
      } else if (bot_event.postback) {
        // This is Postback
        param_value = bot_event.postback.payload;
      }

      return param_value;
    }
  }, {
    key: "extract_message_text",
    value: function extract_message_text(bot_event) {
      return this["_".concat(this.type, "_extract_message_text")](bot_event);
    }
  }, {
    key: "_line_extract_message_text",
    value: function _line_extract_message_text(bot_event) {
      var message_text;

      switch (bot_event.type) {
        case "message":
          message_text = bot_event.message.text;
          break;

        case "postback":
          message_text = bot_event.postback.data;
          break;
      }

      return message_text;
    }
  }, {
    key: "_facebook_extract_message_text",
    value: function _facebook_extract_message_text(bot_event) {
      var message_text;

      if (bot_event.message) {
        if (bot_event.message.quick_reply) {
          // This is Quick Reply
          message_text = bot_event.message.quick_reply.payload;
        } else if (bot_event.message.text) {
          // This is Text Message
          message_text = bot_event.message.text;
        }
      } else if (bot_event.postback) {
        // This is Postback
        message_text = bot_event.postback.payload;
      }

      return message_text;
    }
  }, {
    key: "create_message",
    value: function create_message(message_object, message_type) {
      return this["_".concat(this.type, "_create_message")](message_object, message_type);
    }
  }, {
    key: "_line_create_message",
    value: function _line_create_message(message_object) {
      var message_type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "text";
      var message;

      switch (message_type) {
        case "text":
          message = {
            type: "text",
            text: message_object
          };
          break;
      }

      return message;
    }
  }, {
    key: "_facebook_create_message",
    value: function _facebook_create_message(message_object) {
      var message_type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "text";
      var message;

      switch (message_type) {
        case "text":
          message = {
            text: message_object
          };
          break;
      }

      return message;
    }
  }, {
    key: "reply",
    value: function reply(bot_event, messages) {
      if (process.env.BOT_EXPRESS_ENV == "test") {
        return new Promise(function (resolve, reject) {
          return resolve();
        });
      }

      return this["_".concat(this.type, "_reply")](bot_event, messages);
    }
  }, {
    key: "_line_reply",
    value: function _line_reply(bot_event, messages) {
      return this.service.reply(bot_event.replyToken, messages);
    }
  }, {
    key: "_facebook_reply",
    value: function _facebook_reply(bot_event, messages) {
      return this.service.send({
        id: bot_event.sender.id
      }, messages);
    }
  }, {
    key: "send",
    value: function send(recipient_id, messages) {
      if (process.env.BOT_EXPRESS_ENV == "test") {
        return new Promise(function (resolve, reject) {
          return resolve();
        });
      }

      return this["_".concat(this.type, "_send")](recipient_id, messages);
    }
  }, {
    key: "_line_send",
    value: function _line_send(recipient_id, messages) {
      return this.service.send(recipient_id, messages);
    }
  }, {
    key: "_facebook_send",
    value: function _facebook_send(recipient_id, messages) {
      return this.service.send({
        id: recipient_id
      }, messages);
    } // While collect method exists in flow, this method is for developers to explicitly collect a parameter.

  }, {
    key: "collect",
    value: function collect(bot_event, parameter) {
      if (Object.keys(parameter).length != 1) {
        return Promise.reject("Malformed parameter.");
      }

      var param_key = Object.keys(parameter)[0];
      this.context.confirming = param_key;
      Object.assign(this.context.to_confirm, parameter);

      if (!parameter[param_key].message_to_confirm[this.type]) {
        return Promise.reject("While we need to send a message to confirm parameter, the message not found.");
      } // Send question to the user.


      var messages = [parameter[param_key].message_to_confirm[this.type]];
      return this.reply(bot_event, messages);
    }
  }]);

  return VirtualPlatform;
}();