import { Booking } from '../model/booking.interface';

interface IBookingService {
  getBooking(id: string): Promise<Booking | null>;

  getBookings(options?: { from?: string; to?: string; userId?: string }): Promise<Booking[]>;

  addBooking(bookingData: Omit<Booking, 'id'>): Promise<Booking>;

  removeBooking(id: string): Promise<void>;
}

export default IBookingService;
