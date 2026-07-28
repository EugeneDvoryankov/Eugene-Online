import { v4 as uuidv4 } from 'uuid';
import { Booking } from '../model/booking.interface';
import IBookingService from './booking.service.interface';

class BookingService implements IBookingService {
  private bookings: Booking[] = [];

  async getBooking(id: string): Promise<Booking | null> {
    const booking = this.bookings.find((savedBooking) => savedBooking.id === id);
    if (booking === undefined) {
      return null;
    }

    return JSON.parse(JSON.stringify(booking));
  }

  async getBookings(options?: { from?: string; to?: string; userId?: string }): Promise<Booking[]> {
    // Is either limited bookings by date or all bookings
    const requestedBookings = this.bookings.filter((booking) => {
      const bookingDate = new Date(booking.year, booking.month - 1, booking.day, booking.time);
      // from and to are optional
      const fromTimestamp = (options && options.from) ? new Date(options.from).getTime() : 0;
      const toTimestamp = (options && options.to) ? new Date(options.to).getTime() : Infinity;
      return bookingDate.getTime() >= fromTimestamp && bookingDate.getTime() < toTimestamp;
    });

    const userBookings = requestedBookings.filter((booking) => {
      if (options && options.userId) {
        return booking.userId === options.userId;
      }

      // If userId is not provided then return all bookings
      return true;
    });

    return JSON.parse(JSON.stringify(userBookings));
  }

  async addBooking(bookingData: Omit<Booking, 'id'>): Promise<Booking> {
    // Check that the booking date is a future date
    const bookingDate = new Date(
      bookingData.year,
      bookingData.month - 1,
      bookingData.day,
      bookingData.time,
    );
    if (bookingDate.getTime() < (new Date()).getTime()) {
      throw new Error('Cannot book a booking for a previous date');
    }

    // Check if the slot to be booked, year, month, day, time, is already booked
    const doubleBooking = this.bookings.find(
      (existingBooking) => existingBooking.year === bookingData.year
      && existingBooking.month === bookingData.month
      && existingBooking.day === bookingData.day
      && existingBooking.time === bookingData.time,
    );
    if (doubleBooking !== undefined) {
      throw new Error('Time slot is already booked');
    }

    const booking = {
      ...bookingData,
      id: uuidv4(),
    };
    // this.bookings.push(booking);
    this.bookings = [...this.bookings, booking];
    return JSON.parse(JSON.stringify(booking));
  }

  async removeBooking(id: string): Promise<void> {
    const booking = await this.getBooking(id);
    if (booking === null) {
      // The booking has already been deleted
      return;
    }

    const bookingDate = new Date(booking.year, booking.month - 1, booking.day, booking.time);
    if (bookingDate.getTime() < (new Date()).getTime()) {
      throw new Error('Cannot unbook a booking that has already happened');
    }

    // You should not be able to delete bookings that have already happened
    this.bookings = this.bookings.filter((existingBooking) => existingBooking.id !== id);
  }

  // Used for testing purposes
  async addOne(bookingData: Omit<Booking, 'id'>): Promise<Booking> {
    const booking = { ...bookingData, id: uuidv4() };
    this.bookings = [...this.bookings, booking];
    return booking;
  }

  // Used for testing purposes to reset the in-memory database between tests
  removeBookings() {
    this.bookings = [];
  }
}

const bookingService = new BookingService();
export default bookingService;
