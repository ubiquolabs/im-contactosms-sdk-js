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
    // 1. List messages with filters
    console.log("\n1. Listing messages...");
    const messages = await api.messages.listMessages({
      startDate: "2025-07-01",
      endDate: "2025-07-04",
      limit: 10,
      direction: "MT", // Outgoing messages
    });
    
    if (messages.ok) {
      console.log(`✅ Found ${messages.data?.length || 0} messages`);
      console.log("Sample messages:", messages.data?.slice(0, 2));
    } else {
      console.log("❌ Failed to list messages:", messages.error);
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

    // 5. Get message status by ID (if we have a message ID)
    if (sendToContact.ok && sendToContact.data?.message_id) {
      console.log("\n5. Getting message status...");
      const messageStatus = await api.messages.getMessageStatus(sendToContact.data.message_id);
      
      if (messageStatus.ok) {
        console.log("✅ Message status retrieved successfully");
        console.log("Message status:", messageStatus.data);
      } else {
        console.log("❌ Failed to get message status:", messageStatus.error);
      }
    }

    // 6. Get delivery reports (using messages list with delivery status)
    console.log("\n6. Getting delivery reports...");
    const deliveryReports = await api.messages.listMessages({
      startDate: "2025-07-01",
      endDate: "2025-07-04",
      limit: 10,
      delivery_status_enable: true,
    });
    
    if (deliveryReports.ok) {
      console.log("✅ Delivery reports retrieved successfully");
      console.log(`   Found ${deliveryReports.data?.length || 0} messages with delivery status`);
      console.log("Sample reports:", deliveryReports.data?.slice(0, 2));
    } else {
      console.log("❌ Failed to get delivery reports:", deliveryReports.error);
    }

    // 7. List incoming messages (MO)
    console.log("\n7. Listing incoming messages...");
    const incomingMessages = await api.messages.listMessages({
      startDate: "2025-07-01",
      endDate: "2025-07-04",
      limit: 5,
      direction: "MO", // Incoming messages
    });
    
    if (incomingMessages.ok) {
      console.log("✅ Incoming messages retrieved successfully");
      console.log(`   Found ${incomingMessages.data?.length || 0} incoming messages`);
    } else {
      console.log("❌ Failed to get incoming messages:", incomingMessages.error);
    }

    console.log("\n✨ Messages example completed!");

  } catch (error) {
    console.error("❌ Error in messages example:", error.message);
  }
};

// Run the example
messagesExample(); 