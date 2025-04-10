"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user.controller");
const data_service_1 = require("../services/data.service");
// Mock the DataService
jest.mock('../services/data.service');
describe('UserController', () => {
    let userController;
    let mockRequest;
    let mockResponse;
    let mockDataService;
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
        userController = new user_controller_1.UserController();
        mockDataService = new data_service_1.DataService();
        userController.dataService = mockDataService;
    });
    describe('getAllUsers', () => {
        it('should return all users successfully', () => {
            const mockUsers = [
                { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user', isActive: true },
                { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'admin', isActive: true },
            ];
            mockDataService.getAllUsers.mockReturnValue(mockUsers);
            userController.getAllUsers(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
        });
        it('should handle errors when getting users', () => {
            mockDataService.getAllUsers.mockImplementation(() => {
                throw new Error('Database error');
            });
            userController.getAllUsers(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });
    describe('getUserById', () => {
        it('should return a user when found', () => {
            const mockUser = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                role: 'user',
                isActive: true,
            };
            mockRequest.params = { id: '1' };
            mockDataService.getUserById.mockReturnValue(mockUser);
            userController.getUserById(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
        });
        it('should return 404 when user is not found', () => {
            mockRequest.params = { id: '999' };
            mockDataService.getUserById.mockReturnValue(undefined);
            userController.getUserById(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
        });
    });
    describe('createUser', () => {
        it('should create a new user successfully', () => {
            const newUser = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                role: 'user',
                isActive: true,
            };
            const createdUser = Object.assign(Object.assign({}, newUser), { id: 1, createdAt: new Date(), updatedAt: new Date() });
            mockRequest.body = newUser;
            mockDataService.createUser.mockReturnValue(createdUser);
            userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(createdUser);
        });
        it('should return 400 when required fields are missing', () => {
            mockRequest.body = {
                firstName: 'John',
                // Missing lastName and email
            };
            userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'First name, last name, and email are required',
            });
        });
    });
    describe('updateUser', () => {
        it('should update a user successfully', () => {
            const updatedUser = {
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
            userController.updateUser(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
        });
        it('should return 404 when updating non-existent user', () => {
            mockRequest.params = { id: '999' };
            mockRequest.body = { firstName: 'John' };
            mockDataService.updateUser.mockReturnValue(undefined);
            userController.updateUser(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
        });
    });
    describe('deleteUser', () => {
        it('should delete a user successfully', () => {
            mockRequest.params = { id: '1' };
            mockDataService.deleteUser.mockReturnValue(true);
            userController.deleteUser(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });
        it('should return 404 when deleting non-existent user', () => {
            mockRequest.params = { id: '999' };
            mockDataService.deleteUser.mockReturnValue(false);
            userController.deleteUser(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
        });
    });
});
