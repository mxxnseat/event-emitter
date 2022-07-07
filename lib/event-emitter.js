class EventEmitter {
  _map = {};

  subscribe(event, callback) {
    if (!(event in this._map)) {
      this._map[event] = [];
    }
    this._map[event].push(callback);
  }

  unsibcribe(event, callback) {
    if (!(event in this._map)) {
      return;
    }
    this._map[event] = this._map[event].filter(
      (existCallback) => callback.toString() !== existCallback.toString()
    );
  }

  unsubscribeAll() {
    this._map = {};
  }

  emit(event, data) {
    Object.keys(this._map).forEach((existEvent) => {
      if (existEvent === "*") {
        this._map[existEvent]?.forEach((callback) => {
          callback(data, event);
        });
      }
      const prepareEventString = existEvent
        .replace("*", "[a-z0-9A-Z]+")
        .replace(".", "\\.");
      const regexpByExistEvent = new RegExp(`^${prepareEventString}$`);
      const isExistInMap = regexpByExistEvent.exec(event);
      if (!isExistInMap) {
        return;
      }
      this._map[existEvent].forEach((callback) => {
        callback(data, event);
      });
    });
  }
}

module.exports = { EventEmitter };
