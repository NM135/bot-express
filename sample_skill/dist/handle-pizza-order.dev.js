'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var debug = require("debug")("skill");

module.exports =
/*#__PURE__*/
function () {
  // コンストラクター。このスキルで必要とする、または指定することができるパラメータを設定します。
  function HandlePizzaOrder() {
    _classCallCheck(this, HandlePizzaOrder);

    this.required_parameter = {
      pizza: {
        message_to_confirm: {
          line: {
            type: "template",
            altText: "ご注文のピザはお決まりでしょうか？ マルゲリータ、マリナーラからお選びください。",
            template: {
              type: "buttons",
              text: "ご注文のピザはお決まりでしょうか？",
              actions: [{
                type: "postback",
                label: "マルゲリータ",
                data: "マルゲリータ"
              }, {
                type: "postback",
                label: "マリナーラ",
                data: "マリナーラ"
              }]
            }
          },
          facebook: {
            text: "ご注文のピザはお決まりでしょうか？",
            quick_replies: [{
              content_type: "text",
              title: "マルゲリータ",
              payload: "マルゲリータ"
            }, {
              content_type: "text",
              title: "マリナーラ",
              payload: "マリナーラ"
            }]
          }
        }
      },
      size: {
        message_to_confirm: {
          line: {
            type: "template",
            altText: "サイズはいかがいたしましょうか？ S、M、Lからお選びください。",
            template: {
              type: "buttons",
              text: "サイズはいかがいたしましょうか？",
              actions: [{
                type: "postback",
                label: "S",
                data: "S"
              }, {
                type: "postback",
                label: "M",
                data: "M"
              }, {
                type: "postback",
                label: "L",
                data: "L"
              }]
            }
          },
          facebook: {
            text: "サイズはいかがいたしましょうか？",
            quick_replies: [{
              content_type: "text",
              title: "S",
              payload: "S"
            }, {
              content_type: "text",
              title: "M",
              payload: "M"
            }, {
              content_type: "text",
              title: "L",
              payload: "L"
            }]
          }
        }
      },
      address: {
        message_to_confirm: {
          line: {
            type: "text",
            text: "お届け先の住所を教えていただけますか？"
          },
          facebook: {
            text: "お届け先の住所を教えていただけますか？"
          }
        }
      },
      name: {
        message_to_confirm: {
          line: {
            type: "text",
            text: "最後に、お客様のお名前を教えていただけますか？"
          },
          facebook: {
            text: "最後に、お客様のお名前を教えていただけますか？"
          }
        }
      }
    };
    this.clear_context_on_finish = true;
  }

  _createClass(HandlePizzaOrder, [{
    key: "parse_pizza",
    value: function parse_pizza(value) {
      var parsed_value;

      if (value.match(/マルゲリータ/)) {
        parsed_value = "マルゲリータ";
      } else if (value.match(/マリナーラ/)) {
        parsed_value = "マリナーラ";
      } else {
        parsed_value = false;
      }

      return parsed_value;
    }
  }, {
    key: "parse_size",
    value: function parse_size(value) {
      var parsed_value;

      if (value.match(/[sS]/) || value.match(/小/)) {
        parsed_value = "S";
      } else if (value.match(/[mM]/) || value.match(/中/) || value.match(/普通/)) {
        parsed_value = "M";
      } else if (value.match(/[lL]/) || value.match(/大/)) {
        parsed_value = "L";
      } else {
        parsed_value = false;
      }

      return parsed_value;
    }
  }, {
    key: "parse_address",
    value: function parse_address(value) {
      var parsed_value;

      if (typeof value == "string") {
        parsed_value = {
          address: value.replace("です", "").replace("でーす", "").replace("ですー", "").replace("。", ""),
          latitude: null,
          longitude: null
        };
      } else if (_typeof(value) == "object") {
        if (value.address) {
          // This is LINE location message.
          parsed_value = {
            address: value.address,
            latitude: value.latitude,
            longitude: value.longitude
          };
        } else if (value.attachments) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = value.attachments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var attachment = _step.value;

              if (attachment.type == "location") {
                parsed_value = {
                  address: null,
                  // Need to fill out some day...
                  latitude: attachment.payload.coordinates.lat,
                  longitude: attachment.payload.coordinates["long"]
                };
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
        } else {
          parsed_value = false;
        }
      } else {
        parsed_value = false;
      }

      return parsed_value;
    }
  }, {
    key: "parse_name",
    value: function parse_name(value) {
      var parsed_value;
      parsed_value = value.replace("です", "").replace("でーす", "").replace("ですー", "").replace("と申します", "").replace("。", "");
      return parsed_value;
    } // パラメーターが全部揃ったら実行する処理を記述します。

  }, {
    key: "finish",
    value: function finish(bot, bot_event, context) {
      var messages = [bot.create_message("".concat(context.confirmed.name, " \u69D8\u3001\u3054\u6CE8\u6587\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3057\u305F\uFF01").concat(context.confirmed.pizza, "\u306E").concat(context.confirmed.size, "\u30B5\u30A4\u30BA\u309230\u5206\u4EE5\u5185\u306B\u3054\u6307\u5B9A\u306E").concat(context.confirmed.address.address, "\u307E\u3067\u304A\u5C4A\u3051\u306B\u4E0A\u304C\u308A\u307E\u3059\u3002"))];
      return bot.reply(bot_event, messages);
    }
  }]);

  return HandlePizzaOrder;
}();