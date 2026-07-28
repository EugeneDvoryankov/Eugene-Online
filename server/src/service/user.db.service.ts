import bcrypt from 'bcrypt';
import UserModel from '../db/User.db';
import { CreateUserInput, User } from '../model/user.interface';

const ADMIN_EMAIL = 'admin@gmail.com';

/* eslint-disable class-methods-use-this */
class UserService {
  // Get all registered users
  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.findAll();
    return users.map((u) => u.toJSON());
  }

  async getUser(id: string): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    return user ? user.toJSON() : null;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    if (!input.email || !input.password || !input.companyName) {
      throw new Error('Must include email, password, company name when creating user');
    }

    const existing = await UserModel.findOne({ where: { email: input.email } });
    if (existing) throw new Error('User with this email already exists');

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const newUser = await UserModel.create({
      email: input.email,
      phoneNumber: input.phoneNumber,
      password: hashedPassword,
      companyName: input.companyName,
      admin: input.email === ADMIN_EMAIL,
    });

    return newUser.toJSON();
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    if (!user) return null;

    const allowedFields = ['phoneNumber', 'password'];
    const invalidFields = Object.keys(userData).filter((f) => !allowedFields.includes(f));
    if (invalidFields.length > 0) {
      throw new Error('You can only update phone number and password');
    }

    if (userData.password && userData.password.length < 8) {
      throw new Error('Password too short');
    }

    let updatedPassword;
    if (userData.password) {
      updatedPassword = await bcrypt.hash(userData.password, 10);
    }

    await user.update({
      ...userData,
      ...(updatedPassword ? { password: updatedPassword } : {}),
    });

    return user.toJSON();
  }

  async authenticateUser(email: string, password: string): Promise<User> {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw new Error('No user with email');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid password');

    return user.toJSON();
  }
}
/* eslint-enable class-methods-use-this */

const userService = new UserService();
export default userService;
