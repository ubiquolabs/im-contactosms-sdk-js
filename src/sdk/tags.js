import { request } from "./helper.js";
import { validateContactStatus, validateInteger } from "./helper.js";

export const Tags = {
  /**
   * Get tags with optional filtering
   * @param {Object} params - Query parameters
   * @param {string} params.query - Search query
   * @param {number} params.limit - Number of results to return
   * @param {number} params.start - Starting offset
   * @param {number} params.shortResults - Return short results (0 or 1)
   * @returns {Promise<Object>} - API response
   */
  listTags: async (params = {}) => {
    try {
      // Validate parameters
      validateInteger(params.start);
      validateInteger(params.limit);
      validateInteger(params.shortResults, true);

      const response = await request({
        type: "get",
        endpoint: "tags",
        params,
      });

      return response;
    } catch (error) {
      console.error("Error listing tags:", error.message);
      throw error;
    }
  },

  /**
   * Get a specific tag by short name
   * @param {string} shortName - Tag's short name
   * @returns {Promise<Object>} - API response
   */
  getTag: async (shortName) => {
    try {
      if (!shortName) {
        throw new Error("Tag short name is required");
      }

      const response = await request({
        type: "get",
        endpoint: `tags/${shortName}`,
        params: { tag_name: shortName },
      });

      return response;
    } catch (error) {
      console.error("Error getting tag:", error.message);
      throw error;
    }
  },

  /**
   * Get contacts that belong to a specific tag
   * @param {string} shortName - Tag's short name
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of results to return
   * @param {number} params.start - Starting offset
   * @param {string} params.status - Contact status filter
   * @param {number} params.shortResults - Return short results (0 or 1)
   * @returns {Promise<Object>} - API response
   */
  getTagContacts: async (shortName, params = {}) => {
    try {
      if (!shortName) {
        throw new Error("Tag short name is required");
      }

      // Validate parameters
      validateContactStatus(params.status);
      validateInteger(params.limit);
      validateInteger(params.start);
      validateInteger(params.shortResults, true);

      const requestParams = {
        ...params,
        tag_name: shortName,
      };

      const response = await request({
        type: "get",
        endpoint: `tags/${shortName}/contacts`,
        params: requestParams,
      });

      return response;
    } catch (error) {
      console.error("Error getting tag contacts:", error.message);
      throw error;
    }
  },

  /**
   * Create a new tag
   * @param {Object} tagData - Tag data
   * @param {string} tagData.name - Tag name
   * @param {string} tagData.shortName - Tag short name (optional)
   * @param {string} tagData.description - Tag description (optional)
   * @returns {Promise<Object>} - API response
   */
  createTag: async (tagData) => {
    try {
      const { name, shortName, description } = tagData;

      if (!name) {
        throw new Error("Tag name is required");
      }

      const body = {
        name,
        short_name: shortName,
        description,
      };

      const response = await request({
        type: "post",
        endpoint: "tags",
        data: body,
      });

      return response;
    } catch (error) {
      console.error("Error creating tag:", error.message);
      throw error;
    }
  },

  /**
   * Update an existing tag
   * @param {string} shortName - Tag's short name
   * @param {Object} tagData - Tag data to update
   * @param {string} tagData.name - Tag name (optional)
   * @param {string} tagData.description - Tag description (optional)
   * @returns {Promise<Object>} - API response
   */
  updateTag: async (shortName, tagData) => {
    try {
      if (!shortName) {
        throw new Error("Tag short name is required");
      }

      const { name, description } = tagData;

      const body = {
        name,
        description,
      };

      const response = await request({
        type: "put",
        endpoint: `tags/${shortName}`,
        params: { tag_name: shortName },
        data: body,
      });

      return response;
    } catch (error) {
      console.error("Error updating tag:", error.message);
      throw error;
    }
  },

  /**
   * Delete a tag
   * @param {string} shortName - Tag's short name
   * @returns {Promise<Object>} - API response
   */
  deleteTag: async (shortName) => {
    try {
      if (!shortName) {
        throw new Error("Tag short name is required");
      }

      const response = await request({
        type: "delete",
        endpoint: `tags/${shortName}`,
        params: { tag_name: shortName },
      });

      return response;
    } catch (error) {
      console.error("Error deleting tag:", error.message);
      throw error;
    }
  },

  /**
   * Add multiple contacts to a tag
   * @param {string} shortName - Tag's short name
   * @param {Array<string>} msisdns - Array of MSISDNs to add
   * @returns {Promise<Object>} - API response
   */
  addContactsToTag: async (shortName, msisdns) => {
    try {
      if (!shortName || !msisdns) {
        throw new Error("Tag short name and MSISDNs array are required");
      }

      if (!Array.isArray(msisdns)) {
        throw new Error("MSISDNs must be an array");
      }

      const body = {
        msisdns,
      };

      const response = await request({
        type: "post",
        endpoint: `tags/${shortName}/contacts`,
        params: { tag_name: shortName },
        data: body,
      });

      return response;
    } catch (error) {
      console.error("Error adding contacts to tag:", error.message);
      throw error;
    }
  },

  /**
   * Remove multiple contacts from a tag
   * @param {string} shortName - Tag's short name
   * @param {Array<string>} msisdns - Array of MSISDNs to remove
   * @returns {Promise<Object>} - API response
   */
  removeContactsFromTag: async (shortName, msisdns) => {
    try {
      if (!shortName || !msisdns) {
        throw new Error("Tag short name and MSISDNs array are required");
      }

      if (!Array.isArray(msisdns)) {
        throw new Error("MSISDNs must be an array");
      }

      const body = {
        msisdns,
      };

      const response = await request({
        type: "delete",
        endpoint: `tags/${shortName}/contacts`,
        params: { tag_name: shortName },
        data: body,
      });

      return response;
    } catch (error) {
      console.error("Error removing contacts from tag:", error.message);
      throw error;
    }
  },
}; 