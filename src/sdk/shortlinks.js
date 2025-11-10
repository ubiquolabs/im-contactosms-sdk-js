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
        requestParams.start_date = params.start_date;
      }
      
      if (params.end_date) {
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
   * @param {string} [shortlinkData.name] - Optional shortlink name (max 50 chars)
   * @param {string} [shortlinkData.alias] - Optional alias without spaces (max 30 chars)
   * @param {string} [shortlinkData.status] - Status (ACTIVE, INACTIVE)
   * @returns {Promise<Object>} - API response
   */
  createShortlink: async (shortlinkData = {}) => {
    try {
      const { long_url, name, status, alias } = shortlinkData;

      if (!long_url) {
        throw new Error("long_url is required");
      }

      let normalizedStatus = status || "ACTIVE";
      if (typeof normalizedStatus === "string") {
        normalizedStatus = normalizedStatus.trim().toUpperCase();
      }

      if (!["ACTIVE", "INACTIVE"].includes(normalizedStatus)) {
        throw new Error("Status must be ACTIVE or INACTIVE");
      }

      let normalizedName = null;
      if (name !== undefined && name !== null) {
        if (typeof name !== "string") {
          throw new Error("name must be a string");
        }
        normalizedName = name.trim();
        if (normalizedName.length === 0) {
          normalizedName = null;
        } else if (normalizedName.length > 50) {
          throw new Error("name must be 50 characters or fewer");
        }
      }

      let normalizedAlias = null;
      if (alias !== undefined && alias !== null) {
        if (typeof alias !== "string") {
          throw new Error("alias must be a string");
        }
        normalizedAlias = alias.trim();
        if (normalizedAlias.length === 0) {
          throw new Error("alias cannot be empty");
        }
        if (normalizedAlias.length > 30) {
          throw new Error("alias must be 30 characters or fewer");
        }
        if (/\s/.test(normalizedAlias)) {
          throw new Error("alias cannot contain spaces");
        }
      }

      const body = {
        long_url,
        status: normalizedStatus,
      };

      if (normalizedName !== null) {
        body.name = normalizedName;
      } else if (name !== undefined) {
        body.name = null;
      }

      if (normalizedAlias !== null) {
        body.alias = normalizedAlias;
      }

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
   * Create a new shortlink enforcing a custom alias
   * @param {Object} shortlinkData - Shortlink data
   * @param {string} shortlinkData.long_url - Original long URL
   * @param {string} shortlinkData.alias - Required alias (max 30 chars, no spaces)
   * @param {string} [shortlinkData.name] - Optional shortlink name (max 50 chars)
   * @param {string} [shortlinkData.status] - Status (ACTIVE, INACTIVE)
   * @returns {Promise<Object>} - API response
   */
  createShortlinkWithAlias: async (shortlinkData = {}) => {
    const { alias } = shortlinkData;

    if (alias === undefined || alias === null) {
      throw new Error("alias is required");
    }
    if (typeof alias !== "string") {
      throw new Error("alias must be a string");
    }
    if (alias.trim().length === 0) {
      throw new Error("alias cannot be empty");
    }

    return Shortlinks.createShortlink({
      ...shortlinkData,
      alias,
    });
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

      if (status === "ACTIVE") {
        console.warn("Warning: shortlinks cannot be reactivated; backend will reject ACTIVE requests.");
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
      if (error.response?.data?.message) {
        console.error("Server message:", error.response.data.message);
      }
      throw error;
    }
  },
};

