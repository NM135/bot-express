'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var REQUIRED_OPTIONS = {
  line: ["line_channel_id", "line_channel_secret", "line_channel_access_token"],
  facebook: ["facebook_app_secret", "facebook_page_access_token"]
}; // Import NPM Packages

var Promise = require("bluebird");

var memory = require("memory-cache");

var debug = require("debug")("webhook"); // Import Flows


var beacon_flow = require('./flow/beacon');

var start_conversation_flow = require('./flow/start_conversation');

var reply_flow = require('./flow/reply');

var change_intent_flow = require('./flow/change_intent');

var change_parameter_flow = require('./flow/change_parameter');

var no_way_flow = require('./flow/no_way'); // Import Services


var Line = require("./service/line");

var Apiai = require("./service/apiai"); // Import Platform Abstraction.


var Virtual_platform = require("./virtual-platform");

module.exports =
/*#__PURE__*/
function () {
  function webhook(options) {
    _classCallCheck(this, webhook);

    this.options = options;
  }

  _createClass(webhook, [{
    key: "run",
    value: function run(req) {
      var _this = this;

      debug("\nWebhook runs.\n"); // FOR TEST PURPOSE ONLY: Clear Memory.

      if (process.env.BOT_EXPRESS_ENV == "test" && req.clear_memory) {
        debug("Deleting memory of ".concat(req.clear_memory));
        memory.del(req.clear_memory);
        return Promise.resolve({
          message: "memory cleared",
          memory_id: req.clear_memory
        });
      } // Identify Message Platform.


      if (req.get("X-Line-Signature") && req.body.events) {
        this.options.message_platform_type = "line";
      } else if (req.get("X-Hub-Signature") && req.body.object == "page") {
        this.options.message_platform_type = "facebook";
      } else {
        return Promise.resolve("This event comes from unsupported message platform. Skip processing.");
      }

      debug("Message Platform is ".concat(this.options.message_platform_type)); // Check if required options for this message platform are set.

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = REQUIRED_OPTIONS[this.options.message_platform_type][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var req_opt = _step.value;

          if (typeof this.options[req_opt] == "undefined") {
            return Promise.reject({
              reason: "required option missing",
              missing_option: req_opt
            });
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

      debug("Message Platform specific required options all set."); // Instantiate Message Platform.

      var vp = new Virtual_platform(this.options);
      debug("Virtual Message Platform instantiated."); // Signature Validation.

      if (process.env.BOT_EXPRESS_ENV != "test") {
        if (!vp.validate_signature(req)) {
          return Promise.reject("Signature Validation failed.");
        }

        debug("Signature Validation suceeded.");
      } // Set Events.


      var bot_events = vp.extract_events(req.body); // Instantiate api.ai instance

      var apiai = new Apiai(this.options.apiai_client_access_token, this.options.language);
      debug("api.ai instantiated.");
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        var _loop = function _loop() {
          var bot_event = _step2.value;
          debug("Processing following event.");
          debug(bot_event); // Recall Memory

          var memory_id = vp.extract_memory_id(bot_event);
          debug("memory id is ".concat(memory_id, "."));
          var context = memory.get(memory_id);
          vp.context = context;
          var promise_flow_completed = void 0;
          var flow = void 0;

          if (vp.extract_event_type(bot_event) == "beacon") {
            /*
            ** Beacon Flow
            */
            var beacon_event_type = vp.extract_beacon_event_type(bot_event);

            if (!beacon_event_type) {
              return {
                v: Promise.resolve("Unsupported beacon event.")
              };
            }

            if (!_this.options.beacon_skill || !_this.options.beacon_skill[beacon_event_type]) {
              return {
                v: Promise.resolve("This is beacon flow but beacon_skill[\"".concat(beacon_event_type, "\"] not found so skip."))
              };
            }

            debug("This is beacon flow and we use ".concat(_this.options.beacon_skill[beacon_event_type], " as skill")); // Instantiate the conversation object. This will be saved as Bot Memory.

            context = {
              intent: {
                action: _this.options.beacon_skill[beacon_event_type]
              },
              confirmed: {},
              to_confirm: {},
              confirming: null,
              previous: {
                confirmed: []
              }
            };
            vp.context = context;

            try {
              flow = new beacon_flow(vp, bot_event, context, _this.options);
            } catch (err) {
              return {
                v: Promise.reject(err)
              };
            }

            promise_flow_completed = flow.run();
          } else if (!context) {
            /*
            ** Start Conversation Flow.
            */
            // Check if this event type is supported in this flow.
            if (!vp.check_supported_event_type("start_conversation", bot_event)) {
              return {
                v: Promise.resolve("unsupported event for start conversation flow")
              };
            } // Set session id for api.ai and text to identify intent.


            var session_id = vp.extract_session_id(bot_event);
            var text = vp.extract_message_text(bot_event);
            promise_flow_completed = apiai.identify_intent(session_id, text).then(function (response) {
              debug("Intent is ".concat(response.result.action)); // Instantiate the conversation object. This will be saved as Bot Memory.

              context = {
                intent: response.result,
                confirmed: {},
                to_confirm: {},
                confirming: null,
                previous: {
                  confirmed: []
                }
              };
              vp.context = context;

              try {
                flow = new start_conversation_flow(vp, bot_event, context, _this.options);
              } catch (err) {
                return Promise.reject(err);
              }

              return flow.run();
            }, function (response) {
              debug("Failed to identify intent.");
              return Promise.reject(response);
            }); // End of Start Conversation Flow.
          } else {
            if (!!context.confirming) {
              /*
              ** Reply Flow
              */
              // Check if this event type is supported in this flow.
              if (!vp.check_supported_event_type("reply", bot_event)) {
                debug("This is unsupported event type in this flow so skip processing.");
                return {
                  v: Promise.resolve("unsupported event for reply flow")
                };
              }

              try {
                flow = new reply_flow(vp, bot_event, context, _this.options);
              } catch (err) {
                return {
                  v: Promise.reject(err)
                };
              }

              promise_flow_completed = flow.run(); // End of Reply Flow
            } else {
              // Check if this is Change Intent Flow.
              var promise_is_change_intent_flow;

              if (!vp.check_supported_event_type("change_intent", bot_event)) {
                promise_is_change_intent_flow = new Promise(function (resolve, reject) {
                  resolve({
                    result: false,
                    intent: {
                      fulfillment: {
                        speech: ""
                      }
                    },
                    reason: "unsupported event for change intent flow"
                  });
                });
              } else {
                // Set session id for api.ai and text to identify intent.
                var _session_id = vp.extract_session_id(bot_event);

                var _text = vp.extract_message_text(bot_event);

                promise_is_change_intent_flow = apiai.identify_intent(_session_id, _text).then(function (response) {
                  if (response.result.action != _this.options.default_intent) {
                    // This is change intent flow.
                    debug("This is change intent flow since we could identify intent.");
                    return {
                      result: true,
                      intent: response.result
                    };
                  } else {
                    debug("This is not change intent flow since we could not identify intent.");
                    return {
                      result: false,
                      intent: response.result
                    };
                  }
                }, function (response) {
                  // Failed to identify intent.
                  return Promise.reject(response);
                });
              }

              promise_flow_completed = promise_is_change_intent_flow.then(function (response) {
                if (response.result) {
                  /*
                  ** Change Intent Flow
                  */
                  // Set new intent while keeping other data.
                  context.intent = response.intent;

                  try {
                    flow = new change_intent_flow(vp, bot_event, context, _this.options);
                  } catch (err) {
                    return Promise.reject(err);
                  }

                  return flow.run(); // End of Change Intent Flow
                } else {
                  context.intent.fulfillment = response.intent.fulfillment; // Check if this is Change Parameter Flow.

                  var promise_is_change_parameter_flow;

                  if (!context.previous.confirmed || context.previous.confirmed.length == 0 || context.intent.action == _this.options.default_intent) {
                    // This is not Change Parameter Flow.
                    debug("This is not change parameter flow since we cannot find previously confirmed parameter. Or previous intent was default intent.");
                    promise_is_change_parameter_flow = new Promise(function (resolve, reject) {
                      resolve({
                        result: false
                      });
                    });
                  } else {
                    // Assume this is Change Parameter Flow.
                    try {
                      flow = new change_parameter_flow(vp, bot_event, context, _this.options);
                    } catch (err) {
                      return Promise.reject(err);
                    }

                    promise_is_change_parameter_flow = flow.run();
                  }

                  return promise_is_change_parameter_flow.then(function (response) {
                    if (response.result) {
                      /*
                      ** This was Change Parameter Flow
                      */
                      debug("This was change parameter flow since we could change parameter.");
                      return response.response;
                    }
                    /*
                    ** This is No Way Flow
                    */


                    debug("This is no way flow.");

                    try {
                      flow = new no_way_flow(vp, bot_event, context, _this.options);
                    } catch (err) {
                      return Promise.reject(err);
                    }

                    return flow.run();
                  }, function (response) {
                    // This is exception. Stop processing webhook and reject.
                    return Promise.reject(response);
                  });
                }
              }, function (response) {
                // This is exception. Stop processing webhook and reject.
                return Promise.reject(response);
              });
            }
          } // Completion of Flow


          return {
            v: promise_flow_completed.then(function (response) {
              debug("Successful End of Flow."); // Update memory.

              memory.put(memory_id, flow.context, _this.options.memory_retention);
              return flow.context;
            }, function (response) {
              debug("Abnormal End of Flow."); // Clear memory.

              memory.del(memory_id);
              return Promise.reject(response);
            })
          }; // End of Completion of Flow
        };

        for (var _iterator2 = bot_events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _ret = _loop();

          if (_typeof(_ret) === "object") return _ret.v;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      ; // End of Process Event
    }
  }]);

  return webhook;
}();