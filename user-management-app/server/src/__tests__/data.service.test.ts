import fs from 'fs';
import path from 'path';
import { DataService } from '../services/data.service';
import { User } from '../models/user.interface';

// Mock the fs module
jest.mock('fs');

describe('DataService', () => {
  let dataService: DataService;
  const mockUsers: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock fs.existsSync to return true
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    
    // Mock fs.readFileSync to return mock data
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockUsers));
    
    // Create service instance
    dataService = new DataService();
  });

  describe('getAllUsers', () => {
    it('should return all users', () => {
      const users = dataService.getAllUsers();
      expect(users).toEqual(mockUsers);
    });

    it('should return empty array when file does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      dataService = new DataService();
      const users = dataService.getAllUsers();
      expect(users).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', () => {
      const user = dataService.getUserById(1);
      expect(user).toEqual(mockUsers[0]);
    });

    it('should return undefined when user not found', () => {
      const user = dataService.getUserById(999);
      expect(user).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should create a new user', () => {
      const newUser: User = {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        role: 'user',
        isActive: true,
      };

      const createdUser = dataService.createUser(newUser);

      expect(createdUser.id).toBeDefined();
      expect(createdUser.firstName).toBe(newUser.firstName);
      expect(createdUser.lastName).toBe(newUser.lastName);
      expect(createdUser.email).toBe(newUser.email);
      expect(createdUser.createdAt).toBeDefined();
      expect(createdUser.updatedAt).toBeDefined();
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should generate correct ID for first user', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.readFileSync as jest.Mock).mockReturnValue('[]');
      dataService = new DataService();

      const newUser: User = {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        role: 'user',
        isActive: true,
      };

      const createdUser = dataService.createUser(newUser);
      expect(createdUser.id).toBe(1);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', () => {
      const updatedData: User = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.updated@example.com',
        role: 'admin',
        isActive: false,
      };

      const updatedUser = dataService.updateUser(1, updatedData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.email).toBe(updatedData.email);
      expect(updatedUser?.role).toBe(updatedData.role);
      expect(updatedUser?.isActive).toBe(updatedData.isActive);
      expect(updatedUser?.updatedAt).toBeDefined();
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should return undefined when updating non-existent user', () => {
      const updatedData: User = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'user',
        isActive: true,
      };

      const updatedUser = dataService.updateUser(999, updatedData);
      expect(updatedUser).toBeUndefined();
    });
  });

  describe('deleteUser', () => {
    it('should delete an existing user', () => {
      const success = dataService.deleteUser(1);
      expect(success).toBe(true);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should return false when deleting non-existent user', () => {
      const success = dataService.deleteUser(999);
      expect(success).toBe(false);
    });
  });
}); 