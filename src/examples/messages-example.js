import "dotenv/config";
import { SmsApi } from "../sdk/SmsApi.js";

// Initialize the API client
const api = new SmsApi(
  process.env.API_KEY,
  process.env.API_SECRET,
  process.env.URL
);

/**
 * Complete example of message management operations
 */
const messagesExample = async () => {
  console.log("💬 Message Management Example");
  console.log("=============================");

  try {
    // 1. List recent messages
    console.log("\n1. 📋 Listing recent messages...");
    const messages = await api.messages.listMessages({
      startDate: "2024-01-01",
      endDate: new Date().toISOString().split('T')[0], // Today
      limit: 5,
      direction: "MT", // Mobile Terminated (outgoing)
    });

    if (messages.ok) {
      console.log(`✅ Found ${messages.data?.length || 0} messages`);
      messages.data?.forEach((message, index) => {
        console.log(`   ${index + 1}. ${message.message?.substring(0, 50)}... - ${message.msisdn}`);
      });
    } else {
      console.log("❌ Failed to list messages:", messages.data?.error || messages.error);
    }

    // 2. Send message to a specific contact
    console.log("\n2. 📤 Sending message to contact...");
    const sendToContact = await api.messages.sendToContact({
      msisdn: "50212345678",
      message: "Hello! This is a test message from JavaScript SDK v4. 🚀",
      id: `test-${Date.now()}`,
    });

    if (sendToContact.ok) {
      console.log("✅ Message sent successfully!");
      console.log(`   Message ID: ${sendToContact.data?.id || 'N/A'}`);
      console.log(`   Status: ${sendToContact.data?.status || 'N/A'}`);
    } else {
      console.log("❌ Failed to send message:", sendToContact.data?.error || sendToContact.error);
    }

    // 3. Send message to multiple contacts
    console.log("\n3. 📤 Sending message to multiple contacts...");
    const sendToMultiple = await api.messages.sendToMultipleContacts({
      msisdns: ["50212345678", "50287654321"],
      message: "Hello everyone! This is a bulk message from JavaScript SDK v4. 📢",
      id: `bulk-${Date.now()}`,
    });

    if (sendToMultiple.ok) {
      console.log("✅ Bulk message sent successfully!");
      console.log(`   Message ID: ${sendToMultiple.data?.id || 'N/A'}`);
      console.log(`   Recipients: ${sendToMultiple.data?.recipients || 'N/A'}`);
    } else {
      console.log("❌ Failed to send bulk message:", sendToMultiple.data?.error || sendToMultiple.error);
    }

    // 4. Send message to contacts with specific tags
    console.log("\n4. 📤 Sending message to tagged contacts...");
    const sendToTags = await api.messages.sendToTags({
      tags: ["vip", "premium"],
      message: "Special offer for VIP customers! 🎉 Exclusive discount available now.",
      id: `vip-${Date.now()}`,
    });

    if (sendToTags.ok) {
      console.log("✅ Tagged message sent successfully!");
      console.log(`   Message ID: ${sendToTags.data?.id || 'N/A'}`);
      console.log(`   Tags: ${sendToTags.data?.tags || 'N/A'}`);
    } else {
      console.log("❌ Failed to send tagged message:", sendToTags.data?.error || sendToTags.error);
    }

    // 5. Get message status
    console.log("\n5. 📊 Getting message status...");
    const messageStatus = await api.messages.getMessageStatus("test-123");

    if (messageStatus.ok) {
      console.log("✅ Message status retrieved successfully!");
      console.log(`   Status: ${messageStatus.data?.status || 'N/A'}`);
      console.log(`   Delivered: ${messageStatus.data?.delivered || 'N/A'}`);
      console.log(`   Timestamp: ${messageStatus.data?.timestamp || 'N/A'}`);
    } else {
      console.log("❌ Failed to get message status:", messageStatus.data?.error || messageStatus.error);
    }

    // 6. Get delivery reports
    console.log("\n6. 📊 Getting delivery reports...");
    const deliveryReports = await api.messages.getDeliveryReports({
      startDate: "2024-01-01",
      endDate: new Date().toISOString().split('T')[0],
      limit: 5,
    });

    if (deliveryReports.ok) {
      console.log(`✅ Found ${deliveryReports.data?.length || 0} delivery reports`);
      deliveryReports.data?.forEach((report, index) => {
        console.log(`   ${index + 1}. ${report.msisdn} - ${report.status} - ${report.timestamp}`);
      });
    } else {
      console.log("❌ Failed to get delivery reports:", deliveryReports.data?.error || deliveryReports.error);
    }

    // 7. Send a scheduled message (if supported by API)
    console.log("\n7. ⏰ Sending scheduled message...");
    const scheduledMessage = await api.messages.sendToContact({
      msisdn: "50212345678",
      message: "This is a scheduled message! ⏰",
      id: `scheduled-${Date.now()}`,
      scheduledAt: new Date(Date.now() + 60000).toISOString(), // 1 minute from now
    });

    if (scheduledMessage.ok) {
      console.log("✅ Scheduled message created successfully!");
      console.log(`   Message ID: ${scheduledMessage.data?.id || 'N/A'}`);
      console.log(`   Scheduled for: ${scheduledMessage.data?.scheduled_at || 'N/A'}`);
    } else {
      console.log("❌ Failed to schedule message:", scheduledMessage.data?.error || scheduledMessage.error);
    }

    // 8. Get message statistics
    console.log("\n8. 📈 Getting message statistics...");
    const today = new Date().toISOString().split('T')[0];
    const stats = await api.messages.listMessages({
      startDate: today,
      endDate: today,
      limit: 100,
    });

    if (stats.ok) {
      const totalMessages = stats.data?.length || 0;
      const deliveredMessages = stats.data?.filter(m => m.status === 'DELIVERED').length || 0;
      const failedMessages = stats.data?.filter(m => m.status === 'FAILED').length || 0;
      
      console.log("✅ Message statistics retrieved successfully!");
      console.log(`   Total messages today: ${totalMessages}`);
      console.log(`   Delivered: ${deliveredMessages}`);
      console.log(`   Failed: ${failedMessages}`);
      console.log(`   Success rate: ${totalMessages > 0 ? ((deliveredMessages / totalMessages) * 100).toFixed(2) : 0}%`);
    } else {
      console.log("❌ Failed to get message statistics:", stats.data?.error || stats.error);
    }

    console.log("\n✨ Message management example completed!");

  } catch (error) {
    console.error("❌ Message example error:", error.message);
  }
};

// Run the example
messagesExample(); 