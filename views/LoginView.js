/*
 * Login view
 */
(function() {
  // Constructor

  function LoginView() {
    EventEmitter.call(this);

    this.title = 'Connexion';
    this.path = '/login';
  }

  LoginView.prototype = Object.create(EventEmitter.prototype);
  LoginView.prototype.constructor = LoginView;

  // Public methods

  LoginView.prototype.display = function() {
    this.element = Templates.getInstance().replace('login');

    this.form = this.element.querySelector('#login');
    this.form.querySelector('input').focus();

    this.form.onsubmit = login.bind(this);
  }

  // Private methods

  function login(ev) {
    ev.preventDefault();

    var email = this.form.querySelector('input[type="email"]').value;
    var password = this.form.querySelector('input[type="password"]').value;
    var errorMsg = this.element.querySelector('.error');

    SimpleAjax.request(Config.apiUrl + '/login', {
      method: 'POST',
      data: {
        email: email,
        password: password
      },
      success: (function(response) {
        errorMsg.innerText = '';
        var json = JSON.parse(response);
        localStorage.setItem('token', json.token);
        this.emit('logged-in');
      }).bind(this),
      error: function(err) {
        var json = JSON.parse(err);
        errorMsg.innerText = json.message;
      }
    })
  }

  // Instantiation

  this.LoginView = new LoginView();
})();
