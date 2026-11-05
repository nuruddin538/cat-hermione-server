# Impactora — Backend Server

Impactora is a community service and social development platform that helps people discover community events, create initiatives, and participate in meaningful activities.

This repository contains the backend REST API for Impactora, built with Node.js, Express.js and MongoDB.

## 🚀 Features

- **RESTful API:** Provides endpoints for managing community events.
- **Event Management:** Create, retrieve, update, and delete events.
- **Upcoming Events:** Retrieve upcoming events sorted by event date.
- **Recent Events:** Fetch the latest relevant upcoming events for the homepage.
- **Event Details:** Retrieve individual event details by ID.
- **Join Events:** Allow authenticated users to join community events.
- **Joined Events:** Retrieve events joined by the authenticated user.
- **My Events:** Retrieve and manage events created by the authenticated user.
- **Authentication & Authorization:** Verify JWT tokens and protect private API endpoints.
- **Duplicate Join Prevention:** Prevent users from joining the same event multiple times.
- **Input Validation:** Validate event IDs, required fields, and event dates.
- **MongoDB Integration:** Store events and event participation records in MongoDB.

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- Better Auth JWT integration
- `jose` for JWT verification
- CORS
- dotenv

## 📁 Project Structure

```text
server/
├── index.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── .env
├── .gitignore
└── README.md
```

_The structure may vary depending on your project configuration._

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the server directory

```bash
cd YOUR_PROJECT_FOLDER/server
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the server root directory.

```env
PORT=8000
CLIENT_URL=http://localhost:3000

MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=kindora

BETTER_AUTH_URL=http://localhost:3000
```

Add any additional environment variables required by your existing server configuration. Never commit real secrets or database credentials to GitHub.

### 5. Start the development server

Use the script configured in your `package.json`. For example, if you have a `dev` script:

```bash
npm run dev
```

### 6. Build and run in production

If your project has the corresponding scripts configured:

```bash
npm run build
npm start
```

## 🌐 API Endpoints

Base URL: `http://localhost:8000`

| Method | Endpoint                | Description                            | Access    |
| ------ | ----------------------- | -------------------------------------- | --------- |
| GET    | `/`                     | Check server status, if configured     | Public    |
| GET    | `/api/events`           | Get upcoming events                    | Public    |
| GET    | `/api/events/recent`    | Get recent upcoming events             | Public    |
| GET    | `/api/events/:id`       | Get event details                      | Public    |
| POST   | `/api/events`           | Create a new event                     | Protected |
| POST   | `/api/events/:id/join`  | Join an event                          | Protected |
| GET    | `/api/my-events`        | Get events created by the current user | Protected |
| PATCH  | `/api/my-events/:id`    | Update an owned event                  | Protected |
| DELETE | `/api/my-events/:id`    | Delete an owned event                  | Protected |
| GET    | `/api/my-joined-events` | Get events joined by the current user  | Protected |

**Note:** Protected endpoints require a valid JWT access token in the request's `Authorization` header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The token must be issued by the configured authentication system and accepted by the server's JWT verification middleware.

## 🔐 Security

- Keep sensitive credentials in environment variables.
- Do not commit `.env` files to version control.
- Validate incoming request data.
- Protect private endpoints with authentication middleware.
- Verify event ownership before updating or deleting events.
- Configure CORS to allow only trusted client origins in production.
- Use rate limiting and security headers where configured.

## 🌍 Deployment

Deploy the backend to a Node.js-compatible hosting provider, such as Render or Railway, or another platform that supports your server configuration.

Before deployment:

1. Configure production environment variables.
2. Set `CLIENT_URL` to your deployed frontend URL.
3. Configure your MongoDB connection and database access.
4. Configure the authentication URL and JWT verification settings.
5. Ensure the production build and start commands match `package.json`.
6. Test the public and protected API endpoints.

## 👨‍💻 Project

**Project Name:** Impactora  
**Project Type:** Community Service & Social Development Platform  
**Backend:** Express.js REST API with TypeScript  
**Database:** MongoDB

**Client Live URL:** YOUR_DEPLOYED_CLIENT_URL  
**Repository:** YOUR_GITHUB_REPOSITORY_URL

---

_Impactora — Small acts. Lasting impact._
