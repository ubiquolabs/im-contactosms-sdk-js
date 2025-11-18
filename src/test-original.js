import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables FIRST, before any SDK modules are imported.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// NOW, import the SDK modules. They will correctly initialize with the loaded environment variables.
import { SmsApi } from './sdk/SmsApi.js';


// Initialize the API client
const api = new SmsApi(
  process.env.API_KEY,
  process.env.API_SECRET,
  process.env.URL
);

console.log("Testing Original Structure");
console.log("============================");

/* MENSAJES */

const testSendMessage = async (body) => {
  try {
    console.log("1. Init testSendMessage");
    const response = await api.messages.sendToContact(body);
    console.log("Success: Message sent successfully!");
    console.log("Response:", response.data);
  } catch (error) {
    console.log("Error: Error sending message:", error.response?.data || error.message);
  }
};

const testListMessages = async (params) => {
  try {
    console.log("1. Init testListMessages");
    const response = await api.messages.listMessages(params);
    console.log("Success: Messages retrieved successfully!");
    console.log("Response:", response.data);
  } catch (error) {
    console.log("Error: Error listing messages:", error.response?.data || error.message);
  }
};

/* CONTACTOS */

const testListContacts = async (params) => {
  try {
    console.log("1. Init testListContacts");
    const response = await api.contacts.listContacts(params);
    console.log("Success: Contacts retrieved successfully!");
    console.log("Response:", response.data);
  } catch (error) {
    console.log("Error: Error listing contacts:", error.response?.data || error.message);
  }
};

const testGetContact = async (msisdn) => {
  try {
    console.log("1. Init testGetContact");
    const response = await api.contacts.getContact(msisdn);
    console.log("Success: Contact retrieved successfully!");
    console.log("Response:", response.data);
  } catch (error) {
    console.log("Error: Error getting contact:", error.response?.data || error.message);
  }
};

// Asynchronous IIFE to run tests sequentially
(async () => {
  console.log("\n Testing Send Message...");
  await testSendMessage({
    msisdn: "50212345678",
    message: "Test SMS from JavaScript SDK v4",
    id: Date.now(), // Use timestamp to avoid duplicate ID
  });

  console.log("\nTesting List Messages...");
  await testListMessages({
    limit: 10,
    direction: "MT",
    startDate: "2025-07-01 00:00:00",
    endDate: "2025-07-03 23:00:00",
    delivery_status_enable: "true"
  });

  console.log("\n Testing List Contacts...");
  await testListContacts({ limit: 10 });

  console.log("\n Testing Get Contact...");
  await testGetContact("50212345678");
})(); 