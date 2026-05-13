# TidesAtlas Node.js SDK

Official Node.js SDK for [TidesAtlas](https://tidesatlas.com) — worldwide tide predictions, weather & marine data API.

- 18,000+ tide stations across 188 countries
- Tide predictions, weather, marine/wave, astronomy (sun & moon) data
- Historical data access
- Zero dependencies, native `fetch` (Node 18+)
- Full TypeScript type definitions

## Installation

```bash
npm install tidesatlas
```

## Quick Start

```js
const TidesAtlas = require('tidesatlas');

const client = new TidesAtlas('your-api-key');

// Get today's tides for Brest, France
const data = await client.tides({ port: 'brest-3-fra-refmar' });
console.log(data.extremes);
```

Get your free API key at [tidesatlas.com/api/docs](https://tidesatlas.com/api/docs).

## Usage

### Initialize

```js
const TidesAtlas = require('tidesatlas');

const client = new TidesAtlas('your-api-key');

// With options
const client = new TidesAtlas('your-api-key', {
  baseUrl: 'https://tidesatlas.com/api/v1',  // default
  timeout: 15000,                              // 15s timeout
});
```

### Tides

Get tide predictions (high/low water times and heights).

```js
// By port slug
const tides = await client.tides({ port: 'aberdeen-abe-gbr-bodc', days: 3 });

// By coordinates (finds nearest station)
const tides = await client.tides({ lat: 48.39, lon: -4.49, days: 7 });

// With specific date and datum
const tides = await client.tides({
  port: 'brest-3-fra-refmar',
  date: '2026-06-15',
  days: 3,
  datum: 'MSL',
});

console.log(tides.port);     // { name, slug, lat, lon, timezone, country, ... }
console.log(tides.datum);    // { reference: 'MSL', native: 'LAT', available: [...] }
console.log(tides.extremes); // [{ datetime, timestamp, height_m, type }, ...]
```

### Ports

Search for tide stations worldwide.

```js
// Search by name
const results = await client.ports({ search: 'london' });

// Filter by country
const results = await client.ports({ country: 'france', limit: 100 });

// List all (up to 500)
const results = await client.ports({ limit: 500 });

console.log(results.count);
console.log(results.ports); // [{ name, slug, lat, lon, timezone, country, ... }, ...]
```

### Countries

List all countries with station counts.

```js
const data = await client.countries();

console.log(data.count);      // 188
console.log(data.countries);   // [{ name, slug, code_iso, station_count }, ...]
```

### Weather

Get weather forecast for a location.

```js
// By port
const weather = await client.weather({ port: 'brest-3-fra-refmar', days: 5 });

// By coordinates
const weather = await client.weather({ lat: 51.5, lon: -0.1, days: 3 });

console.log(weather.daily);  // [{ date, temperature_max_c, condition, sunrise, sunset, ... }]
console.log(weather.hourly); // [{ datetime, temperature_c, wind_speed_kmh, condition, ... }]
```

### Marine

Get wave and swell forecast.

```js
const marine = await client.marine({ port: 'brest-3-fra-refmar', days: 3 });

console.log(marine.daily);  // [{ date, wave_height_max_m, sea_state, swell_height_max_m, ... }]
console.log(marine.hourly); // [{ datetime, wave_height_m, swell_height_m, wave_period_s, ... }]
```

### Astronomy

Get sun and moon data (sunrise, sunset, moon phase, etc.).

```js
const astro = await client.astronomy({ port: 'brest-3-fra-refmar', days: 7 });

for (const day of astro.data) {
  console.log(day.date);
  console.log(day.sun);   // { sunrise, sunset, dawn, dusk, day_length }
  console.log(day.moon);  // { phase, illumination_pct, age_days, moonrise, moonset }
}
```

### Conditions

Get combined weather + marine + astronomy data in a single call.

```js
// All data
const conditions = await client.conditions({ port: 'brest-3-fra-refmar', days: 3 });

// Only specific data types
const conditions = await client.conditions({
  lat: 48.39,
  lon: -4.49,
  days: 3,
  include: ['weather', 'marine'],
});

console.log(conditions.weather);   // { daily: [...], hourly: [...] }
console.log(conditions.marine);    // { daily: [...], hourly: [...] }
console.log(conditions.astronomy); // [{ date, sun, moon }, ...]
```

### History

Get historical tide and weather data for past dates.

```js
// Historical tides only
const history = await client.history({
  port: 'brest-3-fra-refmar',
  date: '2025-01-01',
  days: 30,
});

// Historical tides + weather
const history = await client.history({
  port: 'brest-3-fra-refmar',
  date: '2025-06-01',
  days: 14,
  include: ['tides', 'weather'],
});

console.log(history.tides.extremes);  // [{ datetime, height_m, type }, ...]
console.log(history.weather.daily);   // [{ date, temperature_max_c, ... }, ...]
```

## Error Handling

```js
const { TidesAtlasError } = require('tidesatlas');

try {
  const data = await client.tides({ port: 'nonexistent-port' });
} catch (err) {
  if (err instanceof TidesAtlasError) {
    console.error(err.message);  // "Station 'nonexistent-port' not found."
    console.error(err.status);   // 404
    console.error(err.body);     // { error: true, message: "...", status: 404 }
  }
}
```

Error status codes:
- `400` - Bad request (invalid parameters)
- `401` - Unauthorized (invalid API key)
- `404` - Not found (unknown port or endpoint)
- `429` - Rate limit exceeded
- `502` - Upstream data source temporarily unavailable

## TypeScript

Full type definitions are included. Import types directly:

```ts
import TidesAtlas, { TidesResponse, PortsResponse, TidesAtlasError } from 'tidesatlas';

const client = new TidesAtlas('your-api-key');
const tides: TidesResponse = await client.tides({ port: 'brest-3-fra-refmar' });
```

## Requirements

- Node.js 18+ (uses native `fetch`)
- No external dependencies

## API Documentation

Full API reference: [tidesatlas.com/api/docs](https://tidesatlas.com/api/docs)

## License

MIT
