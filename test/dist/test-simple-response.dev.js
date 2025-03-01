'use strict';

var message_platform_list = ["line", "facebook"];

var chai = require('chai');

var chaiAsPromised = require('chai-as-promised');

var Webhook = require('../module/webhook');

var Util = require("../test_utility/test_utility");

chai.use(chaiAsPromised);
chai.should();

var _loop = function _loop() {
  var message_platform = _message_platform_lis[_i];
  describe("simple response skill test - from " + message_platform, function () {
    var user_id = "simple-response";
    var event_type = "message";
    describe("#こんにちは", function () {
      it("responds fulfillment speech and left 0 to_confirm.", function () {
        var options = Util.create_options();
        var webhook = new Webhook(options);
        return webhook.run(Util["create_req_to_clear_memory"](user_id)).then(function (response) {
          return webhook.run(Util.create_req(message_platform, event_type, user_id, "text", "こんにちは。"));
        }).then(function (response) {
          response.should.have.property("confirmed").and.deep.equal({});
          response.should.have.property("confirming", null);
          response.should.have.property("to_confirm").and.deep.equal({});
          response.should.have.property("previous").and.deep.equal({
            confirmed: []
          });
          response.should.have.property("intent").and.have.property("fulfillment").and.have.property("speech").and.equal("どうも。");
        });
      });
    });
  });
};

for (var _i = 0, _message_platform_lis = message_platform_list; _i < _message_platform_lis.length; _i++) {
  _loop();
}