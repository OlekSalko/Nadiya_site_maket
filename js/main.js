/* ==========================================================================
   Shared behaviour for every page: header, burger menu
   ========================================================================== */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('main-nav');

  /* Header shadow / solid background after scrolling ---------------------- */
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Burger menu ------------------------------------------------------------ */
  function setMenu(open) {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    nav.classList.toggle('is-open', open);
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    if (open) {
      var first = nav.querySelector('a');
      if (first) setTimeout(function () { first.focus(); }, 50);
    }
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a, [data-open-contact]')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        burger.focus();
      }
    });

    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }
})();

/* ==========================================================================
   Modals (generic) + contact form stub
   ========================================================================== */
(function () {
  'use strict';

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  var active = null;      // currently open modal
  var lastTrigger = null; // element to return focus to

  function openModal(id, trigger) {
    var modal = document.getElementById(id);
    if (!modal) return;
    if (active) closeModal();
    lastTrigger = trigger || document.activeElement;
    modal.hidden = false;
    active = modal;
    document.body.classList.add('is-locked');
    var first = modal.querySelector('.modal__dialog input:not([type="radio"]):not([type="checkbox"]), .modal__dialog select, .modal__dialog button:not(.modal__close)') ||
      modal.querySelector(FOCUSABLE);
    if (first) first.focus();
  }

  function closeModal() {
    if (!active) return;
    active.hidden = true;
    active = null;
    document.body.classList.remove('is-locked');
    if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
  }

  document.addEventListener('click', function (e) {
    var openContact = e.target.closest('[data-open-contact]');
    if (openContact) {
      e.preventDefault();
      var project = openContact.getAttribute('data-project');
      var select = document.getElementById('cm-project');
      if (project && select) select.value = project;
      var msg = openContact.getAttribute('data-message');
      var textarea = document.getElementById('cm-message');
      if (msg && textarea) textarea.value = msg;
      // Request type: preselect from the trigger (e.g. "booking"), else default
      var type = openContact.getAttribute('data-request-type') || 'consultation';
      var radio = document.querySelector('#contact-modal input[name="type"][value="' + type + '"]');
      if (radio) radio.checked = true;
      resetForm(document.querySelector('#contact-modal .js-contact-form'));
      openModal('contact-modal', openContact);
      return;
    }
    var opener = e.target.closest('[data-open-modal]');
    if (opener) {
      e.preventDefault();
      openModal(opener.getAttribute('data-open-modal'), opener);
      return;
    }
    if (e.target.closest('[data-close-modal]')) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (!active) return;
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key === 'Tab') { // keep focus inside the dialog
      var items = Array.prototype.filter.call(active.querySelectorAll(FOCUSABLE), function (el) {
        return el.offsetParent !== null;
      });
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* Contact forms: client-side check, then a fake "sent" state ------------- */
  function resetForm(form) {
    if (!form) return;
    form.hidden = false;
    var success = form.parentElement.querySelector('.form-success');
    if (success) success.hidden = true;
  }

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('.js-contact-form');
    if (!form) return;
    e.preventDefault();
    var valid = true;
    Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (field) {
      var ok = field.type === 'checkbox' ? field.checked : field.value.trim().length > 1;
      if (field.type === 'tel') ok = field.value.replace(/\D/g, '').length >= 9;
      field.classList.toggle('is-invalid', !ok);
      if (!ok && valid) {
        field.focus();
        valid = false;
      }
    });
    if (!valid) return;
    form.reset();
    form.hidden = true;
    var success = form.parentElement.querySelector('.form-success');
    if (success) success.hidden = false;
  });

  document.addEventListener('input', function (e) {
    if (e.target.classList && e.target.classList.contains('is-invalid')) {
      e.target.classList.remove('is-invalid');
    }
  });

  window.Nadiya = window.Nadiya || {};
  window.Nadiya.openModal = openModal;
  window.Nadiya.closeModal = closeModal;
})();
