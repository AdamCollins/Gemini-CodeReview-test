import { Request, Response } from 'express';
import { DataService } from '../services/data.service';
import { User } from '../models/user.interface';

export class UserController {
  private dataService: DataService;

  constructor() {
    this.dataService = new DataService();
  }

  getAllUsers = (req: Request, res: Response): void => {
    try {
      const users = this.dataService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getUserById = (req: Request, res: Response): void => {
    try {
      const id = parseInt(req.params.id, 10);
      const user = this.dataService.getUserById(id);
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  createUser = (req: Request, res: Response): void => {
    try {
      const userData: User = req.body;
      
      // Validate required fields
      if (!userData.firstName || !userData.lastName || !userData.email) {
        res.status(400).json({ message: 'First name, last name, and email are required' });
        return;
      }
      
      const newUser = this.dataService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateUser = (req: Request, res: Response): void => {
    try {
      const id = parseInt(req.params.id, 10);
      const userData: User = req.body;
      
      const updatedUser = this.dataService.updateUser(id, userData);
      
      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  deleteUser = (req: Request, res: Response): void => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = this.dataService.deleteUser(id);
      
      if (!success) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
} 