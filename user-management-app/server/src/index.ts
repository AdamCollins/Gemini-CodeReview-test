import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'User Management API is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`- GET /api/users - Get all users`);
  console.log(`- GET /api/users/:id - Get user by ID`);
  console.log(`- POST /api/users - Create a new user`);
  console.log(`- PUT /api/users/:id - Update a user`);
  console.log(`- DELETE /api/users/:id - Delete a user`);
}); 