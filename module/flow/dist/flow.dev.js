'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DEFAULT_INTENT = "input.unknown";
var DEFAULT_SKILL = "builtin_default";
var DEFAULT_SKILL_PATH = "../../../../skill/";

var Promise = require('bluebird');

var debug = require("debug")("flow");

var apiai = require('apiai');

module.exports =
/*#__PURE__*/
function () {
  function Flow(vp, bot_event, context, options) {
    _classCallCheck(this, Flow);

    this.vp = vp;
    this.bot_event = bot_event;
    this.context = context;
    this.default_intent = options.default_intent || DEFAULT_INTENT;
    this.default_skill = options.default_skill || DEFAULT_SKILL;
    this.skill_path = options.skill_path;
    this.skill = this._instantiate_skill(this.context.intent.action);

    if (!!this.skill.required_parameter && _typeof(this.skill.required_parameter) == "object") {
      debug("This skill requires ".concat(Object.keys(this.skill.required_parameter).length, " parameters."));
    } else {
      debug("This skill requires 0 parameters.");
    }

    this.context.to_confirm = this._identify_to_confirm_parameter(this.skill.required_parameter, this.context.confirmed);
    debug("We have ".concat(Object.keys(this.context.to_confirm).length, " parameters to confirm."));
  }

  _createClass(Flow, [{
    key: "_instantiate_skill",
    value: function _instantiate_skill(intent) {
      if (!intent) {
        debug("Intent should have been set but not.");
        return;
      }

      var skill; // If the intent is not identified, we use default_skill.

      if (intent == this.default_intent) {
        skill = this.default_skill;
      } else {
        skill = intent;
      }

      var skill_instance;

      try {
        if (skill == "builtin_default") {
          debug("Use built-in default skill.");

          var skill_class = require("../skill/default");

          skill_instance = new skill_class();
        } else {
          debug("Use ".concat(skill, " skill."));

          var _skill_class = require("".concat(this.skill_path).concat(skill));

          skill_instance = new _skill_class();
        }
      } catch (err) {
        debug("Cannnot import ".concat(this.skill_path).concat(skill));
        debug(err);
        throw err;
      }

      return skill_instance;
    }
  }, {
    key: "_identify_to_confirm_parameter",
    value: function _identify_to_confirm_parameter(required_parameter, confirmed) {
      var to_confirm = {}; // If there is no required_parameter, we just return empty object as confirmed.

      if (!required_parameter) {
        return to_confirm;
      } // Scan confirmed parameters and if missing required parameters found, we add them to to_confirm.


      for (var _i = 0, _Object$keys = Object.keys(required_parameter); _i < _Object$keys.length; _i++) {
        var req_param_key = _Object$keys[_i];

        if (typeof confirmed[req_param_key] == "undefined") {
          to_confirm[req_param_key] = required_parameter[req_param_key];
        }
      }

      return to_confirm;
    }
  }, {
    key: "_collect",
    value: function _collect() {
      if (Object.keys(this.context.to_confirm).length == 0) {
        debug("While collect() is called, there is no parameter to confirm.");
        return Promise.reject();
      }

      if (!this.context.to_confirm[Object.keys(this.context.to_confirm)[0]].message_to_confirm[this.vp.type]) {
        debug("While we need to send a message to confirm parameter, the message not found.");
        return Promise.reject();
      }

      var messages = [this.context.to_confirm[Object.keys(this.context.to_confirm)[0]].message_to_confirm[this.vp.type]]; // Set confirming.

      this.context.confirming = Object.keys(this.context.to_confirm)[0]; // Send question to the user.

      return this.vp.reply(this.bot_event, messages);
    }
  }, {
    key: "change_parameter",
    value: function change_parameter(key, value) {
      this.add_parameter(key, value, true);
    }
  }, {
    key: "add_parameter",
    value: function add_parameter(key, value) {
      var is_change = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      debug("Parsing parameter {".concat(key, ": \"").concat(value, "\"}"));
      var parsed_value; // Parse the value. If the value is not suitable for this key, exception will be thrown.

      if (this.skill.required_parameter[key]) {
        if (!!this.skill.required_parameter[key].parse) {
          parsed_value = this.skill.required_parameter[key].parse(value);
        } else if (!!this.skill["parse_" + key]) {
          parsed_value = this.skill["parse_" + key](value);
        } else {
          // If parse method is not implemented, we use the value as-is.
          if (value === null || value == "") {
            parsed_value = false;
          } else {
            parsed_value = value;
          }
        }
      } else if (this.skill.optional_parameter[key]) {
        if (!!this.skill.optional_parameter[key].parse) {
          parsed_value = this.skill.optional_parameter[key].parse(value);
        } else if (!!this.skill["parse_" + key]) {
          parsed_value = this.skill["parse_" + key](value);
        } else {
          // If parse method is not implemented, we use the value as-is.
          if (value === null || value == "") {
            parsed_value = false;
          } else {
            parsed_value = value;
          }
        }
      } else {
        // This is not the parameter we care about. So skip it.
        debug("This is not the parameter we care about.");
        throw "This is not the parameter we care about.";
      }

      if (parsed_value === false) {
        // This means user defined skill says this value does not fit to this parameter.
        throw "The value does not fit to this parameter.";
      }

      debug("Adding parameter {".concat(key, ": \"").concat(parsed_value, "\"}")); // Add the parameter to "confirmed".

      var param = {};
      param[key] = parsed_value;
      Object.assign(this.context.confirmed, param); // At the same time, add the parameter key to previously confirmed list. The order of this list is newest first.

      if (!is_change) {
        this.context.previous.confirmed.unshift(key);
      } // Remove item from to_confirm.


      if (this.context.to_confirm[key]) {
        delete this.context.to_confirm[key];
      } // Clear confirming.


      if (this.context.confirming == key) {
        this.context.confirming = null;
      }

      debug("We have ".concat(Object.keys(this.context.to_confirm).length, " parameters to confirm."));
    }
  }, {
    key: "ask_retry",
    value: function ask_retry(message_text) {
      var messages = [this.vp.create_message(message_text)];
      return this.vp.reply(this.bot_event, messages);
    }
  }, {
    key: "finish",
    value: function finish() {
      var _this = this;

      // If we still have parameters to confirm, we collect them.
      if (Object.keys(this.context.to_confirm).length > 0) {
        debug("Going to collect parameter.");
        return this._collect();
      }

      if (this.skill["before_finish"]) {
        debug("Going to process before finish.");
        return this.skill["before_finish"](this.vp, this.bot_event, this.context);
      } // If we have no parameters to confirm, we finish this conversation using finish method of skill.


      debug("Going to perform final action.");
      return this.skill.finish(this.vp, this.bot_event, this.context).then(function (response) {
        if (_this.skill.clear_context_on_finish) {
          debug("Clearing context.");
          _this.context = null;
        }

        return response;
      }, function (response) {
        return Promise.reject(response);
      });
    }
  }]);

  return Flow;
}();