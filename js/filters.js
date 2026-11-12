/* Apartment search page: cards, filters, sorting, "show more" */
(function () {
  'use strict';

  var D = window.NadiyaData;
  var list = document.querySelector('[data-results]');
  if (!D || !list) return;

  var countEl = document.querySelector('[data-count]');
  var moreBtn = document.querySelector('[data-more]');
  var emptyEl = document.querySelector('[data-empty]');
  var countWord = document.querySelector('[data-count-word]');
  var PAGE = 12;
  var shown = PAGE;
  var current = [];

  function card(a) {
    var li = document.createElement('li');
    li.className = 'apt-card';
    li.innerHTML =
      '<div class="apt-card__plan"><img src="' + D.planUrl(a.rooms) + '" alt="Планування ' + D.roomsLabel(a.rooms) +
        ' квартири" width="320" height="240" loading="lazy"></div>' +
      '<div class="apt-card__body">' +
        '<div class="apt-card__top"><span class="status status--' + a.status + '">' + D.statusLabels[a.status] + '</span>' +
        '<span class="apt-card__num">№ ' + a.number + '</span></div>' +
        '<h3 class="apt-card__title">' + D.roomsLabel(a.rooms) + ', ' + D.formatArea(a.area) + '</h3>' +
        '<p class="apt-card__meta">' + a.projectName + ' · ' + a.section + ' · ' + a.floor + '/' + a.floors + ' пов.</p>' +
        '<p class="apt-card__price"><strong>' + D.formatPrice(a.price) + '</strong><span>' + D.formatPrice(a.pricePerM2) + '/м²</span></p>' +
        '<button class="btn btn--outline btn--sm btn--block stretched-link" type="button" data-apartment="' + a.id + '">Детальніше</button>' +
      '</div>';
    return li;
  }

  function render() {
    list.innerHTML = '';
    var frag = document.createDocumentFragment();
    current.slice(0, shown).forEach(function (a) { frag.appendChild(card(a)); });
    list.appendChild(frag);
    countEl.textContent = current.length;
    if (countWord) countWord.textContent = plural(current.length);
    moreBtn.parentElement.hidden = shown >= current.length;
    emptyEl.hidden = current.length > 0;
  }

  moreBtn.addEventListener('click', function () {
    shown += PAGE;
    render();
  });

  function apply(items) {
    current = items;
    shown = PAGE;
    render();
  }

  // Ukrainian plural: 1 квартира, 2–4 квартири, 5+ квартир
  function plural(n) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return 'квартира';
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'квартири';
    return 'квартир';
  }

  /* Filters ---------------------------------------------------------------- */
  var form = document.getElementById('filters-form');
  var sortSel = document.querySelector('[data-sort]');
  var priceOut = document.querySelector('[data-price-out]');
  var toggle = document.querySelector('.filters__toggle');
  var badge = document.querySelector('[data-active-count]');

  function num(name) {
    var v = form.elements[name].value;
    return v === '' ? null : Number(v);
  }

  var SORTS = {
    'price-asc': function (a, b) { return a.price - b.price; },
    'price-desc': function (a, b) { return b.price - a.price; },
    'area-asc': function (a, b) { return a.area - b.area; },
    'area-desc': function (a, b) { return b.area - a.area; },
    'floor-desc': function (a, b) { return b.floor - a.floor || a.price - b.price; }
  };

  function update() {
    var project = form.elements.project.value;
    var rooms = Array.prototype.filter.call(form.querySelectorAll('[name="rooms"]'), function (c) { return c.checked; })
      .map(function (c) { return Number(c.value); });
    var floorMin = num('floorMin'), floorMax = num('floorMax');
    var areaMin = num('areaMin'), areaMax = num('areaMax');
    var priceMax = Number(form.elements.priceMax.value);
    var onlyFree = form.elements.onlyFree.checked;

    priceOut.textContent = D.formatPrice(priceMax);

    var result = D.apartments.filter(function (a) {
      if (a.status === 'sold') return false;
      if (onlyFree && a.status !== 'free') return false;
      if (project && a.projectId !== project) return false;
      if (rooms.length && rooms.indexOf(Math.min(a.rooms, 3)) === -1) return false;
      if (floorMin !== null && a.floor < floorMin) return false;
      if (floorMax !== null && a.floor > floorMax) return false;
      if (areaMin !== null && a.area < areaMin) return false;
      if (areaMax !== null && a.area > areaMax) return false;
      if (a.price > priceMax) return false;
      return true;
    }).sort(SORTS[sortSel.value]);

    var active = [project, rooms.length, floorMin, floorMax, areaMin, areaMax, priceMax < 8000000, onlyFree]
      .filter(function (v) { return v !== null && v !== '' && v !== false && v !== 0; }).length;
    badge.textContent = active;
    badge.hidden = active === 0;

    apply(result);
  }

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  form.addEventListener('reset', function () { setTimeout(update, 0); });
  sortSel.addEventListener('change', update);

  // Mobile: collapsible filter panel
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    form.classList.toggle('is-open', open);
  });

  // Deep link from a complex page: apartments.html?project=park
  var preset = new URLSearchParams(location.search).get('project');
  if (preset && form.elements.project.querySelector('option[value="' + preset + '"]')) {
    form.elements.project.value = preset;
  }

  window.NadiyaSearch = { apply: apply, update: update };
  update();
})();
