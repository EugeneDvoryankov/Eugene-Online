<template>
  <main class="container py-5">
    <div class="card-deck">
      <div class="card text-center" style="width: 100%">
        <div class="card-body d-flex flex-column justify-content-center">
          <h1 class="card-title font-weight-bold mb-4">{{ t('nav.about') }}</h1>

          <p class="card-text">
            {{ t('about.visibility') }}
          </p>

          <p class="card-text">
            {{ t('about.history') }}
          </p>

          <p class="card-text">
            {{ t('about.strategy') }}
          </p>

          <p class="card-text">
            {{ t('about.services') }}
          </p>

          <p class="card-text">
            {{ t('about.goal') }}
          </p>

          <p class="card-text">
            {{ t('about.future') }}
          </p>

          <p class="card-text">
            {{ t('about.design') }}
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { t } from '@/i18n';
export default {
  setup() {
    return { t };
  },
  name: 'AboutUs',
};
</script>

<style scoped>
.card-deck .card {
  margin-bottom: 2rem;
}

.card-body p {
  margin-bottom: 1rem;
  text-align: justify;
}
</style>
