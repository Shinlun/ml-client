/*
 * Navigation history manager
 */
(function() {
  // Constructor

  function NavManager() {
    window.onpopstate = function(e){
      if (e.state) {
        Templates.getInstance().replace(e.state.html);
        document.title = e.state.pageTitle;
      }
    };
  }

  NavManager.prototype.save = function() {
    var data = {
      html: Templates.getInstance().element.innerHTML,
      pageTitle: this.currentView.title
    };

    Templates.getInstance().replace(data.html);
    document.title = data.pageTitle;
    window.history.pushState({ 'html': data.html, 'pageTitle': data.pageTitle }, '', location.origin + this.currentView.path);
  }

  // Instantiation

  this.NavManager = new NavManager();
})();
