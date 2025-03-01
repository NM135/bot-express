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
  describe("change-light-color skill test - from " + message_platform, function () {
    var user_id = "change-light-color";
    var event_type = "message";
    describe("#ライトの色変えて", function () {
      it("goes start conversation flow and confirm the color of light.", function () {
        this.timeout(8000);
        var options = Util.create_options();
        var webhook = new Webhook(options);
        return webhook.run(Util["create_req_to_clear_memory"](user_id)).then(function (response) {
          return webhook.run(Util.create_req(message_platform, event_type, user_id, "text", "ライトの色変えて"));
        }).then(function (response) {
          response.should.have.property("confirmed").and.deep.equal({});
          response.should.have.property("confirming", "color");
          response.should.have.property("to_confirm").have.property("color");
          response.should.have.property("previous").and.deep.equal({
            confirmed: []
          });
        });
      });
    });
    describe("#赤", function () {
      it("goes reply flow and the color of light is changed to 赤.", function () {
        this.timeout(8000);
        var options = Util.create_options();
        var webhook = new Webhook(options);
        return webhook.run(Util.create_req(message_platform, event_type, user_id, "text", "赤")).then(function (response) {
          response.should.have.property("confirmed").and.deep.equal({
            color: "FF7B7B"
          });
          response.should.have.property("confirming", null);
          response.should.have.property("to_confirm").and.deep.equal({});
          response.should.have.property("previous").and.deep.equal({
            confirmed: ["color"]
          });
        });
      });
    });
    describe("#黄", function () {
      it("goes change parameter flow and the color of light is changed to 黄.", function () {
        this.timeout(8000);
        var options = Util.create_options();
        var webhook = new Webhook(options);
        return webhook.run(Util.create_req(message_platform, event_type, user_id, "text", "黄")).then(function (response) {
          response.should.have.property("confirmed").and.deep.equal({
            color: "FFFA6A"
          });
          response.should.have.property("confirming", null);
          response.should.have.property("to_confirm").and.deep.equal({});
          response.should.have.property("previous").and.deep.equal({
            confirmed: ["color"]
          });
        });
      });
    });
    describe("#ライトの色を青に変えて", function () {
      it("goes change intent flow and changes the color of light to 青 immediately.", function () {
        this.timeout(8000);
        var options = Util.create_options();
        var webhook = new Webhook(options);
        return webhook.run(Util.create_req(message_platform, event_type, user_id, "text", "ライトの色を青に変えて")).then(function (response) {
          response.should.have.property("confirmed").and.deep.equal({
            color: "5068FF"
          });
          response.should.have.property("confirming", null);
          response.should.have.property("to_confirm").and.deep.equal({});
          response.should.have.property("previous").and.deep.equal({
            confirmed: ["color", "color"]
          });
        });
      });
    });
    describe("#赤", function () {
      it("goes change parameter flow and changes the color of light to 赤.", function () {
        this.timeout(8000);
        var options = Util.create_options();
        var webhook = new Webhook(options);
        return webhook.run(Util.create_req(message_platform, event_type, user_id, "text", "赤")).then(function (response) {
          response.should.have.property("confirmed").and.deep.equal({
            color: "FF7B7B"
          });
          response.should.have.property("confirming", null);
          response.should.have.property("to_confirm").and.deep.equal({});
          response.should.have.property("previous").and.deep.equal({
            confirmed: ["color", "color"]
          });
        });
      });
    });
    describe("#黄(postback)", function () {
      it("goes change parameter flow and changes the color of light to 黄.", function () {
        this.timeout(8000);
        var options = Util.create_options();
        var webhook = new Webhook(options);
        return webhook.run(Util.create_req(message_platform, "postback", user_id, null, "黄")).then(function (response) {
          response.should.have.property("confirmed").and.deep.equal({
            color: "FFFA6A"
          });
          response.should.have.property("confirming", null);
          response.should.have.property("to_confirm").and.deep.equal({});
          response.should.have.property("previous").and.deep.equal({
            confirmed: ["color", "color"]
          });
        });
      });
    });
  });
};

for (var _i = 0, _message_platform_lis = message_platform_list; _i < _message_platform_lis.length; _i++) {
  _loop();
}