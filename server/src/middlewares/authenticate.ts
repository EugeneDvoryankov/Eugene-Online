import { NextFunction, Request, Response } from 'express';
import userService from '../service/user.db.service';

// HTTP Basic authentication middleware
// https://medium.com/@elangoram1998/understanding-basic-authentication-in-node-js-9e3a43ad2cc9
// eslint-disable-next-line @stylistic/max-len
export default (options?: { admin: boolean }) => async (req: Request, res: Response, next: NextFunction) => {
  // Has format "Basic base64"
  // Email and password, "email:password", is base64 encoded
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Get the base64 string, decode it, and define email and password
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [email, password] = credentials.split(':');

  try {
    const authenticatedUser = await userService.authenticateUser(email, password);

    if (options && options.admin === true && authenticatedUser.admin !== true) {
      return res.status(403).json({ message: 'Route requires admin authorization' });
    }

    // The user is now accessible in middlewares and the route handlers with req.user
    req.user = authenticatedUser;
    return next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};
