function EventEmitter() {
  this.events = {};
}

EventEmitter.prototype.on = function(eventName, fn) {
  if (typeof fn !== 'function' || typeof eventName !== 'string') return;

  this.events[eventName] = this.events[eventName] || [];

  this.events[eventName].push(fn);
}

EventEmitter.prototype.off = function(eventName, fn) {
  if (!this.events[eventName]) return;

  for (var i = 0; i < this.events.length; i++) {
    if (this.events[eventName][i] === fn) {
      this.events[eventName].splice(i, 1);
      break;
    }
  }
}

EventEmitter.prototype.emit = function(eventName, data) {
  if (!this.events[eventName]) return;

  this.events[eventName].forEach(function (fn) {
    fn(data);
  })
}
