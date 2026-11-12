/* Chessboard ("шахматка"): floors x apartments grid for one complex */
(function () {
  'use strict';

  var D = window.NadiyaData;
  var root = document.querySelector('[data-chessboard]');
  if (!D || !root) return;

  var projectId = root.getAttribute('data-chessboard');
  var project = D.projects.filter(function (p) { return p.id === projectId; })[0];
  var grid = root.querySelector('.chess__grid');
  var sectionTabs = root.querySelector('.chess__sections');
  var roomChips = root.querySelectorAll('[data-rooms]');
  var summary = root.querySelector('.chess__summary');
  var state = { section: 0, rooms: 'all' };

  // Section switcher
  project.sections.forEach(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = s.name;
    b.setAttribute('aria-pressed', String(i === 0));
    b.addEventListener('click', function () {
      state.section = i;
      Array.prototype.forEach.call(sectionTabs.children, function (c, ci) {
        c.setAttribute('aria-pressed', String(ci === i));
      });
      render();
    });
    sectionTabs.appendChild(b);
  });

  Array.prototype.forEach.call(roomChips, function (chip) {
    chip.addEventListener('click', function () {
      state.rooms = chip.getAttribute('data-rooms');
      Array.prototype.forEach.call(roomChips, function (c) {
        c.setAttribute('aria-pressed', String(c === chip));
      });
      render();
    });
  });

  function render() {
    var list = D.apartments.filter(function (a) {
      return a.projectId === projectId && a.sectionIndex === state.section;
    });
    var perFloor = project.sections[state.section].layouts.length;
    grid.style.setProperty('--cols', perFloor);
    grid.innerHTML = '';

    var free = 0;
    for (var floor = project.floors; floor >= project.firstResidentialFloor; floor--) {
      var row = document.createElement('div');
      row.className = 'chess__row';
      row.setAttribute('role', 'row');
      var label = document.createElement('span');
      label.className = 'chess__floor';
      label.setAttribute('role', 'rowheader');
      label.textContent = floor;
      row.appendChild(label);

      list.filter(function (a) { return a.floor === floor; }).forEach(function (a) {
        var match = state.rooms === 'all' || String(a.rooms) === state.rooms || (state.rooms === '3' && a.rooms >= 3);
        if (a.status === 'free' && match) free++;
        var cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'chess__cell chess__cell--' + a.status + (match ? '' : ' is-dimmed');
        cell.setAttribute('role', 'gridcell');
        cell.innerHTML = '<span class="chess__rooms">' + a.rooms + 'к</span><span class="chess__area">' +
          a.area.toFixed(1).replace('.', ',') + '</span>';
        cell.setAttribute('aria-label', 'Квартира ' + a.number + ', ' + a.rooms + '-кімнатна, ' +
          D.formatArea(a.area) + ', ' + floor + ' поверх, ' + D.statusLabels[a.status].toLowerCase());
        if (a.status === 'sold') {
          cell.disabled = true;
        } else {
          cell.setAttribute('data-apartment', a.id);
        }
        row.appendChild(cell);
      });
      grid.appendChild(row);
    }
    summary.textContent = 'Вільних квартир за обраними параметрами: ' + free;
  }

  render();
})();
