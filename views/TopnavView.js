/*
 * Topnav view
 */
(function() {
  // Constructor

  function TopnavView() {
    EventEmitter.call(this);
    this.logoutCb = logout.bind(this);
  }

  TopnavView.prototype = Object.create(EventEmitter.prototype);
  TopnavView.prototype.constructor = LoginView;

  // Public methods

  TopnavView.prototype.display = function() {
    this.element = document.querySelector('#top-nav');
    this.element.style.display = 'block';

    this.element.querySelector('button').addEventListener('click', this.logoutCb);
  };

  TopnavView.prototype.hide = function() {
    this.element.style.display = 'none';
    this.element.querySelector('button').removeEventListener('click', this.logoutCb);
  }

  // Private methods

  function logout(ev) {
    ev.preventDefault();

    SimpleAjax.request(Config.apiUrl + '/logout', {
      method: 'GET',
      success: (function() {
        localStorage.clear();
        this.emit('logged-out');
      }).bind(this),
      error: function(err) {
        var json = JSON.parse(err);
        console.error(json);
      }
    })
  }

  // Instantiation

  this.TopnavView = new TopnavView();
})();

