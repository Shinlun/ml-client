(function() {
  // Constructor

  function CalendarController() {
    bindEvents();
  }

  // Public methods

  CalendarController.prototype.init = function(cb) {
    var now = CalendarView.date;

    var toMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2;

    var from = new Date(now.getFullYear() + '-' + (now.getMonth() + 1) + '-01');
    var to = new Date(now.getFullYear() + '-' + toMonth + '-01');

    SimpleAjax.request(Config.apiUrl + '/api/events?from=' + from.getTime() + '&to=' + to.getTime(), {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token')
      },
      success: (function(response) {
        var events = JSON.parse(response);

        CalendarView.happenings = events.map(function(ev) {
          return new Event(ev);
        });

        if (cb) {
          cb(response);
        }
      }).bind(this),
      error: function(err) {
        console.error(err);
      }
    });
  };

  // Private methods

  function bindEvents() {
    CalendarView.on('create-event', createEvent);
  }

  function createEvent(data) {
    SimpleAjax.request(Config.apiUrl + '/api/events', {
      method: 'POST',
      headers: {
        Authorization: localStorage.getItem('token')
      },
      data: {
        type: data.type,
        title: data.title,
        content: data.body,
        date: data.date.getTime(),
        recurring: data.recurring
      },
      success: function(response) {
        var event = new Event(JSON.parse(response));

        if (event.date.getMonth() === CalendarView.date.getMonth()) {
          CalendarView.happenings.push(event);
        }
        CalendarView.display();
        CalendarView.showEvents(event.date.getDate());
      },
      error: function(err) {
        console.error(err);
      }
    });

    Templates.getInstance().closeModal();
  }

  // Instantiation

  this.CalendarController = new CalendarController();
})();
