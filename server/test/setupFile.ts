import { beforeEach, vi } from 'vitest';
import { User } from '../src/model/user.interface';
import sequelize from '../src/db/conn';
import userService from '../src/service/user.db.service';

// Mock without a factory function will instead of loading conn.ts
// it will load __mocks__/conn.ts which returns a Sequelize instance
// connected to a in-memory sqlite database
vi.mock('../src/db/conn.ts');

/* eslint-disable import-x/no-mutable-exports */
export let user: User;
export let adminUser: User;
export let authorizationHeader: string;
export let adminAuthorizationHeader: string;
/* eslint-enable import-x/no-mutable-exports */

// Define user, adminUser, authorizationHeader, and adminAuthorizationHeader
beforeEach(async () => {
  await sequelize.sync({ force: true });

  // Must run in beforeEach after sequelize.sync(...) otherwise
  // a SQLITE_ERROR no such table error is thrown
  user = await userService.createUser({
    email: 'email',
    password: 'password',
    companyName: 'Kramerica',
  });
  // "email:password" base64 encoded is "ZW1haWw6cGFzc3dvcmQ="
  authorizationHeader = 'Basic ZW1haWw6cGFzc3dvcmQ=';
  adminUser = await userService.createUser({
    email: 'admin@gmail.com',
    password: 'password',
    companyName: 'Vandelay',
  });
  // "admin@gmail.com:password" base64 encoded is "YWRtaW5AZ21haWwuY29tOnBhc3N3b3Jk"
  adminAuthorizationHeader = 'Basic YWRtaW5AZ21haWwuY29tOnBhc3N3b3Jk';
});
