'use strict';

var REQUIRED_OPTIONS = {
  common: ["apiai_client_access_token"]
};
var DEFAULT_MEMORY_RETENTION = 60000;
var DEFAULT_SKILL_PATH = "../../../../skill/";

var express = require("express");

var router = express.Router();

var body_parser = require("body-parser");

var debug = require("debug")("index");

var Webhook = require("./webhook");

router.use(body_parser.json({
  verify: function verify(req, res, buf, encoding) {
    req.raw_body = buf;
  }
}));

module.exports = function (options) {
  debug("\nBot Express\n"); // Set optional options.

  options.memory_retention = options.memory_retention || DEFAULT_MEMORY_RETENTION;

  if (!!options.skill_path) {
    options.skill_path = "../../../../" + options.skill_path;
  } else if (process.env.BOT_EXPRESS_ENV == "development") {
    // This is for Bot Express development environment only.
    options.skill_path = "../../sample_skill/";
  } else {
    options.skill_path = DEFAULT_SKILL_PATH;
  }

  if (options.enable_ask_retry === null) {
    options.enable_ask_retry = false;
  }

  options.message_to_ask_retry = options.message_to_ask_retry || "ごめんなさい、もうちょっと正確にお願いできますか？";
  options.facebook_verify_token = options.facebook_verify_token || options.facebook_page_access_token; // Check if common required options are set.

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = REQUIRED_OPTIONS["common"][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var req_opt = _step.value;

      if (typeof options[req_opt] == "undefined") {
        throw "Required option: \"".concat(req_opt, "\" not set");
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

  debug("Common required options all set."); // Webhook Process

  router.post('/', function (req, res, next) {
    res.status(200).end();
    var webhook = new Webhook(options);
    webhook.run(req).then(function (response) {
      debug("Successful End of Webhook.");
      debug(response);
    }, function (response) {
      debug("Abnormal End of Webhook.");
      debug(response);
    });
  }); // Verify Facebook Webhook

  router.get("/", function (req, res, next) {
    if (!options.facebook_verify_token) {
      debug("Failed validation. facebook_verify_token not set.");
      res.sendStatus(403);
    }

    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === options.facebook_verify_token) {
      debug("Validating webhook");
      res.status(200).send(req.query['hub.challenge']);
    } else {
      debug("Failed validation. Make sure the validation tokens match.");
      res.sendStatus(403);
    }
  });
  return router;
};