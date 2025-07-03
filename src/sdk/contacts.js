import { request } from "./helper.js";
import { validateContactStatus, validateInteger } from "./helper.js";

export const Contacts = {
  /**
   * Get contacts with optional filtering
   * @param {Object} params - Query parameters
   * @param {string} params.query - Search query (phone number or name)
   * @param {number} params.limit - Number of results to return
   * @param {number} params.start - Starting offset
   * @param {string} params.status - Contact status filter
   * @param {number} params.shortResults - Return short results (0 or 1)
   * @returns {Promise<Object>} - API response
   */
  listContacts: async (params = {}) => {
    try {
      // Validate parameters
      validateContactStatus(params.status);
      validateInteger(params.start);
      validateInteger(params.limit);
      validateInteger(params.shortResults, true);

      const response = await request({
        type: "get",
        endpoint: "contacts",
        params,
      });

      return response;
    } catch (error) {
      console.error("Error listing contacts:", error.message);
      throw error;
    }
  },

  /**
   * Get a specific contact by MSISDN
   * @param {string} msisdn - Contact's MSISDN
   * @returns {Promise<Object>} - API response
   */
  getContact: async (msisdn) => {
    try {
      if (!msisdn) {
        throw new Error("MSISDN is required");
      }

      const response = await request({
        type: "get",
        endpoint: `contacts/${msisdn}`,
        params: { msisdn },
      });

      return response;
    } catch (error) {
      console.error("Error getting contact:", error.message);
      throw error;
    }
  },

  /**
   * Get contact groups
   * @param {string} msisdn - Contact's MSISDN
   * @returns {Promise<Object>} - API response
   */
  getContactGroups: async (msisdn) => {
    try {
      if (!msisdn) {
        throw new Error("MSISDN is required");
      }

      const response = await request({
        type: "get",
        endpoint: `contacts/${msisdn}/groups`,
        params: { msisdn },
      });

      return response;
    } catch (error) {
      console.error("Error getting contact groups:", error.message);
      throw error;
    }
  },

  /**
   * Create a new contact
   * @param {Object} contactData - Contact data
   * @param {string} contactData.phoneNumber - Phone number
   * @param {string} contactData.countryCode - Country code
   * @param {string} contactData.firstName - First name (optional)
   * @param {string} contactData.lastName - Last name (optional)
   * @param {string} contactData.customField1 - Custom field 1 (optional)
   * @param {string} contactData.customField2 - Custom field 2 (optional)
   * @param {string} contactData.customField3 - Custom field 3 (optional)
   * @param {string} contactData.customField4 - Custom field 4 (optional)
   * @param {string} contactData.customField5 - Custom field 5 (optional)
   * @returns {Promise<Object>} - API response
   */
  createContact: async (contactData) => {
    try {
      const { phoneNumber, countryCode, firstName, lastName, customField1, customField2, customField3, customField4, customField5 } = contactData;

      if (!phoneNumber || !countryCode) {
        throw new Error("Phone number and country code are required");
      }

      const msisdn = countryCode + phoneNumber;
      const body = {
        msisdn,
        phone_number: phoneNumber,
        country_code: countryCode,
        first_name: firstName,
        last_name: lastName,
        custom_field_1: customField1,
        custom_field_2: customField2,
        custom_field_3: customField3,
        custom_field_4: customField4,
        custom_field_5: customField5,
      };

      const response = await request({
        type: "post",
        endpoint: `contacts/${msisdn}`,
        params: { msisdn },
        data: body,
      });

      return response;
    } catch (error) {
      console.error("Error creating contact:", error.message);
      throw error;
    }
  },

  /**
   * Update an existing contact
   * @param {string} msisdn - Contact's MSISDN
   * @param {Object} contactData - Contact data to update
   * @param {string} contactData.phoneNumber - Phone number (optional)
   * @param {string} contactData.countryCode - Country code (optional)
   * @param {string} contactData.firstName - First name (optional)
   * @param {string} contactData.lastName - Last name (optional)
   * @param {string} contactData.customField1 - Custom field 1 (optional)
   * @param {string} contactData.customField2 - Custom field 2 (optional)
   * @param {string} contactData.customField3 - Custom field 3 (optional)
   * @param {string} contactData.customField4 - Custom field 4 (optional)
   * @param {string} contactData.customField5 - Custom field 5 (optional)
   * @returns {Promise<Object>} - API response
   */
  updateContact: async (msisdn, contactData) => {
    try {
      if (!msisdn) {
        throw new Error("MSISDN is required");
      }

      const { phoneNumber, countryCode, firstName, lastName, customField1, customField2, customField3, customField4, customField5 } = contactData;

      const body = {
        msisdn,
        phone_number: phoneNumber,
        country_code: countryCode,
        first_name: firstName,
        last_name: lastName,
        custom_field_1: customField1,
        custom_field_2: customField2,
        custom_field_3: customField3,
        custom_field_4: customField4,
        custom_field_5: customField5,
      };

      const response = await request({
        type: "put",
        endpoint: `contacts/${msisdn}`,
        params: { msisdn },
        data: body,
      });

      return response;
    } catch (error) {
      console.error("Error updating contact:", error.message);
      throw error;
    }
  },

  /**
   * Delete a contact
   * @param {string} msisdn - Contact's MSISDN
   * @returns {Promise<Object>} - API response
   */
  deleteContact: async (msisdn) => {
    try {
      if (!msisdn) {
        throw new Error("MSISDN is required");
      }

      const response = await request({
        type: "delete",
        endpoint: `contacts/${msisdn}`,
        params: { msisdn },
      });

      return response;
    } catch (error) {
      console.error("Error deleting contact:", error.message);
      throw error;
    }
  },

  /**
   * Add a tag to a contact
   * @param {string} msisdn - Contact's MSISDN
   * @param {string} tagName - Tag name to add
   * @returns {Promise<Object>} - API response
   */
  addTagToContact: async (msisdn, tagName) => {
    try {
      if (!msisdn || !tagName) {
        throw new Error("MSISDN and tag name are required");
      }

      const response = await request({
        type: "post",
        endpoint: `contacts/${msisdn}/tags/${tagName}`,
        params: {
          tag_name: tagName,
          msisdn,
        },
      });

      return response;
    } catch (error) {
      console.error("Error adding tag to contact:", error.message);
      throw error;
    }
  },

  /**
   * Remove a tag from a contact
   * @param {string} msisdn - Contact's MSISDN
   * @param {string} tagName - Tag name to remove
   * @returns {Promise<Object>} - API response
   */
  removeTagFromContact: async (msisdn, tagName) => {
    try {
      if (!msisdn || !tagName) {
        throw new Error("MSISDN and tag name are required");
      }

      const response = await request({
        type: "delete",
        endpoint: `contacts/${msisdn}/tags/${tagName}`,
        params: {
          tag_name: tagName,
          msisdn,
        },
      });

      return response;
    } catch (error) {
      console.error("Error removing tag from contact:", error.message);
      throw error;
    }
  },
};
