<template>
  <header>
    <input type="checkbox" id="hamburger-toggle" />

    <div class="top-header text-white">
      <div
        class="position-relative container-fluid d-flex align-items-center justify-content-end py-3 px-4"
      >
        <!-- Hidden on smaller screens -->
        <div class="center-absolute mx-auto d-none d-lg-flex align-items-center" style="gap: 1rem">
          <span> Vill ni också vara i rampljuset? </span>
          <RouterLink to="/contact">
            <button class="btn btn-light btn-sm">Kontakta oss</button>
          </RouterLink>
        </div>

        <div class="d-flex">
          <RouterLink to="/" class="btn btn-link text-white">Hem</RouterLink>
          <RouterLink
            to="/about-us"
            class="btn btn-link text-white"
          >
            Om oss
          </RouterLink>
          <RouterLink
            to="/products"
            class="btn btn-link text-white"
          >
            Våra tjänster
          </RouterLink>
          <RouterLink to="/contact" class="btn btn-link text-white">Kontakta oss</RouterLink>
        </div>
      </div>
    </div>

    <div class="bottom-header position-relative border-bottom">
      <div
        class="container-fluid d-flex align-items-center justify-content-between py-3 px-4"
      >
        <label
          for="hamburger-toggle"
          class="hamburger d-flex align-items-center"
        >
          <span class="mr-2">&#9776;</span>
          <span class="menu-text">Meny</span>
        </label>

        <RouterLink to="/" class="center-absolute no-router-underline d-none d-md-block">
          <div class="logo text-center">
            <span class="logo-placeholder mr-2"></span>
            ONLINENOW AB
          </div>
        </RouterLink>

        <div class="d-flex align-items-center gap-3">
          <BookingModal />

          <template v-if="!user">
            <RouterLink
              to="/login"
              class="btn btn-primary btn-sm"
            >
              Logga in
            </RouterLink>
          </template>
          <template v-else>
            <div class="header-user d-flex gap-1 align-items-center">
              <BDropdown
                :text="`${user.companyName}${user.admin ? ' (Admin)' : ''}`"
                variant="outline-dark"
                size="sm"
                class="me-2"
              >
                <BDropdownItem v-if="user.admin === true" to="/dashboard">Dashboard</BDropdownItem>
                <BDropdownItem to="/profile">Min profil</BDropdownItem>
                <BDropdownItem @click="logout">Logga ut</BDropdownItem>
              </BDropdown>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div id="hamburger-container" class="container-fluid d-flex flex-row">
      <div
        id="hamburger-menu"
        class="d-flex flex-column justify-content-between shadow"
      >
        <div class="list-group">
          <RouterLink
            to="/"
            class="hamburger-menu-item list-group-item list-group-item-action"
            exact-active-class="active"
          >
            Hem
          </RouterLink>
          <RouterLink
            to="/about-us"
            class="hamburger-menu-item list-group-item list-group-item-action"
            exact-active-class="active"
          >
            Om oss
          </RouterLink>
          <RouterLink
            to="/products"
            class="hamburger-menu-item list-group-item list-group-item-action"
            exact-active-class="active"
          >
            Våra tjänster
          </RouterLink>
          <RouterLink
            to="/contact"
            class="hamburger-menu-item list-group-item list-group-item-action"
            exact-active-class="active"
          >
            Kontakta oss
          </RouterLink>
        </div>

        <span class="px-4 py-4">ONLINENOW AB</span>
      </div>

      <label for="hamburger-toggle" class="flex-fill"></label>
    </div>
  </header>
</template>

<script lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import * as auth from '../services/auth';
import type { User } from '@/types';
import * as api from '../api';
import BookingModal from './BookingModal.vue';
import { BDropdown, BDropdownItem } from 'bootstrap-vue-next';

/* const username = computed(() => {
  if (!email.value) return "";
  return email.value.split("@")[0];
  return 'testUsername';
}); */

export default {
  components: {
    RouterLink,
    BookingModal,
    BDropdown,
    BDropdownItem,
  },
  data() {
    return {
      user: null as User | null,
    };
  },
  computed: {
    isLoggedIn(): boolean {
      return auth.isLoggedIn.value;
    },
    token(): string | null {
      return auth.basicToken.value;
    },
  },
  methods: {
    async fetchUser() {
      try {
        const myUser = await api.getMyUser();
        this.user = myUser;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.user = null;
      }
    },
    logout() {
      console.log('Logging out');
      auth.clearCredentials();
      // Redirect to the landing page in case the user is on an authenticated route
      this.router.push('/');
    },
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  async mounted() {
    // Fetch user when the component mounts and also when the login state changes
    await this.fetchUser();
  },
  watch: {
    /* async token(updatedToken: string | null, oldToken: string | null) {
      if (updatedToken && !oldToken) {
        console.log('Token changed, fetching user again');
        // User just logged in, retry fetching
        await this.fetchUser();
      }
    }, */
    // If the user logs in or out try to fetch the user again
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async isLoggedIn(updatedValue: boolean, oldValue: boolean) {
      await this.fetchUser();
    },
  },
};
</script>

<style scoped>
.top-header {
  background-color: #574bfc;
  color: white;
  font-size: 1rem;
  padding: 0.5rem 1.5rem;
}

.bottom-header {
  background-color: #fff;
  font-size: 0.9rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.hamburger {
  font-size: 20px;
  cursor: pointer;
}

.bottom-header .logo {
  font-size: 1.4rem;
}

.logo-placeholder {
  display: inline-block;
  width: 40px;
  height: 40px;
  background-color: #574bfc;
  border-radius: 50%;
  vertical-align: middle;
}

/* https://stackoverflow.com/questions/44808474 */
.no-router-underline {
  color: inherit;
  text-decoration: none;
}

.center-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.user-dropdown {
  border: 0;
}

#hamburger-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 5;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  translate: -100% 0%;
  transition: translate 0.3s ease-in-out;
}

#hamburger-menu {
  min-width: 25vw;
  background-color: #ffffff;
}

#hamburger-toggle {
  display: none;
}

#hamburger-toggle:checked ~ #hamburger-container {
  translate: 0% 0%;
}

.hamburger-menu-item {
  border: 0;
}

.hamburger-menu-item.active {
  color: #fff;
  background-color: #574bfc;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
