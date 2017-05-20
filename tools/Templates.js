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
          '<p class="error"></p>' +
          '<form id="login">' +
            '<p><input type="email" placeholder="email" /></p>' +
            '<p><input type="password" placeholder="password" /></p>' +
            '<p><input type="submit" value="Ok" /></p>' +
          '</form>',

        calendar:
          '<div id="controls">' +
            '<span>Date</span>' +
            '<span>View</span>' +
          '</div>' +
          '<div id="calendar">' +
            'Insert calendar here' +
          '</div>',

        event:
          '<div class="event">' +
            '{{ event.title }}: {{ event.author.firstname }}' +
          '</div>'
      };

      this.factory = document.createElement('span');
      this.factory.style.display = 'none';

      document.querySelector('body').appendChild(this.factory);
    }

    // Public methods

    DOManipulator.prototype.setElement = function(elementId) {
      this.element = document.querySelector('#' + elementId);
    }

    DOManipulator.prototype.replace = function(templateName, options) {
      if (!checkTemplateNames(templateName)) return;

      this.element.innerHTML = '';

      Object.keys(this.templates).forEach((function(k) {
        if (k !== 'nodes') {
          delete this.nodes[k];
        }
      }).bind(this))

      var node = createNode(this.templates[templateName], options)

      this.element.appendChild(node);

      this.nodes[templateName] = node;

      return this.nodes[templateName];
    }

    DOManipulator.prototype.append = function(templateName, options) {
      if (!checkTemplateNames(templateName)) return;
      var node = createNode(this.templates[templateName], options);

      this.element.appendChild(node);

      this.nodes[templateName] =  node;

      return this.nodes[templateName];
    }

    DOManipulator.prototype.prepend = function(templateName, options) {
      if (!checkTemplateNames(templateName)) return;
      var node = createNode(this.templates[templateName], options);

      this.element.insertBefore(node, this.element.firstElementChild);

      this.nodes[templateName] = node;

      return this.nodes[templateName];
    }

    DOManipulator.prototype.appendTo = function(templateName1, templateName2, options) {
      if (!checkTemplateNames([templateName1, templateName2]) || !checkNodes(templateName1)) return;

      var node = createNode(this.templates[templateName2], options);
      this.nodes[templateName1].appendChild(node);

      return node;
    }

    DOManipulator.prototype.prependTo = function(templateName1, templateName2, options) {
      if (!checkTemplateNames([templateName1, templateName2]) || !checkNodes(templateName1)) return;

      var node = createNode(this.templates[templateName2], options);
      this.nodes[templateName1].insertBefore(node, this.nodes[templateName1].firstElementChild);

      return node;
    }

    DOManipulator.prototype.destroy = function(templateName) {
      if (!checkNodes(templateName)) return;

      this.element.removeChild(this.nodes[templateName]);
      delete this.nodes[templateName];
    }

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
          console.error('No templates found for ' + templateNames.join(', '));
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

      options = Object.assign({
        tag: 'section'
      }, options);

      var element = document.createElement(options.tag);
      if (options.className) element.className = options.className;
      if (options.id) element.id = options.id;

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
