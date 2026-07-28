<script lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { BButton, BCol, BContainer, BRow, useToast } from 'bootstrap-vue-next';
import * as auth from '../services/auth';
import * as api from '@/api';
import type { Product } from '@/types';

export default {
  components: { BContainer, BRow, BCol, BButton },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();
    return { router, route, toast };
  },

  data() {
    return{
      products: [] as Product[],
      errorMsg: '',
      selectedCategory: 'all',
    };
  },

  computed: {
    isLoggedIn(): boolean {
      return !!auth.basicToken.value;
    },

    filteredProducts(): Product[] {
      const category = this.route.query.category as string | undefined;

      if (!category) {
        return this.products;
      }

      return this.products.filter(
        (product) =>
          product.category?.toLowerCase() === category.toLowerCase(),
      );
    },
  },

  methods: {
    async fetchProducts() {
      this.errorMsg = '';
      try{
        this.products = await api.getProducts();
      } catch (error){
        console.error('Failed to fetch products:', error);
        this.errorMsg = 'Kunde inte ladda in tjänsterna';
      }
      console.log('Fetched products:', this.products);
    },

    setCategory(category: string) {
      this.selectedCategory = category;
      this.router.push({
        path: '/products',
        query: category === 'all' ? {} : { category },
      });
    },

    async handleBuy(productId: string){
      if (!this.isLoggedIn){
        this.toast.show({
          title: 'Inloggning krävs',
          body: 'Vänligen logga in för att köpa ett paket.',
          variant: 'warning',
          pos: 'top-center',
          value: 5000,
        });
        this.router.push('/login');
        return;
      }
      try{
        const order = await api.createOrder(productId);
        // this.router.push(`/orders/${order.orderId}`);
        this.router.push(`/orders/${order.orderId}/payment`);
      } catch (error) {
        console.error('Purchase failed:', error);
        this.toast.show({
          title: 'Ett fel uppstod',
          body: 'Kunde inte genomföra beställningen',
          variant: 'danger',
          pos: 'top-center',
        });
      }
    },
  },

  async mounted() {
    const category = this.route.query.category as string;

    if (category) {
      this.selectedCategory = category;
    }

    await this.fetchProducts();
  },
};
</script>

<template>
  <BContainer fluid="md" tag="main" class="py-5 overflow-x-hidden">
    <div class="text-center">
      <h1 class="display-4 fw-bold">Våra tjänster</h1>
      <p class="fs-5 text-secondary">Lösningar för ditt företags digitala resa</p>
    </div>

    <div v-if="errorMsg" class="text-center">
      <p class="text-danger">{{ errorMsg }}</p>
    </div>
    <div class="d-flex gap-2 flex-wrap mb-4 justify-content-center">
      <BButton
        variant="outline-dark"
        :class="{ active: selectedCategory === 'all' }"
        @click="setCategory('all')"
      >
        Alla
      </BButton>

      <BButton
        variant="outline-dark"
        :class="{ active: selectedCategory === 'design' }"
        @click="setCategory('design')"
      >
        Design
      </BButton>

      <BButton
        variant="outline-dark"
        :class="{ active: selectedCategory === 'webdev' }"
        @click="setCategory('webdev')"
      >
        Webbutveckling
      </BButton>

      <BButton
        variant="outline-dark"
        :class="{ active: selectedCategory === 'consultation' }"
        @click="setCategory('consultation')"
      >
        Konsultation
      </BButton>

      <BButton
        variant="outline-dark"
        :class="{ active: selectedCategory === 'appdev' }"
        @click="setCategory('appdev')"
      >
        Apputveckling
      </BButton>
    </div>
    <BRow v-if="!errorMsg" class="g-4">
      <BCol
        v-for="product in filteredProducts"
        :key="product.id"
        tag="article"
        cols="12"
        md="6"
        lg="4"
      >
        <div class="product-card h-100 d-flex flex-column bg-white rounded-4 overflow-hidden">
          <div class="p-4 flex-grow-1">
            <h2 class="h3 mb-3 fw-bold">{{ product.name }}</h2>
            <p class="text-secondary">{{ product.description }}</p>
          </div>

          <div class="p-4 pt-0 mt-auto border-top">
            <div class="d-flex justify-content-between align-items-center mt-4">
              <span class="fs-4 fw-bold">{{ product.price }} kr</span>
              <BButton variant="primary" size="lg" @click="handleBuy(product.id)">
                Köp
              </BButton>
            </div>
          </div>
        </div>
      </BCol>
    </BRow>
  </BContainer>
</template>

<style scoped>
.product-card {
  border: 1px solid rgba(0, 0, 0, 0.65);
  box-shadow: 0px 8px 16px 0px rgba(66, 68, 90, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2 ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 12px 24px 0px rgba(66, 68, 90, 0.2);
}
</style>