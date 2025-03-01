'use strict';

var message_platform_list = ["line"];

var chai = require('chai');

var chaiAsPromised = require('chai-as-promised');

var Webhook = require('../module/webhook');

var Util = require("../test_utility/test_utility");

chai.use(chaiAsPromised);
var should = chai.should();

var _loop = function _loop() {
  var message_platform = _message_platform_lis[_i];
  describe("beacon-flow test - from " + message_platform, function () {
    var user_id = "beacon-flow";
    var event_type = "beacon";
    describe("beacon_skill not set", function () {
      it("should be skipped", function () {
        this.timeout(8000);
        var options = Util.create_options();
        var webhook = new Webhook(options);
        return webhook.run(Util["create_req_to_clear_memory"](user_id)).then(function (response) {
          return webhook.run(Util.create_req(message_platform, event_type, user_id, null, null));
        }).then(function (response) {
          response.should.equal("This is beacon flow but beacon_skill[\"enter\"] not found so skip.");
        });
      });
    });
    describe("beacon enter event", function () {
      it("should be processed successfully using survey skill.", function () {
        this.timeout(8000);
        var options = Util.create_options({
          beacon_skill: {
            enter: "survey",
            leave: "bye"
          }
        });
        var webhook = new Webhook(options);
        return webhook.run(Util["create_req_to_clear_memory"](user_id)).then(function (response) {
          return webhook.run(Util.create_req(message_platform, event_type, user_id, null, {
            "hwid": "d41d8cd98f",
            "type": "enter"
          }));
        }).then(function (response) {
          response.should.have.property("confirmed").and.deep.equal({});
          response.should.have.property("confirming", "satisfaction");
          response.should.have.property("to_confirm").and.have.property("satisfaction");
          response.should.have.property("to_confirm").and.have.property("difficulty");
          response.should.have.property("to_confirm").and.have.property("free_comment");
          response.should.have.property("to_confirm").and.have.property("mail");
          response.should.have.property("previous").and.deep.equal({
            confirmed: []
          });
        });
      });
    });
    describe("beacon leave event", function () {
      it("should be processed successfully using bye skill.", function () {
        this.timeout(8000);
        var options = Util.create_options({
          beacon_skill: {
            enter: "survey",
            leave: "bye"
          }
        });
        var webhook = new Webhook(options);
        return webhook.run(Util["create_req_to_clear_memory"](user_id)).then(function (response) {
          return webhook.run(Util.create_req(message_platform, event_type, user_id, null, {
            "hwid": "d41d8cd98f",
            "type": "leave"
          }));
        }).then(function (response) {
          response.should.have.property("confirmed").and.deep.equal({});
          response.should.have.property("confirming", null);
          response.should.have.property("to_confirm").and.deep.equal({});
          response.should.have.property("previous").and.deep.equal({
            confirmed: []
          });
        });
      });
    });
  });
};

for (var _i = 0, _message_platform_lis = message_platform_list; _i < _message_platform_lis.length; _i++) {
  _loop();
}