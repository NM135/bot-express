'use strict';
/*
** Import Packages
*/

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Promise = require('bluebird');

var debug = require("debug")("flow");

var Flow = require("./flow");

module.exports =
/*#__PURE__*/
function (_Flow) {
  _inherits(ChangeParameterFlow, _Flow);

  /*
  ** ### Change Parameter Flow ###
  ** - Check if the event is supported one in this flow.
  ** - Add Parameter from message text or postback data.
  ** - Run final action.
  */
  function ChangeParameterFlow(vp, bot_event, context, options) {
    var _this;

    _classCallCheck(this, ChangeParameterFlow);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ChangeParameterFlow).call(this, vp, bot_event, context, options));
    _this.context._flow = "change_parameter";
    _this.enable_ask_retry = options.enable_ask_retry;
    _this.message_to_ask_retry = options.message_to_ask_retry;
    return _this;
  }

  _createClass(ChangeParameterFlow, [{
    key: "run",
    value: function run() {
      debug("\n### ASSUME This is Change Parameter Flow. ###\n"); // Check if the event is supported one in this flow.

      if (!this.vp.check_supported_event_type("change_parameter", this.bot_event)) {
        return Promise.resolve({
          result: false,
          reason: "unsupported event for change parameter flow"
        });
      } // Add Parameter from message text or postback data.


      var param_value = this.vp.extract_param_value(this.bot_event);
      var is_fit = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.context.previous.confirmed[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var previously_confirmed_param_key = _step.value;

          try {
            debug("Check if \"".concat(param_value, "\" is suitable for ").concat(previously_confirmed_param_key, "."));

            _get(_getPrototypeOf(ChangeParameterFlow.prototype), "change_parameter", this).call(this, previously_confirmed_param_key, param_value);

            debug("Great fit!");
            is_fit = true;
            break;
          } catch (err) {
            debug("It does not fit.");
          }
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

      if (!is_fit) {
        if (this.enable_ask_retry && typeof param_value == "string" && param_value.length <= 10) {
          return Promise.resolve({
            result: true,
            response: _get(_getPrototypeOf(ChangeParameterFlow.prototype), "ask_retry", this).call(this, this.message_to_ask_retry)
          });
        }

        return Promise.resolve({
          result: false,
          reason: "not fit"
        });
      } // Run final action.


      return Promise.resolve({
        result: true,
        response: _get(_getPrototypeOf(ChangeParameterFlow.prototype), "finish", this).call(this)
      });
    } // End of run()

  }]);

  return ChangeParameterFlow;
}(Flow);