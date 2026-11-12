/* Home page: hero video play/pause control */
(function () {
  'use strict';

  var video = document.querySelector('.hero__video');
  var toggle = document.querySelector('.hero__toggle');
  if (!video || !toggle) return;

  // Respect users who prefer reduced motion: show the poster frame instead.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
  }

  function sync() {
    var paused = video.paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Відтворити відео' : 'Пауза відео');
    toggle.classList.toggle('is-paused', paused);
  }

  toggle.addEventListener('click', function () {
    if (video.paused) video.play(); else video.pause();
  });
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  sync();
})();
