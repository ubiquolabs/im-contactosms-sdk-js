import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { SmsApi } from '../sdk/SmsApi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const api = new SmsApi(
  process.env.API_KEY,
  process.env.API_SECRET,
  process.env.URL
);

const runExample = async () => {
  try {
    console.log("Shortlinks SDK Example");
    console.log("========================\n");

    const shortlink = await api.shortlinks.createShortlink({
      long_url: "https://www.example.com/very-long-url-with-many-parameters",
      name: "Example Shortlink",
      status: "ACTIVE"
    });

    console.log("Created shortlink:", shortlink.data);

    const shortlinks = await api.shortlinks.listShortlinks({ 
      limit: 10,
      offset: -6
    });
    console.log("\nList of shortlinks:", shortlinks.data);

    if (shortlink.data?.url_id) {
      const details = await api.shortlinks.getShortlinkById(shortlink.data.url_id);
      console.log("\nShortlink details:", details.data);

      const updated = await api.shortlinks.updateShortlinkStatus(shortlink.data.url_id, "INACTIVE");
      console.log("\nUpdated shortlink:", updated.data);
    }

  } catch (error) {
    console.error("Error:", error.message);
  }
};

runExample();

