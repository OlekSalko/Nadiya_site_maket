/* Cooperation page: the request form follows the active tab
   (vacancies -> employment, contracting -> contracting, suppliers -> supply). */
(function () {
  'use strict';

  var select = document.getElementById('co-type');
  if (!select) return;

  function sync() {
    var active = document.querySelector('[role="tab"][aria-selected="true"][data-request-type]');
    if (active) select.value = active.getAttribute('data-request-type');
  }

  Array.prototype.forEach.call(document.querySelectorAll('[role="tab"][data-request-type]'), function (tab) {
    tab.addEventListener('click', sync);
    tab.addEventListener('keyup', sync);
  });

  sync(); // after tabs.js has applied a #hash deep link
})();
