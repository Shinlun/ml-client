/*
 * Calendar view
 */
(function() {
  // Constructor

  function CalendarView() {
    EventEmitter.call(this);

    this.title = 'Calendrier';
    this.path = '/calendar';
    this.happenings = [];
    this.date = new Date();
  }

  CalendarView.prototype = Object.create(EventEmitter.prototype);
  CalendarView.prototype.constructor = CalendarView;

  // Public methods

  CalendarView.prototype.display = function() {
    this.element = Templates.getInstance().replace('calendar', {
      month: Months[this.date.getMonth()],
      year: this.date.getFullYear()
    });

    var firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var lastDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    var today = new Date();

    var x = 1;
    for (var i = 0; i < 6; i++) {
      Templates.getInstance().appendTo('calendar', 'week', {
        elementId: 'calendar',
        template: {
          tag: 'tr',
          id: 'week-' + i
        }
      });

      for (var j = 0; j < 7; j++) {
        var cond = i === 0 && j < firstDay || x > lastDate;
        var nbEvents = this.happenings.filter(function(ev) {
          return !cond && new Date(ev.date).getDate() === x && new Date(ev.date).getMonth() === this.date.getMonth();
        }).length;

        var isToday = this.date.getFullYear() === today.getFullYear()
          && this.date.getMonth() === today.getMonth()
          && x === today.getDate();

        var className = cond ? 'empty' : (nbEvents > 0 ? 'hasEvents day' : 'day');
        className += isToday ? ' day-' + x + ' today' : (cond ? '' : ' day-' + x);

        Templates.getInstance().appendTo('calendar', 'day', {
          elementId: 'week-' + i,
          template: {
            tag: 'td',
            className: className,
            tagData: x,
            day: cond ? '' : x,
            nbEvents: nbEvents > 0 ? '(' + nbEvents + ')' : ''
          }
        });
        if (!cond) x++;
      }
      if (x > lastDate) break;
    }

    bindEvents(this);
  };

  CalendarView.prototype.serialize = function() {
    return {
      date: this.date,
      happenings: this.happenings
    }
  }

  CalendarView.prototype.deserialize = function(data) {
    if (data.date) {
      this.date = new Date(data.date);
    }
    if (data.happenings) {
      this.happenings = data.happenings
    }
  };

  CalendarView.prototype.setMonth = function(month) {
    this.date.setMonth(month);
    this.emit('changed-date');
  };

  CalendarView.prototype.showEvents = function(day) {
    var selected = document.querySelector('.selected');

    if (selected && selected.classList) selected.classList.remove('selected');

    this.element.querySelector('.day-' + day).classList.add('selected');

    Templates.getInstance().destroy('events');
    Templates.getInstance().append('events');

    var date = this.date;
    date.setDate(day);

    var daysEvents = this.happenings.filter(function(happening) {
      return (happening.date.getFullYear() === date.getFullYear() || happening.recurring)
        && happening.date.getMonth() === date.getMonth()
        && happening.date.getDate() === date.getDate();
    });

    daysEvents.forEach(function(event) {
      var type = event.type;
      switch (event.type) {
        case 'birth':
          type = 'Anniversaire';
        break;
        case 'engagement':
          type = 'Fiançailles';
        break;
        case 'marriage':
          type = 'Mariage';
        break;
        case 'death':
          type = 'Décès';
        break;
        case 'holidays':
          type = 'Vacances';
        break;
        case 'annoucement':
          type = 'Annonce';
        break;
        case 'news':
          type = 'Nouvelle';
        break;
        case 'other':
          type = '';
        break;
      }

      event.type = type;

      Templates.getInstance().appendTo('events', 'event', {
        template: {
          tag: 'p',
          event: event
        }
      })
    });
  };

  CalendarView.prototype.showEventForm = function(ev, day) {
    ev.stopPropagation();

    var form = Templates.getInstance().openModal('createEventForm', {
      day: day,
      year: this.date.getFullYear()
    });

    form.querySelector('#new-event-month').querySelectorAll('option')[this.date.getMonth()].setAttribute('selected', 'selected');

    form.addEventListener('submit', submitEvent.bind(this));
  };

  // Private methods

  function bindEvents(instance) {
    instance.element.querySelector('.prev-month').onclick = instance.setMonth.bind(instance, instance.date.getMonth() - 1);
    instance.element.querySelector('.next-month').onclick = instance.setMonth.bind(instance, instance.date.getMonth() + 1);

    instance.element.querySelectorAll('.day').forEach(function(day) {
      day.onclick = function() {
        instance.showEvents.call(instance, day.getAttribute('data-element'));
      };

      day.onmouseover = function() {
        day.querySelector('.day-controls').style.visibility = 'visible';
      };

      day.onmouseout = function() {
        day.querySelector('.day-controls').style.visibility = 'hidden';
      };

      day.querySelector('.see-events').onclick = instance.showEvents.bind(instance, day.getAttribute('data-element'));
      day.querySelector('.add-event').onclick = function(ev) { instance.showEventForm.call(instance, ev, day.getAttribute('data-element')) };
    });
  }

  function submitEvent(ev) {
    ev.preventDefault();

    var year = document.querySelector('#new-event-year').value;
    var month = document.querySelector('#new-event-month').value;
    var day = document.querySelector('#new-event-day').value;

    var eventDate = new Date(month + '-' + day + '-' + year);

    this.emit('create-event', {
      title: document.querySelector('#new-event-title').value,
      type: document.querySelector('#new-event-type').value,
      body: document.querySelector('#new-event-description').value,
      date: eventDate,
      recurring: document.querySelector('#new-event-recurring').checked
    });
  }

  // Instantiation

  this.CalendarView = new CalendarView();
})();
