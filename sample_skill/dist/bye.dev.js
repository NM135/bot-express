'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var debug = require("debug")("skill");
/*
** Intended for use of beacon leave event.
*/


module.exports =
/*#__PURE__*/
function () {
  function SkillBye() {
    _classCallCheck(this, SkillBye);
  }

  _createClass(SkillBye, [{
    key: "finish",
    value: function finish(bot, bot_event, context) {
      debug("Going to reply \"Bye\".");
      var messages = [bot.create_message("Bye")];
      return bot.reply(bot_event, messages);
    }
  }]);

  return SkillBye;
}();