'use strict';

const BASE_URL = 'https://tidesatlas.com/api/v1';

class TidesAtlasError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {object|null} body
   */
  constructor(message, status, body) {
    super(message);
    this.name = 'TidesAtlasError';
    this.status = status;
    this.body = body;
  }
}

class TidesAtlas {
  /**
   * Create a TidesAtlas API client.
   *
   * @param {string} apiKey - Your API key from https://tidesatlas.com/api/docs
   * @param {object} [options]
   * @param {string} [options.baseUrl] - Override the API base URL
   * @param {number} [options.timeout] - Request timeout in milliseconds (default: 30000)
   */
  constructor(apiKey, { baseUrl, timeout } = {}) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('TidesAtlas: apiKey is required');
    }
    this.apiKey = apiKey;
    this.baseUrl = (baseUrl || BASE_URL).replace(/\/+$/, '');
    this.timeout = timeout || 30000;
  }

  /**
   * Get tide predictions (high/low water extremes).
   *
   * @param {object} params
   * @param {string} [params.port]  - Station slug (e.g. "brest-3-fra-refmar")
   * @param {number} [params.lat]   - Latitude (finds nearest station)
   * @param {number} [params.lon]   - Longitude (finds nearest station)
   * @param {number} [params.days]  - Number of days, 1-14 (default: 1)
   * @param {string} [params.date]  - Start date YYYY-MM-DD (default: today)
   * @param {string} [params.datum] - Vertical datum: LAT, MSL, MLLW, MHW, MLW, MHHW, MTL, HAT
   * @returns {Promise<object>}
   */
  async tides({ port, lat, lon, days, date, datum } = {}) {
    return this._request('/tides', { port, lat, lon, days, date, datum });
  }

  /**
   * Search tide stations / ports.
   *
   * @param {object} [params]
   * @param {string} [params.search]  - Search query (name, slug)
   * @param {string} [params.country] - Country slug filter
   * @param {number} [params.limit]   - Max results, 1-500 (default: 50)
   * @returns {Promise<object>}
   */
  async ports({ search, country, limit } = {}) {
    return this._request('/ports', { search, country, limit });
  }

  /**
   * List all countries with station counts.
   *
   * @returns {Promise<object>}
   */
  async countries() {
    return this._request('/countries');
  }

  /**
   * Get weather forecast for a location.
   *
   * @param {object} params
   * @param {string} [params.port] - Station slug
   * @param {number} [params.lat]  - Latitude
   * @param {number} [params.lon]  - Longitude
   * @param {number} [params.days] - Number of days, 1-7 (default: 3)
   * @returns {Promise<object>}
   */
  async weather({ port, lat, lon, days } = {}) {
    return this._request('/weather', { port, lat, lon, days });
  }

  /**
   * Get marine / wave forecast for a location.
   *
   * @param {object} params
   * @param {string} [params.port] - Station slug
   * @param {number} [params.lat]  - Latitude
   * @param {number} [params.lon]  - Longitude
   * @param {number} [params.days] - Number of days, 1-7 (default: 3)
   * @returns {Promise<object>}
   */
  async marine({ port, lat, lon, days } = {}) {
    return this._request('/marine', { port, lat, lon, days });
  }

  /**
   * Get sun and moon data for a location.
   *
   * @param {object} params
   * @param {string} [params.port] - Station slug
   * @param {number} [params.lat]  - Latitude
   * @param {number} [params.lon]  - Longitude
   * @param {number} [params.days] - Number of days, 1-7 (default: 1)
   * @param {string} [params.date] - Start date YYYY-MM-DD (default: today)
   * @returns {Promise<object>}
   */
  async astronomy({ port, lat, lon, days, date } = {}) {
    return this._request('/astronomy', { port, lat, lon, days, date });
  }

  /**
   * Get combined weather, marine, and astronomy data in a single call.
   *
   * @param {object} params
   * @param {string}   [params.port]    - Station slug
   * @param {number}   [params.lat]     - Latitude
   * @param {number}   [params.lon]     - Longitude
   * @param {number}   [params.days]    - Number of days, 1-7 (default: 3)
   * @param {string[]} [params.include] - Data types: "weather", "marine", "astronomy"
   * @returns {Promise<object>}
   */
  async conditions({ port, lat, lon, days, include } = {}) {
    const params = { port, lat, lon, days };
    if (include) {
      params.include = Array.isArray(include) ? include.join(',') : include;
    }
    return this._request('/conditions', params);
  }

  /**
   * Get historical tide and weather data for past dates.
   *
   * @param {object} params
   * @param {string}   params.port      - Station slug (required)
   * @param {string}   params.date      - Start date YYYY-MM-DD in the past (required)
   * @param {number}   [params.days]    - Number of days, 1-365 (default: 7)
   * @param {string[]} [params.include] - Data types: "tides", "weather"
   * @returns {Promise<object>}
   */
  async history({ port, lat, lon, days, date, include } = {}) {
    const params = { port, lat, lon, days, date };
    if (include) {
      params.include = Array.isArray(include) ? include.join(',') : include;
    }
    return this._request('/history', params);
  }

  /**
   * Internal method to perform API requests.
   *
   * @param {string} endpoint - API endpoint path (e.g. "/tides")
   * @param {object} [params] - Query parameters
   * @returns {Promise<object>}
   * @throws {TidesAtlasError}
   */
  async _request(endpoint, params) {
    const url = new URL(this.baseUrl + endpoint);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    let response;
    try {
      response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'Accept': 'application/json',
          'User-Agent': 'tidesatlas-node/0.1.0',
        },
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new TidesAtlasError(
          `Request timed out after ${this.timeout}ms`,
          0,
          null
        );
      }
      throw new TidesAtlasError(
        `Network error: ${err.message}`,
        0,
        null
      );
    } finally {
      clearTimeout(timeoutId);
    }

    let body;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await response.json();
    } else {
      const text = await response.text();
      try {
        body = JSON.parse(text);
      } catch {
        body = { message: text };
      }
    }

    if (!response.ok) {
      const message = body?.message || body?.error || `HTTP ${response.status}`;
      throw new TidesAtlasError(message, response.status, body);
    }

    return body;
  }
}

module.exports = TidesAtlas;
module.exports.TidesAtlas = TidesAtlas;
module.exports.TidesAtlasError = TidesAtlasError;
module.exports.default = TidesAtlas;
