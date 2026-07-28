<script lang="ts">
import type { Product } from '@/types';
import * as api from '../api';
import DashboardResource from '@/components/DashboardResource.vue';

export default {
  components: {
    DashboardResource,
  },
  methods: {
    fetchProducts() {
      return api.getProducts();
    },
    createProduct(data: Record<string, string>) {
      return api.createProduct(data as unknown as Omit<Product, 'id'>);
    },
    async updateProduct(id: string, data: Record<string, string>) {
      await api.updateProduct(id, data);
    },
    deleteProduct(id: string) {
      return api.deleteProduct(id);
    },
  },
};
</script>

<template>
  <DashboardResource
    resource-name="produkter"
    :fields="['id', 'name', 'description', 'category', 'price']"
    :create-fields="[
      { key: 'name', label: 'Namn', placeholder: 'Produkt namn...', type: 'text' },
      { key: 'description', label: 'Beskrivning', placeholder: 'Produkt beskrivning...', type: 'text' },
      { key: 'category', label: 'Kategori', placeholder: 'consultation | webdev | appdev | design', type: 'text' },
      { key: 'price', label: 'Pris', placeholder: 'Produktens pris...', type: 'number' },
    ]"
    :update-fields="[
      { key: 'name', label: 'Namn', placeholder: 'Produkt namn...', type: 'text' },
      { key: 'description', label: 'Beskrivning', placeholder: 'Produkt beskrivning...', type: 'text' },
      { key: 'category', label: 'Kategori', placeholder: 'consultation | webdev | appdev | design', type: 'text' },
      { key: 'price', label: 'Pris', placeholder: 'Produktens pris...', type: 'number' },
    ]"
    :on-fetch="fetchProducts"
    :on-create="createProduct"
    :on-update="updateProduct"
    :on-delete="deleteProduct"
  />
</template>
