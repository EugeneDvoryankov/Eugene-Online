import { User } from './model/user.interface';

// The authenticate middleware adds user to the request
// Therefore you need to add the property as optional because
// all routes do not necessarily require authentication
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
