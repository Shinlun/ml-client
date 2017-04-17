/*
 * Login view
 */
(function() {
  // Constructor

  function Login() {}

  // Public methods

  Login.prototype.create = function() {
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
      success: function(response) {
        errorMsg.innerText = '';
        var json = JSON.parse(response);
        console.log(json.id);
      },
      error: function(err) {
        var json = JSON.parse(err);
        errorMsg.innerText = json.message;
      }
    })
  }

  // Instantiation

  this.Login = new Login();
})();
