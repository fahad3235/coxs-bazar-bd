'use strict';
/* Cox's Bazar BD — Node unit tests. Run: node tests/unit.test.js */
const CORE = require('../js/core.js');
const DATA = require('../js/data.js');
const I18N = require('../js/i18n.js');

let pass = 0, fail = 0;
const failures = [];
function check(name, cond) {
  if (cond) { pass++; }
  else { fail++; failures.push(name); console.log('FAIL: ' + name); }
}
function eq(name, a, b) { check(name + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')', JSON.stringify(a) === JSON.stringify(b)); }

/* ---------- Bengali digits + taka ---------- */
eq('toBnDigits 2026', CORE.toBnDigits('2026'), '২০২৬');
eq('toBnDigits 120', CORE.toBnDigits(120), '১২০');
eq('formatTaka en 11200', CORE.formatTaka(11200, 'en'), 'Tk 11,200');
eq('formatTaka bn 11200', CORE.formatTaka(11200, 'bn'), '৳১১,২০০');
eq('formatTaka rounds', CORE.formatTaka(12366.6, 'en'), 'Tk 12,367');

/* ---------- clampInt ---------- */
eq('clampInt non-numeric -> fallback', CORE.clampInt('abc', 1, 30, 2), 2);
eq('clampInt below min', CORE.clampInt(0, 1, 30, 2), 1);
eq('clampInt above max', CORE.clampInt(99, 1, 30, 2), 30);
eq('clampInt floors', CORE.clampInt(2.9, 1, 30, 2), 2);

/* ---------- cost estimate (hand-computed) ---------- */
/* defaults: fare 1100, people 2, nights 2, hotel 3500, food 1200, local 800, activities 1500
   rooms 1; transport 4400; hotel 7000; food 4800; local 3200; activities 3000; group 22400; per person 11200 */
let r = CORE.estimateCost({ transportFare: 1100, people: 2, nights: 2, hotelPerNight: 3500, foodPerDay: 1200, localPerDay: 800, activities: 1500 });
eq('default rooms', r.rooms, 1);
eq('default transport', r.breakdown.transport, 4400);
eq('default hotel', r.breakdown.hotel, 7000);
eq('default food', r.breakdown.food, 4800);
eq('default local', r.breakdown.local, 3200);
eq('default activities', r.breakdown.activities, 3000);
eq('default group', r.group, 22400);
eq('default perPerson', r.perPerson, 11200);
/* 3 people: rooms 2; transport 6600; hotel 14000; food 7200; local 4800; activities 4500; group 37100; perPerson 12367 */
r = CORE.estimateCost({ transportFare: 1100, people: 3, nights: 2, hotelPerNight: 3500, foodPerDay: 1200, localPerDay: 800, activities: 1500 });
eq('3 people rooms', r.rooms, 2);
eq('3 people group', r.group, 37100);
eq('3 people perPerson', r.perPerson, 12367);
/* 1 person 1 night flight: transport 7000*2=14000; hotel 3500; food 1200; local 800; activities 1500; group 21000 */
r = CORE.estimateCost({ transportFare: 7000, people: 1, nights: 1, hotelPerNight: 3500, foodPerDay: 1200, localPerDay: 800, activities: 1500 });
eq('solo flight group', r.group, 21000);
eq('solo flight perPerson', r.perPerson, 21000);
/* invalid inputs fall back: people 0 -> 1, nights 99 -> 14 */
r = CORE.estimateCost({ transportFare: 'x', people: 0, nights: 99, hotelPerNight: -5, foodPerDay: 1200, localPerDay: 800, activities: 1500 });
eq('bad inputs people fallback', r.people, 1);
eq('bad inputs nights clamped', r.nights, 14);
eq('bad inputs fare fallback', r.breakdown.transport, 1100 * 2 * 1);

/* ---------- place filtering ---------- */
eq('filter all places', CORE.filterPlaces(DATA.places, '', 'all').length, 10);
eq('filter island category', CORE.filterPlaces(DATA.places, '', 'island').length, 3);
eq('filter beach category', CORE.filterPlaces(DATA.places, '', 'beach').length, 4);
eq('filter coral EN', CORE.filterPlaces(DATA.places, 'coral', 'all').map((p) => p.id).sort(), ['inani', 'saintmartin']);
eq('filter Bengali query', CORE.filterPlaces(DATA.places, 'ইনানী', 'all').map((p) => p.id), ['inani']);
eq('filter no match', CORE.filterPlaces(DATA.places, 'zzzz', 'all').length, 0);
eq('filter query + category', CORE.filterPlaces(DATA.places, 'beach', 'island').length, 0);

/* ---------- progress / totals ---------- */
eq('progress 3/10', CORE.progress(3, 10), { done: 3, total: 10, pct: 30 });
eq('progress 0 total', CORE.progress(0, 0), { done: 0, total: 0, pct: 0 });
eq('progress clamps over-done', CORE.progress(12, 10).pct, 100);
eq('packing total items', CORE.packingTotal(DATA.packing), 16);
eq('itinerary 2-day total', CORE.itineraryTotal(DATA.itineraries['2']), 10);
eq('itinerary 3-day total', CORE.itineraryTotal(DATA.itineraries['3']), 15);

/* ---------- Saint Martin season ---------- */
check('saint martin open 15 Nov 2026', CORE.saintMartinOpen(new Date(2026, 10, 15)) === true);
check('saint martin open 10 Jan 2027', CORE.saintMartinOpen(new Date(2027, 0, 10)) === true);
check('saint martin open 15 Mar 2027 (last day)', CORE.saintMartinOpen(new Date(2027, 2, 15)) === true);
check('saint martin closed 16 Mar 2027', CORE.saintMartinOpen(new Date(2027, 2, 16)) === false);
check('saint martin closed 15 Jun 2026', CORE.saintMartinOpen(new Date(2026, 5, 15)) === false);
check('saint martin closed 31 Oct 2026', CORE.saintMartinOpen(new Date(2026, 9, 31)) === false);

/* ---------- custom packing item validation ---------- */
check('valid custom item', CORE.validCustomItem('Umbrella') === true);
check('too short rejected', CORE.validCustomItem('a') === false);
check('blank rejected', CORE.validCustomItem('   ') === false);
check('too long rejected', CORE.validCustomItem('x'.repeat(81)) === false);

/* ---------- data integrity ---------- */
eq('10 places', DATA.places.length, 10);
eq('4 transport modes', DATA.transport.length, 4);
eq('transport fares sane', DATA.transport.map((x) => x.fare), [1100, 2000, 3000, 7000]);
eq('place ids unique', new Set(DATA.places.map((p) => p.id)).size, 10);
check('every place has EN+BN name and desc', DATA.places.every((p) => p.en && p.bn && p.enDesc && p.bnDesc && p.enBest && p.bnBest));
check('every place has a known category', DATA.places.every((p) => ['beach', 'nature', 'drive', 'island', 'market'].includes(p.cat)));
eq('3 seasons', DATA.seasons.length, 3);
check('exactly one best season', DATA.seasons.filter((s) => s.best).length === 1);
eq('6 tips', DATA.tips.length, 6);
check('tips have EN+BN', DATA.tips.every((x) => x.en && x.bn));
eq('5 packing groups', DATA.packing.length, 5);
check('beach is 120 km', DATA.facts.beachKm === 120);
check('Dhaka distance 394 km', DATA.facts.dhakaKm === 394);

/* ---------- i18n completeness ---------- */
const enKeys = Object.keys(I18N.en);
const bnKeys = Object.keys(I18N.bn);
eq('i18n key sets match', bnKeys.sort(), enKeys.sort());
check('all i18n strings non-empty', enKeys.every((k) => I18N.en[k] && I18N.bn[k]));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
if (fail) { console.log('Failures: ' + failures.join(' | ')); process.exit(1); }
