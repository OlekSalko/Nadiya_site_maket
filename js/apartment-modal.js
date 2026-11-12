/* Fills and opens the shared apartment details modal (#apartment-modal) */
(function () {
  'use strict';

  var D = window.NadiyaData;
  var modal = document.getElementById('apartment-modal');
  if (!D || !modal) return;

  function set(name, value) {
    var el = modal.querySelector('[data-apt="' + name + '"]');
    if (el) el.textContent = value;
  }

  function open(id, trigger) {
    var apt = D.byId(id);
    if (!apt) return;
    set('title', D.roomsLabel(apt.rooms) + ' квартира № ' + apt.number);
    set('project', apt.projectName + ' · ' + apt.section);
    set('area', D.formatArea(apt.area));
    set('floor', apt.floor + ' з ' + apt.floors);
    set('rooms', apt.rooms);
    set('completion', apt.completion);
    set('price', D.formatPrice(apt.price));
    set('ppm', D.formatPrice(apt.pricePerM2) + '/м²');

    var status = modal.querySelector('[data-apt="status"]');
    status.textContent = D.statusLabels[apt.status];
    status.className = 'status status--' + apt.status;

    var img = modal.querySelector('[data-apt="plan"]');
    img.src = D.planUrl(apt.rooms);
    img.alt = 'Планування: ' + D.roomsLabel(apt.rooms) + ' квартира, ' + D.formatArea(apt.area);

    var cta = modal.querySelector('[data-apt="cta"]');
    cta.setAttribute('data-project', apt.projectName);
    cta.setAttribute('data-message', 'Цікавить квартира № ' + apt.number + ' (' + apt.section + ', ' + apt.floor +
      ' поверх, ' + D.formatArea(apt.area) + ')');
    cta.textContent = apt.status === 'free' ? 'Забронювати квартиру' : 'Стати в чергу на квартиру';

    window.Nadiya.openModal('apartment-modal', trigger);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-apartment]');
    if (!btn) return;
    e.preventDefault();
    open(btn.getAttribute('data-apartment'), btn);
  });

  window.Nadiya = window.Nadiya || {};
  window.Nadiya.openApartment = open;
})();
