import "dotenv";

/**
 * Configuration management for the SMS API SDK
 */

// Export config object for direct access
// Use getters to ensure the values are read from process.env at access time, not at module load time.
export const config = {
  get apiKey() { return process.env.API_KEY; },
  get apiSecret() { return process.env.API_SECRET; },
  get url() { return process.env.URL; },
};

/**
 * Set configuration from environment variables or constructor parameters
 * @param {string} apiKey - API key
 * @param {string} apiSecret - API secret
 * @param {string} url - API URL
 */
export const setConfig = (apiKey, apiSecret, url) => {
  // This function should set the process.env variables so the getters can pick them up.
  if (apiKey) process.env.API_KEY = apiKey;
  if (apiSecret) process.env.API_SECRET = apiSecret;
  if (url) process.env.URL = url;


  // Ensure URL ends with slash
  if (process.env.URL && !process.env.URL.endsWith('/')) {
    process.env.URL = process.env.URL + '/';
  }
};

/**
 * Get current configuration
 * @returns {Object} - Current configuration
 */
export const getConfig = () => {
  return { ...config };
};
