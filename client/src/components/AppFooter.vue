<template>
  <footer class="footer pt-5 pb-3 mt-auto">
    <div class="container">
      <div class="row">
        <div class="col-md-3 col-6 d-flex flex-column mb-4">
          <span class="fw-bold mb-2">Tjänster</span>
          <RouterLink to="/products?category=consultation&scrollTop=true" class="footer-link">Konsultation</RouterLink>
          <RouterLink to="/products?category=webdev&scrollTop=true" class="footer-link">Webbutveckling</RouterLink>
          <RouterLink to="/products?category=appdev&scrollTop=true" class="footer-link">Apputveckling</RouterLink>
          <RouterLink to="/products?category=design&scrollTop=true" class="footer-link">Design</RouterLink>
        </div>

        <div class="col-md-3 col-6 d-flex flex-column mb-4">
          <span class="fw-bold mb-2">Företaget</span>
          <RouterLink to="/about-us?scrollTop=true" class="footer-link">Om oss</RouterLink>
          <RouterLink to="/contact?scrollTop=true" class="footer-link">Kontakta oss</RouterLink>
          <RouterLink to="/blogs?scrollTop=true" class="footer-link">Blogg</RouterLink>
          <RouterLink to="/career?scrollTop=true" class="footer-link">Karriär</RouterLink>
        </div>

        <div
          class="col-md-6 d-flex flex-column align-items-md-end align-items-start"
        >
          <span class="logo text-muted">ONLINENOW AB</span>
          <span class="text-muted">Sveriges mest unika konsultbolag</span>
        </div>
      </div>

      <hr />

      <div class="text-center text-muted small">
        © 2026 OnlineNow AB. All rights reserved.
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
