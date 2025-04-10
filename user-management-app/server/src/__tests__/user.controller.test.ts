import { Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { DataService } from '../services/data.service';
import { User } from '../models/user.interface';

// Mock the DataService
jest.mock('../services/data.service');

describe('UserController', () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockDataService: jest.Mocked<DataService>;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create mock response object
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    // Create mock request object
    mockRequest = {
      params: {},
      body: {},
    };

    // Create controller instance
    userController = new UserController();
    mockDataService = new DataService() as jest.Mocked<DataService>;
    (userController as any).dataService = mockDataService;
  });

  describe('getAllUsers', () => {
    it('should return all users successfully', () => {
      const mockUsers: User[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user', isActive: true },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'admin', isActive: true },
      ];

      mockDataService.getAllUsers.mockReturnValue(mockUsers);

      userController.getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors when getting users', () => {
      mockDataService.getAllUsers.mockImplementation(() => {
        throw new Error('Database error');
      });

      userController.getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', () => {
      const mockUser: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'user',
        isActive: true,
      };

      mockRequest.params = { id: '1' };
      mockDataService.getUserById.mockReturnValue(mockUser);

      userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 when user is not found', () => {
      mockRequest.params = { id: '999' };
      mockDataService.getUserById.mockReturnValue(undefined);

      userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', () => {
      const newUser: User = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'user',
        isActive: true,
      };

      const createdUser: User = {
        ...newUser,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = newUser;
      mockDataService.createUser.mockReturnValue(createdUser);

      userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdUser);
    });

    it('should return 400 when required fields are missing', () => {
      mockRequest.body = {
        firstName: 'John',
        // Missing lastName and email
      };

      userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'First name, last name, and email are required',
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', () => {
      const updatedUser: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'admin',
        isActive: true,
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = updatedUser;
      mockDataService.updateUser.mockReturnValue(updatedUser);

      userController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });

    it('should return 404 when updating non-existent user', () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { firstName: 'John' };
      mockDataService.updateUser.mockReturnValue(undefined);

      userController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', () => {
      mockRequest.params = { id: '1' };
      mockDataService.deleteUser.mockReturnValue(true);

      userController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 404 when deleting non-existent user', () => {
      mockRequest.params = { id: '999' };
      mockDataService.deleteUser.mockReturnValue(false);

      userController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });
}); 