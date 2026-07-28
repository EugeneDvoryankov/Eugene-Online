import { Op } from 'sequelize';
import { Booking } from '../model/booking.interface';
import IBookingService from './booking.service.interface';
import BookingModel from '../db/Booking.db';

/* eslint-disable class-methods-use-this */
class BookingService implements IBookingService {
  async getBooking(id: string): Promise<Booking | null> {
    const booking = await BookingModel.findByPk(id);
    return booking;
  }

  async getBookings(options?: { from?: string; to?: string; userId?: string }): Promise<Booking[]> {
    // The filters object will look like
    // The comparisons can also have default values gte can be -Infinity
    // and lte can be Infinity
    /*
      year: {
        [Op.gte]: (new Date(options.from)).getFullYear(),
        [Op.lte]: (new Date(options.to)).getFullYear(),
      },
      month: {
        [Op.gte]: (new Date(options.from)).getMonth() + 1,
        [Op.lte]: (new Date(options.to)).getMonth() + 1,
      },
      day: {
        [Op.gte]: (new Date(options.from)).getDate(),
        [Op.lte]: (new Date(options.to)).getDate(),
      },
      userId: options.userId,
    */
    // You cannot use Infinity, it doesn't exist in SQL
    /* const filters = {
      year: {
        [Op.gte]: (options && options.from) ? (new Date(options.from)).getFullYear() : -Infinity,
        [Op.lte]: (options && options.to) ? (new Date(options.to)).getFullYear() : Infinity,
      },
      month: {
        [Op.gte]: (options && options.from) ? (new Date(options.from)).getMonth() + 1 : -Infinity,
        [Op.lte]: (options && options.to) ? (new Date(options.to)).getMonth() + 1 : Infinity,
      },
      day: {
        [Op.gte]: (options && options.from) ? (new Date(options.from)).getDate() : -Infinity,
        [Op.lte]: (options && options.to) ? (new Date(options.to)).getDate() : Infinity,
      },
      ...(options && options.userId ? { userId: options.userId } : {}),
    }; */
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type BookingFilter = {
      year?: {
        [Op.gte]?: number;
        [Op.lte]?: number;
      };
      month?: {
        [Op.gte]?: number;
        [Op.lte]?: number;
      };
      day?: {
        [Op.gte]?: number;
        [Op.lte]?: number;
      };
      time?: {
        [Op.gt]?: number;
        [Op.lte]?: number;
      };
      userId?: string;
    };
    const filters: BookingFilter = {};
    if (options && options.from) {
      const fromDate = new Date(options.from);
      filters.year = {
        ...(filters.year || {}),
        [Op.gte]: fromDate.getUTCFullYear(),
      };
      filters.month = {
        ...(filters.month || {}),
        [Op.gte]: fromDate.getUTCMonth() + 1,
      };
      filters.day = {
        ...(filters.day || {}),
        [Op.gte]: fromDate.getUTCDate(),
      };
      filters.time = {
        ...(filters.time || {}),
        // Should be gt instead of gte
        // because if you are requesting bookings from 14:30, UTC hours will be 14
        // If you do gte you will get bookings that are booked for 14:00 as well
        [Op.gt]: fromDate.getUTCHours(),
      };
    }

    if (options && options.to) {
      const fromDate = new Date(options.to);
      filters.year = {
        ...(filters.year || {}),
        [Op.lte]: fromDate.getUTCFullYear(),
      };
      filters.month = {
        ...(filters.month || {}),
        [Op.lte]: fromDate.getUTCMonth() + 1,
      };
      filters.day = {
        ...(filters.day || {}),
        [Op.lte]: fromDate.getUTCDate(),
      };
      filters.time = {
        ...(filters.time || {}),
        [Op.lte]: fromDate.getUTCHours(),
      };
    }
    if (options && options.userId) {
      filters.userId = options.userId;
    }

    const bookings = await BookingModel.findAll({ where: filters });
    return bookings;
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
    const doubleBooking = await BookingModel.findOne({
      where: {
        year: bookingData.year,
        month: bookingData.month,
        day: bookingData.day,
        time: bookingData.time,
      },
    });
    if (doubleBooking !== null) {
      throw new Error('Time slot is already booked');
    }

    const booking = await BookingModel.create({
      type: bookingData.type,
      year: bookingData.year,
      month: bookingData.month,
      day: bookingData.day,
      time: bookingData.time,
      userId: bookingData.userId,
    });

    return booking;
  }

  async removeBooking(id: string): Promise<void> {
    const booking = await BookingModel.findByPk(id);
    if (booking === null) {
      // The booking has already been deleted
      return;
    }

    // You should not be able to delete bookings that have already happened
    const bookingDate = new Date(booking.year, booking.month - 1, booking.day, booking.time);
    if (bookingDate.getTime() < (new Date()).getTime()) {
      throw new Error('Cannot unbook a booking that has already happened');
    }

    await booking.destroy();
  }

  // Used for testing purposes
  /* async addOne(bookingData: Omit<Booking, 'id'>): Promise<Booking> {
    const booking = { ...bookingData, id: uuidv4() };
    this.bookings = [...this.bookings, booking];
    return booking;
  }

  // Used for testing purposes to reset the in-memory database between tests
  removeBookings() {
    this.bookings = [];
  } */
}
/* eslint-enable class-methods-use-this */

const bookingService = new BookingService();
export default bookingService;
