import axios from "axios";
import crypto from "crypto";
import { sortParams } from "./lib/sortParams.js";
import { config } from "./config/dotenv.js";

/**
 * Validates required configuration
 * @param {Object} config - Configuration object
 * @returns {boolean} - True if valid
 */
const validateConfig = (config) => {
  if (!config.apiKey || !config.apiSecret) {
    throw new Error("API_KEY and API_SECRET are required");
  }
  if (!config.url) {
    throw new Error("URL is required");
  }
  return true;
};

/**
 * Validates contact status according to official documentation
 * @param {string} status - Contact status to validate
 * @returns {boolean} - True if valid
 */
export const validateContactStatus = (status) => {
  if (!status) return true;
  
  const validStatuses = ["SUBSCRIBED", "INVITED", "CONFIRMED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}. Valid statuses are: ${validStatuses.join(", ")}`);
  }
  return true;
};

/**
 * Validates integer values
 * @param {any} value - Value to validate
 * @param {boolean} isBoolean - Whether the value should be 0 or 1
 * @returns {boolean} - True if valid
 */
export const validateInteger = (value, isBoolean = false) => {
  if (value === null || value === undefined) return true;
  
  if (!Number.isInteger(Number(value))) {
    throw new Error(`Value ${value} is not numeric`);
  }
  
  if (isBoolean && ![0, 1].includes(Number(value))) {
    throw new Error(`Value ${value} is not 0 or 1`);
  }
  
  return true;
};

/**
 * Validates and formats date
 * @param {string|Date} value - Date value to validate
 * @param {boolean} required - Whether the date is required
 * @returns {string} - Formatted date string
 */
export const validateDate = (value, required = false) => {
  if (!value && !required) return null;
  
  let date;
  if (typeof value === 'string') {
    date = new Date(value);
  } else if (value instanceof Date) {
    date = value;
  } else {
    throw new Error(`Invalid date format: ${value}`);
  }
  
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

/**
 * Validates array values
 * @param {any} value - Value to validate
 * @param {boolean} required - Whether the array is required
 * @returns {boolean} - True if valid
 */
export const validateArray = (value, required = false) => {
  if (!value && !required) return true;
  
  if (!Array.isArray(value)) {
    throw new Error(`Expected array, got: ${typeof value}`);
  }
  
  return true;
};

/**
 * Creates authorization headers for API requests
 * @param {Object} requestConfig - Request configuration
 * @returns {Object} - Authorization headers
 */
const authorization = (requestConfig) => {
  console.log("2. Authorization");

  validateConfig(config);

  const auth = {};
  let formattedParams = "";
  let formattedData = "";
  const formattedDate = new Date().toUTCString();

  if (requestConfig.data) {
    // Use JSON.stringify without escaping UTF-8 characters
    formattedData = JSON.stringify(requestConfig.data);
    // Note: JavaScript doesn't have a direct equivalent to Python's ensure_ascii=False
    // The encoding issue is typically handled at the HTTP request level
  }

  if (requestConfig.params) {
    formattedParams = Object.keys(sortParams(requestConfig.params))
      .map(
        (key) =>
          key + "=" + encodeURIComponent(requestConfig.params[key]).replace(/%20/g, "+")
      )
      .join("&");
  }

  const canonicalString = `${config.apiKey}${formattedDate}${formattedParams}${formattedData}`;

  const sign = crypto
    .createHmac("sha1", config.apiSecret)
    .update(canonicalString)
    .digest("base64");

  console.log({ formattedData, formattedParams, canonicalString, sign });

  auth.Date = `${formattedDate}`;
  auth.Authorization = `IM ${config.apiKey}:${sign}`;
  auth["X-IM-ORIGIN"] = "IM_SDK_JAVASCRIPT_V4";

  console.log(auth);

  return auth;
};

/**
 * Makes HTTP requests to the API
 * @param {Object} data - Request data
 * @returns {Promise<Object>} - API response
 */
export const request = async (data) => {
  try {
    // Create a clean request configuration for this specific request
    const requestConfig = {
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      url: config.url,
      params: data.params || null,
      data: data.data || null,
    };

    const auth = authorization(requestConfig);

    console.log("3. Send request");
    const response = await axios({
      method: data.type,
      url: `${config.url}${data.endpoint}`,
      data: data.data,
      params: data.params,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Date: auth.Date,
        Authorization: auth.Authorization,
        "X-IM-ORIGIN": auth["X-IM-ORIGIN"],
      },
      timeout: 30000, // 30 seconds timeout
    });

    return {
      code: response.status,
      status: response.statusText,
      ok: response.status >= 200 && response.status < 300,
      data: response.data,
      headers: response.headers,
    };
  } catch (error) {
    console.error("Request failed:", error.message);
    
    if (error.response) {
      return {
        code: error.response.status,
        status: error.response.statusText,
        ok: false,
        data: error.response.data,
        headers: error.response.headers,
        error: error.message,
      };
    }
    
    throw new Error(`Request failed: ${error.message}`);
  }
};
