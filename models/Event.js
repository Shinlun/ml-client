/*
 * Event model
 */
function Event(data) {
  EventEmitter.call(this);

  var options = {};

  options.id = data.id ? data.id : '';
  options.type = data.type ? data.type : '';
  options.title = data.title ? data.title : '';
  options.body = data.body ? data.body : '';
  options.date = data.date ? new Date(data.date) : null;
  options.recurring = data.recurring ? data.recurring : false;
  options.created_at = data.created_at ? data.created_at : null;
  options.updated_at = data.updated_at ? data.updated_at : null;
  options.author = data.author ? data.author : {};

  Object.keys(options).forEach(function(key) {
    this[key] = options[key];
  }, this);
}

Event.prototype = Object.create(EventEmitter.prototype);
Event.prototype.constructor = Event;
