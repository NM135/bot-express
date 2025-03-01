'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var debug = require("debug")("skill");
/*
** Just reply the text response provided from api.ai.
*/


module.exports =
/*#__PURE__*/
function () {
  function SkillSimpleResponse() {
    _classCallCheck(this, SkillSimpleResponse);
  }

  _createClass(SkillSimpleResponse, [{
    key: "finish",
    value: function finish(bot, bot_event, context) {
      debug("Going to reply \"".concat(context.intent.fulfillment.speech, "\"."));
      var messages = [bot.create_message(context.intent.fulfillment.speech)];
      return bot.reply(bot_event, messages);
    }
  }]);

  return SkillSimpleResponse;
}();