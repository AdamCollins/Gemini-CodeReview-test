"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Routes
app.use('/api/users', user_routes_1.default);
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
