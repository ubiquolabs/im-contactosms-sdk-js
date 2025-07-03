import { Messages } from "./messages.js";
import { Contacts } from "./contacts.js";
import { Tags } from "./tags.js";

/**
 * Main SMS API class that provides access to all API resources
 */
export class SmsApi {
  /**
   * Create a new SMS API instance
   * @param {string} apiKey - Your API key
   * @param {string} apiSecret - Your API secret
   * @param {string} apiUrl - Your API URL
   */
  constructor(apiKey, apiSecret, apiUrl) {
    if (!apiKey || !apiSecret || !apiUrl) {
      throw new Error("API Key, API Secret, and API URL are required");
    }

    // Set environment variables for the SDK
    process.env.API_KEY = apiKey;
    process.env.API_SECRET = apiSecret;
    process.env.URL = apiUrl.endsWith('/') ? apiUrl : apiUrl + '/';

    this._contacts = null;
    this._messages = null;
    this._tags = null;
  }

  /**
   * Get contacts resource
   * @returns {Object} Contacts API methods
   */
  get contacts() {
    if (!this._contacts) {
      this._contacts = Contacts;
    }
    return this._contacts;
  }

  /**
   * Get messages resource
   * @returns {Object} Messages API methods
   */
  get messages() {
    if (!this._messages) {
      this._messages = Messages;
    }
    return this._messages;
  }

  /**
   * Get tags resource
   * @returns {Object} Tags API methods
   */
  get tags() {
    if (!this._tags) {
      this._tags = Tags;
    }
    return this._tags;
  }

  /**
   * Test the API connection
   * @returns {Promise<Object>} Connection test result
   */
  async testConnection() {
    try {
      const response = await this.contacts.listContacts({ limit: 1 });
      return {
        success: true,
        message: "API connection successful",
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: "API connection failed",
        error: error.message,
      };
    }
  }

  /**
   * Get API statistics
   * @returns {Promise<Object>} API statistics
   */
  async getStats() {
    try {
      const [contactsResponse, messagesResponse, tagsResponse] = await Promise.all([
        this.contacts.listContacts({ limit: 1 }),
        this.messages.listMessages({ 
          startDate: new Date().toISOString().split('T')[0], 
          endDate: new Date().toISOString().split('T')[0],
          limit: 1 
        }),
        this.tags.listTags({ limit: 1 }),
      ]);

      return {
        success: true,
        data: {
          contacts: contactsResponse,
          messages: messagesResponse,
          tags: tagsResponse,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to get API statistics",
        error: error.message,
      };
    }
  }
} 