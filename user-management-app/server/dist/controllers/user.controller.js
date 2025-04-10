"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const data_service_1 = require("../services/data.service");
class UserController {
    constructor() {
        this.getAllUsers = (req, res) => {
            try {
                const users = this.dataService.getAllUsers();
                res.status(200).json(users);
            }
            catch (error) {
                console.error('Error getting all users:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.getUserById = (req, res) => {
            try {
                const id = parseInt(req.params.id, 10);
                const user = this.dataService.getUserById(id);
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.status(200).json(user);
            }
            catch (error) {
                console.error('Error getting user by ID:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.createUser = (req, res) => {
            try {
                const userData = req.body;
                // Validate required fields
                if (!userData.firstName || !userData.lastName || !userData.email) {
                    res.status(400).json({ message: 'First name, last name, and email are required' });
                    return;
                }
                const newUser = this.dataService.createUser(userData);
                res.status(201).json(newUser);
            }
            catch (error) {
                console.error('Error creating user:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.updateUser = (req, res) => {
            try {
                const id = parseInt(req.params.id, 10);
                const userData = req.body;
                const updatedUser = this.dataService.updateUser(id, userData);
                if (!updatedUser) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.status(200).json(updatedUser);
            }
            catch (error) {
                console.error('Error updating user:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.deleteUser = (req, res) => {
            try {
                const id = parseInt(req.params.id, 10);
                const success = this.dataService.deleteUser(id);
                if (!success) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                console.error('Error deleting user:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.dataService = new data_service_1.DataService();
    }
}
exports.UserController = UserController;
