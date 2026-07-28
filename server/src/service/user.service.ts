import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserInput, User } from '../model/user.interface';

const ADMIN_EMAIL = 'admin@gmail.com';

class UserService {
  private users: User[] = [];

  // Get all registered users
  async getAllUsers(): Promise <User[]> {
    return this.users;
  }

  async getUser(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user ?? null;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    if (this.users.some((u) => u.email === input.email)) {
      throw new Error('User with this email already exists');
    }

    if (!input.email || !input.password || !input.companyName) {
      throw new Error('Must include email, password, company name when creating user');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const newUser: User = {
      id: uuidv4(),
      email: input.email,
      phoneNumber: input.phoneNumber,
      password: hashedPassword,
      companyName: input.companyName,
      admin: input.email === ADMIN_EMAIL,
    };

    this.users.push(newUser);

    return newUser;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<boolean> {
    const userToUpdate = this.users.find((user) => user.id === id);
    if (!userToUpdate) {
      return false;
    }

    const allowedFields = ['phoneNumber', 'password'];
    const invalidFields = Object.keys(userData).filter((f) => !allowedFields.includes(f));

    if (invalidFields.length > 0) {
      throw new Error('You can only update phone number and password');
    }

    const updatedData: Partial<User> = {
      phoneNumber: userData.phoneNumber,
    };

    if (typeof userData.password === 'string' && userData.password.length > 0) {
      const saltRounds = 10;
      updatedData.password = await bcrypt.hash(userData.password, saltRounds);
    }

    this.users = this.users.map((user) => (user.id === id ? { ...user, ...updatedData } : user));

    return true;
  }

  async authenticateUser(email: string, password: string): Promise <User> {
    const user = this.users.find((U) => U.email === email);

    if (!user) {
      throw new Error('No user with email');
    }

    const passwordComparison = await bcrypt.compare(password, user.password);
    if (passwordComparison === false) {
      throw new Error('Invalid password');
    }

    return user;
  }

  // For testing purposes, remove when not working in-memory
  async removeUsers() {
    this.users = [];
  }
}

const userService = new UserService();
export default userService;
