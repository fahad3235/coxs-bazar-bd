'use strict';
/* Cox's Bazar BD — pure logic (no DOM). Node-testable: node tests/unit.test.js */
const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

function toBnDigits(value) {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

function formatTaka(amount, lang) {
  const n = Math.round(amount);
  const s = n.toLocaleString('en-US');
  return lang === 'bn' ? '৳' + toBnDigits(s) : 'Tk ' + s;
}

function clampInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(n)));
}

/* Cost estimate.
 * inputs: { transportFare (one-way, per person), people, nights,
 *           hotelPerNight (per room), foodPerDay, localPerDay, activities }
 * Rules: round trip = fare x 2 per person; rooms = ceil(people/2);
 * hotel total = rooms x hotelPerNight x nights; food/local/activities per person.
 * Returns { perPerson, group, rooms, breakdown } — all in Taka, integers.
 */
function estimateCost(inp) {
  const people = clampInt(inp.people, 1, 30, 2);
  const nights = clampInt(inp.nights, 1, 14, 2);
  const fare = clampInt(inp.transportFare, 0, 100000, 1100);
  const hotel = clampInt(inp.hotelPerNight, 0, 100000, 3500);
  const food = clampInt(inp.foodPerDay, 0, 50000, 1200);
  const local = clampInt(inp.localPerDay, 0, 50000, 800);
  const activities = clampInt(inp.activities, 0, 100000, 1500);
  const rooms = Math.ceil(people / 2);
  const transportTotal = fare * 2 * people;
  const hotelTotal = rooms * hotel * nights;
  const foodTotal = food * nights * people;
  const localTotal = local * nights * people;
  const activitiesTotal = activities * people;
  const group = transportTotal + hotelTotal + foodTotal + localTotal + activitiesTotal;
  return {
    people, nights, rooms,
    breakdown: { transport: transportTotal, hotel: hotelTotal, food: foodTotal, local: localTotal, activities: activitiesTotal },
    group,
    perPerson: Math.round(group / people)
  };
}

/* Place filtering: query matches EN or BN name/description; category filter. */
function filterPlaces(places, query, category) {
  const q = String(query || '').trim().toLowerCase();
  return places.filter((p) => {
    if (category && category !== 'all' && p.cat !== category) return false;
    if (!q) return true;
    return (p.en + ' ' + p.bn + ' ' + p.enDesc + ' ' + p.bnDesc).toLowerCase().includes(q);
  });
}

/* Progress helpers: checked is a Set/array of keys; total counts items. */
function progress(doneCount, total) {
  if (total <= 0) return { done: 0, total: 0, pct: 0 };
  return { done: Math.min(doneCount, total), total, pct: Math.round((Math.min(doneCount, total) / total) * 100) };
}

function packingTotal(packing) {
  return packing.reduce((n, g) => n + g.items.length, 0);
}

function itineraryTotal(planDays) {
  return planDays.reduce((n, d) => n + d.items.length, 0);
}

/* Saint Martin's season check: season runs 1 Nov -> 15 Mar (wraps the year). */
function saintMartinOpen(date) {
  const m = date.getMonth() + 1; // 1-12
  const d = date.getDate();
  if (m === 11 || m === 12 || m === 1 || m === 2) return true;
  if (m === 3) return d <= 15;
  return false;
}

/* Validate a custom packing item label. */
function validCustomItem(label) {
  const s = String(label || '').trim();
  return s.length >= 2 && s.length <= 80;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { toBnDigits, formatTaka, clampInt, estimateCost, filterPlaces, progress, packingTotal, itineraryTotal, saintMartinOpen, validCustomItem };
}
if (typeof window !== 'undefined') {
  window.CXB_CORE = { toBnDigits, formatTaka, clampInt, estimateCost, filterPlaces, progress, packingTotal, itineraryTotal, saintMartinOpen, validCustomItem };
}
