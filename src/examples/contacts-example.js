import "dotenv/config";
import { SmsApi } from "../sdk/SmsApi.js";

// Initialize the API client
const api = new SmsApi(
  process.env.API_KEY,
  process.env.API_SECRET,
  process.env.URL
);

/**
 * Complete example of contact management operations
 */
const contactsExample = async () => {
  console.log("📞 Contact Management Example");
  console.log("=============================");

  try {
    // 1. List all contacts
    console.log("\n1. 📋 Listing contacts...");
    const contacts = await api.contacts.listContacts({
      limit: 10,
      status: "SUSCRIBED",
    });

    if (contacts.ok) {
      console.log(`✅ Found ${contacts.data?.length || 0} contacts`);
      contacts.data?.forEach((contact, index) => {
        console.log(`   ${index + 1}. ${contact.full_name || 'No name'} - ${contact.msisdn}`);
      });
    } else {
      console.log("❌ Failed to list contacts:", contacts.data?.error || contacts.error);
    }

    // 2. Create a new contact
    console.log("\n2. ➕ Creating a new contact...");
    const newContact = await api.contacts.createContact({
      phoneNumber: "87654321",
      countryCode: "502",
      firstName: "Alice",
      lastName: "Johnson",
      customField1: "VIP Customer",
      customField2: "Premium",
    });

    if (newContact.ok) {
      console.log("✅ Contact created successfully!");
      console.log(`   MSISDN: ${newContact.data?.msisdn}`);
      console.log(`   Name: ${newContact.data?.first_name} ${newContact.data?.last_name}`);
    } else {
      console.log("❌ Failed to create contact:", newContact.data?.error || newContact.error);
    }

    // 3. Get a specific contact
    console.log("\n3. 🔍 Getting specific contact...");
    const contact = await api.contacts.getContact("50287654321");

    if (contact.ok) {
      console.log("✅ Contact retrieved successfully!");
      console.log(`   Name: ${contact.data?.first_name} ${contact.data?.last_name}`);
      console.log(`   Phone: ${contact.data?.phone_number}`);
      console.log(`   Status: ${contact.data?.status}`);
    } else {
      console.log("❌ Failed to get contact:", contact.data?.error || contact.error);
    }

    // 4. Update the contact
    console.log("\n4. ✏️ Updating contact...");
    const updatedContact = await api.contacts.updateContact("50287654321", {
      firstName: "Alice",
      lastName: "Smith",
      customField1: "Updated VIP Customer",
      customField3: "New field",
    });

    if (updatedContact.ok) {
      console.log("✅ Contact updated successfully!");
      console.log(`   New name: ${updatedContact.data?.first_name} ${updatedContact.data?.last_name}`);
    } else {
      console.log("❌ Failed to update contact:", updatedContact.data?.error || updatedContact.error);
    }

    // 5. Get contact groups
    console.log("\n5. 🏷️ Getting contact groups...");
    const groups = await api.contacts.getContactGroups("50287654321");

    if (groups.ok) {
      console.log("✅ Contact groups retrieved successfully!");
      console.log(`   Groups: ${groups.data?.length || 0} groups found`);
      groups.data?.forEach((group, index) => {
        console.log(`   ${index + 1}. ${group.name} (${group.short_name})`);
      });
    } else {
      console.log("❌ Failed to get contact groups:", groups.data?.error || groups.error);
    }

    // 6. Add a tag to the contact
    console.log("\n6. 🏷️ Adding tag to contact...");
    const addTag = await api.contacts.addTagToContact("50287654321", "vip");

    if (addTag.ok) {
      console.log("✅ Tag added successfully!");
    } else {
      console.log("❌ Failed to add tag:", addTag.data?.error || addTag.error);
    }

    // 7. Remove a tag from the contact
    console.log("\n7. 🗑️ Removing tag from contact...");
    const removeTag = await api.contacts.removeTagFromContact("50287654321", "vip");

    if (removeTag.ok) {
      console.log("✅ Tag removed successfully!");
    } else {
      console.log("❌ Failed to remove tag:", removeTag.data?.error || removeTag.error);
    }

    // 8. Delete the contact (cleanup)
    console.log("\n8. 🗑️ Deleting contact (cleanup)...");
    const deleteContact = await api.contacts.deleteContact("50287654321");

    if (deleteContact.ok) {
      console.log("✅ Contact deleted successfully!");
    } else {
      console.log("❌ Failed to delete contact:", deleteContact.data?.error || deleteContact.error);
    }

    console.log("\n✨ Contact management example completed!");

  } catch (error) {
    console.error("❌ Contact example error:", error.message);
  }
};

// Run the example
contactsExample(); 