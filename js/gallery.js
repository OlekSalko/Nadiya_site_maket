/* Gallery slider based on CSS scroll-snap: arrows, counter, keyboard */
(function () {
  'use strict';

  Array.prototype.forEach.call(document.querySelectorAll('[data-gallery]'), function (root) {
    var track = root.querySelector('.gallery__track');
    var slides = track.children;
    var current = root.querySelector('[data-gallery-current]');
    var prev = root.querySelector('.gallery__btn--prev');
    var next = root.querySelector('.gallery__btn--next');

    function index() {
      return Math.round(track.scrollLeft / track.clientWidth);
    }

    function go(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
    }

    function update() {
      var i = index();
      if (current) current.textContent = i + 1;
      prev.disabled = i === 0;
      next.disabled = i === slides.length - 1;
    }

    prev.addEventListener('click', function () { go(index() - 1); });
    next.addEventListener('click', function () { go(index() + 1); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index() - 1); }
    });
    update();
  });
})();
