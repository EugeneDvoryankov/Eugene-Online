<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Order } from '@/types';
import * as api from '../api';
import * as auth from '../services/auth';
import { useToast } from 'bootstrap-vue-next';

import orderAcceptedImg from '../components/icons/order-status-accepted.svg';
import underDevelopmentImg from '../components/icons/order-status-development.svg';
import underTestingImg from '../components/icons/order-status-testing.svg';
import orderCompletedImg from '../components/icons/order-status-completed.svg';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const order = ref<Order | null>(null);
const loading = ref(false);
const error = ref('');

const orderId = computed(() => String(route.params.orderId ?? ''));

const steps = ['Ordern accepterad', 'Under utveckling', 'Under testning', 'Ordern slutförd'];

const statusIndex = computed(() => {
  const s = order.value?.status;
  if (typeof s === 'number') return Math.max(0, Math.min(3, s));
  return 0;
});

const statusText = computed(() => steps[statusIndex.value] ?? 'unknown');

async function load() {
  error.value = '';
  order.value = null;

  if (!auth.basicToken.value) {
    router.push('/login');
    return;
  }
  
  if (!orderId.value) {
    toast.create({ title: 'Order-ID saknas', variant: 'danger' });
    return;
  }

  loading.value = true;
  try {
    order.value = await api.getOrder(orderId.value);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.create({ title: 'Kunde inte hämta ordern', body: 'Försök igen senare.', variant: 'danger' });
  } finally {
    loading.value = false;
  }
}

watch(orderId, () => load(), { immediate: true });
</script>

<template>
  <div class="container padding-bottom-3x mb-1">
    <div v-if="loading" class="text-muted">Laddar...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <main v-else-if="order" class="card mb-3">
      <div class="p-4 text-center text-white text-lg bg-dark rounded-top">
        <span class="text-uppercase">Order id - </span>
        <span class="text-medium">{{ orderId }}</span>
      </div>

      <div class="d-flex flex-wrap flex-sm-nowrap justify-content-between py-3 px-2 bg-light">
        <div class="w-100 text-center py-1 px-2">
          <span class="text-medium">Status:</span> {{ statusText }}
        </div>
      </div>
 
      <img
        v-if="statusIndex === 0"
        :src="orderAcceptedImg"
        class="img-fluid d-block mx-auto my-3"
        alt="Order accepted"
      />
      <img
        v-if="statusIndex === 1"
        :src="underDevelopmentImg"
        class="img-fluid d-block mx-auto my-3"
        alt="Under development"
      />
      <img
        v-if="statusIndex === 2"
        :src="underTestingImg"
        class="img-fluid d-block mx-auto my-3"
        alt="Under testing"
      />
      <img
        v-if="statusIndex === 3"
        :src="orderCompletedImg"
        class="img-fluid d-block mx-auto my-3"
        alt="Order completed"
      />
    </main>
  </div>
</template>
