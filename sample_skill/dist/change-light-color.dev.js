'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Promise = require('bluebird');

var hue = require('../sample_service/hue');

var COLOR_MAPPINGS = [{
  label: "青",
  code: "5068FF"
}, {
  label: "赤",
  code: "FF7B7B"
}, {
  label: "黄",
  code: "FFFA6A"
}];
/*
** Change the color of LED lighting of Hue.
*/

module.exports =
/*#__PURE__*/
function () {
  function SkillChangeLightColor() {
    _classCallCheck(this, SkillChangeLightColor);

    this.required_parameter = {
      color: {
        message_to_confirm: {
          line: {
            type: "template",
            altText: "何色にしますか？（青か赤か黄）",
            template: {
              type: "buttons",
              text: "何色にしますか？",
              actions: [{
                type: "postback",
                label: "青",
                data: "青"
              }, {
                type: "postback",
                label: "赤",
                data: "赤"
              }, {
                type: "postback",
                label: "黄",
                data: "黄"
              }]
            }
          },
          facebook: {
            text: "何色にしますか？",
            quick_replies: [{
              content_type: "text",
              title: "青",
              payload: "青"
            }, {
              content_type: "text",
              title: "赤",
              payload: "赤"
            }, {
              content_type: "text",
              title: "黄",
              payload: "黄"
            }]
          }
        },
        parse: this.parse_color
      }
    };
  } // サポートする色かどうかを判別しカラーコードに変化する


  _createClass(SkillChangeLightColor, [{
    key: "parse_color",
    value: function parse_color(value) {
      if (value === null || value == "") {
        return false;
      }

      var parsed_value = {};
      var found_color = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = COLOR_MAPPINGS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var color_mapping = _step.value;

          if (value.replace("色", "") == color_mapping.label) {
            parsed_value = color_mapping.code;
            found_color = true;
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

      if (!found_color) {
        return false;
      }

      return parsed_value;
    } // IFTTT経由でHueのカラーを変更する

  }, {
    key: "finish",
    value: function finish(bot, bot_event, context) {
      return hue.change_color(context.confirmed.color).then(function (response) {
        var messages = [bot.create_message("了解しましたー。", "text")];
        return bot.reply(bot_event, messages);
      }, function (response) {
        return Promise.reject("Failed to change light color.");
      });
    }
  }]);

  return SkillChangeLightColor;
}();