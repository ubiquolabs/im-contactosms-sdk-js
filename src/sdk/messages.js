import { request } from "./helper.js";
import { validateDate, validateInteger, validateArray } from "./helper.js";

export const Messages = {
  /**
   * Get messages with optional filtering
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date (required)
   * @param {string} params.endDate - End date (required)
   * @param {number} params.limit - Number of results to return
   * @param {number} params.start - Starting offset
   * @param {string} params.msisdn - Filter by MSISDN
   * @param {string} params.direction - Message direction (MT, MO)
   * @returns {Promise<Object>} - API response
   */
  listMessages: async (params) => {
    try {
      // Validate required parameters
      if (!params.startDate || !params.endDate) {
        throw new Error("startDate and endDate are required");
      }

      // Validate and format dates
      const startDate = validateDate(params.startDate, true);
      const endDate = validateDate(params.endDate, true);

      // Validate other parameters
      validateInteger(params.start);
      validateInteger(params.limit);

      const requestParams = {
        ...params,
        start_date: startDate,
        end_date: endDate,
      };

      const response = await request({
        type: "get",
        endpoint: "messages",
        params: requestParams,
      });

      return response;
    } catch (error) {
      console.error("Error listing messages:", error.message);
      throw error;
    }
  },

  /**
   * Send message to a specific contact
   * @param {Object} messageData - Message data
   * @param {string} messageData.msisdn - Contact's MSISDN
   * @param {string} messageData.message - Message content
   * @param {string|number} messageData.id - Message ID (optional)
   * @returns {Promise<Object>} - API response
   */
  sendToContact: async (messageData) => {
    try {
      const { msisdn, message, id } = messageData;

      if (!msisdn || !message) {
        throw new Error("MSISDN and message are required");
      }

      const body = {
        msisdn,
        message,
        id,
      };

      const response = await request({
        type: "post",
        endpoint: "messages/send_to_contact",
        data: body,
      });

      return response;
    } catch (error) {
      console.error("Error sending message to contact:", error.message);
      throw error;
    }
  },

  /**
   * Send message to contacts with specific tags
   * @param {Object} messageData - Message data
   * @param {Array<string>} messageData.tags - Array of tag names
   * @param {string} messageData.message - Message content
   * @param {string|number} messageData.id - Message ID (optional)
   * @returns {Promise<Object>} - API response
   */
  sendToTags: async (messageData) => {
    try {
      const { tags, message, id } = messageData;

      if (!tags || !message) {
        throw new Error("Tags array and message are required");
      }

      validateArray(tags, true);

      const body = {
        tags,
        message,
        id,
      };

      const response = await request({
        type: "post",
        endpoint: "messages/send",
        data: body,
      });

      return response;
    } catch (error) {
      console.error("Error sending message to tags:", error.message);
      throw error;
    }
  },

  /**
   * Send message to multiple contacts
   * @param {Object} messageData - Message data
   * @param {Array<string>} messageData.msisdns - Array of MSISDNs
   * @param {string} messageData.message - Message content
   * @param {string|number} messageData.id - Message ID (optional)
   * @returns {Promise<Object>} - API response
   */
  sendToMultipleContacts: async (messageData) => {
    try {
      const { msisdns, message, id } = messageData;

      if (!msisdns || !message) {
        throw new Error("MSISDNs array and message are required");
      }

      validateArray(msisdns, true);

      const body = {
        msisdns,
        message,
        id,
      };

      const response = await request({
        type: "post",
        endpoint: "messages/send_to_multiple",
        data: body,
      });

      return response;
    } catch (error) {
      console.error("Error sending message to multiple contacts:", error.message);
      throw error;
    }
  },

  /**
   * Get message status by ID
   * @param {string|number} messageId - Message ID
   * @returns {Promise<Object>} - API response
   */
  getMessageStatus: async (messageId) => {
    try {
      if (!messageId) {
        throw new Error("Message ID is required");
      }

      const response = await request({
        type: "get",
        endpoint: `messages/${messageId}/status`,
        params: { id: messageId },
      });

      return response;
    } catch (error) {
      console.error("Error getting message status:", error.message);
      throw error;
    }
  },

  /**
   * Get message delivery reports
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date (required)
   * @param {string} params.endDate - End date (required)
   * @param {number} params.limit - Number of results to return
   * @param {number} params.start - Starting offset
   * @param {string} params.msisdn - Filter by MSISDN
   * @returns {Promise<Object>} - API response
   */
  getDeliveryReports: async (params) => {
    try {
      // Validate required parameters
      if (!params.startDate || !params.endDate) {
        throw new Error("startDate and endDate are required");
      }

      // Validate and format dates
      const startDate = validateDate(params.startDate, true);
      const endDate = validateDate(params.endDate, true);

      // Validate other parameters
      validateInteger(params.start);
      validateInteger(params.limit);

      const requestParams = {
        ...params,
        start_date: startDate,
        end_date: endDate,
      };

      const response = await request({
        type: "get",
        endpoint: "messages/delivery_reports",
        params: requestParams,
      });

      return response;
    } catch (error) {
      console.error("Error getting delivery reports:", error.message);
      throw error;
    }
  },
};
