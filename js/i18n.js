'use strict';
/* Cox's Bazar BD — UI strings (EN + BN). Works in Node and browser. */
const CXB_I18N = {
  en: {
    tagline: "World's longest natural sea beach — plan the trip, know the cost, pack right.",
    tabPlaces: 'Places', tabCost: 'Cost', tabPlan: 'Plan', tabPacking: 'Packing', tabTips: 'Tips',
    heroBeach: '120 km of beach', heroDist: '394 km from Dhaka', heroBus: '9–12 h by bus',
    searchPh: 'Search places…', catAll: 'All', catBeach: 'Beaches', catNature: 'Nature', catDrive: 'Drive', catIsland: 'Islands', catMarket: 'Market',
    distFromTown: 'from town', bestTime: 'Best', noPlaces: 'No places match that search.',
    costTitle: 'Trip cost estimator', costNote: 'Planning ranges from late 2026 — confirm live prices before booking.',
    transport: 'Transport (Dhaka → Cox’s Bazar)', people: 'People', nights: 'Nights',
    hotel: 'Hotel / night (per room)', food: 'Food / day (per person)', local: 'Local travel / day (per person)',
    activities: 'Activities total (per person)', roundTrip: 'Round trip (×2) included',
    perPerson: 'Per person', groupTotal: 'Group total', rooms: 'rooms',
    breakdown: 'Breakdown', bdTransport: 'Transport', bdHotel: 'Hotel', bdFood: 'Food', bdLocal: 'Local travel', bdActivities: 'Activities',
    planTitle: 'Day-by-day plan', planDays2: '2 days', planDays3: '3 days', planDone: 'done',
    dayLabel: 'Day', switchPlanNote: 'Switching plans clears your checkmarks.',
    packTitle: 'Packing checklist', packAdd: 'Add item', packAddPh: 'e.g. Umbrella', packCustom: 'Custom', packEmpty: 'Nothing packed yet — tick items as you pack.',
    tipsTitle: 'Know before you go', seasonsTitle: 'Best time to visit', seasonBest: 'Best time',
    saintOpen: "Saint Martin's ships are running now (season: 1 Nov – 15 Mar).",
    saintClosed: "Saint Martin's ships are NOT running now (season: 1 Nov – 15 Mar).",
    footer: 'Offline guide — no internet needed. Prices are planning ranges, not live rates. Travel safe.',
    exportBtn: 'Export my plan', importBtn: 'Import', eraseBtn: 'Erase all my data', eraseConfirm: 'Type DELETE to erase all saved trip data.',
    exported: 'Saved data exported.', imported: 'Data imported.', importBad: 'That file is not valid Cox’s Bazar BD data.', erased: 'All saved data erased.',
    langBtn: 'বাংলা'
  },
  bn: {
    tagline: 'বিশ্বের দীর্ঘতম প্রাকৃতিক সমুদ্র সৈকত — ভ্রমণের পরিকল্পনা, খরচের হিসাব, সঠিক প্যাকিং।',
    tabPlaces: 'স্থানসমূহ', tabCost: 'খরচ', tabPlan: 'পরিকল্পনা', tabPacking: 'প্যাকিং', tabTips: 'টিপস',
    heroBeach: '১২০ কিমি বিচ', heroDist: 'ঢাকা থেকে ৩৯৪ কিমি', heroBus: 'বাসে ৯–১২ ঘণ্টা',
    searchPh: 'স্থান খুঁজুন…', catAll: 'সব', catBeach: 'বিচ', catNature: 'প্রকৃতি', catDrive: 'ড্রাইভ', catIsland: 'দ্বীপ', catMarket: 'বাজার',
    distFromTown: 'শহর থেকে', bestTime: 'সেরা সময়', noPlaces: 'এই খোঁজে কোনো স্থান মেলেনি।',
    costTitle: 'ভ্রমণ খরচের হিসাব', costNote: '২০২৬ সালের শেষের পরিকল্পনার ধারণা — বুক করার আগে আসল দাম নিশ্চিত করুন।',
    transport: 'যাতায়াত (ঢাকা → কক্সবাজার)', people: 'জন', nights: 'রাত',
    hotel: 'হোটেল / রাত (প্রতি রুম)', food: 'খাবার / দিন (প্রতি জন)', local: 'স্থানীয় যাতায়াত / দিন (প্রতি জন)',
    activities: 'কার্যক্রম মোট (প্রতি জন)', roundTrip: 'আসা-যাওয়া (×২) ধরা হয়েছে',
    perPerson: 'প্রতি জন', groupTotal: 'দলের মোট', rooms: 'টি রুম',
    breakdown: 'ভাঙন', bdTransport: 'যাতায়াত', bdHotel: 'হোটেল', bdFood: 'খাবার', bdLocal: 'স্থানীয় যাতায়াত', bdActivities: 'কার্যক্রম',
    planTitle: 'দিন অনুযায়ী পরিকল্পনা', planDays2: '২ দিন', planDays3: '৩ দিন', planDone: 'শেষ',
    dayLabel: 'দিন', switchPlanNote: 'পরিকল্পনা বদলালে টিকচিহ্ন মুছে যাবে।',
    packTitle: 'প্যাকিং চেকলিস্ট', packAdd: 'যোগ করুন', packAddPh: 'যেমন: ছাতা', packCustom: 'নিজের জিনিস', packEmpty: 'এখনো কিছু প্যাক হয়নি — প্যাক করার সঙ্গে সঙ্গে টিক দিন।',
    tipsTitle: 'যাওয়ার আগে জানুন', seasonsTitle: 'যাওয়ার সেরা সময়', seasonBest: 'সেরা সময়',
    saintOpen: 'সেন্টমার্টিনের জাহাজ এখন চলছে (মৌসুম: ১ নভেম্বর – ১৫ মার্চ)।',
    saintClosed: 'সেন্টমার্টিনের জাহাজ এখন চলছে না (মৌসুম: ১ নভেম্বর – ১৫ মার্চ)।',
    footer: 'অফলাইন গাইড — ইন্টারনেট লাগে না। দামগুলো পরিকল্পনার ধারণা, আসল হার নয়। নিরাপদে ভ্রমণ করুন।',
    exportBtn: 'আমার পরিকল্পনা এক্সপোর্ট', importBtn: 'ইমপোর্ট', eraseBtn: 'আমার সব তথ্য মুছুন', eraseConfirm: 'সব সংরক্ষিত ভ্রমণ তথ্য মুছতে DELETE লিখুন।',
    exported: 'সংরক্ষিত তথ্য এক্সপোর্ট হয়েছে।', imported: 'তথ্য ইমপোর্ট হয়েছে।', importBad: 'এই ফাইলটি কক্সবাজার বিডির বৈধ তথ্য নয়।', erased: 'সব সংরক্ষিত তথ্য মোছা হয়েছে।',
    langBtn: 'English'
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = CXB_I18N;
if (typeof window !== 'undefined') window.CXB_I18N = CXB_I18N;
