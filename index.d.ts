/**
 * Official Node.js SDK for TidesAtlas — worldwide tide predictions, weather & marine data API.
 *
 * @see https://tidesatlas.com/api/docs
 */

// ─── Constructor options ───

export interface TidesAtlasOptions {
  /** Override the API base URL (default: https://tidesatlas.com/api/v1) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

// ─── Error class ───

export class TidesAtlasError extends Error {
  /** HTTP status code (0 for network/timeout errors) */
  status: number;
  /** Raw response body, if available */
  body: any;
  constructor(message: string, status: number, body: any);
}

// ─── Shared types ───

export interface PortInfo {
  name: string;
  slug: string;
  lat: number;
  lon: number;
  timezone: string;
  country: string;
  country_slug: string;
  region: string;
}

export interface PortSummary {
  name: string;
  slug: string;
  country: string;
}

export interface NearestInfo {
  distance_km: number;
  note: string;
}

// ─── /tides ───

export interface TidesParams {
  /** Station slug (e.g. "brest-3-fra-refmar") */
  port?: string;
  /** Latitude — finds nearest station */
  lat?: number;
  /** Longitude — finds nearest station */
  lon?: number;
  /** Number of days, 1-14 (default: 1) */
  days?: number;
  /** Start date YYYY-MM-DD (default: today) */
  date?: string;
  /** Vertical datum: LAT, MSL, MLLW, MHW, MLW, MHHW, MTL, HAT */
  datum?: 'LAT' | 'MSL' | 'MLLW' | 'MHW' | 'MLW' | 'MHHW' | 'MTL' | 'HAT';
}

export interface TideExtreme {
  /** ISO 8601 datetime with timezone offset */
  datetime: string;
  /** Unix timestamp */
  timestamp: number;
  /** Height in meters relative to chosen datum */
  height_m: number;
  /** "high" or "low" */
  type: 'high' | 'low';
}

export interface DatumInfo {
  /** Currently applied datum */
  reference: string;
  /** Station's native datum */
  native: string;
  /** All available datums for this station */
  available: string[];
}

export interface TidesResponse {
  port: PortInfo;
  datum: DatumInfo;
  date: string;
  days: number;
  count: number;
  extremes: TideExtreme[];
  nearest?: NearestInfo;
  observations?: {
    source: string;
    interval_minutes: number;
    data: any[];
  };
  has_observations?: boolean;
}

// ─── /ports ───

export interface PortsParams {
  /** Search query (name, slug) */
  search?: string;
  /** Country slug filter */
  country?: string;
  /** Max results, 1-500 (default: 50) */
  limit?: number;
}

export interface PortListItem {
  name: string;
  slug: string;
  lat: number;
  lon: number;
  timezone: string;
  country: string;
  country_slug: string;
  code_iso: string;
  region: string;
}

export interface PortsResponse {
  count: number;
  ports: PortListItem[];
}

// ─── /countries ───

export interface Country {
  name: string;
  slug: string;
  code_iso: string;
  station_count: number;
}

export interface CountriesResponse {
  count: number;
  countries: Country[];
}

// ─── /weather ───

export interface WeatherParams {
  /** Station slug */
  port?: string;
  /** Latitude */
  lat?: number;
  /** Longitude */
  lon?: number;
  /** Number of days, 1-7 (default: 3) */
  days?: number;
}

export interface WeatherDailyItem {
  date: string;
  temperature_max_c: number | null;
  temperature_min_c: number | null;
  precipitation_mm: number | null;
  wind_max_kmh: number | null;
  uv_index_max: number | null;
  condition: string;
  sunrise: string;
  sunset: string;
}

export interface WeatherHourlyItem {
  datetime: string;
  temperature_c: number | null;
  feels_like_c: number | null;
  humidity_pct: number | null;
  precipitation_mm: number | null;
  pressure_hpa: number | null;
  cloud_cover_pct: number | null;
  wind_speed_kmh: number | null;
  wind_direction_deg: number | null;
  wind_gust_kmh: number | null;
  uv_index: number | null;
  condition: string;
}

export interface WeatherResponse {
  lat: number;
  lon: number;
  timezone: string;
  days: number;
  source: string;
  daily: WeatherDailyItem[];
  hourly: WeatherHourlyItem[];
  port?: PortSummary;
  cached?: boolean;
  stale?: boolean;
}

// ─── /marine ───

export interface MarineParams {
  /** Station slug */
  port?: string;
  /** Latitude */
  lat?: number;
  /** Longitude */
  lon?: number;
  /** Number of days, 1-7 (default: 3) */
  days?: number;
}

export interface MarineDailyItem {
  date: string;
  wave_height_max_m: number | null;
  wave_period_max_s: number | null;
  wave_direction_dominant: number | null;
  swell_height_max_m: number | null;
  swell_period_max_s: number | null;
  sea_state: string;
}

export interface MarineHourlyItem {
  datetime: string;
  wave_height_m: number | null;
  wave_direction_deg: number | null;
  wave_period_s: number | null;
  swell_height_m: number | null;
  swell_direction_deg: number | null;
  swell_period_s: number | null;
  wind_wave_height_m: number | null;
  wind_wave_direction: number | null;
  wind_wave_period_s: number | null;
}

export interface MarineResponse {
  lat: number;
  lon: number;
  timezone: string;
  days: number;
  source: string;
  daily: MarineDailyItem[];
  hourly: MarineHourlyItem[];
  port?: PortSummary;
  cached?: boolean;
  stale?: boolean;
}

// ─── /astronomy ───

export interface AstronomyParams {
  /** Station slug */
  port?: string;
  /** Latitude */
  lat?: number;
  /** Longitude */
  lon?: number;
  /** Number of days, 1-7 (default: 1) */
  days?: number;
  /** Start date YYYY-MM-DD (default: today) */
  date?: string;
}

export interface SunData {
  sunrise: string | null;
  sunset: string | null;
  dawn: string | null;
  dusk: string | null;
  day_length: string | null;
}

export interface MoonData {
  phase: string;
  illumination_pct: number;
  age_days: number;
  moonrise: string | null;
  moonset: string | null;
}

export interface AstronomyDayItem {
  date: string;
  sun: SunData;
  moon: MoonData;
}

export interface AstronomyResponse {
  lat: number;
  lon: number;
  timezone: string;
  date: string;
  days: number;
  data: AstronomyDayItem[];
  port?: PortSummary;
}

// ─── /conditions ───

export interface ConditionsParams {
  /** Station slug */
  port?: string;
  /** Latitude */
  lat?: number;
  /** Longitude */
  lon?: number;
  /** Number of days, 1-7 (default: 3) */
  days?: number;
  /** Data types to include: "weather", "marine", "astronomy" */
  include?: string[] | string;
}

export interface ConditionsResponse {
  lat: number;
  lon: number;
  timezone: string;
  days: number;
  port?: PortSummary;
  weather?: {
    daily: WeatherDailyItem[];
    hourly: WeatherHourlyItem[];
  };
  marine?: {
    daily: MarineDailyItem[];
    hourly: MarineHourlyItem[];
  };
  astronomy?: AstronomyDayItem[];
  sources: {
    weather: string;
    marine: string;
    astronomy: string;
  };
}

// ─── /history ───

export interface HistoryParams {
  /** Station slug (required) */
  port?: string;
  /** Latitude */
  lat?: number;
  /** Longitude */
  lon?: number;
  /** Start date YYYY-MM-DD in the past (required) */
  date?: string;
  /** Number of days, 1-365 (default: 7) */
  days?: number;
  /** Data types to include: "tides", "weather" */
  include?: string[] | string;
}

export interface HistoryWeatherItem {
  date: string;
  temperature_max_c: number | null;
  temperature_min_c: number | null;
  precipitation_mm: number | null;
  wind_max_kmh: number | null;
}

export interface HistoryResponse {
  port: PortInfo;
  date: string;
  days: number;
  include: string[];
  tides?: {
    count: number;
    extremes: TideExtreme[];
  };
  weather?: {
    source: string;
    count: number;
    daily: HistoryWeatherItem[];
  };
}

// ─── Main class ───

declare class TidesAtlas {
  /** Your API key */
  readonly apiKey: string;
  /** API base URL */
  readonly baseUrl: string;
  /** Request timeout in milliseconds */
  readonly timeout: number;

  /**
   * Create a TidesAtlas API client.
   *
   * @param apiKey - Your API key from https://tidesatlas.com/api/docs
   * @param options - Configuration options
   */
  constructor(apiKey: string, options?: TidesAtlasOptions);

  /**
   * Get tide predictions (high/low water extremes).
   */
  tides(params?: TidesParams): Promise<TidesResponse>;

  /**
   * Search tide stations / ports.
   */
  ports(params?: PortsParams): Promise<PortsResponse>;

  /**
   * List all countries with station counts.
   */
  countries(): Promise<CountriesResponse>;

  /**
   * Get weather forecast for a location.
   */
  weather(params?: WeatherParams): Promise<WeatherResponse>;

  /**
   * Get marine / wave forecast for a location.
   */
  marine(params?: MarineParams): Promise<MarineResponse>;

  /**
   * Get sun and moon data for a location.
   */
  astronomy(params?: AstronomyParams): Promise<AstronomyResponse>;

  /**
   * Get combined weather, marine, and astronomy data in a single call.
   */
  conditions(params?: ConditionsParams): Promise<ConditionsResponse>;

  /**
   * Get historical tide and weather data for past dates.
   */
  history(params?: HistoryParams): Promise<HistoryResponse>;
}

export default TidesAtlas;
export { TidesAtlas };
