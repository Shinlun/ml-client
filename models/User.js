/*
 * User model
 */
function User(data) {
  EventEmitter.call(this);

  var options = {};

  options.id = data.id ? data.id : '';
  options.firstname = data.firstname ? data.firstname : '';
  options.lastname = data.lastname ? data.lastname : '';
  options.email = data.email ? data.email : '';
  options.dob = data.dob ? data.dob : '';
  options.dop = data.dop ? data.dop : '';
  options.sex = data.sex ? data.sex : '';
  options.tutorial = data.tutorial ? data.tutorial : true;

  Object.keys(options).forEach(function(key) {
    this[key] = options[key];
  }, this);
}

User.prototype = Object.create(EventEmitter.prototype);
User.prototype.constructor = User;