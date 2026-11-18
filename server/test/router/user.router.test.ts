import {
  describe,
  test,
  expect,
} from 'vitest';
import SuperTest from 'supertest';
import userService from '../../src/service/user.db.service';
import app from '../../src/start';
import {
  adminAuthorizationHeader,
  adminUser,
  authorizationHeader,
  user,
} from '../setupFile';
import UserModel from '../../src/db/User.db';

const request = SuperTest(app);

describe('GET users', () => {
  const getRequest = () => request
    .get('/api/users')
    .set('Authorization', adminAuthorizationHeader);

  test('it should return 401 if the user is not authenticated', async () => {
    const res = await request
      .get('/api/users');

    expect(res.statusCode).toBe(401);
  });

  test('it should return 403 if the user is not an admin', async () => {
    const res = await request
      .get('/api/users')
      .set('Authorization', authorizationHeader);

    expect(res.statusCode).toBe(403);
  });

  test('it should return 200 with all users', async () => {
    const res = await getRequest();

    expect(res.statusCode).toBe(200);
    // Users contains the user and admin users that are used in test cases
    expect(res.body).toHaveLength(2);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: user.id,
          email: user.email,
          companyName: user.companyName,
          admin: user.admin,
        }),
        expect.objectContaining({
          id: adminUser.id,
          email: adminUser.email,
          companyName: adminUser.companyName,
          admin: adminUser.admin,
        }),
      ]),
    );
    for (const account of res.body) {
      expect(account).not.toHaveProperty('password');
    }
  });
});

describe('GET my user', () => {
  const getRequest = () => request
    .get('/api/users/me')
    .set('Authorization', authorizationHeader);
  test('it should return 401 if the user is not authenticated', async () => {
    const res = await request
      .get('/api/users/me');

    expect(res.statusCode).toBe(401);
  });

  test('it should return 200 with the user', async () => {
    const res = await getRequest();

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: user.id,
        email: user.email,
        companyName: user.companyName,
        phoneNumber: null,
        admin: false,
      }),
    );
    expect(res.body).not.toHaveProperty('password');
  });
});

describe('PATCH /api/users/:id', () => {
  const updateRequest = (id: string, data?: string | object | undefined) => request
    .patch(`/api/users/${id}`)
    .set('Authorization', authorizationHeader)
    .send(data);

  test('should return 401 if the user is not authenticated', async () => {
    const res = await request
      .patch(`/api/users/${user.id}`)
      .send({ phoneNumber: '9999999999' });
    expect(res.statusCode).toBe(401);
  });

  test('returns 400 for password too short', async () => {
    const res = await updateRequest(user.id, { password: '123' });
    expect(res.statusCode).toBe(400);
  });

  test('successfully updates phonenumber', async () => {
    const res = await updateRequest(user.id, { phoneNumber: '9999999999' });
    expect(res.statusCode).toBe(200);
    expect(res.body.phoneNumber).toBe('9999999999');
  });

  test('successfully updates password (hashed)', async () => {
    const newPassword = 'newStrongPass';
    const res = await updateRequest(user.id, { password: newPassword });
    expect(res.statusCode).toBe(200);

    const updated = await userService.getUser(user.id);
    expect(updated?.password).not.toBe(newPassword);
  });

  test('updates both phonenumber and password together', async () => {
    const newPassword = 'newStrongPass2';
    const res = await updateRequest(user.id, { phoneNumber: '8888888888', password: newPassword });
    expect(res.statusCode).toBe(200);

    const updated = await userService.getUser(user.id);
    expect(updated?.phoneNumber).toBe('8888888888');
    expect(updated?.password).not.toBe(newPassword);
  });

  test('returns 400 when trying to update email', async () => {
    const res = await updateRequest(user.id, { email: 'newemail@gmail.com' });

    expect(res.statusCode).toBe(400);
  });

  test('returns 400 when trying to update id', async () => {
    const res = await updateRequest(user.id, { id: 'new-id' });

    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/users', () => {
  const postRequest = (data?: string | object | undefined) => request
    .post('/api/users')
    .set('Authorization', authorizationHeader)
    .send(data);

  test('creates a normal user', async () => {
    const res = await postRequest({
      email: 'user@gmail.com',
      phoneNumber: '111111',
      password: 'password123',
      companyName: 'Test Company',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('user@gmail.com');
    expect(res.body.admin).toBe(false);
  });

  test('creates a normal user without phonenumber', async () => {
    const res = await postRequest({
      email: 'user2@gmail.com',
      password: 'password123',
      companyName: 'Test Company',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.phoneNumber).toBeUndefined();
  });

  test('creates a normal user regardless of email', async () => {
    // Delete the admin user that is created in setupFile
    await UserModel.destroy({ where: { id: adminUser.id } });

    const res = await postRequest({
      email: 'admin@gmail.com',
      phoneNumber: '111111',
      password: 'password123',
      companyName: 'Test Company',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.admin).toBe(false);
    expect(res.body).not.toHaveProperty('password');
  });

  test('returns 400 if email already exists', async () => {
    const res = await postRequest({
      email: user.email,
      phoneNumber: '111111',
      password: 'password123',
      companyName: 'Test Company',
    });

    expect(res.statusCode).toBe(400);
  });

  test('returns 400 if password is missing', async () => {
    const res = await postRequest({
      email: 'new@gmail.com',
      phoneNumber: '111111',
      companyName: 'Test Company',
    });

    expect(res.statusCode).toBe(400);
  });
});
