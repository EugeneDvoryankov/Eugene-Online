import express, { Request, Response } from 'express';
import {
  body,
  checkExact,
  param,
} from 'express-validator';
import userService from '../service/user.db.service';
import { User } from '../model/user.interface';
import validate from '../middlewares/validate';
import authenticate from '../middlewares/authenticate';

const userRouter = express.Router();

function publicUser(user: User) {
  const { id, email, phoneNumber, companyName, admin } = user;
  return { id, email, phoneNumber, companyName, admin };
}

/**
 * GET /users
 * Get all users
 */
userRouter.get(
  '/',
  authenticate({ admin: true }),
  async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users.map(publicUser));
    } catch (e: unknown) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }
      return res.status(500).end();
    }
  },
);

// Needs to be placed above GET users/:id
// Otherwise a request to users/me will go to /users/:id instead
userRouter.get(
  '/me',
  authenticate(),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).send('User is not authenticated');
      }

      const user = await userService.getUser(req.user.id);
      if (!user) return res.sendStatus(404);
      return res.status(200).json(publicUser(user));
    } catch (e: unknown) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }
      return res.status(500).end();
    }
  },
);

/**
 * GET /users
 * Get a specific user by its id
 */
userRouter.get(
  '/:id',
  authenticate({ admin: true }),
  validate([
    param('id').isUUID(4),
  ]),
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const user = await userService.getUser(req.params.id);
      if (!user) {
        return res.status(404).send('User with id does not exist');
      }
      return res.status(200).json(publicUser(user));
    } catch (e: unknown) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }
      return res.status(500).end();
    }
  },
);

userRouter.patch(
  '/:id',
  authenticate(),
  validate([
    param('id').isUUID(4),
    body('phoneNumber').optional().isString(),
    body('password').optional().isLength({ min: 6 }),
    // If any other fields are added besides id, phoneNumber, and password, throw an error
    checkExact(),
  ]),
  async (req: Request<{ id: string }, unknown, Partial<User>>, res: Response) => {
    if (req.user?.id !== req.params.id && !req.user?.admin) return res.sendStatus(403);

    try {
      const updated = await userService.updateUser(req.params.id, req.body);
      if (!updated) return res.status(404).send('User not found');
      return res.status(200).json(publicUser(updated));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      return res.status(500).end();
    }
  },
);

userRouter.post(
  '/',
  validate([
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('phoneNumber').optional().isString(),
    body('companyName').isString(),
  ]),
  async (req, res) => {
    try {
      const user = await userService.createUser(req.body);
      return res.status(201).json(publicUser(user));
    } catch (e: any) {
      return res.status(400).send(e.message);
    }
  },
);

userRouter.post(
  '/login',
  async (
    req: Request,
    res: Response,
  ) => {
    const { email, password } = req.body;
    try {
      try {
        const user = await userService.authenticateUser(email, password);
        return res.status(200).json(publicUser(user));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return res.status(401).send({ message: 'Invalid email or password' });
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }

      return res.status(500).end();
    }
  },
);

export default userRouter;
