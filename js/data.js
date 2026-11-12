/* ==========================================================================
   Mock data: residential complexes and generated apartments.
   Deterministic (seeded) so the chessboard and the search page always match.
   ========================================================================== */
(function () {
  'use strict';

  var PROJECTS = [
    {
      id: 'park',
      name: 'ЖК «Надія Парк»',
      district: 'Голосіївський р-н',
      pricePerM2: 42000,
      floors: 16,
      firstResidentialFloor: 2,
      completion: 'IV кв. 2027',
      sections: [
        { name: 'Секція А', layouts: [[1, 42.3], [2, 64.8], [3, 86.1], [1, 38.5]] },
        { name: 'Секція Б', layouts: [[2, 61.2], [1, 40.7], [2, 66.4], [3, 91.5]] }
      ]
    },
    {
      id: 'naberezhnyi',
      name: 'ЖК «Набережний»',
      district: 'Оболонський р-н',
      pricePerM2: 58000,
      floors: 24,
      firstResidentialFloor: 2,
      completion: 'II кв. 2027',
      sections: [
        { name: 'Секція 1', layouts: [[1, 44.6], [2, 68.2], [3, 98.4], [2, 71.3], [1, 46.1], [3, 104.7]] }
      ]
    },
    {
      id: 'sonyachna',
      name: 'ЖК «Сонячна Гавань»',
      district: 'Бровари',
      pricePerM2: 31000,
      floors: 10,
      firstResidentialFloor: 1,
      completion: 'III кв. 2028',
      sections: [
        { name: 'Секція 1', layouts: [[1, 36.9], [1, 41.2], [2, 58.7], [2, 62.5], [3, 79.8], [3, 84.3]] }
      ]
    }
  ];

  // Small seeded PRNG (mulberry32) — same output on every page load.
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  var APARTMENTS = [];
  PROJECTS.forEach(function (project, pi) {
    var rand = rng(2026 + pi * 97);
    var number = 1;
    project.sections.forEach(function (section, si) {
      for (var floor = project.firstResidentialFloor; floor <= project.floors; floor++) {
        section.layouts.forEach(function (layout, li) {
          var r = rand();
          // Lower floors sell out first: more sold apartments near the ground.
          var soldShare = 0.55 - (floor / project.floors) * 0.35;
          var status = r < soldShare ? 'sold' : (r < soldShare + 0.1 ? 'reserved' : 'free');
          var floorFactor = 1 + (floor - project.firstResidentialFloor) * 0.006;
          var area = layout[1];
          var price = Math.round(area * project.pricePerM2 * floorFactor / 1000) * 1000;
          APARTMENTS.push({
            id: project.id + '-' + si + '-' + floor + '-' + li,
            projectId: project.id,
            projectName: project.name,
            section: section.name,
            sectionIndex: si,
            position: li,
            number: number++,
            floor: floor,
            floors: project.floors,
            rooms: layout[0],
            area: area,
            price: price,
            pricePerM2: Math.round(price / area),
            status: status,
            completion: project.completion
          });
        });
      }
    });
  });

  var STATUS_LABELS = { free: 'Вільна', reserved: 'Заброньована', sold: 'Продана' };

  function formatPrice(value) {
    return value.toLocaleString('uk-UA').replace(/,/g, ' ') + ' ₴';
  }

  function formatArea(value) {
    return value.toFixed(1).replace('.', ',') + ' м²';
  }

  function roomsLabel(rooms) {
    return rooms + '-кімнатна';
  }

  // Plans live in assets/img/plans; all pages that use them sit in /html.
  function planUrl(rooms) {
    return '../assets/img/plans/plan-' + Math.min(rooms, 3) + '.svg';
  }

  window.NadiyaData = {
    projects: PROJECTS,
    apartments: APARTMENTS,
    statusLabels: STATUS_LABELS,
    formatPrice: formatPrice,
    formatArea: formatArea,
    roomsLabel: roomsLabel,
    planUrl: planUrl,
    byId: function (id) {
      for (var i = 0; i < APARTMENTS.length; i++) if (APARTMENTS[i].id === id) return APARTMENTS[i];
      return null;
    }
  };
})();
