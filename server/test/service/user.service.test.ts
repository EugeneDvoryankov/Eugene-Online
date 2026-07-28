import {
  describe,
  test,
  expect,
  beforeEach,
} from 'vitest';
import bcrypt from 'bcrypt';
import userService from '../../src/service/user.service';
import { User } from '../../src/model/user.interface';

describe('UserService', () => {
  const user: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    phoneNumber: '1234567890',
    password: 'password123',
    email: 'test@example.com',
    companyName: 'Test Company',
    admin: false,
  };

  beforeEach(() => {
    (userService as any).users = [];
  });

  test('updateUser should return false if user does not exist', async () => {
    const result = await userService.updateUser('non-existent-id', { phoneNumber: '111' });
    expect(result).toBe(false);
  });

  test('updateUser should update phonenumber', async () => {
    (userService as any).users.push({ ...user });
    const result = await userService.updateUser(user.id, { phoneNumber: '9999999999' });
    expect(result).toBe(true);

    const updated = await userService.getUser(user.id);
    expect(updated?.phoneNumber).toBe('9999999999');
  });

  test('updateUser should hash password when updating', async () => {
    (userService as any).users.push({ ...user });
    const newPassword = 'newStrongPass';

    const result = await userService.updateUser(user.id, { password: newPassword });
    expect(result).toBe(true);

    const updated = await userService.getUser(user.id);
    expect(updated?.password).not.toBe(newPassword);
    const match = await bcrypt.compare(newPassword, updated!.password);
    expect(match).toBe(true);
  });
});

describe('createUser', () => {
  test('creates a normal user', async () => {
    const user = await userService.createUser({
      email: 'user@gmail.com',
      phoneNumber: '123456',
      password: 'password123',
      companyName: 'Test Company',
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe('user@gmail.com');
    expect(user.admin).toBe(false);
  });

  test('creates admin user when using admin email', async () => {
    const user = await userService.createUser({
      email: 'admin@gmail.com',
      phoneNumber: '123456',
      password: 'password123',
      companyName: 'Test Company',
    });

    expect(user.admin).toBe(true);
  });

  test('throws error if email already exists', async () => {
    await userService.createUser({
      email: 'duplicate@gmail.com',
      phoneNumber: '123456',
      password: 'password123',
      companyName: 'Test Company',
    });

    await expect(
      userService.createUser({
        email: 'duplicate@gmail.com',
        phoneNumber: '999999',
        password: 'password123',
        companyName: 'Test Company',
      }),
    ).rejects.toThrow();
  });
});
