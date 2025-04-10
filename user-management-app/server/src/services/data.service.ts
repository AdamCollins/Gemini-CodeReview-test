import fs from 'fs';
import path from 'path';
import { User } from '../models/user.interface';

export class DataService {
  private dataFilePath: string;
  private users: User[] = [];

  constructor() {
    this.dataFilePath = path.join(__dirname, '../data/users.json');
    this.loadData();
  }

  private loadData(): void {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const data = fs.readFileSync(this.dataFilePath, 'utf8');
        this.users = JSON.parse(data);
      } else {
        // Create the file with empty data if it doesn't exist
        this.saveData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.users = [];
    }
  }

  private saveData(): void {
    try {
      // Ensure the directory exists
      const dir = path.dirname(this.dataFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.dataFilePath, JSON.stringify(this.users, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  createUser(user: User): User {
    const newUser: User = {
      ...user,
      id: this.getNextId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.push(newUser);
    this.saveData();
    return newUser;
  }

  updateUser(id: number, userData: User): User | undefined {
    const index = this.users.findIndex(user => user.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    const updatedUser: User = {
      ...this.users[index],
      ...userData,
      id,
      updatedAt: new Date()
    };
    
    this.users[index] = updatedUser;
    this.saveData();
    return updatedUser;
  }

  deleteUser(id: number): boolean {
    const index = this.users.findIndex(user => user.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.users.splice(index, 1);
    this.saveData();
    return true;
  }

  private getNextId(): number {
    if (this.users.length === 0) {
      return 1;
    }
    
    const maxId = Math.max(...this.users.map(user => user.id || 0));
    return maxId + 1;
  }
} 