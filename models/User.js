/*
 * User model
 */
function User(data) {
  EventEmitter.call(this);

  var options = Object.assign({
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    dob: '',
    dop: '',
    sex: '',
    tutorial: true
  }, data);

  Object.keys(options).forEach(function(key) {
    this[key] = options[key];
  }, this);
}

User.prototype = Object.create(EventEmitter.prototype);
User.prototype.constructor = User;