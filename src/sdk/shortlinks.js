import { request } from "./helper.js";
import { validateDate, validateInteger } from "./helper.js";

export const Shortlinks = {
  /**
   * List all shortlinks with optional filtering
   * @param {Object} params - Query parameters
   * @param {string} params.start_date - Start date (optional)
   * @param {string} params.end_date - End date (optional)
   * @param {number} params.limit - Number of results to return
   * @param {number} params.offset - Timezone offset (optional)
   * @param {string} params.id - Specific shortlink ID (optional)
   * @returns {Promise<Object>} - API response
   */
  listShortlinks: async (params = {}) => {
    try {
      if (params.id) {
        const requestParams = { id: params.id };
        
        const response = await request({
          type: "get",
          endpoint: "short_link/",
          params: requestParams,
        });
        
        return response;
      }

      const requestParams = {};
      
      if (params.start_date) {
        validateDate(params.start_date, true);
        requestParams.start_date = params.start_date;
      }
      
      if (params.end_date) {
        validateDate(params.end_date, true);
        requestParams.end_date = params.end_date;
      }
      
      validateInteger(params.limit);
      validateInteger(params.offset);
      
      if (params.limit) {
        requestParams.limit = params.limit;
      }
      
      if (params.offset !== undefined) {
        requestParams.offset = params.offset;
      }

      const response = await request({
        type: "get",
        endpoint: "short_link/",
        params: requestParams,
      });

      return response;
    } catch (error) {
      console.error("Error listing shortlinks:", error.message);
      throw error;
    }
  },

  /**
   * Get a specific shortlink by ID
   * @param {string} id - Shortlink ID
   * @returns {Promise<Object>} - API response
   */
  getShortlinkById: async (id) => {
    try {
      if (!id) {
        throw new Error("Shortlink ID is required");
      }

      const response = await request({
        type: "get",
        endpoint: "short_link/",
        params: { id },
      });

      return response;
    } catch (error) {
      console.error("Error getting shortlink by ID:", error.message);
      throw error;
    }
  },

  /**
   * Create a new shortlink
   * @param {Object} shortlinkData - Shortlink data
   * @param {string} shortlinkData.long_url - Original long URL
   * @param {string} shortlinkData.name - Shortlink name
   * @param {string} shortlinkData.status - Status (ACTIVE, INACTIVE)
   * @returns {Promise<Object>} - API response
   */
  createShortlink: async (shortlinkData) => {
    try {
      const { long_url, name, status } = shortlinkData;

      if (!long_url) {
        throw new Error("long_url is required");
      }

      if (status && !["ACTIVE", "INACTIVE"].includes(status)) {
        throw new Error("Status must be ACTIVE or INACTIVE");
      }

      const body = {
        long_url,
        name: name || null,
        status: status || "ACTIVE",
      };

      const response = await request({
        type: "post",
        endpoint: "short_link",
        data: body,
      });

      return response;
    } catch (error) {
      console.error("Error creating shortlink:", error.message);
      throw error;
    }
  },

  /**
   * Update shortlink status
   * @param {string} id - Shortlink ID
   * @param {string} status - New status (ACTIVE, INACTIVE)
   * @returns {Promise<Object>} - API response
   */
  updateShortlinkStatus: async (id, status) => {
    try {
      if (!id) {
        throw new Error("Shortlink ID is required");
      }

      if (!status || !["ACTIVE", "INACTIVE"].includes(status)) {
        throw new Error("Status is required and must be ACTIVE or INACTIVE");
      }

      const response = await request({
        type: "put",
        endpoint: `short_link/${id}/status`,
        params: { id },
        data: { status },
      });

      return response;
    } catch (error) {
      console.error("Error updating shortlink status:", error.message);
      throw error;
    }
  },
};

