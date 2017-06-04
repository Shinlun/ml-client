(function() {
  // Constructor

  function MainController() {
    bindEvents(this);
  }

  // Public methods

  MainController.prototype.init = function() {
    if (this.initiated) return;

    localStorage.getItem('token')
      ? CalendarController.init((function() {
          this.displayView(CalendarView);
        }).bind(this))
      : this.displayView(LoginView);
    this.initiated = true;
  };

  MainController.prototype.displayView = function(view) {
    if (typeof view === 'string') view = window[view];

    if (!view.display) return;

    view.display();
    var data = view.serialize ? view.serialize() : null;

    NavManager.save(view, data);
  };

  // Private methods

  function bindEvents(instance) {
    LoginView.on('logged-in', function() {
      CalendarController.init(function() {
        instance.displayView(CalendarView);
      });
    });

    CalendarView.on('changed-date', function() {
      CalendarController.init(function() {
        instance.displayView(CalendarView);
      });
    });
  }

  // Instantiation

  this.MainController = new MainController();
})();
