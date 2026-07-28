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
      // show: true,
      email: '',
      password: '',
      companyName: '',
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
        await api.createUser(this.email, this.password, this.companyName);
        await auth.setCredentials(this.email, this.password);
        this.toast.create({ title: 'Konto skapat', body: 'Du är nu inloggad.', variant: 'success' });
        this.router.push('/');
      } catch (error) {
        const title = 'Kunde inte registrera användare';
        let body = 'Försök igen senare.';
        if (error instanceof Error) {
          body = error.message;
        }

        this.toast.create({ title, body, variant: 'danger' });
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
        <h1>Registrera konto</h1>
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

          <!-- Company name -->
          <BFormGroup
            id="input-group-2"
            label="Företagsnamn:"
            label-for="input-2"
          >
            <BFormInput
              id="input-2"
              v-model="companyName"
              placeholder="Ditt företag..."
              required
            />
          </BFormGroup>

          <div class="w-100 d-flex justify-content-end">
            <BButton
              type="reset"
              variant="link-secondary"
              to="/login"
              class="text-nowrap"
            >
              Har du redan ett konto?
            </BButton>
            <BButton
              type="submit"
              variant="primary"
              class="text-nowrap"
            >
              Registrera
            </BButton>
          </div>
        </BForm>
      </BCol>
    </BRow>
  </BContainer>
</template>

<style scoped>
</style>
