/* Monthly construction photos: grid of thumbnails + photo viewer modal.
   Uses the shared modal helpers from main.js (close on × / backdrop / Esc,
   focus trap, focus return). Arrows switch photos inside the viewer. */
(function () {
  'use strict';

  var grid = document.querySelector('[data-month-grid]');
  var modal = document.getElementById('photo-modal');
  if (!grid || !modal || !window.Nadiya) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-photo-index]'));
  var img = modal.querySelector('[data-photo-img]');
  var caption = modal.querySelector('[data-photo-caption]');
  var count = modal.querySelector('[data-photo-count]');
  var current = 0;

  function show(i) {
    current = (i + cards.length) % cards.length;
    var card = cards[current];
    img.src = card.getAttribute('data-full');
    img.alt = card.querySelector('img').alt;
    caption.textContent = card.getAttribute('data-caption');
    count.textContent = (current + 1) + ' / ' + cards.length;
  }

  cards.forEach(function (card, i) {
    card.addEventListener('click', function () {
      show(i);
      window.Nadiya.openModal('photo-modal', card);
    });
  });

  modal.querySelector('[data-photo-prev]').addEventListener('click', function () { show(current - 1); });
  modal.querySelector('[data-photo-next]').addEventListener('click', function () { show(current + 1); });

  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
  });
})();
