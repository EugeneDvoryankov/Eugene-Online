<script lang="ts">
import * as api from '../api';
import DashboardResource from '@/components/DashboardResource.vue';

export default {
  components: {
    DashboardResource,
  },
  methods: {
    // Implemented all order methods only for admin@gmail.com

    fetchOrders() {
      console.log('Fetching orders');
      return api.getOrders();
    },
    async updateOrder(orderId: string, data: Record<string, string>) {
      await api.updateOrder(orderId, data);
    },
    deleteOrder(orderId: string) {
      return api.deleteOrder(orderId);
    },
  },
};
</script>

<template>
  <DashboardResource
    resource-name="beställningar"
    :fields="['orderId', 'status', 'isPaid', 'productId', 'userId']"
    id-column="orderId"
    :update-fields="[
      { key: 'status', label: 'Status', placeholder: '0 | 1 | 2 | 3', type: 'number' },
      { key: 'isPaid', label: 'Betald', placeholder: 'true | false', type: 'text' },
    ]"
    :on-fetch="fetchOrders"
    :on-update="updateOrder"
  />
</template>
