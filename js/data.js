'use strict';
/* Cox's Bazar BD — static content data (EN + BN).
 * Facts grounded in web research 2026-11-15 (unseenbangladesh.com 2026-10-25,
 * gojatra.com, thetravelerbd.com, masterasish.com 2026-11-05):
 * - beach ~120 km, world's longest natural sea beach
 * - Dhaka -> Cox's Bazar ~394 km via N1, 9-12 h by bus
 * - bus one-way: non-AC Tk 800-1,200; AC Tk 1,400-2,500; sleeper Tk 2,500-3,500
 * - Marine Drive ~80 km Cox's Bazar -> Teknaf
 * - Himchari ~12 km from Kolatoli; Inani ~13 km further (~25 km)
 * - Saint Martin's ship season 1 Nov 2026 - 15 Mar 2027, from Nuniyarchhara ghat
 * All prices are planning ranges, not live rate cards; the app labels them so.
 * Works in Node (module.exports) and in the browser (window.CXB_DATA).
 */
const CXB_DATA = {
  facts: {
    beachKm: 120,
    dhakaKm: 394,
    busHoursMin: 9,
    busHoursMax: 12,
    marineDriveKm: 80,
    saintMartinSeason: { from: '2026-11-01', to: '2027-03-15' }
  },
  transport: [
    { id: 'nonac',    en: 'Bus — Non-AC',  bn: 'বাস — নন-এসি',   fare: 1100, rangeEn: 'Tk 800–1,200 one-way',  rangeBn: 'একমুখী ৮০০–১,২০০ টাকা' },
    { id: 'ac',       en: 'Bus — AC',      bn: 'বাস — এসি',       fare: 2000, rangeEn: 'Tk 1,400–2,500 one-way', rangeBn: 'একমুখী ১,৪০০–২,৫০০ টাকা' },
    { id: 'sleeper',  en: 'Bus — AC Sleeper', bn: 'বাস — এসি স্লিপার', fare: 3000, rangeEn: 'Tk 2,500–3,500 one-way', rangeBn: 'একমুখী ২,৫০০–৩,৫০০ টাকা' },
    { id: 'flight',   en: 'Flight',        bn: 'ফ্লাইট',          fare: 7000, rangeEn: 'Tk 5,500–9,000 one-way', rangeBn: 'একমুখী ৫,৫০০–৯,০০০ টাকা' }
  ],
  places: [
    { id: 'laboni', en: 'Laboni Beach', bn: 'লাবণী বিচ', cat: 'beach', distKm: 0,
      enDesc: 'The main town beach — widest stretch of sand, sunset crowds, horse rides and beach chairs.',
      bnDesc: 'শহরের প্রধান বিচ — সবচেয়ে চওড়া বালুর তট, সূর্যাস্ত, ঘোড়ায় চড়া ও বিচ চেয়ার।',
      enBest: 'Sunset, 4–6 pm', bnBest: 'সূর্যাস্ত, বিকেল ৪–৬টা' },
    { id: 'sugandha', en: 'Sugandha Beach', bn: 'সুগন্ধা বিচ', cat: 'beach', distKm: 1,
      enDesc: 'Quieter than Laboni, a short walk south — good for a calm morning swim and local food stalls.',
      bnDesc: 'লাবণীর চেয়ে শান্ত, দক্ষিণে অল্প হাঁটা — শান্ত সকালে সাঁতার ও স্থানীয় খাবারের দোকানের জন্য ভালো।',
      enBest: 'Early morning', bnBest: 'ভোরবেলা' },
    { id: 'kolatoli', en: 'Kolatoli Beach', bn: 'কলাতলী বিচ', cat: 'beach', distKm: 2,
      enDesc: 'Hotel zone beach with the liveliest evening — street food, lights and the busiest sunset point.',
      bnDesc: 'হোটেল এলাকার বিচ, সন্ধ্যায় সবচেয়ে জমজমাট — স্ট্রিট ফুড, আলো ও ব্যস্ততম সূর্যাস্তের জায়গা।',
      enBest: 'Evening', bnBest: 'সন্ধ্যা' },
    { id: 'himchari', en: 'Himchari', bn: 'হিমছড়ি', cat: 'nature', distKm: 12,
      enDesc: 'Waterfall at the foot of green hills plus a hilltop viewpoint over the bay. Small park entry fee.',
      bnDesc: 'সবুজ পাহাড়ের পাদদেশে ঝরনা ও উপসাগরের দিকে পাহাড়চূড়ার ভিউপয়েন্ট। ছোট প্রবেশ ফি আছে।',
      enBest: 'Morning, before the crowd', bnBest: 'সকাল, ভিড়ের আগে' },
    { id: 'inani', en: 'Inani Beach', bn: 'ইনানী বিচ', cat: 'beach', distKm: 25,
      enDesc: 'Famous for coral stones and clear water — the prettiest beach on the Marine Drive, best at low tide.',
      bnDesc: 'প্রবাল পাথর ও স্বচ্ছ পানির জন্য বিখ্যাত — মেরিন ড্রাইভের সবচেয়ে সুন্দর বিচ, ভাটার সময় সেরা।',
      enBest: 'Low tide', bnBest: 'ভাটার সময়' },
    { id: 'marine', en: 'Marine Drive', bn: 'মেরিন ড্রাইভ', cat: 'drive', distKm: 80,
      enDesc: 'The 80 km coastal road to Teknaf — hills on one side, sea on the other. Hire a car, CNG or bike for the day.',
      bnDesc: 'টেকনাফ পর্যন্ত ৮০ কিমি উপকূলীয় সড়ক — একদিকে পাহাড়, অন্যদিকে সমুদ্র। দিনের জন্য গাড়ি, সিএনজি বা বাইক ভাড়া নিন।',
      enBest: 'Daylight hours', bnBest: 'দিনের আলোয়' },
    { id: 'moheshkhali', en: 'Moheshkhali Island', bn: 'মহেশখালী দ্বীপ', cat: 'island', distKm: 12,
      enDesc: 'Short boat ride from town — Adinath Temple on the hill, salt fields and a sleepy fishing-island feel.',
      bnDesc: 'শহর থেকে অল্প নৌকা যাত্রা — পাহাড়ে আদিনাথ মন্দির, লবণের মাঠ ও শান্ত মাছধরা দ্বীপের অনুভূতি।',
      enBest: 'Day trip', bnBest: 'দিনের ভ্রমণ' },
    { id: 'sonadia', en: 'Sonadia Island', bn: 'সোনাদিয়া দ্বীপ', cat: 'island', distKm: 15,
      enDesc: 'Quiet mangrove island known for red crabs on the sand at low tide. Go with a local boatman.',
      bnDesc: 'ভাটার সময় বালুতে লাল কাঁকড়ার জন্য পরিচিত শান্ত ম্যানগ্রোভ দ্বীপ। স্থানীয় নৌকার মাঝির সঙ্গে যান।',
      enBest: 'Low tide, with a guide', bnBest: 'ভাটা, গাইডসহ' },
    { id: 'saintmartin', en: "Saint Martin's Island", bn: 'সেন্টমার্টিন দ্বীপ', cat: 'island', distKm: 90,
      enDesc: 'Bangladesh’s only coral island — turquoise water and Chhera Dwip at low tide. Ships run in season only (1 Nov – 15 Mar).',
      bnDesc: 'বাংলাদেশের একমাত্র প্রবাল দ্বীপ — ফিরোজা পানি ও ভাটায় ছেঁড়া দ্বীপ। শুধু মৌসুমে জাহাজ চলে (১ নভেম্বর – ১৫ মার্চ)।',
      enBest: 'Nov–Feb, by ship', bnBest: 'নভেম্বর–ফেব্রুয়ারি, জাহাজে' },
    { id: 'burmese', en: 'Burmese Market', bn: 'বার্মিজ মার্কেট', cat: 'market', distKm: 1,
      enDesc: 'Town market for dry fish, pickles, cosmetics and souvenirs — bargain politely and compare stalls first.',
      bnDesc: 'শুকনো মাছ, আচার, প্রসাধনী ও স্যুভেনিরের শহরের বাজার — ভদ্রভাবে দরদাম করুন, আগে দোকান ঘুরে দেখুন।',
      enBest: 'Evening', bnBest: 'সন্ধ্যা' }
  ],
  itineraries: {
    '2': [
      { day: 1, en: 'Arrive + Laboni sunset', bn: 'পৌঁছানো + লাবণী সূর্যাস্ত', items: [
        { en: 'Morning bus/flight from Dhaka (arrive by noon)', bn: 'ঢাকা থেকে সকালের বাস/ফ্লাইট (দুপুরের মধ্যে পৌঁছান)' },
        { en: 'Check in, lunch near Kolatoli', bn: 'হোটেলে চেক-ইন, কলাতলীর কাছে দুপুরের খাবার' },
        { en: 'Afternoon: Sugandha Beach walk', bn: 'বিকেল: সুগন্ধা বিচে হাঁটা' },
        { en: 'Sunset at Laboni, beach chairs + horse ride', bn: 'লাবণীতে সূর্যাস্ত, বিচ চেয়ার + ঘোড়ায় চড়া' },
        { en: 'Evening: Burmese Market + seafood dinner', bn: 'সন্ধ্যা: বার্মিজ মার্কেট + সামুদ্রিক খাবারের রাতের খাবার' } ] },
      { day: 2, en: 'Marine Drive day', bn: 'মেরিন ড্রাইভের দিন', items: [
        { en: 'Early start: hire a car/CNG for Marine Drive', bn: 'ভোরে রওনা: মেরিন ড্রাইভের জন্য গাড়ি/সিএনজি ভাড়া' },
        { en: 'Himchari waterfall + hilltop viewpoint', bn: 'হিমছড়ি ঝরনা + পাহাড়চূড়ার ভিউপয়েন্ট' },
        { en: 'Inani Beach at low tide — coral stones', bn: 'ভাটার সময় ইনানী বিচ — প্রবাল পাথর' },
        { en: 'Lunch at a Marine Drive restaurant', bn: 'মেরিন ড্রাইভের রেস্তোরাঁয় দুপুরের খাবার' },
        { en: 'Back by evening bus/flight to Dhaka', bn: 'সন্ধ্যার বাস/ফ্লাইটে ঢাকায় ফেরা' } ] }
    ],
    '3': [
      { day: 1, en: 'Arrive + town beaches', bn: 'পৌঁছানো + শহরের বিচ', items: [
        { en: 'Morning bus/flight from Dhaka (arrive by noon)', bn: 'ঢাকা থেকে সকালের বাস/ফ্লাইট (দুপুরের মধ্যে পৌঁছান)' },
        { en: 'Check in, lunch near Kolatoli', bn: 'হোটেলে চেক-ইন, কলাতলীর কাছে দুপুরের খাবার' },
        { en: 'Afternoon: Sugandha Beach walk', bn: 'বিকেল: সুগন্ধা বিচে হাঁটা' },
        { en: 'Sunset at Laboni, beach chairs + horse ride', bn: 'লাবণীতে সূর্যাস্ত, বিচ চেয়ার + ঘোড়ায় চড়া' },
        { en: 'Evening: Burmese Market + seafood dinner', bn: 'সন্ধ্যা: বার্মিজ মার্কেট + সামুদ্রিক খাবারের রাতের খাবার' } ] },
      { day: 2, en: 'Marine Drive day', bn: 'মেরিন ড্রাইভের দিন', items: [
        { en: 'Early start: hire a car/CNG for Marine Drive', bn: 'ভোরে রওনা: মেরিন ড্রাইভের জন্য গাড়ি/সিএনজি ভাড়া' },
        { en: 'Himchari waterfall + hilltop viewpoint', bn: 'হিমছড়ি ঝরনা + পাহাড়চূড়ার ভিউপয়েন্ট' },
        { en: 'Inani Beach at low tide — coral stones', bn: 'ভাটার সময় ইনানী বিচ — প্রবাল পাথর' },
        { en: 'Lunch at a Marine Drive restaurant', bn: 'মেরিন ড্রাইভের রেস্তোরাঁয় দুপুরের খাবার' },
        { en: 'Sunset back at Kolatoli', bn: 'কলাতলীতে ফিরে সূর্যাস্ত' } ] },
      { day: 3, en: 'Island morning + home', bn: 'দ্বীপের সকাল + ফেরা', items: [
        { en: 'Morning boat to Moheshkhali Island', bn: 'সকালে নৌকায় মহেশখালী দ্বীপ' },
        { en: 'Adinath Temple hill climb + salt fields', bn: 'আদিনাথ মন্দিরের পাহাড়ে ওঠা + লবণের মাঠ' },
        { en: 'Back to town, last swim at Sugandha', bn: 'শহরে ফেরা, সুগন্ধায় শেষ সাঁতার' },
        { en: 'Lunch, souvenir shopping, check out', bn: 'দুপুরের খাবার, স্যুভেনির কেনা, চেক-আউট' },
        { en: 'Evening bus/flight to Dhaka', bn: 'সন্ধ্যার বাস/ফ্লাইটে ঢাকায় ফেরা' } ] }
    ]
  },
  packing: [
    { groupEn: 'Documents', groupBn: 'কাগজপত্র', items: [
      { en: 'NID / passport', bn: 'এনআইডি / পাসপোর্ট' },
      { en: 'Hotel booking confirmation', bn: 'হোটেল বুকিংয়ের নিশ্চয়তা' },
      { en: 'Bus / flight tickets', bn: 'বাস / ফ্লাইটের টিকিট' } ] },
    { groupEn: 'Clothes', groupBn: 'পোশাক', items: [
      { en: 'Light cotton clothes (2–3 sets)', bn: 'হালকা সুতির পোশাক (২–৩ সেট)' },
      { en: 'Swimwear + extra towel', bn: 'সাঁতারের পোশাক + বাড়তি তোয়ালে' },
      { en: 'Sandals + walking shoes', bn: 'স্যান্ডেল + হাঁটার জুতা' },
      { en: 'Light jacket (Nov–Feb nights are cool)', bn: 'হালকা জ্যাকেট (নভেম্বর–ফেব্রুয়ারি রাত ঠান্ডা)' } ] },
    { groupEn: 'Beach', groupBn: 'বিচ', items: [
      { en: 'Sunscreen (SPF 30+)', bn: 'সানস্ক্রিন (SPF ৩০+)' },
      { en: 'Sunglasses + cap/hat', bn: 'সানগ্লাস + টুপি' },
      { en: 'Water bottle', bn: 'পানির বোতল' } ] },
    { groupEn: 'Health & safety', groupBn: 'স্বাস্থ্য ও নিরাপত্তা', items: [
      { en: 'Regular medicines + first-aid basics', bn: 'নিয়মিত ওষুধ + প্রাথমিক চিকিৎসার জিনিস' },
      { en: 'Mosquito repellent', bn: 'মশা তাড়ানোর ক্রিম' },
      { en: 'Hand sanitizer + tissues', bn: 'হ্যান্ড স্যানিটাইজার + টিস্যু' } ] },
    { groupEn: 'Money & tech', groupBn: 'টাকা ও প্রযুক্তি', items: [
      { en: 'Cash (ATMs exist but can run out)', bn: 'নগদ টাকা (এটিএম আছে, তবে ফুরিয়ে যেতে পারে)' },
      { en: 'Phone charger + power bank', bn: 'ফোনের চার্জার + পাওয়ার ব্যাংক' },
      { en: 'Waterproof phone pouch', bn: 'ওয়াটারপ্রুফ ফোনের ব্যাগ' } ] }
  ],
  seasons: [
    { id: 'novfeb', en: 'Nov – Feb', bn: 'নভেম্বর – ফেব্রুয়ারি', enLabel: 'Best — cool, dry, clear sea', bnLabel: 'সেরা — ঠান্ডা, শুকনো, স্বচ্ছ সমুদ্র', best: true },
    { id: 'mar-may', en: 'Mar – May', bn: 'মার্চ – মে', enLabel: 'Hot and humid — beach mornings only', bnLabel: 'গরম ও আর্দ্র — শুধু সকালে বিচ', best: false },
    { id: 'jun-oct', en: 'Jun – Oct', bn: 'জুন – অক্টোবর', enLabel: 'Monsoon — rough sea, some boats stop', bnLabel: 'বর্ষা — উত্তাল সমুদ্র, কিছু নৌকা বন্ধ', best: false }
  ],
  tips: [
    { en: 'Swim only where lifeguards are on duty — rip currents are strong, especially at Laboni and Kolatoli.', bn: 'শুধু লাইফগার্ড থাকা জায়গায় সাঁতার কাটুন — লাবণী ও কলাতলীতে স্রোত শক্তিশালী।' },
    { en: 'Never swim after dark. The beach has no lights and the tide turns fast.', bn: 'অন্ধকারের পর কখনো সাঁতার কাটবেন না। বিচে আলো নেই, জোয়ার দ্রুত বদলায়।' },
    { en: 'Book hotels and buses early for weekends and the Nov–Feb season — prices jump.', bn: 'সপ্তাহান্ত ও নভেম্বর–ফেব্রুয়ারি মৌসুমে হোটেল ও বাস আগেই বুক করুন — দাম বেড়ে যায়।' },
    { en: 'Saint Martin’s ships run in season only (1 Nov – 15 Mar). Confirm the ship before you go.', bn: 'সেন্টমার্টিনের জাহাজ শুধু মৌসুমে চলে (১ নভেম্বর – ১৫ মার্চ)। যাওয়ার আগে জাহাজ নিশ্চিত করুন।' },
    { en: 'Carry cash. ATMs exist in town but can run out on busy weekends.', bn: 'নগদ টাকা সঙ্গে রাখুন। শহরে এটিএম আছে, তবে ব্যস্ত সপ্তাহান্তে ফুরিয়ে যেতে পারে।' },
    { en: 'All prices in this app are planning ranges from late 2026 — confirm bus, hotel and ship prices before you book.', bn: 'এই অ্যাপের সব দাম ২০২৬ সালের শেষের পরিকল্পনার ধারণা — বুক করার আগে বাস, হোটেল ও জাহাজের দাম নিশ্চিত করুন।' }
  ]
};

if (typeof module !== 'undefined' && module.exports) module.exports = CXB_DATA;
if (typeof window !== 'undefined') window.CXB_DATA = CXB_DATA;
