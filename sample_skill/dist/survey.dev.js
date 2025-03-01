'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Promise = require("bluebird");

var moji = require("moji");

var debug = require("debug")("skill");

var is_email = require("isemail");

module.exports =
/*#__PURE__*/
function () {
  function SkillSurvey() {
    _classCallCheck(this, SkillSurvey);

    this.required_parameter = {
      satisfaction: {
        message_to_confirm: {
          line: {
            type: "text",
            text: "勉強会お疲れ様でした！今回の満足度を5段階で教えてください。（5が最高、1が最低）"
          },
          facebook: {
            text: "勉強会お疲れ様でした！今回の満足度を5段階で教えてください。",
            quick_replies: [{
              content_type: "text",
              title: "5 高",
              payload: 5
            }, {
              content_type: "text",
              title: "4",
              payload: 4
            }, {
              content_type: "text",
              title: "3",
              payload: 3
            }, {
              content_type: "text",
              title: "2",
              payload: 2
            }, {
              content_type: "text",
              title: "1 低",
              payload: 1
            }]
          }
        }
      },
      // End of satisfaction
      difficulty: {
        message_to_confirm: {
          line: {
            type: "template",
            altText: "難易度はどうでした？(難しい or 適当 or 易しい）",
            template: {
              type: "buttons",
              text: "難易度はどうでした？",
              actions: [{
                type: "postback",
                label: "難しい",
                data: "難しい"
              }, {
                type: "postback",
                label: "適当",
                data: "適当"
              }, {
                type: "postback",
                label: "易しい",
                data: "易しい"
              }]
            }
          },
          facebook: {
            text: "難易度はどうでした？",
            quick_replies: [{
              content_type: "text",
              title: "難しい",
              payload: "難しい"
            }, {
              content_type: "text",
              title: "適当",
              payload: "適当"
            }, {
              content_type: "text",
              title: "易しい",
              payload: "易しい"
            }]
          }
        }
      },
      // End of difficulty
      free_comment: {
        message_to_confirm: {
          line: {
            type: "text",
            text: "是非感想を教えてください！"
          },
          facebook: {
            text: "是非感想を教えてください！"
          }
        }
      },
      // End of free_comment
      mail: {
        message_to_confirm: {
          line: {
            type: "text",
            text: "最後にメールアドレス教えてもらえますか？"
          },
          facebook: {
            text: "最後にメールアドレス教えてもらえますか？"
          }
        }
      } // End of mail

    }; // End of required_parameter

    this.clear_context_on_finish = true;
  }

  _createClass(SkillSurvey, [{
    key: "parse_satisfaction",
    value: function parse_satisfaction(value) {
      debug("Parsing satisfaction.");
      var parsed_value;

      try {
        parsed_value = Number(moji(value).convert('ZE', 'HE').toString());
      } catch (error) {
        parsed_value = false;
      }

      if (typeof parsed_value != "number" || parsed_value === NaN || parsed_value < 1 || parsed_value > 5) {
        debug("Value is outside of range.");
        parsed_value = false;
      }

      debug("Parsed value is ".concat(parsed_value, "."));
      return parsed_value;
    }
  }, {
    key: "parse_difficulty",
    value: function parse_difficulty(value) {
      debug("Parsing difficulty.");
      var parsed_value = false;

      if (value.match(/難/) || value.match(/むずかし/) || value.match(/むずい/) || value.match(/げきむず/) || value.match(/ゲキムズ/)) {
        parsed_value = 1;
      } else if (value.match(/適/) || value.match(/てきとう/) || value.match(/てきせつ/) || value.match(/ちょうど/) || value.match(/普通/) || value.match(/ふつう/)) {
        parsed_value = 0;
      } else if (value.match(/易/) || value.match(/やさしい/) || value.match(/簡単/) || value.match(/かんたん/) || value.match(/easy/) || value.match(/イージー/)) {
        parsed_value = -1;
      }

      debug("Parsed value is ".concat(parsed_value, "."));
      return parsed_value;
    }
  }, {
    key: "parse_free_comment",
    value: function parse_free_comment(value) {
      debug("Parsing free_comment.");
      var parsed_value = value;
      debug("Parsed value is ".concat(parsed_value, "."));
      return parsed_value;
    }
  }, {
    key: "parse_mail",
    value: function parse_mail(value) {
      debug("Parsing mail.");
      var parsed_value;

      if (is_email.validate(value)) {
        parsed_value = value;
      } else {
        parsed_value = false;
      }

      debug("Parsed value is ".concat(parsed_value, "."));
      return parsed_value;
    }
  }, {
    key: "finish",
    value: function finish(bot, bot_event, context) {
      var messages = [bot.create_message("\u5B8C\u74A7\u3067\u3059\uFF01\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3057\u305F\uFF01\uFF01")];
      return bot.reply(bot_event, messages);
    }
  }]);

  return SkillSurvey;
}();