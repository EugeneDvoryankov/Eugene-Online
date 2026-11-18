<script setup lang="ts">
import { brandName } from '@/branding';
import { t } from '@/i18n';
</script>

<template>
  <footer class="footer pt-5 pb-3 mt-auto">
    <div class="container">
      <div class="row">
        <div class="col-md-3 col-6 d-flex flex-column mb-4">
          <span class="fw-bold mb-2 footer-body-text">{{ t('footer.services') }}</span>
          <RouterLink to="/products?category=consultation&scrollTop=true" class="footer-link">{{ t('services.consultation') }}</RouterLink>
          <RouterLink to="/products?category=webdev&scrollTop=true" class="footer-link">{{ t('services.web') }}</RouterLink>
          <RouterLink to="/products?category=appdev&scrollTop=true" class="footer-link">{{ t('services.app') }}</RouterLink>
          <RouterLink to="/products?category=design&scrollTop=true" class="footer-link">{{ t('services.design') }}</RouterLink>
        </div>

        <div class="col-md-3 col-6 d-flex flex-column mb-4">
          <span class="fw-bold mb-2 footer-body-text">{{ t('footer.company') }}</span>
          <RouterLink to="/about-us?scrollTop=true" class="footer-link">{{ t('nav.about') }}</RouterLink>
          <RouterLink to="/contact?scrollTop=true" class="footer-link">{{ t('nav.contact') }}</RouterLink>
          <RouterLink to="/blogs?scrollTop=true" class="footer-link">{{ t('nav.blog') }}</RouterLink>
          <RouterLink to="/career?scrollTop=true" class="footer-link">{{ t('nav.careers') }}</RouterLink>
        </div>

        <div
          class="col-md-6 d-flex flex-column align-items-md-end align-items-start"
        >
          <span class="logo footer-body-text">{{ brandName }}</span>
          <span class="footer-body-text">{{ t('footer.tagline') }}</span>
        </div>
      </div>

      <hr />

      <div class="text-center footer-body-text small">
        {{ t('footer.copyright') }}
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--on-footer-bg);
}

.footer-link {
  cursor: pointer;
  color: var(--on-footer-text);
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: 0.2s;
}

.footer-body-text {
  color: var(--on-footer-text);
}

.footer-link:hover {
  color: #574bfc;
}

.footer-icon {
  cursor: pointer;
  color: #6c757d;
  transition: 0.2s;
}

.footer-icon:hover {
  color: #574bfc;
}

.logo {
  font-size: 1.5rem;
  font-weight: 600;
}
</style>
