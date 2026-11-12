/* Apartment search page: renders apartment cards (filters are added below) */
(function () {
  'use strict';

  var D = window.NadiyaData;
  var list = document.querySelector('[data-results]');
  if (!D || !list) return;

  var countEl = document.querySelector('[data-count]');
  var moreBtn = document.querySelector('[data-more]');
  var emptyEl = document.querySelector('[data-empty]');
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

  window.NadiyaSearch = { apply: apply };
  apply(D.apartments.filter(function (a) { return a.status !== 'sold'; }));
})();
