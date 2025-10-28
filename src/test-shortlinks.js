import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { SmsApi } from './sdk/SmsApi.js';

const api = new SmsApi(
  process.env.API_KEY,
  process.env.API_SECRET,
  process.env.URL
);

console.log("Testing Shortlinks API SDK");
console.log("=============================");

const getRandomLongUrl = () => {
  const baseUrls = [
    "https://www.example.com/very-long-url-with-parameters-and-filters",
    "https://www.google.com/search?q=test+shortlink+api+production+usage",
    "https://www.github.com/user/repository/very-long-path/with-many/parameters",
  ];
  return baseUrls[Math.floor(Math.random() * baseUrls.length)];
};

const getRandomName = () => {
  const names = [
    "Test Shortlink from SDK",
    "Production Test Link",
    "SDK Generated Link",
  ];
  return names[Math.floor(Math.random() * names.length)];
};

const testCreateShortlink = async (longUrl, name) => {
  try {
    console.log("\nTesting create shortlink...");
    
    const response = await api.shortlinks.createShortlink({
      long_url: longUrl || getRandomLongUrl(),
      name: name || getRandomName(),
      status: "ACTIVE"
    });
    
    console.log("Shortlink created successfully!");
    console.log("Status:", response.status);
    console.log("Code:", response.code);
    console.log("OK:", response.ok);
    
    if (response.data && response.data.url_id) {
      console.log("\nShortlink details:");
      console.log("  ID:", response.data.url_id);
      console.log("  Name:", response.data.name);
      console.log("  Short URL:", response.data.short_url);
      console.log("  Long URL:", response.data.long_url);
      console.log("  Status:", response.data.status);
      console.log("  Created:", response.data.created_on);
    }
    
    return response;
  } catch (error) {
    console.log("Error creating shortlink:", error.message);
    if (error.response?.data) {
      console.log("Error details:", error.response.data);
    }
    return null;
  }
};

const testListShortlinks = async (startDate, endDate, limit, offset) => {
  try {
    console.log("\nTesting list shortlinks...");
    
    const params = {
      limit: limit || 10,
    };
    
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (offset !== undefined) params.offset = offset;
    
    const response = await api.shortlinks.listShortlinks(params);
    
    console.log("List shortlinks response:");
    console.log("Status:", response.status);
    console.log("Code:", response.code);
    console.log("OK:", response.ok);
    console.log("Count:", response.data?.data ? response.data.data.length : 0);
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      console.log("\nShortlinks:");
      response.data.data.slice(0, 3).forEach((shortlink, index) => {
        console.log(`  ${index + 1}. ${shortlink.name || shortlink.url_id}`);
        console.log(`     Short URL: ${shortlink.short_url}`);
        console.log(`     Visits: ${shortlink.visits || 0}`);
        console.log(`     Status: ${shortlink.status}`);
      });
    }
    
    return response;
  } catch (error) {
    console.log("Error listing shortlinks:", error.message);
    throw error;
  }
};

const testGetShortlinkById = async (id) => {
  try {
    console.log("\nTesting get shortlink by ID...");
    
    if (!id) {
      console.log("Shortlink ID is required");
      return null;
    }
    
    const response = await api.shortlinks.getShortlinkById(id);
    
    console.log("Shortlink found:");
    console.log("Status:", response.status);
    console.log("Code:", response.code);
    
    if (response.data && response.data.url_id) {
      console.log("\nShortlink details:");
      console.log("  ID:", response.data.url_id);
      console.log("  Name:", response.data.name);
      console.log("  Short URL:", response.data.short_url);
      console.log("  Long URL:", response.data.long_url);
      console.log("  Status:", response.data.status);
      console.log("  Created:", response.data.created_on);
      console.log("  Visits:", response.data.visits || 0);
      console.log("  Unique Visits:", response.data.unique_visits || 0);
    }
    
    return response;
  } catch (error) {
    console.log("Error getting shortlink:", error.message);
    if (error.response?.data) {
      console.log("Error details:", error.response.data);
    }
    return null;
  }
};

const testUpdateShortlinkStatus = async (id, newStatus) => {
  try {
    console.log("\nTesting update shortlink status...");
    
    if (!id) {
      console.log("Shortlink ID is required");
      return null;
    }
    
    if (!newStatus) {
      console.log("New status is required (ACTIVE or INACTIVE)");
      return null;
    }
    
    const response = await api.shortlinks.updateShortlinkStatus(id, newStatus);
    
    console.log("Shortlink status updated:");
    console.log("Status:", response.status);
    console.log("Code:", response.code);
    
    if (response.data && response.data.url_id) {
      console.log("\nUpdated shortlink:");
      console.log("  ID:", response.data.url_id);
      console.log("  New Status:", response.data.status);
      console.log("  Short URL:", response.data.short_url);
    }
    
    return response;
  } catch (error) {
    console.log("Error updating shortlink:", error.message);
    if (error.response?.data) {
      console.log("Error details:", error.response.data);
    }
    return null;
  }
};

const runTests = async () => {
  try {
    await testListShortlinks();
    await testCreateShortlink();
    console.log("\nAll tests completed successfully!");
  } catch (error) {
    console.log("\nTest sequence failed:", error.message);
  }
};

const args = process.argv.slice(2);
const command = args[0];

if (command === "create") {
  const longUrl = args[1] || getRandomLongUrl();
  const name = args[2] || getRandomName();
  testCreateShortlink(longUrl, name);
} else if (command === "list") {
  const startDate = args[1] || null;
  const endDate = args[2] || null;
  const limit = parseInt(args[3]) || 10;
  const offset = args[4] !== undefined ? parseInt(args[4]) : undefined;
  testListShortlinks(startDate, endDate, limit, offset);
} else if (command === "id") {
  const shortLinkId = args[1];
  if (!shortLinkId) {
    console.log("Shortlink ID is required");
    console.log("Usage: node src/test-shortlinks.js id <shortlink_id>");
  } else {
    testGetShortlinkById(shortLinkId);
  }
} else if (command === "update") {
  const shortLinkId = args[1];
  const newStatus = args[2];
  if (!shortLinkId || !newStatus) {
    console.log("Shortlink ID and status are required");
    console.log("Usage: node src/test-shortlinks.js update <shortlink_id> <ACTIVE|INACTIVE>");
  } else {
    testUpdateShortlinkStatus(shortLinkId, newStatus);
  }
} else {
  console.log("Usage:");
  console.log("  node src/test-shortlinks.js                      - Run basic tests");
  console.log("  node src/test-shortlinks.js create               - Create a shortlink");
  console.log("  node src/test-shortlinks.js list                 - List shortlinks");
  console.log("  node src/test-shortlinks.js list 2024-01-01      - List from date");
  console.log("  node src/test-shortlinks.js list 2024-01-01 2024-12-31 - List between dates");
  console.log("  node src/test-shortlinks.js list 2024-01-01 2024-12-31 20 - List with limit");
  console.log("  node src/test-shortlinks.js list 2024-01-01 2024-12-31 20 -5 - List with timezone (NYC)");
  console.log("  node src/test-shortlinks.js id <id>              - Get shortlink by ID");
  console.log("  node src/test-shortlinks.js update <id> ACTIVE   - Update status");
  console.log("");
  
  runTests();
}
