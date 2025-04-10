# User Management API Server

This is a simple Node.js server that provides a RESTful API for managing users. It uses a JSON file for persistent storage.

## Features

- CRUD operations for users
- JSON file-based storage
- TypeScript for type safety
- Express.js for routing and middleware

## API Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Installation

1. Make sure you have Node.js installed (v14 or higher recommended)
2. Clone the repository
3. Navigate to the server directory:
   ```
   cd user-management-app/server
   ```
4. Install dependencies:
   ```
   npm install
   ```

## Running the Server

### Development Mode

To run the server in development mode with hot reloading:

```
npm run dev
```

### Production Mode

To build and run the server in production mode:

```
npm run build
npm start
```

## Data Storage

The server stores user data in a JSON file located at `src/data/users.json`. This file is automatically created when the server starts if it doesn't exist.

## Integration with Angular Frontend

This server is designed to work with the Angular frontend in the parent directory. The Angular service is configured to connect to this server at `http://localhost:3000/api/users`. 