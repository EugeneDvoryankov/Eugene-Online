<script lang="ts">
import * as api from '../api';
import DashboardResource from '@/components/DashboardResource.vue';

export default {
  components: {
    DashboardResource,
  },
  methods: {
    fetchUsers() {
      return api.getUsers();
    },
    async updateUser(id: string, data: Record<string, string>) {
      await api.updateUser(id, data);
    },
  },
};
</script>

<template>
  <DashboardResource
    resource-name="användare"
    :fields="['id', 'email', 'phoneNumber', 'companyName', 'admin']"
    :update-fields="[
      { key: 'phoneNumber', label: 'Telefonnummer', placeholder: '555-111 222', type: 'tel' },
      { key: 'password', label: 'Lösenord', placeholder: 'Nytt lösenord...', type: 'password' }
    ]"
    :on-fetch="fetchUsers"
    :on-update="updateUser"
  />
</template>
