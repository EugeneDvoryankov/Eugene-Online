<script lang="ts">
import type { Booking, Order } from '@/types';
import * as api from '../api';
import { BAlert, BDropdown, BDropdownItem, useToast } from 'bootstrap-vue-next';
import { useRouter } from 'vue-router';
import * as auth from '../services/auth';

type BookingWithDate = Booking & { dateObj: Date };

export default {
  components: { BAlert, BDropdown, BDropdownItem },
  data() {
    return {
      bookings: [] as BookingWithDate[],
      bookingsError: '',
      orders: [] as Order[],

      showCreateOrderModal: false,
      newProductId: '',
      isCreatingOrder: false,

      companyName: '',
      phoneNumber: '',
      password: '',
      email: '',
    };
  },

  computed: {
    localBookings(): BookingWithDate[] {
      return this.bookings.map((booking) => {
        const date = new Date(Date.UTC(booking.year, booking.month - 1, booking.day, booking.time));
        return {
          ...booking,
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
          time: date.getHours(),
          dateObj: date,
        };
      });
    },
  },

  methods: {
    async fetchProfile() {
      try {
        
        const myUser = await api.getMyUser();
        this.companyName = myUser.companyName;
        this.email = myUser.email;
        this.phoneNumber = myUser.phoneNumber?.trim();
        this.password = '';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.toast.create({ title: 'Kunde inte hämta din profil', body: 'Försök igen senare.', variant: 'danger' });
      }
    },

    async updateProfile() {
      try {
        const myUser = await api.getMyUser();
        const userId = myUser.id;

        const payload: Record<string, string> = {};
        const phoneNumber = this.phoneNumber.trim();
        const password = this.password.trim();

        if (phoneNumber) payload.phoneNumber = phoneNumber;
        if (password) payload.password = password;

        if (Object.keys(payload).length === 0) {
          this.toast.create({ title: 'Inget att spara', body: 'Fyll i minst ett fält.', variant: 'warning' });
        }

        await api.updateUser(userId, payload);

        // You need to set credentials again with the updated password
        if (password) {
          auth.setCredentials(myUser.email, password);
        }
        this.password = '';
        this.toast.create({ title: 'Profil uppdaterad', body: 'Dina uppgifter har sparats.', variant: 'success' });
        await this.fetchProfile();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.toast.create({ title: 'Kunde inte updatera din profil', body: 'Försök igen senare.', variant: 'danger' });
      }
    },

    async fetchBookings() {
      this.bookingsError = '';
      try {
        const bookings = await api.getMyBookings();

        const bookingsWithDate = bookings.map((booking) => {
          const date = new Date(Date.UTC(booking.year, booking.month - 1, booking.day, booking.time));
          return {
            ...booking,
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            time: date.getHours(),
            dateObj: date,
          };
        });

        const futureBookings = bookingsWithDate.filter((b) => b.dateObj.getTime() > Date.now());
        this.bookings = [...futureBookings].sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.bookingsError = 'Kunde inte hämta dina bokningar';
      }

      if (this.bookings.length <= 0) {
        this.bookingsError = 'Du har inga bokningar';
      }
    },

    async deleteBooking(bookingId: string) {
      try {
        await api.deleteBooking(bookingId);
        this.toast.create({ title: 'Avbokad', body: 'Återkom när som helst.', variant: 'success' });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.toast.create({ title: 'Kunde inte avboka', body: 'Försök igen senare.', variant: 'danger' });
      }
      await this.fetchBookings();
    },

    async fetchOrders() {
      try {
        this.orders = await api.getMyOrders();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.toast.create({ title: 'Kunde inte hämta dina ordrar', body: 'Försök igen senare.', variant: 'danger' });
      }
    },

    openCreateOrderModal() {
      this.showCreateOrderModal = true;
    },

    closeCreateOrderModal() {
      this.showCreateOrderModal = false;
    },

    async submitOrder() {
      const productId = this.newProductId.trim();
      if (!productId) {
        this.toast.create({ title: 'Produkt-ID saknas', body: 'Vänligen ange ett produkt-ID.', variant: 'warning' });
        return;
      }

      this.isCreatingOrder = true;

      try {
        const created = await api.createOrder(productId);
        this.orders = [created, ...this.orders];

        this.toast.create({ title: 'Ordern skapad', body: 'Ordern har skapats.', variant: 'success' });

        this.newProductId = '';
        this.closeCreateOrderModal();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.toast.create({ title: 'Kunde inte skapa ordern', body: 'Försök igen senare.', variant: 'danger' });
      } finally {
        this.isCreatingOrder = false;
      }
    },

    orderTitle(o: Order) {
      const orderId = o.orderId;
      const productId = o.productId;
      return `Order #${orderId} (Product ${productId})`;
    },

    statusText(o: Order): string {
      const s = o.status;
      if (typeof s === 'string') return s;
      const statusArray = ['Accepterad', 'Utveckling', 'Testning', 'Slutförd'];
      if (typeof s === 'number' && statusArray[s] ) return statusArray[s];
      return 'unknown';
    },

    statusBadgeClass(o: Order) {
      const txt = this.statusText(o).toLowerCase();
      if (txt.includes('reject')) return 'bg-danger';
      if (txt.includes('pend')) return 'bg-secondary';
      if (txt.includes('approve') || txt.includes('done')) return 'bg-success';
      if (txt.includes('accept')) return 'bg-info';
      return 'bg-dark';
    },

    orderMeta(o: Order) {
      const userId = `User: ${o.userId}`;
      const productId = `Product: ${o.productId}`;
      const parts = [productId, userId];
      return parts.join(' • ');
    },

    orderDate(o: Order) {
      const timestampString = o.date;
      if (!timestampString) return '';
      const d = new Date(timestampString);
      return d.toLocaleString('sv-SE');
    },

    viewOrder(o: Order) {
      const id = o.orderId;
      if (id == null) return;
      this.router.push(`/orders/${id}`);
    },

    payOrder(o: Order) {
      const orderId = o.orderId;
      if (orderId == null) {
        this.toast.create({ title: 'Missing order id', body: 'Could not start payment.', variant: 'danger' });
        return;
      }
      this.router.push(`/orders/${orderId}/payment`);
    },
  },

  setup() {
    const toast = useToast();
    const router = useRouter();
    return { toast, router };
  },

  async mounted() {
    if (!auth.basicToken.value) {
      this.router.push('/login');
      return;
    }

    await this.fetchProfile();
    await this.fetchBookings();
    await this.fetchOrders();
  },
};
</script>

<template>
  <div>
    <div class="container">
      <div class="main-body">
        <div class="row">
          <section class="col-lg-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex flex-column align-items-center text-center">
                  <img
                    src="https://bootdey.com/img/Content/avatar/avatar6.png"
                    alt="Admin"
                    class="rounded-circle p-1 bg-primary"
                    width="110"
                  />
                  <div class="mt-3">
                    <h1>{{ companyName || 'Företagsnamn' }}</h1>
                    <h4>{{ email || 'E-post' }}</h4>
                  </div>
                </div>

                <hr class="my-4" />

                <ul class="list-group list-group-flush">
                  <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                    <h6 class="mb-0">Lösenord</h6>
                    <div class="text-secondary flex-grow-1 ms-2" style="max-width: 60%;">
                      <input 
                        v-model="password" 
                        type="password"
                        class="form-control"
                        placeholder="Lämna tomt för att behålla nuvarande lösenord"
                      />
                    </div>
                  </li>

                  <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                    <h6 class="mb-0">Mobil</h6>
                    <div class="text-secondary flex-grow-1 ms-2" style="max-width: 60%;">
                      <input 
                        v-model="phoneNumber"
                        type="text"
                        class="form-control"
                        placeholder="Lägg till telefonnummer"
                      />
                    </div>
                  </li>
                </ul>
                <div class="w-100 d-flex justify-content-end px-3">
                  <button class="btn btn-primary btn-sm" type="button" @click="updateProfile">
                    Spara
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section class="col-lg-8">
            <BAlert
              v-for="booking in bookings"
              :key="booking.id"
              :model-value="true"
              class="full-width-alert"
            >
              <div class="w-100 d-flex justify-content-between align-items-center">
                <span>Kommande bokning den {{ booking.dateObj.toLocaleDateString('sv-se', { day: 'numeric', month: 'long' }) }} kl {{ booking.dateObj.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) }}</span>
                <BDropdown
                  variant="light"
                  text="&#8942;"
                  class="me-2"
                  no-caret
                >
                  <BDropdownItem @click="deleteBooking(booking.id)">Avboka</BDropdownItem>
                </BDropdown>
              </div>
            </BAlert>
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <strong>Orderhistorik</strong>
              </div>

              <div class="card-body d-flex flex-column gap-3">
                <div v-if="orders.length === 0" class="text-muted">
                  Inga beställningar gjorda
                </div>

                <div v-for="o in orders" :key="o.orderId" class="d-flex gap-3 align-items-start border rounded p-2">
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{{ orderTitle(o) }}</strong>
                      </div>

                      <div class="d-flex gap-2">
                        <span class="badge" :class="statusBadgeClass(o)">{{ statusText(o) }}</span>
                        <span class="badge" :class="o.isPaid ? 'bg-success' : 'bg-info'">
                          {{ o.isPaid ? 'Betald' : 'Inte Betald' }}
                        </span>
                      </div>
                    </div>

                    <div class="text-muted small" v-if="orderMeta(o)">
                      {{ orderMeta(o) }}
                    </div>

                    <div class="mt-2 d-flex gap-2">
                      <button class="btn btn-success btn-sm" type="button" @click="viewOrder(o)">Visa</button>
                      <button
                        v-if="!o.isPaid"
                        class="btn btn-info btn-sm"
                        type="button"
                        @click="payOrder(o)"
                      >
                        Betala
                      </button>
                    </div>

                    <div class="text-muted small mt-2" v-if="orderDate(o)">
                      {{ orderDate(o) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <div v-if="showCreateOrderModal">
      <div
        role="dialog"
        aria-modal="true"
        class="modal fade show"
        tabindex="-1"
        style="display: block;"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Create order</h5>
              <button
                type="button"
                class="btn-close"
                @click="closeCreateOrderModal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Product ID</label>
                <input
                  v-model="newProductId"
                  type="text"
                  class="form-control"
                  placeholder="e.g. 101"
                />
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" @click="closeCreateOrderModal">
                Avbryt
              </button>

              <button
                type="button"
                class="btn btn-primary"
                @click="submitOrder"
                :disabled="isCreatingOrder || !newProductId.trim()"
              >
                {{ isCreatingOrder ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-backdrop fade show" @click="closeCreateOrderModal"></div>
    </div>
  </div>
</template>

<style>
/* The BootstrapVueAlert BAlert children does by default not take up the entire width */
.full-width-alert .alert-body {
  width: 100%;
}
</style>
