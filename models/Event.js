/*
 * Event model
 */
function Event(data) {
  EventEmitter.call(this);

  var options = Object.assign({
    id: '',
    type: '',
    title: '',
    body: '',
    date: null,
    created_at: null,
    updated_at: null,
    author: {}
  }, data);

  Object.keys(options).forEach(function(key) {
    this[key] = options[key];
  }, this);
}

Event.prototype = Object.create(EventEmitter.prototype);
Event.prototype.constructor = Event;
