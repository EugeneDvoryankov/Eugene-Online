import {
  expect,
  test,
  describe,
  beforeEach,
  vi,
} from 'vitest';
import { NextFunction, Request, Response } from 'express';
import authenticate from '../../src/middlewares/authenticate';
import userService from '../../src/service/user.db.service';
import { User } from '../../src/model/user.interface';
import sequelize from '../../src/db/conn';
import UserModel from '../../src/db/User.db';

// Mock without a factory function will instead of loading conn.ts
// it will load __mocks__/conn.ts which returns a Sequelize instance
// connected to a in-memory sqlite database
vi.mock('../../src/db/conn');

describe('The authenticate middleware', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let user: User;
  // "email:password" is base64 encoded as "ZW1haWw6cGFzc3dvcmQ="
  const validHeader = 'Basic ZW1haWw6cGFzc3dvcmQ=';
  const withoutBasicHeader = 'ZW1haWw6cGFzc3dvcmQ=';
  // "email:incorrectpassword" is base64 encoded as "ZW1haWw6aW5jb3JyZWN0cGFzc3dvcmQ="
  const incorrectPasswordHeader = 'Basic ZW1haWw6aW5jb3JyZWN0cGFzc3dvcmQ=';
  // "admin@gmail.com:password" is base64 encoded as "YWRtaW5AZ21haWwuY29tOnBhc3N3b3Jk"
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const validAdminHeader = 'Basic YWRtaW5AZ21haWwuY29tOnBhc3N3b3Jk';
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;

  beforeEach(async () => {
    // Reset the database between each test
    await sequelize.sync({ force: true });

    user = await userService.createUser({
      email: 'email',
      password: 'password',
      companyName: 'Kramerica',
    });

    mockReq = {
      headers: {},
    } as unknown as Request;
    // res.status is often followed by json
    // If you don't add a mock for json you will get "cannot read properties of undefined"
    mockRes = {
      status: vi.fn(() => ({
        json: vi.fn(),
      })),
    } as unknown as Response;
    mockNext = vi.fn();
  });

  test('should return 401 if authorization header is not included', async () => {
    await authenticate()(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  test('should return 401 if authorization header is not Basic authentication', async () => {
    mockReq = {
      headers: {
        authorization: withoutBasicHeader,
      },
    } as unknown as Request;

    await authenticate()(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  test('should return 401 if user with email does not exist', async () => {
    // Remove user with email manually
    await UserModel.destroy({ where: {} });
    mockReq = {
      headers: {
        authorization: validHeader,
      },
    } as unknown as Request;

    await authenticate()(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  test('should return 401 if user exist but with invalid password', async () => {
    mockReq = {
      headers: {
        authorization: incorrectPasswordHeader,
      },
    } as unknown as Request;

    await authenticate()(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  test('should return 403 if admin is required and user is not an admin', async () => {
    mockReq = {
      headers: {
        authorization: validHeader,
      },
    } as unknown as Request;

    await authenticate({
      admin: true,
    })(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
  });

  test('should call next if user is authenticated and set req.user', async () => {
    mockReq = {
      headers: {
        authorization: validHeader,
      },
    } as unknown as Request;

    await authenticate()(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toEqual(
      expect.objectContaining({
        id: expect.anything(),
        email: 'email',
        // Password is hashed so you cannot compare its exact value
        password: expect.anything(),
        companyName: 'Kramerica',
      }),
    );
  });
});
