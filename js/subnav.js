/* Highlights the in-page navigation link of the section in view */
(function () {
  'use strict';

  var links = document.querySelectorAll('.subnav__list a[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;

  var map = {};
  Array.prototype.forEach.call(links, function (a) {
    var target = document.getElementById(a.getAttribute('href').slice(1));
    if (target) map[target.id] = a;
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      Array.prototype.forEach.call(links, function (a) { a.classList.remove('is-active'); });
      var link = map[entry.target.id];
      link.classList.add('is-active');
      // Keep the active link visible in the horizontally scrollable list
      // (without scrolling the page itself).
      var list = link.closest('.subnav__list');
      var left = link.offsetLeft - list.offsetLeft;
      if (left < list.scrollLeft || left + link.offsetWidth > list.scrollLeft + list.clientWidth) {
        list.scrollTo({ left: left - 16, behavior: 'smooth' });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  Object.keys(map).forEach(function (id) { observer.observe(document.getElementById(id)); });
})();
