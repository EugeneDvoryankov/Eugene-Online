<!-- <script setup lang="ts">
import { BApp, BAlert, BNav, BNavItem, BNavText } from 'bootstrap-vue-next';
import ReusableEmoji from './components/ReusableEmoji.vue';
import BookingModal from './components/BookingModal.vue';
import * as auth from './services/auth';
import { watch } from 'vue';

watch(auth.basicToken, (tokenUpdate) => {
  console.log('Token changed:', tokenUpdate);
});
</script> -->
<script lang="ts">
import { BApp } from 'bootstrap-vue-next';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import * as auth from './services/auth';

export default {
  components: {
    AppFooter,
    AppHeader,
    BApp,
  },
  computed: {
    basicToken() {
      return auth.basicToken.value;
    },
    isLoggedIn(): boolean {
      return !!auth.basicToken.value;
    },
  },
  watch: {
    basicToken(tokenUpdate: string | null) {
      console.log('Token changed:', tokenUpdate);

      if (tokenUpdate) {
        console.log('User logged in');
      } else {
        console.log('User logged out');
      }
    },
  },
};
</script>

<template>
  <!-- BApp must be a container around all pages and components for -->
  <!-- BootstrapVueNext to work -->
  <BApp>
    <AppHeader />
    <!-- <BookingModal /> -->
    <!-- Your application content -->
    <router-view />
    <AppFooter />
  </BApp>
</template>

<style scoped></style>
