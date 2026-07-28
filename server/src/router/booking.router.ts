import express, { Request, Response } from 'express';
import { body, param, query } from 'express-validator';
import bookingService from '../service/booking.db.service';
import { Booking } from '../model/booking.interface';
import validate from '../middlewares/validate';
import authenticate from '../middlewares/authenticate';

const bookingRouter = express.Router();

bookingRouter.get(
  '/',
  // Any user should be able to fetch bookings
  // But they need to login or register to make a booking
  // authenticate(),
  validate([
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
  ]),
  async (
    req: Request<
      Record<string, any> | undefined,
      unknown,
      unknown,
      { from?: string; to?: string }
    >,
    res: Response<Booking[] | string>,
  ) => {
    try {
      const bookings = await bookingService.getBookings({ ...req.query });
      return res.status(200).json(bookings);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log('e', e, e.message);
        return res.status(500).send(e.message);
      }

      return res.status(500).end();
    }
  },
);

// Must be placed above GET users/:id
// Otherwise requests to users/me will be sent to users/:id instead
bookingRouter.get(
  '/me',
  authenticate(),
  async (req: Request, res: Response<Booking[] | string>) => {
    try {
      if (!req.user) {
        return res.status(401).send('User is not authenticated');
      }

      const bookings = await bookingService.getBookings({ userId: req.user.id });
      return res.status(200).json(bookings);
    } catch (e: unknown) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }

      return res.status(500).end();
    }
  },
);

bookingRouter.get(
  '/:id',
  authenticate(),
  validate([
    param('id').isUUID(4),
  ]),
  async (req: Request<{ id: string }>, res: Response<Booking | string>) => {
    try {
      const booking = await bookingService.getBooking(req.params.id);
      if (booking === null) {
        return res.status(404).send('Booking with id does not exist');
      }

      return res.status(200).json(booking);
    } catch (e: unknown) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }

      return res.status(500).end();
    }
  },
);

bookingRouter.post(
  '/',
  authenticate(),
  validate([
    body('type').isIn(['consultation', 'update']),
    body('year').isInt(),
    body('month').isInt({ min: 1, max: 12 }),
    body('day').isInt({ min: 1, max: 31 }),
    body('time').isInt({ min: 6, max: 17 }),
  ]),
  async (
    req: Request<Record<string, any> | undefined, Booking | string, Omit<Booking, 'id' | 'userId'>>,
    res: Response<Booking | string>,
  ) => {
    try {
      try {
        // Take userId from req.user
        const booking = await bookingService.addBooking({ ...req.body, userId: req.user!.id });
        res.location(`/api/bookings/${booking.id}`);
        return res.status(201).json(booking);
      } catch (error) {
        console.log('Add booking error', error);
        return res.status(400).send('Could not add booking');
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }

      return res.status(500).end();
    }
  },
);

bookingRouter.delete(
  '/:id',
  authenticate(),
  validate([
    param('id').isUUID(4),
  ]),
  async (req: Request<{ id: string }>, res: Response<string>) => {
    try {
      const booking = await bookingService.getBooking(req.params.id);
      if (!booking) {
        // The booking was already deleted
        return res.status(200).end();
      }

      if (!req.user!.admin) {
        // If the user is not an admin they should not be able to delete other user bookings
        if (booking.userId !== req.user?.id) {
          return res.status(403).send('Cannot delete another user booking');
        }
      }

      try {
        await bookingService.removeBooking(req.params.id);
        return res.status(200).end();
        // eslint-disable-next-line
      } catch (error) {
        return res.status(400).send('Could not delete booking');
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        return res.status(500).send(e.message);
      }

      return res.status(500).end();
    }
  },
);

export default bookingRouter;
