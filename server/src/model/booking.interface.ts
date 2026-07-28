type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type Day = | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;

type TimeSlot = 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17;

export interface Booking {
  id: string;
  type: 'consultation' | 'update';
  // Year, month, day, and time are UTC dates
  year: number;
  month: Month; // 1-12
  day: Day; // 1-31
  // Assuming a booking always is an hour
  // If time is 6 then that would refer to the slot 06:00-07:00
  time: TimeSlot;
  userId: string;
}
