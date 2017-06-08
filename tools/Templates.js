/*
 * Templates Singleton
  */
(function() {
  this.Templates = (function() {
    var instance;

    // Constructor

    function DOManipulator() {
      this.nodes = {};

      this.templates = {
        login:
          '<p class="error col-xs-12"></p>' +
          '<p class="col-xs-2">&nbsp;</p>' +
          '<form id="login" class="col-xs-8">' +
            '<p><input type="email" placeholder="email" /></p>' +
            '<p><input type="password" placeholder="password" /></p>' +
            '<p><input type="submit" value="Ok" /></p>' +
          '</form>' +
          '<p class="col-xs-2">&nbsp;</p>',

        calendar:
          '<a class="control-link prev-month left fa fa-arrow-circle-left"></a>' +
          '<a class="control-link next-month right fa fa-arrow-circle-right"></a>' +
          '<h2 class="page-title">{{ month }} {{ year }}</h2>' +
          '<table id="calendar">' +
            '<tr id="days">' +
              '<th>Dimanche</th>' +
              '<th>Lundi</th>' +
              '<th>Mardi</th>' +
              '<th>Mercredi</th>' +
              '<th>Jeudi</th>' +
              '<th>Vendredi</th>' +
              '<th>Samedi</th>' +
            '</tr>' +
          '</table>',

        week: ' ',

        day:
          '<span class="day-infos">{{ day }} {{ nbEvents}}</span>' +
          '<span class="day-controls">' +
            '<button class="fa fa-eye event-button see-events"></button>' +
            '<button class="fa fa-plus event-button add-event"></button>' +
          '</span>',

        events:
          '<div id="daysEvents"></div>',

        event:
          '<h3>{{ event.title }} - <i> {{ event.type }}</i></h3>' +
          '<p><i>créé par {{ event.author.firstname }} {{ event.author.lastname }}</i> </p>' +
          '<p>{{ event.body }}</p>' +
          '<hr/>',

        createEventForm:
          '<form id="new-event-form">' +
            '<span id="new-event-date">' +
              '<input type="number" min="1" max="31" value="{{ day }}" id="new-event-day" />' +
              '<select id="new-event-month">' +
                '<option value="1">Janvier</option>' +
                '<option value="2">Février</option>' +
                '<option value="3">Mars</option>' +
                '<option value="4">Avril</option>' +
                '<option value="5">Mai</option>' +
                '<option value="6">Juin</option>' +
                '<option value="7">Juillet</option>' +
                '<option value="8">Août</option>' +
                '<option value="9">Septembre</option>' +
                '<option value="10">Octobre</option>' +
                '<option value="11">Novembre</option>' +
                '<option value="12">Décembre</option>' +
              '</select>' +
              '<input type="text" value="{{ year }}" id="new-event-year" />' +
            '</span>' +
            '<input type="text" id="new-event-title" placeholder="Titre" />' +
            '<br/>' +
            '<select id="new-event-type">' +
              '<option value="birth">Naissance</option>' +
              '<option value="engagement">Fiançailles</option>' +
              '<option value="marriage">Mariage</option>' +
              '<option value="death">Décès</option>' +
              '<option value="holidays">Vacances</option>' +
              '<option value="announcement">Annonce</option>' +
              '<option value="news">Nouvelle</option>' +
              '<option value="other">Autre</option>' +
            '</select>' +
            '<br/>' +
            '<textarea id="new-event-description" placeholder="Description"></textarea>' +
            '<br/>' +
            '<input type="checkbox" id="new-event-recurring" />' +
            '<label for="new-event-recurring">Répéter chaque année</label>' +
            '<br/>' +
            '<input type="submit" value="Créer" />' +
          '</form>'
      };

      this.factory = document.createElement('span');
      this.factory.style.display = 'none';

      document.querySelector('body').appendChild(this.factory);
    }

    // Public methods

    DOManipulator.prototype.setElement = function(elementId) {
      this.element = document.querySelector('#' + elementId);
    };

    DOManipulator.prototype.replace = function(templateName, options) {
      this.element.innerHTML = '';

      Object.keys(this.templates).forEach((function(k) {
        if (k !== 'nodes') {
          delete this.nodes[k];
        }
      }).bind(this));

      var node = createNode(this.templates[templateName] ? this.templates[templateName] : templateName, options)

      this.element.appendChild(node);

      this.nodes[templateName] = node;

      return this.nodes[templateName];
    };

    DOManipulator.prototype.append = function(templateName, options) {
      if (!checkTemplateNames(templateName)) return;
      var node = createNode(this.templates[templateName], options);

      this.element.appendChild(node);

      this.nodes[templateName] =  node;

      return this.nodes[templateName];
    };

    DOManipulator.prototype.prepend = function(templateName, options) {
      if (!checkTemplateNames(templateName)) return;
      var node = createNode(this.templates[templateName], options);

      this.element.insertBefore(node, this.element.firstElementChild);

      this.nodes[templateName] = node;

      return this.nodes[templateName];
    };

    DOManipulator.prototype.appendTo = function(templateName1, templateName2, options) {
      if (!checkTemplateNames([templateName1, templateName2]) || !checkNodes(templateName1)) return;

      var templateOpts = options.template ? options.template : null;
      var node = createNode(this.templates[templateName2], templateOpts);
      (options.elementId ? this.nodes[templateName1].querySelector('#' + options.elementId) : this.nodes[templateName1]).appendChild(node);

      return node;
    };

    DOManipulator.prototype.prependTo = function(templateName1, templateName2, options) {
      if (!checkTemplateNames([templateName1, templateName2]) || !checkNodes(templateName1)) return;

      var node = createNode(this.templates[templateName2], options);
      this.nodes[templateName1].insertBefore(node, this.nodes[templateName1].firstElementChild);

      return node;
    };

    DOManipulator.prototype.destroy = function(templateName) {
      if (!checkNodes(templateName)) return;

      this.element.removeChild(this.nodes[templateName]);
      delete this.nodes[templateName];
    };

    DOManipulator.prototype.setModal = function(modalId) {
      this.modal = document.querySelector('#' + modalId);
      this.modalContent = this.modal.querySelector('.modal-text');
      this.modal.querySelector('.close').onclick = this.closeModal.bind(this);
    };

    DOManipulator.prototype.openModal = function(templateName, options) {
      if (!checkTemplateNames(templateName)) return;

      this.modalContent.innerHTML = '';

      var node = createNode(this.templates[templateName], options);

      this.modalContent.appendChild(node);

      this.modal.style.display = 'block';

      return node;
    };

    DOManipulator.prototype.closeModal = function() {
      this.modalContent.innerHTML = '';
      this.modal.style.display = 'none';
    };

    // Private methods

    function createInstance() {
      return new DOManipulator();
    }

    function checkTemplateNames(templateNames) {
      if (!instance.element) {
        console.error('No base element set for templates');
        return false;
      }

      if (typeof templateNames === 'string' && !instance.templates[templateNames]) {
        console.error('No template found for ' + templateNames);
        return false;
      }

      if (typeof  templateNames === 'object') {
        var notFound = [];
        templateNames.forEach(function(templateName) {
          if (!instance.templates[templateName]) {
            notFound.push(templateName);
          }
        });

        if (notFound.length > 0) {
          console.error('No templates found for ' + notFound.join(', '));
          return false;
        }
      }

      return true;
    }

    function checkNodes(templateNames) {
      if (!instance.element) {
        console.error('No base element set for templates');
        return false;
      }

      if (typeof templateNames === 'string' && !instance.nodes[templateNames]) {
        console.error('Template ' + templateNames + ' is not present in the DOM');
        return false;
      }

      if (typeof templateNames === 'object') {
        var notFound = [];
        templateNames.forEach(function(templateName) {
          if (!instance.nodes[templateName]) {
            notFound.push(templateName);
          }
        });

        if (notFound.length > 0) {
          console.error('Templates ' + templateNames.join(', ') + ' are not present in the DOM');
          return false;
        }
      }

      return true;
    }

    function createNode(html, options) {
      if (!instance) return;

      options.tag = options.tag ? options.tag : 'section';

      var element = document.createElement(options.tag);
      element.className = options.className ? options.className : '';
      if (options.id) element.id = options.id;
      if (options.tagData) element.setAttribute('data-element', options.tagData);

      // Template pattern replacement
      var match = html.match(/\{\{ ?[a-zA-Z0-9\.]+ ?}}/g);
      if (match) {
        match.forEach(function(pattern) {
          var obj = pattern.replace(/\{\{ ?/g, '').replace(/ ?}}/g, '')
          var split = obj.split('.');
          var opt = options[split[0]];
          for (var i = 1; i < split.length; i++) {
            opt = opt[split[i]];
          }
          html = html.replace(pattern, opt);
        })
      }

      element.innerHTML = html;

      instance.factory.appendChild(element);

      var node = instance.factory.firstElementChild;
      instance.factory.innerHTML = '';
      return node;
    }

    // Singleton

    return {
      getInstance: function() {
        if (!instance) {
          instance = createInstance();
        }

        return instance;
      }
    }
  })();
})();
