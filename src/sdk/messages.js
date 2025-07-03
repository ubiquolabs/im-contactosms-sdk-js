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
   * Send message to multiple contacts (using the same endpoint as sendToContact)
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

      // Send to each contact individually since bulk endpoint might not exist
      const results = [];
      for (const msisdn of msisdns) {
        const response = await request({
          type: "post",
          endpoint: "messages/send_to_contact",
          data: {
            msisdn,
            message,
            id: `${id}-${msisdn}`,
          },
        });
        results.push({ msisdn, response });
      }

      // Return summary of results
      const successCount = results.filter(r => r.response.ok).length;
      const failedCount = results.length - successCount;

      return {
        code: 200,
        status: "OK",
        ok: failedCount === 0,
        data: {
          total: results.length,
          success: successCount,
          failed: failedCount,
          results,
        },
      };
    } catch (error) {
      console.error("Error sending message to multiple contacts:", error.message);
      throw error;
    }
  },

  /**
   * Get message status by ID (if endpoint exists)
   * @param {string|number} messageId - Message ID
   * @returns {Promise<Object>} - API response
   */
  getMessageStatus: async (messageId) => {
    try {
      if (!messageId) {
        throw new Error("Message ID is required");
      }

      // Try to get message status from messages list
      const today = new Date().toISOString().split('T')[0];
      const messages = await request({
        type: "get",
        endpoint: "messages",
        params: {
          start_date: today,
          end_date: today,
          limit: 100,
        },
      });

      if (messages.ok && messages.data) {
        const message = messages.data.find(m => m.id === messageId);
        if (message) {
          return {
            code: 200,
            status: "OK",
            ok: true,
            data: {
              id: messageId,
              status: message.status || 'UNKNOWN',
              delivered: message.status === 'DELIVERED',
              timestamp: message.timestamp || message.created_at,
            },
          };
        }
      }

      return {
        code: 404,
        status: "Not Found",
        ok: false,
        data: { error: "Message not found" },
      };
    } catch (error) {
      console.error("Error getting message status:", error.message);
      throw error;
    }
  },

  /**
   * Get message delivery reports (using messages endpoint)
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

      // Use the messages endpoint to get delivery reports
      const response = await request({
        type: "get",
        endpoint: "messages",
        params: requestParams,
      });

      // Transform the response to look like delivery reports
      if (response.ok && response.data) {
        const reports = response.data.map(message => ({
          msisdn: message.msisdn,
          status: message.status || 'UNKNOWN',
          timestamp: message.timestamp || message.created_at,
          message_id: message.id,
        }));

        return {
          ...response,
          data: reports,
        };
      }

      return response;
    } catch (error) {
      console.error("Error getting delivery reports:", error.message);
      throw error;
    }
  },
};
