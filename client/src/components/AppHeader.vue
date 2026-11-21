<template>
  <header>
    <input type="checkbox" id="hamburger-toggle" />

    <div class="header">

      <RouterLink to="/" class="logo-link d-none d-md-flex">
        
        <img 
            src="./eugene-online-logo.svg"
            alt=""
            class="company-logo"
          />  

        <span class="company-name text-white">{{ brandName }}</span>

      </RouterLink>

      <div class="header-right">
        <div class="d-flex flex-wrap align-items-center">
          <BButton
            variant="link"
            class="theme-toggle"
            @click="toggleTheme"
            :aria-label="mode === 'dark' ? t('nav.lightTheme') : t('nav.darkTheme')"
            :title="mode === 'dark' ? t('nav.lightTheme') : t('nav.darkTheme')"
          >
            <i
              class="bi"
              :class="mode === 'dark' ? 'bi-moon-fill' : 'bi-sun-fill'"
            ></i>
          </BButton>
          <button
            type="button"
            class="language-toggle"
            :lang="language === 'en' ? 'sv' : 'en'"
            @click="toggleLanguage"
          >
            {{ language === 'en' ? 'Svenska' : 'English' }}
          </button>
          <RouterLink
            to="/" class="header-link">
            {{ t('nav.home') }}
          </RouterLink>
          <RouterLink
            to="/about-us" class="header-link"
          >
            {{ t('nav.about') }}
          </RouterLink>
          <RouterLink
            to="/products" class="header-link"
          >
            {{ t('nav.services') }}
          </RouterLink>
          <RouterLink 
            to="/contact" class="header-link"
            >{{ t('nav.contact') }}
          </RouterLink>
        </div>
      </div>
    </div>

    

    
  </header>
</template>

<script lang="ts">
import { brandName } from '@/branding';
import { language, t, toggleLanguage } from '@/i18n';
import { RouterLink, useRouter } from 'vue-router';
import * as auth from '../services/auth';
import type { User } from '@/types';
import * as api from '../api';
import BookingModal from './BookingModal.vue';
import { BButton, BDropdown, BDropdownItem, useColorMode } from 'bootstrap-vue-next';

/* const username = computed(() => {
  if (!email.value) return "";
  return email.value.split("@")[0];
  return 'testUsername';
}); */

export default {
  components: {
    RouterLink,
    BookingModal,
    BButton,
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

    const colorModeOptions = { persist: true, initialValue: 'light' } as const;
    const mode = useColorMode(colorModeOptions);

    function toggleTheme() {
      mode.value = mode.value === 'dark' ? 'light' : 'dark'; 
    }

    return { brandName, t, language, toggleLanguage, router, mode, toggleTheme };
    
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

.header {
  overflow: hidden;
  background-color: var(--on-header-bg);
  padding: 20px 10px;
}

.header-link{
  color: var(--on-header-link);
}

.theme-toggle {
  color: var(--on-header-link);
  font-size: 1.4rem;
  padding: 0.4rem 0.7rem;
  border: none;
  text-decoration: none;
}

.theme-toggle:hover {
  color: var(--on-header-link);
  background-color: rgba(255, 255, 255, 0.15);
}

.language-toggle {
  margin-inline: 0.35rem;
  padding: 0.35rem 0.55rem;
  border: 1px solid currentColor;
  border-radius: 4px;
  background: transparent;
  color: var(--on-header-link);
}

.language-toggle:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.header a {
  float: left;
  text-align: center;
  padding: 12px;
  text-decoration: none;
  font-size: 18px; 
  line-height: 25px;
  border-radius: 4px;
}

.header a.logo {
  font-size: 25px;
  font-weight: bold;
}

.header a:hover {
  background-color: #ddd;
  color: black;
}

.header a.active {
  background-color: dodgerblue;
  color: white;
}

.header-right {
  float: right;
}

@media screen and (max-width: 500px) {
  .header a {
    float: none;
    display: block;
    text-align: left;
  }
  
  .header-right {
    float: none;
  }
}

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


.logo-link  {
  float: left;
  align-items: center;
  padding: 0;
  text-decoration: none;
  gap: 5px;
}

.company-logo {
  display: block;
  width: auto;
  height: 40px;
  max-width: 220px;
  object-fit: contain;
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
