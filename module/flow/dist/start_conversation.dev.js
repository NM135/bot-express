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

var Promise = require("bluebird");

var debug = require("debug")("flow");

var Flow = require("./flow");

module.exports =
/*#__PURE__*/
function (_Flow) {
  _inherits(StartConversationFlow, _Flow);

  /*
  ** ### Start Conversation Flow ###
  ** - Check if the event is supported one in this flow.
  ** - If we find some parameter from initial message, add them to the conversation.
  ** - Run final action.
  */
  function StartConversationFlow(vp, bot_event, context, options) {
    var _this;

    _classCallCheck(this, StartConversationFlow);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StartConversationFlow).call(this, vp, bot_event, context, options));
    _this.context._flow = "start_conversation";
    return _this;
  }

  _createClass(StartConversationFlow, [{
    key: "run",
    value: function run() {
      debug("\n### This is Start Conversation Flow. ###\n"); // If we find some parameters from initial message, add them to the conversation.

      if (this.context.intent.parameters && Object.keys(this.context.intent.parameters).length > 0) {
        for (var _i = 0, _Object$keys = Object.keys(this.context.intent.parameters); _i < _Object$keys.length; _i++) {
          var param_key = _Object$keys[_i];

          // Parse and Add parameters using skill specific logic.
          try {
            _get(_getPrototypeOf(StartConversationFlow.prototype), "add_parameter", this).call(this, param_key, this.context.intent.parameters[param_key]);
          } catch (err) {}
        }
      } // Run final action.


      return _get(_getPrototypeOf(StartConversationFlow.prototype), "finish", this).call(this);
    } // End of run()

  }]);

  return StartConversationFlow;
}(Flow);