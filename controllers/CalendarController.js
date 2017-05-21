(function() {
  // Constructor

  function CalendarController() {
    this.events = [];
  }

  // Public methods

  CalendarController.prototype.init = function(cb) {
    SimpleAjax.request(Config.apiUrl + '/api/events', {
      method: 'GET',
      headers: {
        Authorization: Config.token
      },
      success: (function(response) {
        var events = JSON.parse(response);

        events.forEach(function(ev) {
          var event = new Event(ev);
          this.events.push(event);
          CalendarView.events.push(event);
        }, this);

        if (cb) {
          cb(response);
        }
      }).bind(this),
      error: function(err) {
        console.error(err);
      }
    });
    bindEvents(this);
  }

  // Private methods

  function bindEvents(instance) {}

  // Instantiation

  this.CalendarController = new CalendarController();
})();
