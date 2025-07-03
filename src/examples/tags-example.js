import "dotenv/config";
import { SmsApi } from "../sdk/SmsApi.js";

// Initialize the API client
const api = new SmsApi(
  process.env.API_KEY,
  process.env.API_SECRET,
  process.env.URL
);

/**
 * Complete example of tag management operations
 */
const tagsExample = async () => {
  console.log("🏷️ Tag Management Example");
  console.log("=========================");

  try {
    // 1. List all tags
    console.log("\n1. 📋 Listing all tags...");
    const tags = await api.tags.listTags({
      limit: 10,
      shortResults: 0,
    });

    if (tags.ok) {
      console.log(`✅ Found ${tags.data?.length || 0} tags`);
      tags.data?.forEach((tag, index) => {
        console.log(`   ${index + 1}. ${tag.name} (${tag.short_name}) - ${tag.description || 'No description'}`);
      });
    } else {
      console.log("❌ Failed to list tags:", tags.data?.error || tags.error);
    }

    // 2. Create a new tag
    console.log("\n2. ➕ Creating a new tag...");
    const newTag = await api.tags.createTag({
      name: "JavaScript SDK Demo",
      shortName: "js-demo",
      description: "Tag created for JavaScript SDK v4 demonstration",
    });

    if (newTag.ok) {
      console.log("✅ Tag created successfully!");
      console.log(`   Name: ${newTag.data?.name}`);
      console.log(`   Short Name: ${newTag.data?.short_name}`);
      console.log(`   Description: ${newTag.data?.description}`);
    } else {
      console.log("❌ Failed to create tag:", newTag.data?.error || newTag.error);
    }

    // 3. Create another tag for testing
    console.log("\n3. ➕ Creating another tag...");
    const secondTag = await api.tags.createTag({
      name: "Premium Customers",
      shortName: "premium",
      description: "High-value customers with premium features",
    });

    if (secondTag.ok) {
      console.log("✅ Second tag created successfully!");
      console.log(`   Name: ${secondTag.data?.name}`);
      console.log(`   Short Name: ${secondTag.data?.short_name}`);
    } else {
      console.log("❌ Failed to create second tag:", secondTag.data?.error || secondTag.error);
    }

    // 4. Get a specific tag
    console.log("\n4. 🔍 Getting specific tag...");
    const tag = await api.tags.getTag("js-demo");

    if (tag.ok) {
      console.log("✅ Tag retrieved successfully!");
      console.log(`   Name: ${tag.data?.name}`);
      console.log(`   Short Name: ${tag.data?.short_name}`);
      console.log(`   Description: ${tag.data?.description}`);
      console.log(`   Contact Count: ${tag.data?.contact_count || 0}`);
    } else {
      console.log("❌ Failed to get tag:", tag.data?.error || tag.error);
    }

    // 5. Get contacts in a tag
    console.log("\n5. 👥 Getting contacts in tag...");
    const tagContacts = await api.tags.getTagContacts("js-demo", {
      limit: 10,
      status: "SUSCRIBED",
    });

    if (tagContacts.ok) {
      console.log(`✅ Found ${tagContacts.data?.length || 0} contacts in tag`);
      tagContacts.data?.forEach((contact, index) => {
        console.log(`   ${index + 1}. ${contact.full_name || 'No name'} - ${contact.msisdn}`);
      });
    } else {
      console.log("❌ Failed to get tag contacts:", tagContacts.data?.error || tagContacts.error);
    }

    // 6. Add contacts to tag
    console.log("\n6. ➕ Adding contacts to tag...");
    const addContacts = await api.tags.addContactsToTag("js-demo", [
      "50212345678",
      "50287654321",
    ]);

    if (addContacts.ok) {
      console.log("✅ Contacts added to tag successfully!");
      console.log(`   Added: ${addContacts.data?.added || 'N/A'} contacts`);
    } else {
      console.log("❌ Failed to add contacts to tag:", addContacts.data?.error || addContacts.error);
    }

    // 7. Update tag information
    console.log("\n7. ✏️ Updating tag information...");
    const updatedTag = await api.tags.updateTag("js-demo", {
      name: "Updated JavaScript SDK Demo",
      description: "Updated description for JavaScript SDK v4 demonstration",
    });

    if (updatedTag.ok) {
      console.log("✅ Tag updated successfully!");
      console.log(`   New Name: ${updatedTag.data?.name}`);
      console.log(`   New Description: ${updatedTag.data?.description}`);
    } else {
      console.log("❌ Failed to update tag:", updatedTag.data?.error || updatedTag.error);
    }

    // 8. Get updated tag contacts
    console.log("\n8. 👥 Getting updated tag contacts...");
    const updatedTagContacts = await api.tags.getTagContacts("js-demo", {
      limit: 10,
    });

    if (updatedTagContacts.ok) {
      console.log(`✅ Found ${updatedTagContacts.data?.length || 0} contacts in updated tag`);
      updatedTagContacts.data?.forEach((contact, index) => {
        console.log(`   ${index + 1}. ${contact.full_name || 'No name'} - ${contact.msisdn}`);
      });
    } else {
      console.log("❌ Failed to get updated tag contacts:", updatedTagContacts.data?.error || updatedTagContacts.error);
    }

    // 9. Remove contacts from tag
    console.log("\n9. ➖ Removing contacts from tag...");
    const removeContacts = await api.tags.removeContactsFromTag("js-demo", [
      "50212345678",
    ]);

    if (removeContacts.ok) {
      console.log("✅ Contacts removed from tag successfully!");
      console.log(`   Removed: ${removeContacts.data?.removed || 'N/A'} contacts`);
    } else {
      console.log("❌ Failed to remove contacts from tag:", removeContacts.data?.error || removeContacts.error);
    }

    // 10. Get final tag contacts
    console.log("\n10. 👥 Getting final tag contacts...");
    const finalTagContacts = await api.tags.getTagContacts("js-demo", {
      limit: 10,
    });

    if (finalTagContacts.ok) {
      console.log(`✅ Found ${finalTagContacts.data?.length || 0} contacts in final tag`);
      finalTagContacts.data?.forEach((contact, index) => {
        console.log(`   ${index + 1}. ${contact.full_name || 'No name'} - ${contact.msisdn}`);
      });
    } else {
      console.log("❌ Failed to get final tag contacts:", finalTagContacts.data?.error || finalTagContacts.error);
    }

    // 11. Delete the tags (cleanup)
    console.log("\n11. 🗑️ Deleting tags (cleanup)...");
    const deleteTag = await api.tags.deleteTag("js-demo");
    const deleteSecondTag = await api.tags.deleteTag("premium");

    if (deleteTag.ok) {
      console.log("✅ First tag deleted successfully!");
    } else {
      console.log("❌ Failed to delete first tag:", deleteTag.data?.error || deleteTag.error);
    }

    if (deleteSecondTag.ok) {
      console.log("✅ Second tag deleted successfully!");
    } else {
      console.log("❌ Failed to delete second tag:", deleteSecondTag.data?.error || deleteSecondTag.error);
    }

    // 12. Verify tags are deleted
    console.log("\n12. 🔍 Verifying tags are deleted...");
    const remainingTags = await api.tags.listTags({
      limit: 10,
    });

    if (remainingTags.ok) {
      const jsDemoTag = remainingTags.data?.find(tag => tag.short_name === 'js-demo');
      const premiumTag = remainingTags.data?.find(tag => tag.short_name === 'premium');
      
      if (!jsDemoTag && !premiumTag) {
        console.log("✅ Tags successfully deleted!");
      } else {
        console.log("⚠️ Some tags may still exist");
      }
    } else {
      console.log("❌ Failed to verify tag deletion:", remainingTags.data?.error || remainingTags.error);
    }

    console.log("\n✨ Tag management example completed!");

  } catch (error) {
    console.error("❌ Tag example error:", error.message);
  }
};

// Run the example
tagsExample(); 