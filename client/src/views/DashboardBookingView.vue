<script lang="ts">
import * as api from '../api';
import DashboardResource from '@/components/DashboardResource.vue';

export default {
  components: {
    DashboardResource,
  },
  methods: {
    fetchBookings() {
      return api.getAdminBookings();
    },
    deleteBooking(id: string) {
      return api.deleteBooking(id);
    },
  },
};
</script>

<template>
  <DashboardResource
    resource-name="bokningar"
    :fields="['id', 'year', 'month', 'day', 'time', 'userId']"
    :on-fetch="fetchBookings"
    :on-delete="deleteBooking"
  />
</template>
