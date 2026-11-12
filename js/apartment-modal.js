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

  var QUARTERS = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4 };

  function monthsUntil(completion) {
    var m = /^(I{1,3}|IV) кв\. (\d{4})$/.exec(completion);
    if (!m) return 12;
    var now = new Date();
    var endMonth = QUARTERS[m[1]] * 3; // last month of the quarter, 1-based
    var months = (Number(m[2]) - now.getFullYear()) * 12 + endMonth - (now.getMonth() + 1);
    return Math.max(1, months);
  }

  function monthWord(n) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return 'місяць';
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'місяці';
    return 'місяців';
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

    // Installment estimate: 30% first payment, the rest in equal monthly
    // parts until the end of the completion quarter (e.g. "IV кв. 2027").
    var months = monthsUntil(apt.completion);
    var first = Math.round(apt.price * 0.3 / 100) * 100;
    set('first', D.formatPrice(first));
    set('months', months + ' ' + monthWord(months));
    set('monthly', D.formatPrice(Math.round((apt.price - first) / months / 100) * 100));

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
