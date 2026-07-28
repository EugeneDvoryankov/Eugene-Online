import {
  expect,
  test,
  describe,
  beforeEach,
  vi,
  beforeAll,
  afterAll,
} from 'vitest';
import SuperTest from 'supertest';

import app from '../../src/start';
import bookingService from '../../src/service/booking.db.service';
import { Booking } from '../../src/model/booking.interface';
import userService from '../../src/service/user.db.service';
import BookingModel from '../../src/db/Booking.db';
import { adminAuthorizationHeader, authorizationHeader, user } from '../setupFile';
// import { Booking } from "../../src/model/booking.interface";

const request = SuperTest(app);

describe('The booking router', () => {
  const bookingTestData: Omit<Booking, 'id' | 'userId'> = {
    type: 'update',
    year: 2025,
    month: 5,
    day: 20,
    time: 17,
  };

  beforeAll(async () => {
    // Adding bookings and deleting bookings depends on the current time
    // Set the current time manually so your tests doesn't depend on the currnet time
    const date = Date.UTC(2025, 4, 20, 16, 30);
    vi.useFakeTimers();
    vi.setSystemTime(date);
    vi.stubEnv('TZ', 'UTC');

    /* bookingTestData = {
      type: 'update',
      year: 2025,
      month: 5,
      day: 20,
      time: 17,
      userId: testUser.id,
    }; */
  });

  afterAll(() => {
    // Start using the current time again
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  describe('get bookings', () => {
    const getRequest = (queryParams?: string) => {
      const queryString = queryParams ? `?${queryParams}` : '';
      return request
        .get(`/api/bookings${queryString}`)
        .set('Authorization', authorizationHeader);
    };

    test('it should return 400 if from and to are not ISO8601 strings', async () => {
      const fromRes = await getRequest('from=111');
      expect(fromRes.statusCode).toBe(400);

      const toRes = await getRequest('to=555');
      expect(toRes.statusCode).toBe(400);
    });

    test('it should return 200 with an empty array if there are no bookings', async () => {
      const res = await getRequest();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    test('it should return 200 with only the bookings between from and to', async () => {
      // Out of range
      await bookingService.addBooking({
        ...bookingTestData,
        day: 21,
        time: 14,
        userId: user.id,
      });
      // In range
      await bookingService.addBooking({
        ...bookingTestData,
        day: 21,
        time: 15,
        userId: user.id,
      });
      // In range
      await bookingService.addBooking({
        ...bookingTestData,
        day: 21,
        time: 16,
        userId: user.id,
      });
      // Out of range
      await bookingService.addBooking({
        ...bookingTestData,
        day: 21,
        time: 17,
        userId: user.id,
      });

      // In the request I get the 14:00 booking which I should not get
      const res = await getRequest('from=2025-05-21T14:30:00Z&to=2025-05-21T16:30:00Z');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ time: 15 }),
          expect.objectContaining({ time: 16 }),
        ]),
      );
    });

    test('it should return 200 with only bookings after from', async () => {
      // Out of range
      await bookingService.addBooking({
        ...bookingTestData,
        day: 21,
        time: 16,
        userId: user.id,
      });
      // In range
      await bookingService.addBooking({
        ...bookingTestData,
        day: 21,
        time: 17,
        userId: user.id,
      });

      const res = await getRequest('from=2025-05-21T16:30:00Z');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ time: 17 }),
        ]),
      );
    });

    test('it should return 200 with only bookings before to', async () => {
      // In range
      await bookingService.addBooking({
        ...bookingTestData,
        day: 21,
        time: 16,
        userId: user.id,
      });
      // Out of range
      await bookingService.addBooking({
        ...bookingTestData,
        day: 21,
        time: 17,
        userId: user.id,
      });

      const res = await getRequest('to=2025-05-21T16:30:00Z');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ time: 16 }),
        ]),
      );
    });

    test('it should return 200 with an array of bookings', async () => {
      // Add a booking, the array should now include that booking
      await bookingService.addBooking({ ...bookingTestData, userId: user.id });

      const res = await getRequest();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('get my bookings', () => {
    const getRequest = () => request
      .get('/api/bookings/me')
      .set('Authorization', authorizationHeader);

    test('it should return 401 if the user is not authenticated', async () => {
      const res = await request
        .get('/api/bookings/me');

      expect(res.statusCode).toBe(401);
    });

    test('it should return 200 with the user bookings', async () => {
      const addedBookingOne = await bookingService.addBooking({
        ...bookingTestData,
        day: 21,
        time: 15,
        userId: user.id,
      });
      const addedBookingTwo = await bookingService.addBooking({
        ...bookingTestData,
        day: 21,
        time: 16,
        userId: user.id,
      });
      // Create a booking that belongs to another user
      const otherUser = await userService.createUser({
        email: 'other2@gmail.com',
        password: 'password',
        companyName: 'Another Company',
      });
      await bookingService.addBooking({
        ...bookingTestData,
        day: 21,
        time: 17,
        userId: otherUser.id,
      });

      const res = await getRequest();

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: addedBookingOne.id,
          }),
          expect.objectContaining({
            id: addedBookingTwo.id,
          }),
        ]),
      );
    });
  });

  describe('get booking', () => {
    const getRequest = (id: string) => request
      .get(`/api/bookings/${id}`)
      .set('Authorization', authorizationHeader);

    test('it should return 401 if the user is not authenticated', async () => {
      const addedBooking = await bookingService.addBooking({ ...bookingTestData, userId: user.id });

      const res = await request
        .get(`/api/bookings/${addedBooking.id}`);

      expect(res.statusCode).toBe(401);
    });
    test('it should return 404 if a booking with id does not exist', async () => {
      // Id that does not exist
      const id = 'eaa88e5e-7d45-4221-abcf-a8cd5ee58cb3';

      const res = await getRequest(id);

      expect(res.statusCode).toBe(404);
    });

    test('it should return 200 with the booking', async () => {
      const addedBooking = await bookingService.addBooking({ ...bookingTestData, userId: user.id });

      const res = await getRequest(addedBooking.id);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          ...bookingTestData,
          id: addedBooking.id,
        }),
      );
    });
  });

  describe('create booking', () => {
    const createRequest = (data?: string | object | undefined) => request
      .post('/api/bookings')
      .set('Authorization', authorizationHeader)
      .send(data);

    test('it should return 401 if the user is not authenticated', async () => {
      const res = await request
        .post('/api/bookings')
        .send(bookingTestData);

      expect(res.statusCode).toBe(401);
    });
    test('it should return 400 if any property is excluded', async () => {
      const { type, ...excludingType } = bookingTestData;
      const typeRes = await createRequest(excludingType);
      expect(typeRes.statusCode).toBe(400);

      const { year, ...excludingYear } = bookingTestData;
      const yearRes = await createRequest(excludingYear);
      expect(yearRes.statusCode).toBe(400);

      const { month, ...excludingMonth } = bookingTestData;
      const monthRes = await createRequest(excludingMonth);
      expect(monthRes.statusCode).toBe(400);

      const { day, ...excludingDay } = bookingTestData;
      const dayRes = await createRequest(excludingDay);
      expect(dayRes.statusCode).toBe(400);

      const { time, ...excludingTime } = bookingTestData;
      const timeRes = await createRequest(excludingTime);
      expect(timeRes.statusCode).toBe(400);
    });

    test('it should return 400 if the booking date is a previous date', async () => {
      // The booking has a date which happened a half hour ago
      const res = await createRequest({ ...bookingTestData, time: 16 });

      expect(res.statusCode).toBe(400);
    });

    test('it should return 400 if the time slot is already booked', async () => {
      const firstBookingRes = await createRequest(bookingTestData);
      expect(firstBookingRes.statusCode).toBe(201);

      const secondBookingRes = await createRequest(bookingTestData);
      expect(secondBookingRes.statusCode).toBe(400);
    });

    test('it should return 201 with the created booking', async () => {
      const res = await createRequest(bookingTestData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          ...bookingTestData,
          id: expect.anything(),
          userId: user.id,
        }),
      );
      expect(res.headers.location).toBe(`/api/bookings/${res.body.id}`);
    });
  });

  describe('delete booking', () => {
    let previousBooking: Omit<Booking, 'id'>;
    let upcomingBooking: Omit<Booking, 'id'>;
    const deleteRequest = (id: string) => request
      .delete(`/api/bookings/${id}`)
      .set('Authorization', authorizationHeader);

    beforeEach(() => {
      previousBooking = {
        ...bookingTestData,
        year: 2025,
        month: 5,
        day: 20,
        // If the booking took place a half hour before
        time: 16,
        userId: user.id,
      };
      upcomingBooking = {
        ...bookingTestData,
        year: 2025,
        month: 5,
        day: 20,
        // If the booking takes place in a half hour
        time: 17,
        userId: user.id,
      };
    });

    test('it should return 401 if the user is not authenticated', async () => {
      const booking = await bookingService.addBooking(upcomingBooking);

      const res = await request
        .delete(`/api/bookings/${booking.id}`);

      expect(res.statusCode).toBe(401);
    });

    test('it should return 400 if id is not uuid', async () => {
      // Id should be UUID but is number as string
      const id = '1';

      const res = await deleteRequest(id);

      expect(res.statusCode).toBe(400);
    });

    test('it should return 400 trying to delete a booking that has already happened', async () => {
      const booking = await BookingModel.create(previousBooking);

      const res = await deleteRequest(booking.id);

      expect(res.statusCode).toBe(400);
      const bookings = await bookingService.getBookings();
      expect(bookings).toHaveLength(1);
    });

    test('it should return 403 if deleting a booking that is not the user booking', async () => {
      const otherUser = await userService.createUser({
        email: 'other@gmail.com',
        password: 'password',
        companyName: 'Another Company',
      });
      const otherUserBooking = await BookingModel.create({
        ...upcomingBooking,
        userId: otherUser.id,
      });

      const res = await deleteRequest(otherUserBooking.id);

      expect(res.statusCode).toBe(403);
      const bookings = await bookingService.getBookings();
      expect(bookings).toHaveLength(1);
    });

    test('it should return 200 as an admin if you delete another user booking', async () => {
      const otherUser = await userService.createUser({
        email: 'other@gmail.com',
        password: 'password',
        companyName: 'Another Company',
      });
      const otherUserBooking = await BookingModel.create({
        ...upcomingBooking,
        userId: otherUser.id,
      });

      const res = await request
        .delete(`/api/bookings/${otherUserBooking.id}`)
        .set('Authorization', adminAuthorizationHeader);

      expect(res.statusCode).toBe(200);
      const bookings = await bookingService.getBookings();
      expect(bookings).toHaveLength(0);
    });

    test('it should return 200 even if the booking with id does not exist', async () => {
      // Id that does not exist
      const id = 'eaa88e5e-7d45-4221-abcf-a8cd5ee58cb3';

      const res = await deleteRequest(id);

      expect(res.statusCode).toBe(200);
    });

    test('it should return 200 and the booking should be removed', async () => {
      const booking = await bookingService.addBooking(upcomingBooking);

      const res = await deleteRequest(booking.id);

      expect(res.statusCode).toBe(200);
      const bookings = await bookingService.getBookings();
      expect(bookings).toHaveLength(0);
    });
  });
});
