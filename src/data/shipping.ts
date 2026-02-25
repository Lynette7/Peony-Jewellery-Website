// ---------------------------------------------------------------------------
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
  { name: 'Nairobi', distance_km: 12 },
  { name: 'Ongata Rongai', distance_km: 27 },
  { name: 'Ngong', distance_km: 35 },
  { name: 'Ruaka', distance_km: 28 },
  { name: 'Kiambu', distance_km: 27 },
  { name: 'Ruiru', distance_km: 29 },
  { name: 'Athi River', distance_km: 19 },
  { name: 'Kitengela', distance_km: 21 },
  { name: 'Juja', distance_km: 37 },
  { name: 'Limuru', distance_km: 49 },
  { name: 'Thika', distance_km: 49 },
  { name: 'Machakos', distance_km: 53 },
  { name: "Murang'a", distance_km: 89 },
  { name: 'Naivasha', distance_km: 101 },
  { name: 'Kirinyaga', distance_km: 113 },
  { name: 'Narok', distance_km: 153 },
  { name: 'Nyeri', distance_km: 155 },
  { name: 'Nakuru', distance_km: 171 },
  { name: 'Meru', distance_km: 230 },
  { name: 'Mwingi', distance_km: 176 },
  { name: 'Nyahururu', distance_km: 197 },
  { name: 'Nanyuki', distance_km: 199 },
  { name: 'Kajiado', distance_km: 67 },
  { name: 'Isiolo', distance_km: 277 },
  { name: 'Kericho', distance_km: 274 },
  { name: 'Nandi', distance_km: 323 },
  { name: 'Kisii', distance_km: 316 },
  { name: 'Eldoret', distance_km: 323 },
  { name: 'Uasin Gishu', distance_km: 338 },
  { name: 'Kisumu', distance_km: 365 },
  { name: 'Homabay', distance_km: 386 },
  { name: 'Kakamega', distance_km: 390 },
  { name: 'Siaya', distance_km: 434 },
  { name: 'Migori', distance_km: 382 },
  { name: 'Kitale', distance_km: 398 },
  { name: 'Trans Nzoia', distance_km: 408 },
  { name: 'Webuye', distance_km: 395 },
  { name: 'Busia', distance_km: 476 },
  { name: 'Bungoma', distance_km: 421 },
  { name: 'West Pokot', distance_km: 450 },
  { name: 'Kapenguria', distance_km: 427 },
  { name: 'Samburu', distance_km: 433 },
  { name: 'Embu', distance_km: 134 },
  { name: 'Garissa', distance_km: 371 },
  { name: 'Wajir', distance_km: 685 },
  { name: 'Mandera', distance_km: 1140 },
  { name: 'Marsabit', distance_km: 534 },
  { name: 'Voi', distance_km: 319 },
  { name: 'Taita', distance_km: 329 },
  { name: 'Mombasa', distance_km: 473 },
  { name: 'Kwale', distance_km: 505 },
  { name: 'Kilifi', distance_km: 497 },
  { name: 'Malindi', distance_km: 485 },
  { name: 'Tana River', distance_km: 450 },
  { name: 'Lamu', distance_km: 700 },
  { name: 'Turkana', distance_km: 710 },
  { name: 'Lodwar', distance_km: 609 },
  { name: 'Moyale', distance_km: 779 },
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
