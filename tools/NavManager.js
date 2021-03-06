/*
 * Navigation history manager
 */
(function() {
  // Constructor

  function NavManager() {
    window.onpopstate = function(e){
      if (e.state) {
        if (!localStorage.getItem('token')) return;
        if (localStorage.getItem('token') && e.state.view === 'LoginView') return;

        var view = window[e.state.view];

        if (view.deserialize && e.state.data) {
          view.deserialize(e.state.data);
        }

        view.display();
        document.title = view.title;
      }
    };
  }

  // Public methods

  NavManager.prototype.save = function(view, data) {
    document.title = view.title;
    window.history.pushState({
      view: getViewName(view),
      data: data
    }, '', Config.rootUrl);
  };

  NavManager.prototype.clean = function() {

  };

  // Private methods

  function getViewName(view) {
    return view.constructor.toString().split('function ')[1].split('(')[0];
  }

  // Instantiation

  this.NavManager = new NavManager();
})();
