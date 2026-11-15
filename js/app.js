'use strict';
/* Cox's Bazar BD — UI wiring. Depends on window.CXB_DATA, CXB_I18N, CXB_CORE. */
(function () {
  const DATA = window.CXB_DATA;
  const I18N = window.CXB_I18N;
  const CORE = window.CXB_CORE;
  const LS_KEY = 'coxs-bazar-bd-v1';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const params = new URLSearchParams(location.search);
  const asof = params.get('asof');
  const today = asof ? new Date(asof + 'T12:00:00') : new Date();

  const DEFAULT_COST = { transport: 'nonac', people: 2, nights: 2, hotel: 3500, food: 1200, local: 800, activities: 1500 };

  let state = load();
  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && typeof s === 'object') {
          return {
            lang: s.lang === 'bn' ? 'bn' : 'en',
            tab: ['places', 'cost', 'plan', 'packing', 'tips'].includes(s.tab) ? s.tab : 'places',
            planDays: s.planDays === '3' ? '3' : '2',
            planChecks: s.planChecks && typeof s.planChecks === 'object' ? s.planChecks : {},
            packChecks: s.packChecks && typeof s.packChecks === 'object' ? s.packChecks : {},
            customPack: Array.isArray(s.customPack) ? s.customPack.filter((x) => typeof x === 'string') : [],
            cost: Object.assign({}, DEFAULT_COST, s.cost || {})
          };
        }
      }
    } catch (e) { /* corrupted storage -> fresh state */ }
    return { lang: 'en', tab: 'places', planDays: '2', planChecks: {}, packChecks: {}, customPack: [], cost: Object.assign({}, DEFAULT_COST) };
  }
  function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) { /* storage full/blocked */ } }

  const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
  const L = (en, bn) => (state.lang === 'bn' ? bn : en);
  const num = (n) => (state.lang === 'bn' ? CORE.toBnDigits(String(n)) : String(n));
  const taka = (n) => CORE.formatTaka(n, state.lang);

  /* ---------- language + tabs ---------- */
  function applyI18n() {
    document.documentElement.lang = state.lang === 'bn' ? 'bn' : 'en';
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $('#langBtn').textContent = t('langBtn');
    $('#tagline').textContent = t('tagline');
    $('#heroBeach').textContent = t('heroBeach');
    $('#heroDist').textContent = t('heroDist');
    $('#heroBus').textContent = t('heroBus');
    $('#saintStatus').textContent = CORE.saintMartinOpen(today) ? t('saintOpen') : t('saintClosed');
    $('#saintStatus').classList.toggle('open', CORE.saintMartinOpen(today));
    renderPlaces(); renderCost(); renderPlan(); renderPacking(); renderTips();
  }
  $('#langBtn').addEventListener('click', () => {
    state.lang = state.lang === 'bn' ? 'en' : 'bn';
    save(); applyI18n();
  });
  $$('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.tab = btn.dataset.tab; save();
      $$('.tab').forEach((b) => b.classList.toggle('active', b === btn));
      $$('.panel').forEach((p) => p.classList.toggle('active', p.id === 'panel-' + state.tab));
    });
  });
  function showTab(tab) {
    $$('.tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
    $$('.panel').forEach((p) => p.classList.toggle('active', p.id === 'panel-' + tab));
  }

  /* ---------- places ---------- */
  let query = '', cat = 'all';
  $('#placeSearch').addEventListener('input', (e) => { query = e.target.value; renderPlaces(); });
  $$('.chip').forEach((c) => {
    c.addEventListener('click', () => {
      cat = c.dataset.cat;
      $$('.chip').forEach((x) => x.classList.toggle('active', x === c));
      renderPlaces();
    });
  });
  function renderPlaces() {
    const list = CORE.filterPlaces(DATA.places, query, cat);
    const box = $('#placeList');
    if (!list.length) { box.innerHTML = '<p class="empty">' + t('noPlaces') + '</p>'; return; }
    box.innerHTML = list.map((p) => {
      const dist = p.distKm === 0 ? L('In town', 'শহরেই') : num(p.distKm) + ' km · ' + t('distFromTown');
      return '<article class="card" data-place="' + p.id + '">' +
        '<div class="card-top"><h3>' + L(p.en, p.bn) + '</h3><span class="pill">' + L(catName(p.cat).en, catName(p.cat).bn) + '</span></div>' +
        '<p class="desc">' + L(p.enDesc, p.bnDesc) + '</p>' +
        '<p class="meta">' + dist + ' · ' + t('bestTime') + ': ' + L(p.enBest, p.bnBest) + '</p></article>';
    }).join('');
  }
  function catName(c) {
    return { beach: { en: 'Beach', bn: 'বিচ' }, nature: { en: 'Nature', bn: 'প্রকৃতি' }, drive: { en: 'Drive', bn: 'ড্রাইভ' }, island: { en: 'Island', bn: 'দ্বীপ' }, market: { en: 'Market', bn: 'বাজার' } }[c] || { en: c, bn: c };
  }

  /* ---------- cost estimator ---------- */
  function transportOptions() {
    return DATA.transport.map((tr) =>
      '<option value="' + tr.id + '"' + (state.cost.transport === tr.id ? ' selected' : '') + '>' +
      L(tr.en, tr.bn) + ' — ' + L(tr.rangeEn, tr.rangeBn) + '</option>').join('');
  }
  function renderCost() {
    $('#transportSel').innerHTML = transportOptions();
    $('#peopleIn').value = state.cost.people;
    $('#nightsIn').value = state.cost.nights;
    $('#hotelIn').value = state.cost.hotel;
    $('#foodIn').value = state.cost.food;
    $('#localIn').value = state.cost.local;
    $('#activitiesIn').value = state.cost.activities;
    updateEstimate();
  }
  function readCost() {
    const tr = DATA.transport.find((x) => x.id === $('#transportSel').value) || DATA.transport[0];
    state.cost = {
      transport: tr.id,
      people: CORE.clampInt($('#peopleIn').value, 1, 30, 2),
      nights: CORE.clampInt($('#nightsIn').value, 1, 14, 2),
      hotel: CORE.clampInt($('#hotelIn').value, 0, 100000, 3500),
      food: CORE.clampInt($('#foodIn').value, 0, 50000, 1200),
      local: CORE.clampInt($('#localIn').value, 0, 50000, 800),
      activities: CORE.clampInt($('#activitiesIn').value, 0, 100000, 1500)
    };
    save(); updateEstimate();
  }
  ['transportSel', 'peopleIn', 'nightsIn', 'hotelIn', 'foodIn', 'localIn', 'activitiesIn'].forEach((id) => {
    $('#' + id).addEventListener('input', readCost);
    $('#' + id).addEventListener('change', readCost);
  });
  function updateEstimate() {
    const tr = DATA.transport.find((x) => x.id === state.cost.transport) || DATA.transport[0];
    const r = CORE.estimateCost(Object.assign({}, state.cost, { transportFare: tr.fare }));
    $('#perPerson').textContent = taka(r.perPerson);
    $('#groupTotal').textContent = taka(r.group);
    $('#roomsLine').textContent = num(r.rooms) + ' ' + t('rooms') + ' · ' + num(r.people) + ' ' + L('people', 'জন') + ' · ' + num(r.nights) + ' ' + t('nights');
    $('#bdTransport').textContent = taka(r.breakdown.transport);
    $('#bdHotel').textContent = taka(r.breakdown.hotel);
    $('#bdFood').textContent = taka(r.breakdown.food);
    $('#bdLocal').textContent = taka(r.breakdown.local);
    $('#bdActivities').textContent = taka(r.breakdown.activities);
  }

  /* ---------- itinerary ---------- */
  $$('.plan-days button').forEach((b) => {
    b.addEventListener('click', () => {
      if (state.planDays !== b.dataset.days) {
        state.planDays = b.dataset.days;
        state.planChecks = {};
        save(); renderPlan();
      }
    });
  });
  function renderPlan() {
    $$('.plan-days button').forEach((b) => b.classList.toggle('active', b.dataset.days === state.planDays));
    const days = DATA.itineraries[state.planDays];
    const total = CORE.itineraryTotal(days);
    const done = Object.values(state.planChecks).filter(Boolean).length;
    const p = CORE.progress(done, total);
    $('#planProgress').textContent = num(p.done) + '/' + num(p.total) + ' · ' + num(p.pct) + '% ' + t('planDone');
    $('#planBar').style.width = p.pct + '%';
    $('#planList').innerHTML = days.map((d) =>
      '<section class="day"><h3>' + t('dayLabel') + ' ' + num(d.day) + ' — ' + L(d.en, d.bn) + '</h3>' +
      d.items.map((it, i) => {
        const key = state.planDays + '-' + d.day + '-' + i;
        const checked = !!state.planChecks[key];
        return '<label class="check' + (checked ? ' done' : '') + '"><input type="checkbox" data-plan-key="' + key + '"' + (checked ? ' checked' : '') + '> <span>' + L(it.en, it.bn) + '</span></label>';
      }).join('') + '</section>').join('');
    $$('#planList input[type=checkbox]').forEach((cb) => {
      cb.addEventListener('change', () => {
        state.planChecks[cb.dataset.planKey] = cb.checked;
        save(); renderPlan();
      });
    });
  }

  /* ---------- packing ---------- */
  function packGroups() {
    const groups = DATA.packing.map((g) => ({ en: g.groupEn, bn: g.groupBn, items: g.items.map((it, i) => ({ key: 'base-' + g.groupEn + '-' + i, en: it.en, bn: it.bn })) }));
    if (state.customPack.length) {
      groups.push({ en: t('packCustom'), bn: t('packCustom'), items: state.customPack.map((label, i) => ({ key: 'custom-' + i, en: label, bn: label })) });
    }
    return groups;
  }
  function renderPacking() {
    const groups = packGroups();
    const total = groups.reduce((n, g) => n + g.items.length, 0);
    const done = Object.values(state.packChecks).filter(Boolean).length;
    const p = CORE.progress(done, total);
    $('#packProgress').textContent = num(p.done) + '/' + num(p.total) + ' · ' + num(p.pct) + '% ' + t('planDone');
    $('#packBar').style.width = p.pct + '%';
    $('#packList').innerHTML = groups.map((g) =>
      '<section class="day"><h3>' + L(g.en, g.bn) + '</h3>' +
      g.items.map((it) => {
        const checked = !!state.packChecks[it.key];
        return '<label class="check' + (checked ? ' done' : '') + '"><input type="checkbox" data-pack-key="' + it.key + '"' + (checked ? ' checked' : '') + '> <span>' + L(it.en, it.bn) + '</span></label>';
      }).join('') + '</section>').join('');
    $$('#packList input[type=checkbox]').forEach((cb) => {
      cb.addEventListener('change', () => {
        state.packChecks[cb.dataset.packKey] = cb.checked;
        save(); renderPacking();
      });
    });
  }
  function addCustomItem() {
    const v = $('#customPackIn').value;
    if (!CORE.validCustomItem(v)) { $('#customPackIn').focus(); return; }
    state.customPack.push(v.trim());
    $('#customPackIn').value = '';
    save(); renderPacking();
  }
  $('#customPackAdd').addEventListener('click', addCustomItem);
  $('#customPackIn').addEventListener('keydown', (e) => { if (e.key === 'Enter') addCustomItem(); });

  /* ---------- tips ---------- */
  function renderTips() {
    $('#seasonList').innerHTML = DATA.seasons.map((s) =>
      '<div class="season' + (s.best ? ' best' : '') + '"><strong>' + L(s.en, s.bn) + '</strong><span>' + L(s.enLabel, s.bnLabel) + (s.best ? ' · ' + t('seasonBest') : '') + '</span></div>').join('');
    $('#tipsList').innerHTML = DATA.tips.map((tip) => '<li>' + L(tip.en, tip.bn) + '</li>').join('');
  }

  /* ---------- data: export / import / erase ---------- */
  function download(name, text) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  $('#exportBtn').addEventListener('click', () => {
    download('coxs-bazar-bd-backup.json', JSON.stringify({ app: 'coxs-bazar-bd', version: 1, exportedAt: new Date().toISOString(), state }, null, 2));
    $('#dataMsg').textContent = t('exported');
  });
  $('#importFile').addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const obj = JSON.parse(r.result);
        if (!obj || obj.app !== 'coxs-bazar-bd' || !obj.state || typeof obj.state !== 'object') throw new Error('bad envelope');
        localStorage.setItem(LS_KEY, JSON.stringify(obj.state));
        state = load(); save(); applyI18n(); showTab(state.tab);
        $('#dataMsg').textContent = t('imported');
      } catch (err) { $('#dataMsg').textContent = t('importBad'); }
    };
    r.readAsText(f);
    e.target.value = '';
  });
  $('#eraseBtn').addEventListener('click', () => {
    const ans = prompt(t('eraseConfirm'));
    if (ans !== null && ans.trim().toUpperCase() === 'DELETE') {
      localStorage.removeItem(LS_KEY);
      state = load(); save(); applyI18n(); showTab('places');
      $('#dataMsg').textContent = t('erased');
    }
  });

  /* ---------- init ---------- */
  showTab(state.tab);
  applyI18n();
})();
