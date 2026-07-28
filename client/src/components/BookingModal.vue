<!-- https://fadamakis.com/vue3-creating-a-reusable-modal-component-ac4adbe88a18 -->
<!-- https://bootstrap-vue-next.github.io/bootstrap-vue-next/docs/components/modal.html -->
<script lang="ts">
import * as api from '@/api';
import type { Booking } from '@/types';
import { BButton, BCol, BContainer, BModal, BRow, useToast, type BaseColorVariant } from 'bootstrap-vue-next';
import * as auth from '../services/auth';
import { useRouter } from 'vue-router';

interface SimplifiedDate {
  year: number;
  // monthIndex is easier to work with because JavaScript's date object uses it
  // Just convert to index when you fetch bookings and when you add a new booking
  monthIndex: number;
  date: number;
}

type SimplifiedDateTime = SimplifiedDate & { time: number };

interface BookingDate {
  date: SimplifiedDate;
  times: number[];
  open: boolean;
}

interface BookingModalData {
  isModalOpen: boolean;
  selectedDate: SimplifiedDate | null;
  selectedTime: number | null;
  weekOffset: number;
  dates: Record<string, BookingDate>;
}

export default {
  components: { BButton, BModal, BContainer, BRow, BCol },
  data(): BookingModalData {
    return {
      isModalOpen: false,
      // Set the default selected date to the current date
      /* selectedDate: {
        year: (new Date()).getFullYear(),
        monthIndex: (new Date()).getMonth(),
        date: (new Date()).getDate(),
      }, */
      // Set default date to null
      selectedDate: null,
      selectedTime: null,
      weekOffset: 0,
      /* dates: {
        '16/2': { day: 'Mån', date: '16/2', times: ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'], open: true },
        '17/2': { day: 'Tis', date: '17/2', times: ['11:00', '12:00'], open: true },
        '18/2': { day: 'Ons', date: '18/2', times: [], open: true },
        '19/2': { day: 'Tors', date: '19/2', times: [], open: true },
        '20/2': { day: 'Fre', date: '20/2', times: [], open: true },
        '21/2': { day: 'Lör', date: '21/2', times: [], open: false },
        '23/2': { day: 'Sön', date: '22/2', times: [], open: false },
      }, */
      dates: {},
    };
  },
  computed: {
    dateKey(): string {
      if (!this.selectedDate) {
        return '';
      }

      // Access the dates object with a key like 2025-05-20
      return `${this.selectedDate.year}-${this.selectedDate.monthIndex}-${this.selectedDate.date}`;
    },
    selectedDateTimes(): number[] {
      if (!this.selectedDate) {
        return [];
      }

      if (!this.dates[this.dateKey]) {
        return [];        
      }

      return this.dates[this.dateKey]?.times || [];
    },
    /* token(): string | null {
      return auth.basicToken.value;
    }, */
    activeDates(): BookingDate[] {
      const from = this.weekOffset * 7;
      const to = 7 + this.weekOffset * 7;
      return Object.values(this.dates).slice(from, to);
    },
    todaySelected(): boolean {
      if (!this.selectedDate) {
        return false;
      }

      const todaysDate = new Date();
      return this.selectedDate.year === todaysDate.getFullYear()
        && this.selectedDate.monthIndex === todaysDate.getMonth()
        && this.selectedDate.date === todaysDate.getDate();
    },
  },
  methods: {
    getDateButtonVariant(date: BookingDate, selectedDate: SimplifiedDate | null) {
      // The date is considered close if it has already passed or
      // is a Saturday or Sunday
      if (date.open === false) {
        return 'outline-secondary';
      }

      if (selectedDate === null) {
        return 'outline-primary';
      }

      const isSelected = date.date.year === selectedDate.year &&
        date.date.monthIndex === selectedDate.monthIndex &&
        date.date.date === selectedDate.date;
      return isSelected ? 'primary' : 'outline-primary';
    },
    getTimeButtonVariant(time: number) {
      // If the time has passed then the variant should be outline-secondary
      if (this.todaySelected) {
        const currentDay = new Date();
        // Plus one because you do not want a user to be able to
        // book the current hour
        // If the time is 13:48, they should not be able to book the time 13:00
        if (time < currentDay.getHours() + 1) {
          return 'outline-secondary';
        }
      }

      // If the time is selected then the variant should be primary
      if (this.selectedTime === time) {
        return 'primary';
      }

      // Otherwise the time should be available and be outline-primary
      return 'outline-primary';
    },
    clickDate(date: SimplifiedDate) {
      console.log('Clicked date', date);
      this.selectedDate = date;
      // Reset selected times when changing dates
      this.selectedTime = null;
    },
    getStartOfWeek() {
      const d = new Date();
      const day = d.getDay();   // 0 = Sunday, 1 = Monday, and so on
      // If it's a Saturday or Sunday, it should return next week's Monday
      let diff;
      if (day === 0) {
        // Sunday
        diff = 1;
      } else if (day === 6) {
        // Saturday
        diff = 2;
      } else {
        // If it's a Sunday, go back 6 days
        // diff = (day === 0 ? -6 : 1 - day);
        diff = 1 - day;
      }
      d.setDate(d.getDate() + diff);
      d.setHours(0, 0, 0, 0); // start of day, midnight
      return d;
    },
    getDateOpen(date: Date) {
      // A date is considered open if it's not a Saturday or Sunday
      // and if it's an upcoming date or today's date
      if (date.getDay() === 0 || date.getDay() === 6) {
        // The date is a Saturday or Sunday
        return false;
      }

      // This if statement does not work
      /* if (date.getTime() < Date.now()) {
        // The date is in the past
        return false;
      } */
      // The date is only in the past if getDate is lower than (new Date()).getDate
      // You have to consider month as well
      const currentDate = new Date();
      if ((date.getMonth() === currentDate.getMonth()) && (date.getDate() < currentDate.getDate())) {
        return false;
      }

      return true;
    },
    getDateTimes(currentDate: Date, bookings: Booking[]): number[] {
      // The times available for booking
      // But you need to filter the times that are already booked by other users
      // const times = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
      // Times need to be generated depending on the timezone
      // Start with UTC dates and convert to local and use getHours
      // const times = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
      const times = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((utcHour) => {
        const utcDate = new Date();
        utcDate.setUTCHours(utcHour);
        return utcDate.getHours();
      });

      // Convert bookings from UTC to local time
      const localBookings: SimplifiedDateTime[] = bookings.map((booking) => {
        const utcBookingDate = new Date(
          Date.UTC(booking.year, booking.month - 1, booking.day, booking.time),
        );
        return {
          year: utcBookingDate.getFullYear(),
          monthIndex: utcBookingDate.getMonth(),
          date: utcBookingDate.getDate(),
          time: utcBookingDate.getHours(),
        };
      });

      // All bookings for this specific date
      // Using UTC functions because booking times are UTC times
      const bookingsToday = localBookings.filter(
        (booking) => booking.year === currentDate.getFullYear()
          && booking.monthIndex === currentDate.getMonth()
          && booking.date === currentDate.getDate(),
      );

      // eslint-disable-next-line unicorn/prefer-set-has
      const bookingHours: number[] = bookingsToday.map((booking) => booking.time);
      // console.log('localBookedTimes', currentDate, localBookedTimes);

      return times.filter((time) => bookingHours.includes(time) === false);
    },
    showToast(title: string, body: string, variant: keyof BaseColorVariant) {
      this.toast.create({ title, body, variant: variant || 'primary' });
    },
    async fetchBookings() {
      console.log('Fetching bookings');
      let bookings: Booking[] = [];

      try {
        bookings = await api.getBookings();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Show toast and close modal if bookings could not be fetched
        this.showToast('Kunde inte hämta bokningar', 'Verifiera din internetanslutning', 'danger');
      }

      // Get the start of the week date object and iterate through the week
      // and define the dates object
      const startOfWeek = this.getStartOfWeek();
    
      // Had only 7 days generated first but I will add 21 days
      // and only show 7 days at a time
      for (let i = 0; i < 21; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);

        // Month + 1 because getMonth returns the index of the month
        // Should you get UTC dates or local dates?
        // I think local dates
        // The only thing you need to convert is from UTC to local when you fetch bookings
        const simplifiedDate = {
          year: currentDay.getFullYear(),
          monthIndex: currentDay.getMonth(),
          date: currentDay.getDate(),
        };
        const currentDateKey = `${simplifiedDate.year}-${simplifiedDate.monthIndex}-${simplifiedDate.date}`;
        // const shortDate = `${currentDay.getDate()}/${currentDay.getMonth() + 1}`;
        const availableTimes = this.getDateTimes(currentDay, bookings);
        const open = this.getDateOpen(currentDay);

        this.dates[currentDateKey] = { date: simplifiedDate, times: availableTimes, open };
      }
    },
    async onSubmit() {
      console.log('Booking modal on submit');
      if (!this.selectedDate || !this.selectedTime) {
        this.toast.create({
          title: 'Bokning misslyckades',
          body: 'Måste specificeras datum och tid',
          variant: 'danger',
        });
        return;
      }

      // If the user tries to book a time when not authenticated redirect to login
      if (!auth.basicToken.value) {
        this.router.push('/login');
        return;
      }

      try {
        // Convert times to UTC
        const { year, monthIndex, date } = this.selectedDate;
        const time = this.selectedTime;
        const dateObj = new Date(year, monthIndex, date, time);
        await api.createBooking({
          year: dateObj.getUTCFullYear(),
          month: dateObj.getUTCMonth() + 1,
          date: dateObj.getUTCDate(),
          time: dateObj.getUTCHours(),
        });
        this.toast.create({
          title: 'Konsultation bokad',
          body: 'Vi ser fram emot att samarbeta med er!',
          variant: 'success',
        });

        // When a new booking has been created fetch bookings again
        // The user can then see that the time is booked
        await this.fetchBookings();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.toast.create({
          title: 'Bokning misslyckades',
          body: 'Både datum och tid måste specificeras',
          variant: 'danger',
        });
      }
    },
    getShortDay(date: SimplifiedDate): string {
      // In addition to writing the date in format "20/5"
      // Include a short day like "Tors", "Fre"
      const dateObj = new Date(date.year, date.monthIndex, date.date);
      const shortDay = dateObj.toLocaleDateString('sv-SE', { weekday: 'short' });
      const shortDayCapitalized = `${shortDay.charAt(0).toUpperCase()}${shortDay.slice(1).toLowerCase()}`;
      return shortDayCapitalized;
    },
  },
  setup() {
    const toast = useToast();
    // You should be able to use this.$router but TypeScript complains about it
    const router = useRouter();
    return { toast, router };
  },
  async mounted() {
    await this.fetchBookings();
  },
  // Not needed anymore, unauthenticated users can also fetch bookings
  /* watch: {
    async token(updatedToken: string | null, oldToken: string | null) {
      if (updatedToken && !oldToken) {
        console.log('Token changed, fetching bookings');
        // User just logged in, retry fetching
        await this.fetchBookings();
      }
    },
  }, */
};
</script>

<template>
  <!-- <AppModal @close="closeModal">
    <template #title>
      Boka möte
    </template>
    <template #body>
      <p>Booking Modal Test</p>
    </template>
  </AppModal> -->

  <BButton
    variant="outline-primary"
    size="sm"
    @click="isModalOpen = !isModalOpen"
    class="d-flex align-items-center gap-2"
  >
    <i class="bi bi-calendar-event"></i>
    <span>Boka konsultation</span>
  </BButton>
  <BModal
    v-model="isModalOpen"
    title="Boka möte"
    ok-title="Boka"
    :ok-disabled="selectedTime === null"
    cancel-title="Avbryt"
    @ok="onSubmit()"
    role="dialog"
    aria-modal="true"
    aria-labelledby="Boka möte"
  >
    <div class="d-flex flex-column gap-4">
      <div class="d-flex flex-column gap-1">
        <div class="d-flex flex-row justify-content-between">
          <h2 class="fs-6">Välj datum</h2>
          <div>
            <!-- Week offset can be at minimum 0 -->
            <!-- Week offset can be at most 2 -->
            <!-- When the user changes week, reset selected date and time -->
            <BButton
              :disabled="weekOffset <= 0"
              variant="light"
              size="sm"
              @click="weekOffset = Math.max(weekOffset - 1, 0); selectedTime = null; selectedDate = null"
            >
              &lsaquo; Föregående
            </BButton>
            <BButton
              :disabled="weekOffset >= 2"
              variant="light"
              size="sm"
              @click="weekOffset = Math.min(weekOffset + 1, 2); selectedTime = null; selectedDate = null"
            >
              Nästa &rsaquo;
            </BButton>
          </div>
        </div>
        <BContainer>
          <!-- The no-gutters attribute removes margin from BRow and padding from BCol -->
          <!-- Otherwise the columns will jump to a new row -->
          <!-- Also added flex-nowrap to force the columns to stay in one row -->
          <BRow no-gutters class="flex-nowrap">
            <BCol v-for="date in activeDates" :key="`${date.date.year}-${date.date.monthIndex}-${date.date.date}`">
              <BButton
                :variant="getDateButtonVariant(date, selectedDate)"
                :disabled="!date.open"
                @click="clickDate(date.date)"
                class="d-flex flex-column align-items-start"
              >
                <span class="fw-bold">{{ getShortDay(date.date) }}</span>
                <span>{{ date.date.date }}/{{ date.date.monthIndex + 1 }}</span>
              </BButton>
            </BCol>
          </BRow>
        </BContainer>
      </div>

      <div v-if="selectedDate" class="d-flex flex-column gap-1">
        <!-- <h2 class="fs-6">Välj tid den {{ `${selectedDate.date}/${selectedDate.monthIndex + 1}` }}</h2> -->
        <h2 class="fs-6">Välj tid</h2>
        <BContainer>
          <BRow class="gy-3">
            <BCol
              v-for="time in selectedDateTimes"
              :key="`${selectedDate.year}-${selectedDate.monthIndex}-${selectedDate.date}-${time}`"
              cols="4"
              class="d-flex flex-row justify-content-center align-items-center"
            >
              <BButton
                :variant="getTimeButtonVariant(time)"
                :disabled="getTimeButtonVariant(time) === 'outline-secondary'"
                @click="selectedTime = time"
                class="w-100"
              >
                <!-- Write times as 16:00, 17:00 instead of 16, 17 -->
                {{ `${time}`.padStart(2, '0') }}:00
              </BButton>
            </BCol>
          </BRow>
        </BContainer>
      </div>
    </div>
  </BModal>
</template>
