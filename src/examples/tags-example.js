import "dotenv/config";
import { SmsApi } from "../sdk/SmsApi.js";

// Initialize the API client
const api = new SmsApi(
  process.env.API_KEY,
  process.env.API_SECRET,
  process.env.URL
);

const tagsExample = async () => {
  console.log("🏷️ Tags API Examples");
  console.log("====================");

  try {
    // 1. List all tags
    console.log("\n1. Listing all tags...");
    const allTags = await api.tags.listTags();
    
    if (allTags.ok) {
      console.log(`✅ Found ${allTags.data?.length || 0} tags`);
      console.log("All tags:", allTags.data);
    } else {
      console.log("❌ Failed to list tags:", allTags.error);
    }

    // 2. Search tags by name
    console.log("\n2. Searching tags...");
    const searchTags = await api.tags.listTags({
      search: "customers",
    });
    
    if (searchTags.ok) {
      console.log(`✅ Found ${searchTags.data?.length || 0} matching tags`);
      console.log("Matching tags:", searchTags.data);
    } else {
      console.log("❌ Failed to search tags:", searchTags.error);
    }

    // 3. Get contacts in a specific tag
    console.log("\n3. Getting contacts in tag...");
    const tagContacts = await api.tags.getTagContacts("customers", {
      limit: 10,
    });
    
    if (tagContacts.ok) {
      console.log(`✅ Found ${tagContacts.data?.length || 0} contacts in tag 'customers'`);
      console.log("Tag contacts:", tagContacts.data?.slice(0, 2));
    } else {
      console.log("❌ Failed to get tag contacts:", tagContacts.error);
    }

    // 4. Add tag to a contact
    console.log("\n4. Adding tag to contact...");
    const addTag = await api.contacts.addTagToContact("50212345678", "customers");
    
    if (addTag.ok) {
      console.log("✅ Tag added successfully to contact");
      console.log("Updated contact:", addTag.data);
    } else {
      console.log("❌ Failed to add tag to contact:", addTag.error);
    }

    // 5. Remove tag from a contact
    console.log("\n5. Removing tag from contact...");
    const removeTag = await api.contacts.removeTagFromContact("50212345678", "customers");
    
    if (removeTag.ok) {
      console.log("✅ Tag removed successfully from contact");
    } else {
      console.log("❌ Failed to remove tag from contact:", removeTag.error);
    }

    // 6. Get contact groups (alternative to tags)
    console.log("\n6. Getting contact groups...");
    const contactGroups = await api.contacts.getContactGroups("50212345678");
    
    if (contactGroups.ok) {
      console.log("✅ Contact groups retrieved successfully");
      console.log("Contact groups:", contactGroups.data);
    } else {
      console.log("❌ Failed to get contact groups:", contactGroups.error);
    }

    // 7. Try to create a tag (not supported by API)
    console.log("\n7. Trying to create a tag (not supported)...");
    const createTag = await api.tags.createTag({
      name: "Test Tag",
      shortName: "test",
      description: "Test tag description",
    });
    
    if (createTag.ok) {
      console.log("✅ Tag created successfully");
    } else {
      console.log("❌ Tag creation failed (expected):", createTag.error);
    }

    // 8. Try to update a tag (not supported by API)
    console.log("\n8. Trying to update a tag (not supported)...");
    const updateTag = await api.tags.updateTag("contactos1", {
      name: "Updated Tag Name",
      description: "Updated description",
    });
    
    if (updateTag.ok) {
      console.log("✅ Tag updated successfully");
    } else {
      console.log("❌ Tag update failed (expected):", updateTag.error);
    }

    // 9. Try to add multiple contacts to tag (not supported by API)
    console.log("\n9. Trying to add multiple contacts to tag (not supported)...");
    const addMultiple = await api.tags.addContactsToTag("customers", [
      "50212345678",
      "50287654321",
    ]);
    
    if (addMultiple.ok) {
      console.log("✅ Multiple contacts added to tag successfully");
    } else {
      console.log("❌ Multiple contacts addition failed (expected):", addMultiple.error);
    }

    // 10. Delete a tag (if it exists)
    console.log("\n10. Deleting a tag...");
    const deleteTag = await api.tags.deleteTag("test-tag");
    
    if (deleteTag.ok) {
      console.log("✅ Tag deleted successfully");
    } else {
      console.log("❌ Failed to delete tag:", deleteTag.error);
    }

    console.log("\n✨ Tags example completed!");
    console.log("\n📝 Note: Tag creation, updates, and bulk operations are not supported by this API.");
    console.log("   Tags are managed through individual contact operations only.");

  } catch (error) {
    console.error("❌ Error in tags example:", error.message);
  }
};

// Run the example
tagsExample(); 