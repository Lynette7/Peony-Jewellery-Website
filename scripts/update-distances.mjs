/**
 * One-time script: fetches accurate road distances from Nairobi to every city
 * in our shipping list using the Google Maps Distance Matrix API, then writes
 * the results directly into src/data/shipping.ts.
 *
 * Run once:
 *   node --env-file=.env scripts/update-distances.mjs
 *
 * Requirements:
 *   - Node 18+  (for native fetch + --env-file)
 *   - Distance Matrix API enabled on your Google Cloud key
 *     → console.cloud.google.com › APIs & Services › Enable APIs
 *     → search "Distance Matrix API" and enable it
 */

import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHIPPING_FILE = path.join(__dirname, '../src/data/shipping.ts');

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
const ORIGIN  = 'Imaara Mall, Nairobi, Kenya';
const DELAY_MS = 200; // be polite to the API — 5 req/s well within limits

// ── City list ────────────────────────────────────────────────────────────────
// Keep in sync with the names in shipping.ts.
const CITIES = [
  'Nairobi',
  'Ongata Rongai',
  'Ngong',
  'Ruaka',
  'Kiambu',
  'Ruiru',
  'Athi River',
  'Kitengela',
  'Juja',
  'Limuru',
  'Thika',
  'Machakos',
  "Murang'a",
  'Naivasha',
  'Kirinyaga',
  'Narok',
  'Nyeri',
  'Nakuru',
  'Meru',
  'Mwingi',
  'Nyahururu',
  'Nanyuki',
  'Kajiado',
  'Isiolo',
  'Kericho',
  'Nandi',
  'Kisii',
  'Eldoret',
  'Uasin Gishu',
  'Kisumu',
  'Homabay',
  'Kakamega',
  'Siaya',
  'Migori',
  'Kitale',
  'Trans Nzoia',
  'Webuye',
  'Busia',
  'Bungoma',
  'West Pokot',
  'Kapenguria',
  'Samburu',
  'Embu',
  'Garissa',
  'Wajir',
  'Mandera',
  'Marsabit',
  'Voi',
  'Taita',
  'Mombasa',
  'Kwale',
  'Kilifi',
  'Malindi',
  'Tana River',
  'Lamu',
  'Turkana',
  'Lodwar',
  'Moyale',
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getRoadDistanceKm(destination) {
  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
  url.searchParams.set('origins',      ORIGIN);
  url.searchParams.set('destinations', `${destination}, Kenya`);
  url.searchParams.set('key',          API_KEY);
  url.searchParams.set('units',        'metric');

  const res  = await fetch(url.toString());
  const data = await res.json();

  if (data.status !== 'OK') {
    console.warn(`  ⚠  API error for "${destination}": ${data.status}`);
    return null;
  }

  const element = data.rows?.[0]?.elements?.[0];
  if (element?.status !== 'OK') {
    console.warn(`  ⚠  No route for "${destination}": ${element?.status}`);
    return null;
  }

  return Math.round(element.distance.value / 1000);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!API_KEY) {
    console.error('❌  NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is not set in .env');
    process.exit(1);
  }

  console.log(`📍  Origin: ${ORIGIN}`);
  console.log(`🏙   Cities: ${CITIES.length}`);
  console.log('─'.repeat(50));

  const results = [];
  const failed  = [];

  for (const city of CITIES) {
    const km = await getRoadDistanceKm(city);
    if (km !== null) {
      console.log(`  ✓  ${city.padEnd(20)} ${km} km`);
      results.push({ name: city, distance_km: km });
    } else {
      failed.push(city);
      // Keep the existing approximate value so the file stays valid
      const existing = readExistingDistance(city);
      console.log(`  ~  ${city.padEnd(20)} ${existing} km  (kept existing)`);
      results.push({ name: city, distance_km: existing });
    }
    await sleep(DELAY_MS);
  }

  console.log('─'.repeat(50));
  if (failed.length) {
    console.warn(`⚠  ${failed.length} city/cities used fallback distances: ${failed.join(', ')}`);
  }

  writeShippingFile(results);
  console.log(`\n✅  src/data/shipping.ts updated with ${results.length} cities.`);
}

// ── File helpers ─────────────────────────────────────────────────────────────

/** Read the existing distance for a city from the current shipping.ts (fallback). */
function readExistingDistance(cityName) {
  const content = readFileSync(SHIPPING_FILE, 'utf-8');
  const re = new RegExp(`name:\\s*['"]${escapeRegex(cityName)}['"].*?distance_km:\\s*(\\d+)`, 's');
  const m  = content.match(re);
  return m ? parseInt(m[1], 10) : 500; // 500 km = safe default
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function writeShippingFile(cities) {
  const cityLines = cities
    .map(({ name, distance_km }) => {
      const escaped = name.includes("'") ? `"${name}"` : `'${name}'`;
      return `  { name: ${escaped}, distance_km: ${distance_km} },`;
    })
    .join('\n');

  const content = `// ---------------------------------------------------------------------------
// Shipping fee formula
// fee = max(MIN_FEE, BASE_FEE + distance_km * RATE_PER_KM)
// Adjust the three constants below to change all fees at once.
// ---------------------------------------------------------------------------
export const BASE_FEE = 150;       // KES flat base
export const RATE_PER_KM = 2;     // KES per km of road distance from Nairobi
export const MIN_FEE = 200;        // KES floor (covers Nairobi deliveries)

// ---------------------------------------------------------------------------
// Road distances from Nairobi (km) — updated by scripts/update-distances.mjs
// To refresh: node --env-file=.env scripts/update-distances.mjs
// ---------------------------------------------------------------------------
export interface KenyanCity {
  name: string;
  distance_km: number;
}

export const KENYAN_CITIES: KenyanCity[] = [
${cityLines}
];

/** Returns the shipping fee for a given city name. */
export function getShippingFee(cityName: string): number {
  const city = KENYAN_CITIES.find(
    (c) => c.name.toLowerCase() === cityName.trim().toLowerCase()
  );
  const distance = city?.distance_km ?? 500; // unknown city → ~500 km default
  return Math.max(MIN_FEE, BASE_FEE + Math.round(distance * RATE_PER_KM));
}

/** Returns the calculated fee and distance for display. */
export function getShippingDetails(cityName: string): { fee: number; distance_km: number } {
  const city = KENYAN_CITIES.find(
    (c) => c.name.toLowerCase() === cityName.trim().toLowerCase()
  );
  const distance_km = city?.distance_km ?? 500;
  const fee = Math.max(MIN_FEE, BASE_FEE + Math.round(distance_km * RATE_PER_KM));
  return { fee, distance_km };
}
`;

  writeFileSync(SHIPPING_FILE, content, 'utf-8');
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
