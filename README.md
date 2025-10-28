# JavaScript SMS API SDK

A modern, feature-rich JavaScript SDK for interacting with the SMS API service. This SDK provides easy-to-use methods for managing contacts, sending messages, handling tags, and creating shortlinks with enhanced functionality and improved error handling.

## Features

- **Complete Contact Management**: Create, read, update, delete contacts with custom fields
- **Advanced Message Handling**: Send to individuals, groups, tags, and bulk messaging
- **Tag Management**: Create, manage, and organize contacts with tags
- **Shortlink Management**: Create, list, update shortlinks with statistics
- **Robust Error Handling**: Comprehensive validation and error reporting
- **Modern JavaScript**: ES6+ features with async/await support
- **Type Safety**: JSDoc documentation for better development experience
- **Easy Integration**: Simple setup and intuitive API design

## Requirements

- Node.js 16.0 or higher
- npm or yarn package manager

## Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with your API credentials:

```env
API_KEY=your_api_key_here
API_SECRET=your_api_secret_here
URL=https://your-api-url.com/api/v4/
```

## Quick Start

### Basic Usage

```javascript
import "dotenv/config";
import { SmsApi } from "./src/sdk/SmsApi.js";

// Initialize the API client
const api = new SmsApi(
  process.env.API_KEY,
  process.env.API_SECRET,
  process.env.URL
);

// Test connection
const connection = await api.testConnection();
console.log(connection.success ? "Connected!" : "Connection failed");
```

### Send a Message

```javascript
// Send to a specific contact
const response = await api.messages.sendToContact({
  msisdn: "50212345678",
  message: "Hello from JavaScript SDK",
  id: "unique-message-id"
});

if (response.ok) {
  console.log("Message sent successfully!");
} else {
  console.error("Failed to send message:", response.error);
}
```

### Create a Contact

```javascript
const contact = await api.contacts.createContact({
  phoneNumber: "12345678",
  countryCode: "502",
  firstName: "John",
  lastName: "Doe",
  customField1: "VIP Customer"
});

if (contact.ok) {
  console.log("Contact created:", contact.data.msisdn);
}
```

### Create a Shortlink

```javascript
const shortlink = await api.shortlinks.createShortlink({
  long_url: "https://www.example.com/very-long-url-with-parameters",
  name: "My Shortlink",
  status: "ACTIVE"
});

if (shortlink.ok) {
  console.log("Shortlink created:", shortlink.data.short_url);
}
```

## API Reference

### Contacts

#### List Contacts
```javascript
const contacts = await api.contacts.listContacts({
  limit: 10,
  status: "SUBSCRIBED",
  query: "search term"
});
```

#### Create Contact
```javascript
const contact = await api.contacts.createContact({
  phoneNumber: "12345678",
  countryCode: "502",
  firstName: "John",
  lastName: "Doe",
  customField1: "Field 1",
  customField2: "Field 2",
  customField3: "Field 3",
  customField4: "Field 4",
  customField5: "Field 5"
});
```

#### Get Contact
```javascript
const contact = await api.contacts.getContact("50212345678");
```

#### Update Contact
```javascript
const updated = await api.contacts.updateContact("50212345678", {
  firstName: "Jane",
  lastName: "Smith"
});
```

#### Delete Contact
```javascript
const deleted = await api.contacts.deleteContact("50212345678");
```

#### Add/Remove Tags
```javascript
// Add tag to contact
await api.contacts.addTagToContact("50212345678", "vip");

// Remove tag from contact
await api.contacts.removeTagFromContact("50212345678", "vip");
```

### Messages

#### List Messages
```javascript
const messages = await api.messages.listMessages({
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  limit: 10,
  direction: "MT" // MT = Mobile Terminated (outgoing)
});
```

#### Send to Contact
```javascript
const sent = await api.messages.sendToContact({
  msisdn: "50212345678",
  message: "Hello!",
  id: "unique-id"
});
```

#### Send to Tags
```javascript
const sent = await api.messages.sendToTags({
  tags: ["vip", "premium"],
  message: "Special offer!",
  id: "bulk-id"
});
```

#### Send to Multiple Contacts
```javascript
const sent = await api.messages.sendToMultipleContacts({
  msisdns: ["50212345678", "50287654321"],
  message: "Bulk message",
  id: "bulk-id"
});
```

#### Get Delivery Reports
```javascript
const reports = await api.messages.getDeliveryReports({
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  limit: 10
});
```

### Tags

#### List Tags
```javascript
const tags = await api.tags.listTags({
  limit: 10,
  shortResults: 0
});
```

#### Create Tag
```javascript
const tag = await api.tags.createTag({
  name: "VIP Customers",
  shortName: "vip",
  description: "High-value customers"
});
```

#### Get Tag
```javascript
const tag = await api.tags.getTag("vip");
```

#### Get Tag Contacts
```javascript
const contacts = await api.tags.getTagContacts("vip", {
  limit: 10,
  status: "SUBSCRIBED"
});
```

#### Update Tag
```javascript
const updated = await api.tags.updateTag("vip", {
  name: "Updated VIP Customers",
  description: "Updated description"
});
```

#### Add/Remove Contacts to Tag
```javascript
// Add contacts to tag
await api.tags.addContactsToTag("vip", ["50212345678", "50287654321"]);

// Remove contacts from tag
await api.tags.removeContactsFromTag("vip", ["50212345678"]);
```

#### Delete Tag
```javascript
const deleted = await api.tags.deleteTag("vip");
```

### Shortlinks

#### List Shortlinks
```javascript
const shortlinks = await api.shortlinks.listShortlinks({
  start_date: "2024-01-01",
  end_date: "2024-12-31",
  limit: 10,
  offset: -6 // UTC timezone offset (e.g., -6 for Central America)
});
```

#### Get Shortlink by ID
```javascript
const shortlink = await api.shortlinks.getShortlinkById("abc123");
```

#### Create Shortlink
```javascript
const shortlink = await api.shortlinks.createShortlink({
  long_url: "https://www.example.com/very-long-url",
  name: "My Shortlink",
  status: "ACTIVE" // or "INACTIVE"
});
```

#### Update Shortlink Status
```javascript
const updated = await api.shortlinks.updateShortlinkStatus("abc123", "INACTIVE");
```

## Testing

Before running examples or tests, ensure you have created a `.env` file in the root directory with your API credentials:

```env
API_KEY=your_api_key_here
API_SECRET=your_api_secret_here
URL=https://your-api-url.com/api/v4/
```

### Run Tests

```bash
# Run main test suite (delivery reports and messaging)
node src/test.js

# Run original structure test (messages and contacts)
node src/test-original.js

# Run shortlinks test suite
node src/test-shortlinks.js

# Run shortlinks tests with options
node src/test-shortlinks.js create
node src/test-shortlinks.js list
node src/test-shortlinks.js id <shortlink_id>
node src/test-shortlinks.js update <shortlink_id> ACTIVE
node src/test-shortlinks.js list 2024-01-01 2024-12-31 20 -6
```

## Examples

Run the included examples to see the SDK in action:

```bash
# Run all examples
npm run dev

# Run specific examples
node src/examples/contacts-example.js
node src/examples/messages-example.js
node src/examples/tags-example.js
node src/examples/shortlinks-example.js
```

## Response Format

All API methods return a consistent response format:

```javascript
{
  code: 200,           // HTTP status code
  status: "OK",        // HTTP status text
  ok: true,           // Boolean indicating success
  data: {...},        // Response data
  headers: {...},     // Response headers
  error: "message"    // Error message (if failed)
}
```

## Error Handling

The SDK includes comprehensive error handling:

```javascript
try {
  const response = await api.contacts.createContact(contactData);
  
  if (response.ok) {
    console.log("Success:", response.data);
  } else {
    console.error("API Error:", response.error);
  }
} catch (error) {
  console.error("SDK Error:", error.message);
}
```

## Advanced Usage

### Connection Testing
```javascript
const connection = await api.testConnection();
if (connection.success) {
  console.log("API is accessible");
} else {
  console.error("Connection failed:", connection.error);
}
```

### API Statistics
```javascript
const stats = await api.getStats();
if (stats.success) {
  console.log("API Statistics:", stats.data);
}
```

### Batch Operations
```javascript
// Create multiple contacts
const contacts = [
  { phoneNumber: "12345678", countryCode: "502", firstName: "John" },
  { phoneNumber: "87654321", countryCode: "502", firstName: "Jane" }
];

for (const contactData of contacts) {
  const result = await api.contacts.createContact(contactData);
  console.log(`Contact ${contactData.firstName}: ${result.ok ? 'Created' : 'Failed'}`);
}
```

## Migration from v1

If you're upgrading from the previous version:

1. **Update imports**: Use the new `SmsApi` class
2. **Update method calls**: Some method signatures have changed
3. **Update error handling**: Use the new response format
4. **Update environment variables**: Ensure all required variables are set

### Old vs New Usage

```javascript
// Old way (v1)
import { Messages, Contacts } from "./sdk/messages.js";
const response = await Messages.sendToContact({ msisdn, message });

// New way (v4)
import { SmsApi } from "./sdk/SmsApi.js";
const api = new SmsApi(apiKey, apiSecret, apiUrl);
const response = await api.messages.sendToContact({ msisdn, message });
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions:
- Check the examples in the `src/examples/` directory
- Review the API documentation
- Open an issue on GitHub

## Changelog

### v2.0.0
- Added shortlink management functionality
- Added list, get, create, and update shortlinks methods
- Added timezone offset support for shortlink queries
- Improved error handling

### v1.0.0
- Complete rewrite with modern JavaScript features
- Added comprehensive tag management
- Enhanced error handling and validation
- Improved documentation and examples
- Better performance and reliability
- Modular architecture with unified API class
