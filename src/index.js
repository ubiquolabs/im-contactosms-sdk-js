import "dotenv/config";
import { SmsApi } from "./sdk/SmsApi.js";

// Initialize the API client
const api = new SmsApi(
  process.env.API_KEY,
  process.env.API_SECRET,
  process.env.URL
);

/* ===== SIMPLE TESTS LIKE ORIGINAL ===== */

const testSendMessage = async () => {
  console.log("📤 Testing Send Message...");
  console.log("1. Init testSendMessage");
  
  try {
    const response = await api.messages.sendToContact({
      msisdn: "50212345678",
      message: "Test SMS from JavaScript SDK v4",
      id: Date.now(), // Use timestamp to avoid duplicate ID
    });
    
    if (response.ok) {
      console.log("✅ Message sent successfully!");
      console.log("Response:", response.data);
    } else {
      console.log("❌ Error sending message:", response.error);
    }
  } catch (error) {
    console.log("❌ Error sending message:", error.message);
  }
};

const testListMessages = async () => {
  console.log("\n📋 Testing List Messages...");
  console.log("1. Init testListMessages");
  
  try {
    const response = await api.messages.listMessages({
      startDate: "2025-07-01",
      endDate: "2025-07-04",
      limit: 10,
      direction: "MT",
    });
    
    if (response.ok) {
      console.log("✅ Messages retrieved successfully!");
      console.log("Response:", response.data);
    } else {
      console.log("❌ Error listing messages:", response.error);
    }
  } catch (error) {
    console.log("❌ Error listing messages:", error.message);
  }
};

const testListContacts = async () => {
  console.log("\n👥 Testing List Contacts...");
  console.log("1. Init testListContacts");
  
  try {
    const response = await api.contacts.listContacts({
      limit: 10,
    });
    
    if (response.ok) {
      console.log("✅ Contacts retrieved successfully!");
      console.log("Response:", response.data);
    } else {
      console.log("❌ Error listing contacts:", response.error);
    }
  } catch (error) {
    console.log("❌ Error listing contacts:", error.message);
  }
};

const testGetContact = async () => {
  console.log("\n👤 Testing Get Contact...");
  console.log("1. Init testGetContact");
  
  try {
    const response = await api.contacts.getContact("50212345678");
    
    if (response.ok) {
      console.log("✅ Contact retrieved successfully!");
      console.log("Response:", response.data);
    } else {
      console.log("❌ Error getting contact:", response.error);
    }
  } catch (error) {
    console.log("❌ Error getting contact:", error.message);
  }
};

/* ===== MAIN EXECUTION ===== */

const main = async () => {
  console.log("🚀 JavaScript SDK v4 - Simple Tests");
  console.log("===================================");

  try {
    // Run all tests
    await testSendMessage();
    await testListMessages();
    await testListContacts();
    await testGetContact();

    console.log("\n✨ All tests completed!");

  } catch (error) {
    console.error("Main execution error:", error.message);
  }
};

// Run the main function
main();
