import "dotenv/config";
import { Messages } from "./sdk/messages.js";
import { Contacts } from "./sdk/contacts.js";

// Set environment variables like the original
process.env.API_KEY = process.env.API_KEY;
process.env.API_SECRET = process.env.API_SECRET;
process.env.URL = process.env.URL;

console.log("🔍 Testing Original Structure");
console.log("============================");

/* MENSAJES */

const testSendMessage = async (body) => {
  try {
    console.log("1. Init testSendMessage");
    const response = await Messages.sendToContact(body);
    console.log("✅ Message sent successfully!");
    console.log("Response:", response.data);
  } catch (error) {
    console.log("❌ Error sending message:", error.response?.data || error.message);
  }
};

const testListMessages = async (params) => {
  try {
    console.log("1. Init testListMessages");
    const response = await Messages.listMessages(params);
    console.log("✅ Messages retrieved successfully!");
    console.log("Response:", response.data);
  } catch (error) {
    console.log("❌ Error listing messages:", error.response?.data || error.message);
  }
};

/* CONTACTOS */

const testListContacts = async (params) => {
  try {
    console.log("1. Init testListContacts");
    const response = await Contacts.listContacts(params);
    console.log("✅ Contacts retrieved successfully!");
    console.log("Response:", response.data);
  } catch (error) {
    console.log("❌ Error listing contacts:", error.response?.data || error.message);
  }
};

const testGetContact = async (msisdn) => {
  try {
    console.log("1. Init testGetContact");
    const response = await Contacts.getContact(msisdn);
    console.log("✅ Contact retrieved successfully!");
    console.log("Response:", response.data);
  } catch (error) {
    console.log("❌ Error getting contact:", error.response?.data || error.message);
  }
};

// Run tests
console.log("\n📤 Testing Send Message...");
testSendMessage({
  msisdn: "50245858369",
  message: "Test SMS from JavaScript SDK v4",
  id: 3159878978,
});

console.log("\n📋 Testing List Messages...");
testListMessages({
  limit: 10,
  direction: "MT",
  startDate: "2025-07-01 00:00:00",
  endDate: "2025-07-03 23:00:00",
  delivery_status_enable: "true"
});

console.log("\n👥 Testing List Contacts...");
testListContacts({ limit: 10 });

console.log("\n👤 Testing Get Contact...");
testGetContact("50245858369"); 