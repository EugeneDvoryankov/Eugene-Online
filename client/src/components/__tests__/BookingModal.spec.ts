import { describe, it, expect, vi, afterAll, beforeAll, beforeEach, afterEach } from 'vitest';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import BookingModal from '../BookingModal.vue';
import { BApp } from 'bootstrap-vue-next';
import type { Booking } from '@/types/index.ts';
import * as api from '../../api.ts';

// Mock the API module because you don't want to request anything
// from the backend in your tests and you can set its return value
vi.mock(import('../../api.ts'), () => {
  return {
    async getBookings(): Promise<Booking[]> {
      return [];
    },
    createBooking: vi.fn(),
  };
});

describe('The booking modal', () => {
  let wrapper: VueWrapper;
  beforeEach(() => {
    // Setting fake time before each test because the test cases might use different dates
    // The booking modal depends on the current time
    // Set the current time manually so your tests doesn't depend on the currnet time
    const date = Date.UTC(2025, 4, 20, 16, 30);
    vi.useFakeTimers();
    vi.setSystemTime(date);
    vi.stubEnv('TZ', 'UTC');
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }

    // Reset document between each test
    // The booking modal uses Teleport to place the modal
    document.body.innerHTML = '';
  });

  afterAll(() => {
    // Start using the current time again
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  const createWrapper: (data?: Record<string, unknown>) => Promise<VueWrapper> = async (data) => {
    wrapper = await mount({
      components: { BApp, BookingModal },
      template: '<BApp><BookingModal /></BApp>',
    }, {
      attachTo: document.body,
      // Change the default data so that the modal is shown by default
      // You cannot set data if you use define a new function as the first
      // parameter of mount
      // That only works if you have BookingModal as the first parameter
      /* data() {
        return {
          // message: 'world',
          isModalOpen: (data && data.isModalOpen) || true,
          selectedDate: (data && data.selectedDate) || {
            year: 2025,
            monthIndex: 4,
            date: 20,
          },
          selectedTime: (data && data.selectedTime) || null,
          weekOffset: (data && data.weekOffset) || 0,
          dates: (data && data.dates) || {},
        };
      }, */
    });

    // Set data manually
    const bookingModal = wrapper.findComponent(BookingModal);
    if (data) {
      // await bookingModal.setData({ isModalOpen: true });
      // await nextTick();
      // await nextTick();
      await bookingModal.setData(data);
      // await nextTick();
    }

    // Since selectedTime is controlled by the modal
    // the modal will only update the disabled state of the submit button
    // when the modal is opened
    // I got it working once but not again
    // await bookingModal.setData({ ...data, isModalOpen: true });
    // await nextTick();
    // await nextTick();

    return wrapper;
  };

  const thisWeeksDates = ['19/5', '20/5', '21/5', '22/5', '23/5', '24/5', '25/5'];
  const nextWeeksDates = ['26/5', '27/5', '28/5', '29/5', '30/5', '31/5', '1/6'];
  const nextNextWeeksDates = ['2/6', '3/6', '4/6', '5/6', '6/6', '7/6', '8/6'];

  it('mounts renders properly', async () => {
    // The error useToast() must be called within setup(),
    // and BApp, useRegistry or plugin must be installed/provided.
    // Is because vitest creates the component without the app
    // In the app you call app.use(BootstrapVueNext) and around
    // every view and component you have BApp
    // attachTo document.body because the modal uses Teleport to it
    await createWrapper();

    expect(document.body.textContent).toContain('Boka möte');
    expect(document.body.textContent).toContain('Välj datum');
    // "Välj tid" is not shown unless date is selected
    // expect(document.body.textContent).toContain('Välj tid');
    expect(document.body.textContent).toContain('Föregående');
    expect(document.body.textContent).toContain('Nästa');
    expect(document.body.textContent).toContain('Boka');
    expect(document.body.textContent).toContain('Avbryt');
  });

  it('should first show the dates relevant to this week', async () => {
    await createWrapper();

    // The system time is 2025-05-20 16:30
    // The dates 19/5, 20/5, 21/5, 22/5, 23/5, 24/5, and 25/5 should be rendered
    thisWeeksDates.forEach((shorthandDate) => {
      expect(document.body.textContent).toContain(shorthandDate);
    });
  });

  it('should render the next week\'s date after clicking next', async () => {
    // The modal is rendered inside document.body
    await createWrapper();
    const buttons = document.body.querySelectorAll('button');
    const buttonEl = [...buttons]
      .find((btn) => btn.textContent.includes('Nästa'));
    // Wrapping the button in vue test utils so you can call trigger click on it
    const nextButton = new DOMWrapper(buttonEl);

    await nextButton?.trigger('click');

    // The system time is 2025-05-20 16:30
    // After clicking next the dates 26/5, 27/5, 28/5, 29/5, 30/5, 31/5, and 1/6 should be rendered
    nextWeeksDates.forEach((shorthandDate) => {
      expect(document.body.textContent).toContain(shorthandDate);
    });
  });

  it('should render the next week after next date after clicking next twice', async () => {
    await createWrapper();
    const buttons = document.body.querySelectorAll('button');
    const buttonEl = [...buttons]
      .find((btn) => btn.textContent.includes('Nästa'));
    // Wrapping the button in vue test utils so you can call trigger click on it
    const nextButton = new DOMWrapper(buttonEl);

    await nextButton?.trigger('click');
    await nextButton?.trigger('click');

    // The system time is 2025-05-20 16:30
    // After clicking next twice the dates 2/6, 3/6, 4/6, 5/6, 6/6, 7/6, and 8/6 should be rendered
    nextNextWeeksDates.forEach((shorthandDate) => {
      expect(document.body.textContent).toContain(shorthandDate);
    });
  });

  it('should render next week\'s dates after clicking next 2x and back 1x', async () => {
    await createWrapper();
    const buttons = document.body.querySelectorAll('button');
    const previousButtonEl = [...buttons]
      .find((btn) => btn.textContent.includes('Föregående'));
    const previousButton = new DOMWrapper(previousButtonEl);
    const nextButtonEl = [...buttons]
      .find((btn) => btn.textContent.includes('Nästa'));
    const nextButton = new DOMWrapper(nextButtonEl);

    await nextButton?.trigger('click');
    await nextButton?.trigger('click');
    await previousButton?.trigger('click');

    // The system time is 2025-05-20 16:30
    // After clicking next twice then back the dates 26/5, 27/5, 28/5, 29/5, 30/5, 31/5, and 1/6 should be rendered
    nextWeeksDates.forEach((shorthandDate) => {
      expect(document.body.textContent).toContain(shorthandDate);
    });
  });

  it('should render this week\s dates after clicking next 2x and back 2x', async () => {
    await createWrapper();
    const buttons = document.body.querySelectorAll('button');
    const previousButtonEl = [...buttons]
      .find((btn) => btn.textContent.includes('Föregående'));
    const previousButton = new DOMWrapper(previousButtonEl);
    const nextButtonEl = [...buttons]
      .find((btn) => btn.textContent.includes('Nästa'));
    const nextButton = new DOMWrapper(nextButtonEl);

    await nextButton?.trigger('click');
    await nextButton?.trigger('click');
    await previousButton?.trigger('click');
    await previousButton?.trigger('click');

    // The system time is 2025-05-20 16:30
    // The dates 19/5, 20/5, 21/5, 22/5, 23/5, 24/5, and 25/5 should be rendered
    thisWeeksDates.forEach((shorthandDate) => {
      expect(document.body.textContent).toContain(shorthandDate);
    });
  });

  it('should first show the next weeks dates if it is a Saturday', async () => {
    // The system time is 2025-05-24 16:30, a Saturday
    const date = Date.UTC(2025, 4, 24, 16, 30);
    vi.setSystemTime(date);

    await createWrapper();

    nextWeeksDates.forEach((shorthandDate) => {
      expect(document.body.textContent).toContain(shorthandDate);
    });
  });

  it('should first show the next weeks dates if it is a Sunday', async () => {
    // The system time is 2025-05-25 16:30, a Sunday
    const date = Date.UTC(2025, 4, 25, 16, 30);
    vi.setSystemTime(date);

    await createWrapper();

    nextWeeksDates.forEach((shorthandDate) => {
      expect(document.body.textContent).toContain(shorthandDate);
    });
  });

  /* eslint-disable vitest/no-commented-out-tests */
  /* it('should render times 06:00-17:00 when on UTC local', async () => {
    await createWrapper({ selectedDate: { year: 2025, monthIndex: 4, day: 21 } });

    expect(document.body.textContent).toContain('06:00');
    expect(document.body.textContent).toContain('07:00');
    expect(document.body.textContent).toContain('08:00');
    expect(document.body.textContent).toContain('09:00');
    expect(document.body.textContent).toContain('10:00');
    expect(document.body.textContent).toContain('11:00');
    expect(document.body.textContent).toContain('12:00');
    expect(document.body.textContent).toContain('13:00');
    expect(document.body.textContent).toContain('14:00');
    expect(document.body.textContent).toContain('15:00');
    expect(document.body.textContent).toContain('16:00');
    expect(document.body.textContent).toContain('17:00');
  }); */
  /* eslint-enable vitest/no-commented-out-tests */

  it('should render the submit button as disabled if time is not specified', async () => {
    await createWrapper();
    const buttons = document.body.querySelectorAll('button');
    const submitButtonEl = [...buttons]
      .find((btn) => btn.textContent === 'Boka');
    const submitButton = new DOMWrapper(submitButtonEl);

    // expect(submitButton.attributes('disabled')).toBe('');
    expect(submitButton.element.disabled).toBe(true);
  });

  it('should render the submit button as enabled if date and time is specified', async () => {
    await createWrapper({ selectedDate: { year: 2025, monthIndex: 4, day: 21 }, selectedTime: 6 });
    const buttons = document.body.querySelectorAll('button');
    const submitButtonEl = [...buttons]
      .find((btn) => btn.textContent === 'Boka');
    const submitButton = new DOMWrapper(submitButtonEl);

    expect(submitButton.element.disabled).toBe(false);
  });

  /* eslint-disable vitest/no-commented-out-tests */
  /* it('should create a booking with UTC times on submit', async () => {
    await createWrapper({ selectedDate: { year: 2025, monthIndex: 4, date: 21 }, selectedTime: 6 });
    const buttons = document.body.querySelectorAll('button');
    const submitButtonEl = [...buttons]
      .find((btn) => btn.textContent === 'Boka');
    const submitButton = new DOMWrapper(submitButtonEl);
    console.log('submitButton', submitButton.html());

    await submitButton.trigger('click');

    expect(api.createBooking).toHaveBeenCalledWith();
  }); */
  /* eslint-enable vitest/no-commented-out-tests */
});
