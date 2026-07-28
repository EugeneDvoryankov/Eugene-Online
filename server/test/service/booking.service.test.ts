import {
  expect,
  test,
  describe,
  beforeEach,
  vi,
  beforeAll,
  afterAll,
} from 'vitest';
import bookingService from '../../src/service/booking.service';
import { Booking } from '../../src/model/booking.interface';

describe('The booking service', () => {
  beforeAll(() => {
    // Adding bookings and deleting bookings depends on the current time
    // Set the current time manually so your tests doesn't depend on the currnet time
    const date = Date.UTC(2025, 4, 20, 16, 30);
    vi.useFakeTimers();
    vi.setSystemTime(date);
    vi.stubEnv('TZ', 'UTC');
  });

  afterAll(() => {
    // Start using the current time again
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  beforeEach(() => {
    bookingService.removeBookings();
  });

  test('If a booking is added to the list then it should be in the list', async () => {
    const bookingData: Omit<Booking, 'id'> = {
      type: 'update',
      year: 2025,
      month: 5,
      day: 20,
      time: 17,
      userId: 'ff7d615c-c38c-4e6a-b8a7-9626acbce3d5',
    };

    await bookingService.addBooking(bookingData);

    const bookings = await bookingService.getBookings();
    // expect(bookings.some((task) => task.description === desc)).toBeTruthy();
    expect(bookings).toHaveLength(1);
  });
});
