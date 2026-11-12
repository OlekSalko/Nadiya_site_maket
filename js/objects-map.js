/* ==========================================================================
   Objects map: markers of all company objects over a placeholder map.
   Container: [data-objects-map]
     data-root    — relative path to the site root ("" or "../")
     data-active  — optional object id: only this marker is active,
                    the rest are shown as muted dots (property page)
   Filters (home page): [data-map-filter="sale|done|commercial"] buttons.
   ========================================================================== */
(function () {
  'use strict';

  var TYPES = {
    sale: 'Житлова у продажу',
    done: 'Житлова реалізована',
    commercial: 'Комерційна нерухомість'
  };

  // x / y — position on the map in percent (map viewBox is 1000 × 640)
  var OBJECTS = [
    { id: 'park', type: 'sale', name: 'ЖК «Надія Парк»', address: 'Київ, Голосіївський р-н', fact: 'Здача IV кв. 2027 · від 42 000 ₴/м²', x: 47, y: 81.3 },
    { id: 'naberezhnyi', type: 'sale', name: 'ЖК «Набережний»', address: 'Київ, Оболонський р-н', fact: 'Здача II кв. 2027 · від 58 000 ₴/м²', x: 49, y: 26.6 },
    { id: 'sonyachna', type: 'sale', name: 'ЖК «Сонячна Гавань»', address: 'Бровари, вул. Сонячна', fact: 'Здача III кв. 2028 · від 31 000 ₴/м²', x: 90, y: 31.3 },
    { id: 'livyi', type: 'sale', name: 'ЖК «Лівий Берег»', address: 'Київ, Дніпровський р-н', fact: 'Здача IV кв. 2028 · від 45 000 ₴/м²', x: 72, y: 45.3 },
    { id: 'irpin-sady', type: 'sale', name: 'ЖК «Ірпінські Сади»', address: 'Ірпінь, вул. Університетська', fact: 'Здача I кв. 2028 · від 33 500 ₴/м²', x: 15, y: 28.1 },
    { id: 'zakhidnyi', type: 'sale', name: 'ЖК «Західний»', address: 'Київ, Святошинський р-н', fact: 'Здача III кв. 2027 · від 39 000 ₴/м²', x: 30, y: 43.8 },

    { id: 'lypovyi', type: 'done', name: 'ЖК «Липовий Гай»', address: 'Київ, Солом\'янський р-н', fact: 'Зданий у 2023 · 412 квартир', x: 36, y: 60.9 },
    { id: 'zelenyi', type: 'done', name: 'ЖК «Зелений Квартал»', address: 'Київ, Дарницький р-н', fact: 'Зданий у 2021 · 968 квартир', x: 72, y: 73.4 },
    { id: 'simeinyi', type: 'done', name: 'ЖК «Сімейний»', address: 'Ірпінь, вул. Садова', fact: 'Зданий у 2018 · 216 квартир', x: 9.5, y: 27.3 },
    { id: 'obolon-city', type: 'done', name: 'ЖК «Оболонь Сіті»', address: 'Київ, Оболонський р-н', fact: 'Зданий у 2016 · 288 квартир', x: 43, y: 28.1 },
    { id: 'brovarskyi', type: 'done', name: 'ЖК «Броварський»', address: 'Бровари, вул. Гагаріна', fact: 'Зданий у 2014 · 160 квартир', x: 81.5, y: 25.8 },
    { id: 'pershyi', type: 'done', name: 'ЖК «Перший»', address: 'Ірпінь, вул. Мінеральна', fact: 'Зданий у 2012 · 72 квартири', x: 20.5, y: 31.3 },

    { id: 'c-naberezhnyi', type: 'commercial', name: 'Комерційні приміщення', address: 'ЖК «Набережний», 1 поверх', fact: '45–320 м² · від 64 000 ₴/м²', x: 52, y: 29.4 },
    { id: 'plaza', type: 'commercial', name: 'БЦ «Надія Плаза»', address: 'Київ, Солом\'янський р-н', fact: '12 400 м² · клас B+', x: 33, y: 65.6 },
    { id: 'street', type: 'commercial', name: 'Стріт-ритейл', address: 'ЖК «Зелений Квартал»', fact: '60–180 м² · оренда від 650 ₴/м²', x: 75, y: 77.3 },
    { id: 'c-park', type: 'commercial', name: 'Приміщення під кав\'ярню та аптеку', address: 'ЖК «Надія Парк», 1 поверх', fact: '52–140 м² · від 60 000 ₴/м²', x: 50, y: 85.2 },
    { id: 'warehouse', type: 'commercial', name: 'Склад-логістичний комплекс', address: 'Київ, Голосіївський р-н', fact: '2 400 м² · оренда від 220 ₴/м²', x: 42, y: 89.1 },
    { id: 'parking', type: 'commercial', name: 'Підземний паркінг', address: 'ЖК «Сонячна Гавань»', fact: '86 місць · від 420 000 ₴', x: 93, y: 35.2 }
  ];

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-objects-map]'), function (root) {
    var base = root.getAttribute('data-root') || '';
    var activeId = root.getAttribute('data-active');

    var img = el('img', 'objects-map__img');
    img.src = base + 'assets/img/map-kyiv.svg';
    img.alt = 'Схематична карта Києва та передмість';
    img.width = 1000;
    img.height = 640;
    root.appendChild(img);

    var layer = el('div', 'objects-map__layer');
    root.appendChild(layer);

    /* Property page: one active marker, the rest muted ----------------------- */
    if (activeId) {
      OBJECTS.forEach(function (o) {
        var m;
        if (o.id === activeId) {
          m = el('div', 'map-marker map-marker--active');
          m.setAttribute('role', 'img');
          m.setAttribute('aria-label', o.name + ' на карті: ' + o.address);
          m.appendChild(el('span', 'map-marker__pin'));
          m.appendChild(el('span', 'map-marker__label', o.name));
        } else {
          m = el('span', 'map-marker map-marker--muted');
          m.setAttribute('aria-hidden', 'true');
        }
        m.style.left = o.x + '%';
        m.style.top = o.y + '%';
        layer.appendChild(m);
      });
      return;
    }

    /* Home page: interactive markers, popup and filters --------------------- */
    var popup = el('div', 'map-popup');
    popup.hidden = true;
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', 'Інформація про об\'єкт');
    popup.innerHTML =
      '<button class="map-popup__close" type="button" aria-label="Закрити">×</button>' +
      '<span class="map-popup__type"></span>' +
      '<p class="map-popup__name"></p>' +
      '<p class="map-popup__address"></p>' +
      '<p class="map-popup__fact"></p>' +
      '<a class="btn btn--primary btn--sm map-popup__link">Детальніше</a>';
    root.appendChild(popup);

    var openFor = null;
    var markers = [];

    function closePopup(returnFocus) {
      if (!openFor) return;
      popup.hidden = true;
      openFor.setAttribute('aria-expanded', 'false');
      openFor.classList.remove('is-open');
      if (returnFocus) openFor.focus();
      openFor = null;
    }

    function openPopup(marker, o) {
      if (openFor === marker) { closePopup(); return; }
      closePopup();
      popup.querySelector('.map-popup__type').textContent = TYPES[o.type];
      popup.querySelector('.map-popup__type').className = 'map-popup__type map-popup__type--' + o.type;
      popup.querySelector('.map-popup__name').textContent = o.name;
      popup.querySelector('.map-popup__address').textContent = o.address;
      popup.querySelector('.map-popup__fact').textContent = o.fact;
      popup.querySelector('.map-popup__link').href = base + 'html/property.html';

      // Place above the marker; flip below / shift sideways near the edges.
      popup.style.left = o.x + '%';
      popup.style.top = o.y + '%';
      popup.classList.toggle('is-below', o.y < 40);
      popup.classList.toggle('is-left', o.x < 22);
      popup.classList.toggle('is-right', o.x > 78);

      popup.hidden = false;
      marker.setAttribute('aria-expanded', 'true');
      marker.classList.add('is-open');
      openFor = marker;
    }

    OBJECTS.forEach(function (o) {
      var m = el('button', 'map-marker map-marker--' + o.type);
      m.type = 'button';
      m.style.left = o.x + '%';
      m.style.top = o.y + '%';
      m.setAttribute('data-type', o.type);
      m.setAttribute('aria-label', o.name + ' — ' + TYPES[o.type].toLowerCase());
      m.setAttribute('aria-expanded', 'false');
      m.appendChild(el('span', 'map-marker__dot'));
      m.addEventListener('click', function (e) {
        e.stopPropagation();
        openPopup(m, o);
      });
      layer.appendChild(m);
      markers.push(m);
    });

    popup.querySelector('.map-popup__close').addEventListener('click', function () { closePopup(true); });
    popup.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () { closePopup(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openFor) closePopup(true);
    });

    // Filters live in the same section as the map
    var section = root.closest('section') || document;
    Array.prototype.forEach.call(section.querySelectorAll('[data-map-filter]'), function (btn) {
      var type = btn.getAttribute('data-map-filter');
      var counter = btn.querySelector('[data-map-count]');
      if (counter) counter.textContent = OBJECTS.filter(function (o) { return o.type === type; }).length;

      btn.addEventListener('click', function () {
        var on = btn.getAttribute('aria-pressed') !== 'true';
        btn.setAttribute('aria-pressed', String(on));
        markers.forEach(function (m) {
          if (m.getAttribute('data-type') !== type) return;
          m.classList.toggle('is-hidden', !on);
          m.tabIndex = on ? 0 : -1;
          if (!on && openFor === m) closePopup();
        });
      });
    });
  });
})();
