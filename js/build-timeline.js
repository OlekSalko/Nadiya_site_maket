/* ==========================================================================
   Construction photo chronicle: an animated timeline.
   - Every stage marker on the scale owns several slides.
   - Slides advance automatically every N ms (data-interval), in a loop.
   - The thumb can be dragged along the scale (mouse / touch / pen),
     moved with the keyboard, or a stage date can be clicked.
   - Autoplay pauses on hover, focus and while dragging; it never starts
     for users who prefer reduced motion. A toggle pauses it for good.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('[data-chrono]');
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll('.chrono__slide'));
  var markers = Array.prototype.slice.call(root.querySelectorAll('.chrono__marker'));
  var track = root.querySelector('[data-chrono-track]');
  var thumb = root.querySelector('[data-chrono-thumb]');
  var fill = root.querySelector('[data-chrono-fill]');
  var dateEl = root.querySelector('[data-chrono-date]');
  var titleEl = root.querySelector('[data-chrono-title]');
  var countEl = root.querySelector('[data-chrono-count]');
  var section = root.closest('section') || root;
  var toggle = section.querySelector('[data-chrono-toggle]');
  var toggleLabel = section.querySelector('[data-chrono-toggle-label]');

  var last = slides.length - 1;
  var interval = Number(root.getAttribute('data-interval')) || 4000;
  var current = 0;
  var timer = null;
  var dragging = false;
  var hovered = false;
  var focused = false;
  var stopped = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Position of slide i on the scale, in percent */
  function pos(i) {
    return last ? (i / last) * 100 : 0;
  }

  // Place stage markers at the position of their first slide.
  markers.forEach(function (m) {
    var first = Number(m.querySelector('[data-goto]').getAttribute('data-goto'));
    m.style.left = pos(first) + '%';
  });

  function show(i) {
    current = Math.max(0, Math.min(last, i));
    var slide = slides[current];
    var stage = slide.getAttribute('data-stage');

    slides.forEach(function (s, n) { s.classList.toggle('is-active', n === current); });
    markers.forEach(function (m) {
      var idx = Number(m.getAttribute('data-stage'));
      m.classList.toggle('is-active', String(idx) === stage);
      m.classList.toggle('is-passed', idx < Number(stage));
    });

    // Lazy images in hidden slides: load the next one in advance.
    [current, (current + 1) % slides.length].forEach(function (n) {
      var img = slides[n].querySelector('img');
      if (img && img.loading === 'lazy') img.loading = 'eager';
    });

    var p = pos(current) + '%';
    thumb.style.left = p;
    fill.style.width = p;

    var date = slide.getAttribute('data-date');
    var title = slide.getAttribute('data-title');
    var photo = slide.getAttribute('data-photo') + ' з ' + slide.getAttribute('data-photos');
    dateEl.textContent = date;
    titleEl.textContent = title;
    countEl.textContent = 'Фото ' + photo;

    thumb.setAttribute('aria-valuenow', String(current + 1));
    thumb.setAttribute('aria-valuetext', date + ' — ' + title + ', фото ' + photo);
  }

  /* Autoplay ---------------------------------------------------------------- */
  function canPlay() {
    return !stopped && !dragging && !hovered && !focused && !document.hidden;
  }

  function schedule() {
    clearInterval(timer);
    timer = null;
    if (canPlay()) {
      timer = setInterval(function () { show(current === last ? 0 : current + 1); }, interval);
    }
    root.classList.toggle('is-playing', Boolean(timer));
  }

  function setStopped(value) {
    stopped = value;
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(stopped));
      toggle.classList.toggle('is-paused', stopped);
      toggleLabel.textContent = stopped ? 'Відтворити' : 'Пауза';
    }
    schedule();
  }

  if (toggle) {
    toggle.addEventListener('click', function () { setStopped(!stopped); });
  }

  root.addEventListener('mouseenter', function () { hovered = true; schedule(); });
  root.addEventListener('mouseleave', function () { hovered = false; schedule(); });
  // Pause only for keyboard focus; focus moved by a mouse drag must not
  // keep autoplay paused after the pointer leaves.
  root.addEventListener('focusin', function (e) {
    focused = e.target.matches(':focus-visible');
    schedule();
  });
  root.addEventListener('focusout', function () { focused = false; schedule(); });
  document.addEventListener('visibilitychange', schedule);

  /* Dragging along the scale ----------------------------------------------- */
  function indexFromPointer(e) {
    var rect = track.getBoundingClientRect();
    var ratio = (e.clientX - rect.left) / rect.width;
    return Math.round(Math.max(0, Math.min(1, ratio)) * last);
  }

  function onMove(e) {
    if (!dragging) return;
    var i = indexFromPointer(e);
    if (i !== current) show(i);
  }

  function onUp(e) {
    if (!dragging) return;
    dragging = false;
    root.classList.remove('is-dragging');
    if (track.hasPointerCapture && track.hasPointerCapture(e.pointerId)) {
      track.releasePointerCapture(e.pointerId);
    }
    schedule();
  }

  track.addEventListener('pointerdown', function (e) {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    dragging = true;
    root.classList.add('is-dragging');
    track.setPointerCapture(e.pointerId);
    thumb.focus({ preventScroll: true });
    show(indexFromPointer(e));
    schedule();
  });
  track.addEventListener('pointermove', onMove);
  track.addEventListener('pointerup', onUp);
  track.addEventListener('pointercancel', onUp);

  /* Clicking a stage date ---------------------------------------------------- */
  markers.forEach(function (m) {
    var btn = m.querySelector('[data-goto]');
    btn.addEventListener('click', function () {
      show(Number(btn.getAttribute('data-goto')));
      thumb.focus({ preventScroll: true });
    });
  });

  /* Keyboard ---------------------------------------------------------------- */
  thumb.addEventListener('keydown', function (e) {
    var next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = current + 1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = current - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = last;
    if (e.key === 'PageUp' || e.key === 'PageDown') {
      // jump to the first slide of the next / previous stage
      var stage = Number(slides[current].getAttribute('data-stage')) + (e.key === 'PageUp' ? 1 : -1);
      var m = markers[Math.max(0, Math.min(markers.length - 1, stage))];
      next = Number(m.querySelector('[data-goto]').getAttribute('data-goto'));
    }
    if (next !== null) {
      e.preventDefault();
      show(next);
    }
  });

  show(0);
  setStopped(stopped);
})();
