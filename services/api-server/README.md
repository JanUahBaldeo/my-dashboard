# API Server

Express.js server that provides a proxy API to the LeadConnector service.

## Setup

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Set your LeadConnector API key in the `.env` file:

   ```
   LC_API_KEY=your_actual_api_key_here
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Health Check

```
GET /healthz
```

Returns server status and timestamp.

### Get User Profile

```
GET /v2/location/:locationId/settings/staff/team?userid=USER_ID
```

**Parameters:**

- `locationId` (path): The location ID
- `userid` (query): The user ID to fetch from LeadConnector

**Response:**

```json
{
  "profile": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "role": "Loan Officer",
    "online": true,
    "plan": "Premium",
    "labels": {
      "planBadge": "Premium",
      "presenceBadge": "online"
    },
    "phone": "123-456-7890",
    "locationId": "location_id",
    "_raw": {
      /* original API response */
    }
  }
}
```

**Error Responses:**

- `400` - Missing userid parameter
- `500` - Server configuration error (missing API key)
- `502` - LeadConnector API error

## Environment Variables

- `LC_API_KEY` - LeadConnector API key (required)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)

## Usage Example

```bash
curl "http://localhost:3001/v2/location/abc123/settings/staff/team?userid=user456"
```
