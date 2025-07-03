import { request, validateInteger } from "./helper.js";

/**
 * Tags API module
 */
export const Tags = {

  /**
   * List tags with optional search
   * @param {Object} params - Query parameters
   * @param {string} params.search - Search filter for tag names
   * @returns {Promise<Object>} - API response
   */
  async listTags(params = {}) {
    try {
      return await request({
        type: "GET",
        endpoint: "/tags",
        params,
      });
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  },

  /**
   * Get contacts in a specific tag
   * @param {string} tagName - Tag name (short_name)
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Limit of records (default 50, max 1000)
   * @param {number} params.start - Offset for pagination (default 0)
   * @returns {Promise<Object>} - API response
   */
  async getTagContacts(tagName, params = {}) {
    try {
      if (!tagName) {
        throw new Error("Tag name is required");
      }

      // Validate parameters
      if (params.limit) validateInteger(params.limit);
      if (params.start) validateInteger(params.start);

      return await request({
        type: "GET",
        endpoint: `/tags/${tagName}/contacts`,
        params,
      });
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  },

  /**
   * Delete a tag
   * @param {string} tagName - Tag name to delete
   * @returns {Promise<Object>} - API response
   */
  async deleteTag(tagName) {
    try {
      if (!tagName) {
        throw new Error("Tag name is required");
      }

      return await request({
        type: "DELETE",
        endpoint: `/tags/${tagName}`,
      });
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  },

  /**
   * Get specific tag information (not available in API, returns error)
   * @param {string} tagName - Tag name
   * @returns {Promise<Object>} - API response
   */
  async getTag(tagName) {
    try {
      if (!tagName) {
        throw new Error("Tag name is required");
      }

      // This endpoint doesn't exist in the official API
      // We'll try to get tag info by listing all tags and filtering
      const allTags = await Tags.listTags();
      
      if (allTags.ok && allTags.data) {
        const tag = allTags.data.find(t => t.name === tagName);
        if (tag) {
          return {
            ok: true,
            data: tag,
          };
        }
      }

      return {
        ok: false,
        error: "Tag not found",
        code: 404,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  },

  /**
   * Create a tag (not available in API, returns error)
   * @param {Object} tagData - Tag data
   * @param {string} tagData.name - Tag name
   * @param {string} tagData.shortName - Tag short name
   * @param {string} tagData.description - Tag description
   * @returns {Promise<Object>} - API response
   */
  async createTag(tagData) {
    try {
      if (!tagData.name) {
        throw new Error("Tag name is required");
      }

      // This endpoint doesn't exist in the official API
      return {
        ok: false,
        error: "Tag creation is not supported by this API",
        code: 405,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  },

  /**
   * Update a tag (not available in API, returns error)
   * @param {string} tagName - Tag name
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - API response
   */
  async updateTag(tagName, updateData) {
    try {
      if (!tagName) {
        throw new Error("Tag name is required");
      }

      // This endpoint doesn't exist in the official API
      return {
        ok: false,
        error: "Tag updates are not supported by this API",
        code: 405,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  },

  /**
   * Add contacts to tag (not available in API, returns error)
   * @param {string} tagName - Tag name
   * @param {Array<string>} msisdns - Array of MSISDNs
   * @returns {Promise<Object>} - API response
   */
  async addContactsToTag(tagName, msisdns) {
    try {
      if (!tagName) {
        throw new Error("Tag name is required");
      }

      if (!msisdns || !Array.isArray(msisdns)) {
        throw new Error("MSISDNs array is required");
      }

      // This endpoint doesn't exist in the official API
      // Tags are managed through individual contact operations
      return {
        ok: false,
        error: "Bulk tag operations are not supported. Use addTagToContact() for individual contacts.",
        code: 405,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  },

  /**
   * Remove contacts from tag (not available in API, returns error)
   * @param {string} tagName - Tag name
   * @param {Array<string>} msisdns - Array of MSISDNs
   * @returns {Promise<Object>} - API response
   */
  async removeContactsFromTag(tagName, msisdns) {
    try {
      if (!tagName) {
        throw new Error("Tag name is required");
      }

      if (!msisdns || !Array.isArray(msisdns)) {
        throw new Error("MSISDNs array is required");
      }

      // This endpoint doesn't exist in the official API
      // Tags are managed through individual contact operations
      return {
        ok: false,
        error: "Bulk tag operations are not supported. Use removeTagFromContact() for individual contacts.",
        code: 405,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  },
}; 