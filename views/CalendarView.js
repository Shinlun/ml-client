/*
 * Calendar view
 */
(function() {
  // Constructor

  function CalendarView() {
    EventEmitter.call(this);

    this.events = [];
  }

  CalendarView.prototype = Object.create(EventEmitter.prototype);
  CalendarView.prototype.constructor = CalendarView;

  // Public methods

  CalendarView.prototype.display = function() {
    this.element = Templates.getInstance().replace('calendar');

    this.events.forEach(function(ev) {
      Templates.getInstance().appendTo('calendar', 'event', {
        event: ev
      })
    });
  }

  // Instantiation

  this.CalendarView = new CalendarView();
})();
