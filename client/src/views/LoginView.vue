<script lang="ts">
import { BButton, BCol, BContainer, BForm, BFormGroup, BFormInput, BRow, useToast } from 'bootstrap-vue-next';
import * as api from '../api';
import { useRouter } from 'vue-router';
import * as auth from '../services/auth';

// https://bootstrap-vue-next.github.io/bootstrap-vue-next/docs/components/form.html
export default {
  components: { BForm, BFormGroup, BFormInput, BButton, BContainer, BRow, BCol },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  setup() {
    const toast = useToast();
    // You should be able to use this.$router but TypeScript complains about it
    const router = useRouter();
    return { toast, router };
  },
  methods: {
    async onSubmit(event: Event) {
      event.preventDefault();

      try {
        await api.loginUser(this.email, this.password);
        await auth.setCredentials(this.email, this.password);
        this.toast.create({ title: 'Inloggad', body: 'Du är nu inloggad.', variant: 'success' });
        this.router.push('/');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.toast.create({ title: 'Kunde inte logga in', body: 'Fel email eller lösenord', variant: 'danger' });
      }
    },
  },
};
</script>

<template>
  <BContainer tag="main" class="py-4">
    <BRow class="justify-content-center">
      <BCol
        cols="8"
        sm="8"
        md="6"
        lg="6"
      >
        <h1>Logga in</h1>
        <BForm @submit="onSubmit">
          <!-- Email address -->
          <BFormGroup
            id="input-group-1"
            label="Mejladress:"
            label-for="input-1"
          >
            <BFormInput
              id="input-1"
              v-model="email"
              type="email"
              placeholder="Email..."
              required
            />
          </BFormGroup>

          <!-- Password -->
          <BFormGroup
            id="input-group-2"
            label="Lösenord:"
            label-for="input-2"
          >
            <BFormInput
              id="input-2"
              v-model="password"
              type="password"
              placeholder="Lösenord..."
              required
            />
          </BFormGroup>

          <div class="w-100 d-flex justify-content-end">
            <BButton
              type="reset"
              variant="link-secondary"
              class="text-nowrap"
              to="/register"
            >
              Inget konto? Registrera dig
            </BButton>
            <BButton
              type="submit"
              variant="primary"
              class="text-nowrap"
            >
              Logga in
            </BButton>
          </div>
        </BForm>
      </BCol>
    </BRow>
  </BContainer>
</template>

<style scoped>
</style>
