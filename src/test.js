import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { SmsApi } from './sdk/SmsApi.js';

// Initialize the API client
const api = new SmsApi(
  process.env.API_KEY,
  process.env.API_SECRET,
  process.env.URL
);

console.log("Testing SMS API SDK");
console.log("======================");

// Test getDeliveryReports
const testGetDeliveryReports = async () => {
  try {
    console.log("\n Testing getDeliveryReports...");
    
    const response = await api.messages.getDeliveryReports({
      startDate: "2025-07-01",
      endDate: new Date().toISOString().split('T')[0],
      limit: 5,
      direction: "MT"
    });
    
    console.log(" getDeliveryReports response:");
    console.log("Status:", response.status);
    console.log("Code:", response.code);
    console.log("OK:", response.ok);
    console.log("Number of reports:", response.data ? response.data.length : 0);
    
    if (response.data && response.data.length > 0) {
      console.log("\n Sample reports:");
      response.data.slice(0, 3).forEach((report, index) => {
        console.log(`  Report ${index + 1}:`);
        console.log(`    MSISDN: ${report.msisdn}`);
        console.log(`    Status: ${report.status}`);
        console.log(`    Message ID: ${report.message_id || 'N/A'}`);
        console.log(`    Timestamp: ${report.timestamp || 'N/A'}`);
        console.log(`    Direction: ${report.direction || 'N/A'}`);
        console.log(`    Short Code: ${report.short_code || 'N/A'}`);
      });
    }
    
    return response;
  } catch (error) {
    console.log("Error: Error in getDeliveryReports:", error.message);
    throw error;
  }
};

// Test send message
const testSendMessage = async () => {
  try {
    console.log("\n Testing send message...");
    
    // Get a valid MSISDN from delivery reports
    const deliveryResponse = await api.messages.getDeliveryReports({
      startDate: "2025-07-01",
      endDate: new Date().toISOString().split('T')[0],
      limit: 1,
      direction: "MT"
    });
    
    let testMsisdn = "50212345678"; // Default fallback
    
    if (deliveryResponse.ok && deliveryResponse.data && deliveryResponse.data.length > 0) {
      testMsisdn = deliveryResponse.data[0].msisdn;
      console.log(`Using MSISDN from reports: ${testMsisdn}`);
    }
    
    const response = await api.messages.sendToContact({
      msisdn: testMsisdn,
      message: "Test message from SDK - " + new Date().toISOString(),
      id: Date.now(),
    });
    
    console.log(" Message sent successfully!");
    console.log("Response:", response.data);
    
    return response;
  } catch (error) {
    console.log("Error: Error sending message:", error.message);
    if (error.response?.data) {
      console.log("Error details:", error.response.data);
    }
    return null;
  }
};

// Main test function
const runTests = async () => {
  try {
    // Test 1: getDeliveryReports
    await testGetDeliveryReports();
    
    // Test 2: Send message
    await testSendMessage();
    
    console.log("\n All tests completed successfully!");
    
  } catch (error) {
    console.log("\n Test sequence failed:", error.message);
  }
};

// Run the tests
runTests(); 