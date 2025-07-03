import "dotenv";

/**
 * Configuration management for the SMS API SDK
 */

// Export config object for direct access
export const config = {
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  url: process.env.URL,
};

/**
 * Set configuration from environment variables or constructor parameters
 * @param {string} apiKey - API key
 * @param {string} apiSecret - API secret
 * @param {string} url - API URL
 */
export const setConfig = (apiKey, apiSecret, url) => {
  config = {
    apiKey: apiKey || process.env.API_KEY,
    apiSecret: apiSecret || process.env.API_SECRET,
    url: url || process.env.URL,
  };

  // Ensure URL ends with slash
  if (config.url && !config.url.endsWith('/')) {
    config.url = config.url + '/';
  }
};

/**
 * Get current configuration
 * @returns {Object} - Current configuration
 */
export const getConfig = () => {
  return { ...config };
};
