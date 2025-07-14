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




}; 