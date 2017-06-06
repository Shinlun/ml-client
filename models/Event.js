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
    recurring: false,
    created_at: null,
    updated_at: null,
    author: {}
  }, data);

  if (options.date) {
    options.date = new Date(options.date);
  }

  Object.keys(options).forEach(function(key) {
    this[key] = options[key];
  }, this);
}

Event.prototype = Object.create(EventEmitter.prototype);
Event.prototype.constructor = Event;
