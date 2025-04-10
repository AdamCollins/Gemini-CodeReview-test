"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class DataService {
    constructor() {
        this.users = [];
        this.dataFilePath = path_1.default.join(__dirname, '../data/users.json');
        this.loadData();
    }
    loadData() {
        try {
            if (fs_1.default.existsSync(this.dataFilePath)) {
                const data = fs_1.default.readFileSync(this.dataFilePath, 'utf8');
                this.users = JSON.parse(data);
            }
            else {
                // Create the file with empty data if it doesn't exist
                this.saveData();
            }
        }
        catch (error) {
            console.error('Error loading data:', error);
            this.users = [];
        }
    }
    saveData() {
        try {
            // Ensure the directory exists
            const dir = path_1.default.dirname(this.dataFilePath);
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
            fs_1.default.writeFileSync(this.dataFilePath, JSON.stringify(this.users, null, 2), 'utf8');
        }
        catch (error) {
            console.error('Error saving data:', error);
        }
    }
    getAllUsers() {
        return this.users;
    }
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }
    createUser(user) {
        const newUser = Object.assign(Object.assign({}, user), { id: this.getNextId(), createdAt: new Date(), updatedAt: new Date() });
        this.users.push(newUser);
        this.saveData();
        return newUser;
    }
    updateUser(id, userData) {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) {
            return undefined;
        }
        const updatedUser = Object.assign(Object.assign(Object.assign({}, this.users[index]), userData), { id, updatedAt: new Date() });
        this.users[index] = updatedUser;
        this.saveData();
        return updatedUser;
    }
    deleteUser(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) {
            return false;
        }
        this.users.splice(index, 1);
        this.saveData();
        return true;
    }
    getNextId() {
        if (this.users.length === 0) {
            return 1;
        }
        const maxId = Math.max(...this.users.map(user => user.id || 0));
        return maxId + 1;
    }
}
exports.DataService = DataService;
