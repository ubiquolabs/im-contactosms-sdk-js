import "dotenv/config";
import { SmsApi } from "./sdk/SmsApi.js";

// Initialize the API client
const api = new SmsApi(
  process.env.API_KEY,
  process.env.API_SECRET,
  process.env.URL
);

/* ===== CONTACTS EXAMPLES ===== */

const testContacts = async () => {
  console.log("\n=== CONTACTS TESTS ===");

  try {
    // 1. List contacts
    console.log("1. Testing listContacts...");
    const contactsResponse = await api.contacts.listContacts({
      limit: 5,
      status: "SUSCRIBED",
    });
    console.log("Contacts response:", contactsResponse.ok ? "SUCCESS" : "FAILED");

    // 2. Create a contact
    console.log("\n2. Testing createContact...");
    const createResponse = await api.contacts.createContact({
      phoneNumber: "12345678",
      countryCode: "502",
      firstName: "John",
      lastName: "Doe",
      customField1: "Test field",
    });
    console.log("Create contact response:", createResponse.ok ? "SUCCESS" : "FAILED");

    // 3. Get specific contact
    console.log("\n3. Testing getContact...");
    const getContactResponse = await api.contacts.getContact("50212345678");
    console.log("Get contact response:", getContactResponse.ok ? "SUCCESS" : "FAILED");

    // 4. Update contact
    console.log("\n4. Testing updateContact...");
    const updateResponse = await api.contacts.updateContact("50212345678", {
      firstName: "Jane",
      lastName: "Smith",
    });
    console.log("Update contact response:", updateResponse.ok ? "SUCCESS" : "FAILED");

    // 5. Get contact groups
    console.log("\n5. Testing getContactGroups...");
    const groupsResponse = await api.contacts.getContactGroups("50212345678");
    console.log("Get contact groups response:", groupsResponse.ok ? "SUCCESS" : "FAILED");

  } catch (error) {
    console.error("Contacts test error:", error.message);
  }
};

/* ===== MESSAGES EXAMPLES ===== */

const testMessages = async () => {
  console.log("\n=== MESSAGES TESTS ===");

  try {
    // 1. List messages
    console.log("1. Testing listMessages...");
    const messagesResponse = await api.messages.listMessages({
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      limit: 5,
      direction: "MT",
    });
    console.log("List messages response:", messagesResponse.ok ? "SUCCESS" : "FAILED");

    // 2. Send message to contact
    console.log("\n2. Testing sendToContact...");
    const sendResponse = await api.messages.sendToContact({
      msisdn: "50212345678",
      message: "Hello from JavaScript SDK v4!",
      id: "test-123",
    });
    console.log("Send message response:", sendResponse.ok ? "SUCCESS" : "FAILED");

    // 3. Send message to tags
    console.log("\n3. Testing sendToTags...");
    const sendToTagsResponse = await api.messages.sendToTags({
      tags: ["test", "demo"],
      message: "Hello to all tagged contacts!",
      id: "test-tags-123",
    });
    console.log("Send to tags response:", sendToTagsResponse.ok ? "SUCCESS" : "FAILED");

    // 4. Send to multiple contacts
    console.log("\n4. Testing sendToMultipleContacts...");
    const sendMultipleResponse = await api.messages.sendToMultipleContacts({
      msisdns: ["50212345678", "50287654321"],
      message: "Hello to multiple contacts!",
      id: "test-multiple-123",
    });
    console.log("Send to multiple contacts response:", sendMultipleResponse.ok ? "SUCCESS" : "FAILED");

    // 5. Get delivery reports
    console.log("\n5. Testing getDeliveryReports...");
    const reportsResponse = await api.messages.getDeliveryReports({
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      limit: 5,
    });
    console.log("Delivery reports response:", reportsResponse.ok ? "SUCCESS" : "FAILED");

  } catch (error) {
    console.error("Messages test error:", error.message);
  }
};

/* ===== TAGS EXAMPLES ===== */

const testTags = async () => {
  console.log("\n=== TAGS TESTS ===");

  try {
    // 1. List tags
    console.log("1. Testing listTags...");
    const tagsResponse = await api.tags.listTags({
      limit: 5,
      shortResults: 0,
    });
    console.log("List tags response:", tagsResponse.ok ? "SUCCESS" : "FAILED");

    // 2. Create a tag
    console.log("\n2. Testing createTag...");
    const createTagResponse = await api.tags.createTag({
      name: "JavaScript SDK Test",
      shortName: "js-test",
      description: "Tag created by JavaScript SDK v4",
    });
    console.log("Create tag response:", createTagResponse.ok ? "SUCCESS" : "FAILED");

    // 3. Get specific tag
    console.log("\n3. Testing getTag...");
    const getTagResponse = await api.tags.getTag("js-test");
    console.log("Get tag response:", getTagResponse.ok ? "SUCCESS" : "FAILED");

    // 4. Get tag contacts
    console.log("\n4. Testing getTagContacts...");
    const tagContactsResponse = await api.tags.getTagContacts("js-test", {
      limit: 5,
      status: "SUSCRIBED",
    });
    console.log("Get tag contacts response:", tagContactsResponse.ok ? "SUCCESS" : "FAILED");

    // 5. Add contacts to tag
    console.log("\n5. Testing addContactsToTag...");
    const addContactsResponse = await api.tags.addContactsToTag("js-test", [
      "50212345678",
      "50287654321",
    ]);
    console.log("Add contacts to tag response:", addContactsResponse.ok ? "SUCCESS" : "FAILED");

    // 6. Update tag
    console.log("\n6. Testing updateTag...");
    const updateTagResponse = await api.tags.updateTag("js-test", {
      name: "Updated JavaScript SDK Test",
      description: "Updated description",
    });
    console.log("Update tag response:", updateTagResponse.ok ? "SUCCESS" : "FAILED");

  } catch (error) {
    console.error("Tags test error:", error.message);
  }
};

/* ===== MAIN EXECUTION ===== */

const main = async () => {
  console.log("🚀 JavaScript SDK v4 - Enhanced SMS API");
  console.log("=====================================");

  try {
    // Test API connection
    console.log("\nTesting API connection...");
    const connectionTest = await api.testConnection();
    console.log("Connection test:", connectionTest.success ? "✅ SUCCESS" : "❌ FAILED");
    
    if (!connectionTest.success) {
      console.error("Connection failed:", connectionTest.error);
      return;
    }

    // Run all tests
    await testContacts();
    await testMessages();
    await testTags();

    // Get API stats
    console.log("\n=== API STATISTICS ===");
    const stats = await api.getStats();
    console.log("API stats:", stats.success ? "✅ SUCCESS" : "❌ FAILED");

    console.log("\n✨ All tests completed!");

  } catch (error) {
    console.error("Main execution error:", error.message);
  }
};

// Run the main function
main();
