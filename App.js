window.onload = function() {
  // Launching app

  Templates.getInstance().setElement('main');
  Templates.getInstance().setModal('modal');
  MainController.init();
};
