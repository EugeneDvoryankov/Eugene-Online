<script lang="ts">
import { BCol, BContainer, BListGroup, BListGroupItem, BRow } from 'bootstrap-vue-next';
import { useRoute } from 'vue-router';

export default {
  components: { BContainer, BRow, BCol, BListGroup, BListGroupItem },
  methods: {
    isActive(path: string): boolean {
      // Exact match
      // return this.$route.path === path;
      return this.route.path === path;
    },
  },
  setup() {
    const route = useRoute();
    return { route };
  },
};
</script>

<!-- 
  cols="8"
        sm="8"
        md="6"
        lg="6"
-->
<template>
  <BContainer fluid class="d-flex flex-column gap-3 py-4">
    <BRow class="justify-content-center">
      <BCol cols="10">
        <h1>Dashboard</h1>
      </BCol>
    </BRow>
    <BRow class="justify-content-center">
      <BCol cols="3" tag="nav">
        <BListGroup>
          <BListGroupItem to="/dashboard/users" :active="isActive('/dashboard') || isActive('/dashboard/users')">Users</BListGroupItem>
          <BListGroupItem to="/dashboard/products" :active="isActive('/dashboard/products')">Products</BListGroupItem>
          <BListGroupItem to="/dashboard/orders" :active="isActive('/dashboard/orders')">Orders</BListGroupItem>
          <BListGroupItem to="/dashboard/bookings" :active="isActive('/dashboard/bookings')">Bookings</BListGroupItem>
          <BListGroupItem to="/dashboard/blogs" :active="isActive('/dashboard/blogs')">Blogs</BListGroupItem>
        </BListGroup>
      </BCol>
      <BCol cols="7" tag="section">
        <router-view />
      </BCol>
    </BRow>
  </BContainer>
</template>
