(function() {
  // Constructor

  function MainController() {
    bindEvents(this);
  }

  // Public methods

  MainController.prototype.displayView = function(view) {
    if (typeof view === 'string') view = window[view];

    if (!view.display) return;

    view.display();
  }

  // Private methods

  function bindEvents(instance) {
    LoginView.on('logged-in', function() {
      CalendarController.init(function() {
        instance.displayView('CalendarView');
      });
    });
  }

  // Instantiation

  this.MainController = new MainController();
})();
