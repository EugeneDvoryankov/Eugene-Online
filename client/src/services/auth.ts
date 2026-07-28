import type { User } from '@/types';
import { ref, computed, type ComputedRef } from 'vue';
import * as api from '../api';

// Store login credentials in-memory
// You cannot make email and password regular variables because
// components that depend on auth will check when it's first loaded
// and it's usually null
// The navbar needs to update when email and password gets a new value
// let email: string | null = null;
// let password: string | null = null;
const email = ref<string | null>(null);
const password = ref<string | null>(null);
const user = ref<User | null>(null);

// Set when registrering or logging in
export const setCredentials = async (e: string, p: string) => {
  console.log('setCredentials with email', e);
  email.value = e;
  password.value = p;

  const authenticatedUser = await api.getMyUser();
  user.value = authenticatedUser;
};

export const isLoggedIn: ComputedRef<boolean> = computed(() => {
  if (email.value && password.value) {
    return true;
  }

  return false;
});

export const isAdmin: ComputedRef<boolean> = computed(() => {
  if (!user.value) {
    return false;
  }

  return user.value.admin;
});

// Should be sent with every request if the user is authenticated
export const basicToken = computed(() => {
  if (!email.value || !password.value) {
    return null;
  }

  const token = btoa(`${email.value}:${password.value}`);
  return `Basic ${token}`;
});

// Logging out
export const clearCredentials = () => {
  email.value = null;
  password.value = null;
};
