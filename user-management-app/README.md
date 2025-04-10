# User Management Application

A full-stack application for managing users, built with Angular and Node.js.

## Features

- View a list of users
- Add new users
- Edit existing users
- Delete users
- Toggle user active status
- Responsive design with Material UI

## Project Structure

- `src/` - Angular frontend application
- `server/` - Node.js backend API server

## Prerequisites

- Node.js (v14 or higher)
- Angular CLI (`npm install -g @angular/cli`)

## Installation

### Frontend (Angular)

1. Navigate to the project root:
   ```
   cd user-management-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install Angular Material:
   ```
   npm install @angular/material @angular/cdk
   ```

### Backend (Node.js)

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### Backend

1. Start the server:
   ```
   cd server
   npm run dev
   ```

   The server will run on http://localhost:3000

### Frontend

1. In a new terminal, start the Angular application:
   ```
   cd user-management-app
   ng serve
   ```

2. Open your browser and navigate to http://localhost:4200

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Data Storage

The application uses a JSON file for persistent storage, located at `server/src/data/users.json`.
