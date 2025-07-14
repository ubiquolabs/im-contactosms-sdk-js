import "dotenv/config";
import { SmsApi } from "../sdk/SmsApi.js";

// Initialize the API client
const api = new SmsApi(
  process.env.API_KEY,
  process.env.API_SECRET,
  process.env.URL
);

const messagesExample = async () => {
  console.log("💬 Messages API Examples");
  console.log("========================");

  try {
    // 1. Get delivery reports
    console.log("\n1. Getting delivery reports...");
    const deliveryReports = await api.messages.getDeliveryReports({
      startDate: "2025-07-01",
      endDate: "2025-07-14",
      limit: 10,
      direction: "MT", // Outgoing messages
    });
    
    if (deliveryReports.ok) {
      console.log(`✅ Found ${deliveryReports.data?.length || 0} delivery reports`);
      console.log("Sample reports:", deliveryReports.data?.slice(0, 2));
    } else {
      console.log("❌ Failed to get delivery reports:", deliveryReports.error);
    }

    // 2. Send message to a specific contact
    console.log("\n2. Sending message to contact...");
    const sendToContact = await api.messages.sendToContact({
      msisdn: "50212345678",
      message: "Hello from JavaScript SDK v4! This is a test message.",
      id: "test-msg-001",
    });
    
    if (sendToContact.ok) {
      console.log("✅ Message sent successfully to contact");
      console.log("Message details:", sendToContact.data);
    } else {
      console.log("❌ Failed to send message to contact:", sendToContact.error);
    }

    // 3. Send message to tags/groups
    console.log("\n3. Sending message to tags...");
    const sendToTags = await api.messages.sendToTags({
      tags: ["customers", "vip"],
      message: "Hello to all contacts in these tags!",
      id: "test-tags-001",
    });
    
    if (sendToTags.ok) {
      console.log("✅ Message sent successfully to tags");
      console.log("Message details:", sendToTags.data);
    } else {
      console.log("❌ Failed to send message to tags:", sendToTags.error);
    }

    // 4. Send message to multiple contacts
    console.log("\n4. Sending message to multiple contacts...");
    const sendToMultiple = await api.messages.sendToMultipleContacts({
      msisdns: ["50212345678", "50287654321"],
      message: "Hello to multiple contacts!",
      id: "test-multiple-001",
    });
    
    if (sendToMultiple.ok) {
      console.log("✅ Messages sent successfully to multiple contacts");
      console.log(`   Total: ${sendToMultiple.data.total}`);
      console.log(`   Successful: ${sendToMultiple.data.success}`);
      console.log(`   Failed: ${sendToMultiple.data.failed}`);
      
      if (sendToMultiple.data.results && sendToMultiple.data.results.length > 0) {
        console.log("   Results:", sendToMultiple.data.results.slice(0, 2));
      }
    } else {
      console.log("❌ Failed to send messages to multiple contacts:", sendToMultiple.error);
    }

    // 5. Get delivery reports with different filters
    console.log("\n5. Getting delivery reports with filters...");
    const filteredReports = await api.messages.getDeliveryReports({
      startDate: "2025-07-10",
      endDate: "2025-07-14",
      limit: 5,
      direction: "MT",
      msisdn: "50431400448", // Filter by specific MSISDN
    });
    
    if (filteredReports.ok) {
      console.log("✅ Filtered delivery reports retrieved successfully");
      console.log(`   Found ${filteredReports.data?.length || 0} reports for MSISDN 50431400448`);
      console.log("Sample filtered reports:", filteredReports.data?.slice(0, 2));
    } else {
      console.log("❌ Failed to get filtered delivery reports:", filteredReports.error);
    }

    console.log("\n✨ Messages example completed!");

  } catch (error) {
    console.error("❌ Error in messages example:", error.message);
  }
};

// Run the example
messagesExample(); 