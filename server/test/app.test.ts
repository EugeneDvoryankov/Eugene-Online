import {
  expect,
  test,
  describe,
  vi,
} from 'vitest';
import SuperTest from 'supertest';

import app from '../src/start';
// import { Task } from "../src/model/task.interface";

// Mock without a factory function will instead of loading conn.ts
// it will load __mocks__/conn.ts which returns a Sequelize instance
// connected to a in-memory sqlite database
vi.mock('../src/db/conn');

const request = SuperTest(app);

describe('The app', () => {
  test('should return 200 with a message', async () => {
    const res = await request.get('/api');

    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('HELLO WORLD');
  });
});
