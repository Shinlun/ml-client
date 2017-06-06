(function() {
  if (typeof NodeList.prototype.forEach === "undefined") {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  if (typeof HTMLCollection.prototype.forEach === "undefined") {
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
  }
})();
