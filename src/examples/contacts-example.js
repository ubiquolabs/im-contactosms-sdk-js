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
  console.log("📞 Contacts API Examples");
  console.log("=======================");

  try {
    // 1. List contacts with filters
    console.log("\n1. Listing contacts...");
    const contacts = await api.contacts.listContacts({
      limit: 10,
      status: "SUBSCRIBED",
      query: "12345678", // Search by phone number or name
    });
    
    if (contacts.ok) {
      console.log(`✅ Found ${contacts.data?.length || 0} contacts`);
      console.log("Sample contacts:", contacts.data?.slice(0, 2));
    } else {
      console.log("❌ Failed to list contacts:", contacts.error);
    }

    // 2. Create a new contact
    console.log("\n2. Creating a new contact...");
    const newContact = await api.contacts.createContact({
      phoneNumber: "12345678",
      countryCode: "502",
      firstName: "John",
      lastName: "Doe",
    });
    
    if (newContact.ok) {
      console.log("✅ Contact created successfully");
      console.log("Contact data:", newContact.data);
    } else {
      console.log("❌ Failed to create contact:", newContact.error);
    }

    // 3. Get specific contact
    console.log("\n3. Getting contact details...");
    const contact = await api.contacts.getContact("50212345678");
    
    if (contact.ok) {
      console.log("✅ Contact retrieved successfully");
      console.log("Contact details:", contact.data);
    } else {
      console.log("❌ Failed to get contact:", contact.error);
    }

    // 4. Update contact
    console.log("\n4. Updating contact...");
    const updatedContact = await api.contacts.updateContact("50212345678", {
      firstName: "Jane",
      lastName: "Smith",
    });
    
    if (updatedContact.ok) {
      console.log("✅ Contact updated successfully");
      console.log("Updated contact:", updatedContact.data);
    } else {
      console.log("❌ Failed to update contact:", updatedContact.error);
    }

    // 5. Get contact groups (alternative to tags)
    console.log("\n5. Getting contact groups...");
    const contactGroups = await api.contacts.getContactGroups("50212345678");
    
    if (contactGroups.ok) {
      console.log("✅ Contact groups retrieved successfully");
      console.log("Contact groups:", contactGroups.data);
    } else {
      console.log("❌ Failed to get contact groups:", contactGroups.error);
    }

    // 6. Add tag to contact
    console.log("\n6. Adding tag to contact...");
    const addTag = await api.contacts.addTagToContact("50212345678", "customers");
    
    if (addTag.ok) {
      console.log("✅ Tag added successfully");
      console.log("Updated contact:", addTag.data);
    } else {
      console.log("❌ Failed to add tag:", addTag.error);
    }

    // 7. Remove tag from contact
    console.log("\n7. Removing tag from contact...");
    const removeTag = await api.contacts.removeTagFromContact("50212345678", "customers");
    
    if (removeTag.ok) {
      console.log("✅ Tag removed successfully");
    } else {
      console.log("❌ Failed to remove tag:", removeTag.error);
    }

    // 8. Delete contact (commented out to avoid accidental deletion)
    /*
    console.log("\n8. Deleting contact...");
    const deleteResult = await api.contacts.deleteContact("50212345678");
    
    if (deleteResult.ok) {
      console.log("✅ Contact deleted successfully");
    } else {
      console.log("❌ Failed to delete contact:", deleteResult.error);
    }
    */

    console.log("\n✨ Contact management example completed!");

  } catch (error) {
    console.error("❌ Error in contacts example:", error.message);
  }
};

// Run the example
contactsExample(); 