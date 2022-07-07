const chai = require("chai");
const spies = require("chai-spies");
const { EventEmitter } = require("../lib");
chai.use(spies);
const expect = chai.expect;

describe("EventEmitter suites", () => {
  describe("EventEmitter.subscribe suites", () => {
    it("should subscribe and save in local event emitter state", () => {
      const eventEmitter = new EventEmitter();
      eventEmitter.subscribe("foo", () => {});
      eventEmitter.subscribe("foo.bar", () => {});
      eventEmitter.subscribe("foo.*", () => {});
      expect(Object.keys(eventEmitter._map)).length(3);
    });

    it("should subscribe and push callback to existing key instead of rewrite", () => {
      const eventEmitter = new EventEmitter();
      eventEmitter.subscribe("foo", () => {});
      eventEmitter.subscribe("foo", () => {});
      expect(Object.keys(eventEmitter._map)).length(1);
      expect(eventEmitter._map["foo"]).length(2);
    });
  });

  describe("EventEmitter.unsubscribe suites", () => {
    it("should unsubscribe from event", () => {
      const eventEmitter = new EventEmitter();
      eventEmitter.subscribe("foo", () => {});
      eventEmitter.unsibcribe("foo", () => {});
      expect(eventEmitter._map["foo"]).length(0);
    });
    it("should not unsubscribe from event if functions signatures doesn't compare", () => {
      const eventEmitter = new EventEmitter();
      eventEmitter.subscribe("foo", () => {
        console.log("me");
      });
      eventEmitter.unsibcribe("foo", () => {
        console.log("you");
      });
      expect(eventEmitter._map["foo"]).length(1);
    });
  });

  describe("EventEmitter.unsubscribeAll suites", () => {
    it("should clear local event emitter state from events", () => {
      const eventEmitter = new EventEmitter();
      eventEmitter.subscribe("foo1", () => {});
      eventEmitter.subscribe("foo2", () => {});
      eventEmitter.subscribe("foo3", () => {});
      eventEmitter.subscribe("foo4", () => {});
      eventEmitter.subscribe("foo5", () => {});
      eventEmitter.subscribe("foo6", () => {});
      eventEmitter.unsubscribeAll();
      expect(Object.keys(eventEmitter._map)).length(0);
    });
  });

  describe("EventEmitter.emit suites", () => {
    it("should emit all suitable callbacks", () => {
      const eventEmitter = new EventEmitter();
      const firstCallback = () => 1;
      const secondCallback = () => 2;
      const spyOne = chai.spy(firstCallback);
      const spyTwo = chai.spy(secondCallback);
      eventEmitter.subscribe("foo", spyOne);
      eventEmitter.subscribe("foo.*", spyTwo);
      eventEmitter.emit("foo", { message: "My name is giovanni giorgio" });
      expect(spyOne).to.have.been.called();
      expect(spyTwo).not.to.have.been.called();
    });
    it("should emit to scope", () => {
      const eventEmitter = new EventEmitter();
      const callback = () => 1;
      const spy = chai.spy(callback);
      eventEmitter.subscribe("foo.bar.*", spy);
      eventEmitter.emit("foo.bar", { message: "bad" });
      eventEmitter.emit("foo.bar.xyz", {
        message: "My name is giovani giorgio",
      });
      eventEmitter.emit("foo.bar.zyx", {
        message: "But everybody calls me giorgio",
      });
      expect(spy).to.have.been.called.exactly(2);
    });
  });
});
