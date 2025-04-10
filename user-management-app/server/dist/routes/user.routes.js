"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
// Get all users
router.get('/', userController.getAllUsers);
// Get user by ID
router.get('/:id', userController.getUserById);
// Create a new user
router.post('/', userController.createUser);
// Update a user
router.put('/:id', userController.updateUser);
// Delete a user
router.delete('/:id', userController.deleteUser);
exports.default = router;
