'use strict';

var message_platform_list = ["line", "facebook"];

var chai = require('chai');

var chaiAsPromised = require('chai-as-promised');

var Webhook = require('../module/webhook');

var Util = require("../test_utility/test_utility");

chai.use(chaiAsPromised);
var should = chai.should();

var _loop = function _loop() {
  var message_platform = _message_platform_lis[_i];
  describe("handle-pizza-order skill test - from " + message_platform, function () {
    var user_id = "handle-pizza-order";
    var event_type = "message";
    describe("ピザを注文したいのですが", function () {
      it("goes start conversation flow and confirm the pizza type.", function () {
        this.timeout(8000);
        var options = Util.create_options();
        var webhook = new Webhook(options);
        return webhook.run(Util["create_req_to_clear_memory"](user_id)).then(function (response) {
          return webhook.run(Util.create_req(message_platform, event_type, user_id, "text", "ピザを注文したいのですが"));
        }).then(function (response) {
          response.should.have.property("confirmed").and.deep.equal({});
          response.should.have.property("confirming", "pizza");
          response.should.have.property("to_confirm").have.property("pizza");
          response.should.have.property("to_confirm").have.property("size");
          response.should.have.property("to_confirm").have.property("address");
          response.should.have.property("to_confirm").have.property("name");
          response.should.have.property("previous").and.deep.equal({
            confirmed: []
          });
        });
      });
    });
    describe("マルゲリータで。", function () {
      it("goes reply flow and pizza is set to マルゲリータ.", function () {
        this.timeout(8000);
        var options = Util.create_options();
        var webhook = new Webhook(options);
        return webhook.run(Util.create_req(message_platform, event_type, user_id, "text", "マルゲリータで。")).then(function (response) {
          response.should.have.property("confirmed").and.deep.equal({
            pizza: "マルゲリータ"
          });
          response.should.have.property("confirming", "size");
          response.should.have.property("to_confirm").have.property("size");
          response.should.have.property("to_confirm").have.property("address");
          response.should.have.property("to_confirm").have.property("name");
          response.should.have.property("previous").and.deep.equal({
            confirmed: ["pizza"]
          });
        });
      });
    });
    describe("Mサイズかな。", function () {
      it("goes reply flow and size is set to M.", function () {
        this.timeout(8000);
        var options = Util.create_options();
        var webhook = new Webhook(options);
        return webhook.run(Util.create_req(message_platform, event_type, user_id, "text", "Mサイズで。")).then(function (response) {
          response.should.have.property("confirmed").and.deep.equal({
            pizza: "マルゲリータ",
            size: "M"
          });
          response.should.have.property("confirming", "address");
          response.should.have.property("to_confirm").have.property("address");
          response.should.have.property("to_confirm").have.property("name");
          response.should.have.property("previous").and.deep.equal({
            confirmed: ["size", "pizza"]
          });
        });
      });
    });
    describe("港区北青山1-1-1です", function () {
      it("goes reply flow and address is set to 港区北青山1-1-1.", function () {
        this.timeout(8000);
        var options = Util.create_options();
        var webhook = new Webhook(options);
        return webhook.run(Util.create_req(message_platform, event_type, user_id, "text", "港区北青山1-1-1")).then(function (response) {
          response.should.have.property("confirmed").and.deep.equal({
            pizza: "マルゲリータ",
            size: "M",
            address: {
              address: "港区北青山1-1-1",
              latitude: null,
              longitude: null
            }
          });
          response.should.have.property("confirming", "name");
          response.should.have.property("to_confirm").have.property("name");
          response.should.have.property("previous").and.deep.equal({
            confirmed: ["address", "size", "pizza"]
          });
        });
      });
    });
    describe("中嶋一樹と申します", function () {
      it("goes reply flow and name is set to 中嶋一樹.", function () {
        this.timeout(8000);
        var options = Util.create_options();
        var webhook = new Webhook(options);
        return webhook.run(Util.create_req(message_platform, event_type, user_id, "text", "中嶋一樹")).then(function (response) {
          should.not.exist(response);
        });
      });
    });
    describe("マリナーラのLサイズをお願いしたいのですが", function () {
      it("goes start conversation flow and pizza type and size are set. And confirm address to delivery.", function () {
        this.timeout(8000);
        var options = Util.create_options();
        var webhook = new Webhook(options);
        return webhook.run(Util["create_req_to_clear_memory"](user_id)).then(function (response) {
          return webhook.run(Util.create_req(message_platform, event_type, user_id, "text", "マリナーラのLサイズをお願いしたいのですが"));
        }).then(function (response) {
          response.should.have.property("confirmed").and.deep.equal({
            pizza: "マリナーラ",
            size: "L"
          });
          response.should.have.property("confirming", "address");
          response.should.have.property("to_confirm").have.property("address");
          response.should.have.property("to_confirm").have.property("name");
          response.should.have.property("previous").and.deep.equal({
            confirmed: ["size", "pizza"]
          });
        });
      });
    });
    describe("位置情報", function () {
      it("goes reply flow and address,latitude,longitude are set.", function () {
        this.timeout(8000);
        var options = Util.create_options();
        var webhook = new Webhook(options);
        var payload;

        if (message_platform == "line") {
          payload = {
            "id": "325708",
            "type": "location",
            "title": "my location",
            "address": "〒150-0002 東京都渋谷区渋谷２丁目２１−１",
            "latitude": 35.65910807942215,
            "longitude": 139.70372892916203
          };
        } else if (message_platform == "facebook") {
          payload = {
            "mid": "mid.1458696618141:b4ef9d19ec21086067",
            "seq": 51,
            "attachments": [{
              "type": "location",
              "payload": {
                "coordinates": {
                  "lat": 35.65910807942215,
                  "long": 139.70372892916203
                }
              }
            }]
          };
        }

        return webhook.run(Util.create_req(message_platform, event_type, user_id, "location", payload)).then(function (response) {
          response.should.have.property("confirmed").and.have.property("pizza").and.equal("マリナーラ");
          response.should.have.property("confirmed").and.have.property("size").and.equal("L");

          if (message_platform == "line") {
            response.should.have.property("confirmed").and.have.property("address").and.have.property("address").and.equal("〒150-0002 東京都渋谷区渋谷２丁目２１−１");
          } else if (message_platform == "facebook") {
            response.should.have.property("confirmed").and.have.property("address").and.have.property("address").and.equal(null);
          }

          response.should.have.property("confirmed").and.have.property("address").and.have.property("latitude").and.equal(35.65910807942215);
          response.should.have.property("confirmed").and.have.property("address").and.have.property("longitude").and.equal(139.70372892916203);
          response.should.have.property("confirming", "name");
          response.should.have.property("to_confirm").have.property("name");
          response.should.have.property("previous").and.deep.equal({
            confirmed: ["address", "size", "pizza"]
          });
        });
      });
    });
  });
};

for (var _i = 0, _message_platform_lis = message_platform_list; _i < _message_platform_lis.length; _i++) {
  _loop();
}