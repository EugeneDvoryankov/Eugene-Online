<script lang="ts">
import LandingPageDrawing from '@/components/icons/LandingPageDrawing.vue';
import LandingPageTeamDrawing from '@/components/icons/LandingPageTeamDrawing.vue';
import { BButton, BContainer } from 'bootstrap-vue-next';

export default {
  components: {
    BContainer,
    BButton,
    LandingPageDrawing,
    LandingPageTeamDrawing,
  },

  methods: {
    setBrandColor(brand: string) {
      document.documentElement.dataset.brand = brand;
    },

    resetBrandColor() {
      delete document.documentElement.dataset.brand;
    },
  },
};
</script>

<template>
  <!-- WHY ONLINE NOW -->
  <BContainer fluid tag="section" class="why-section py-5">
    <div class="text-center mb-5">
      <h2>Varför välja OnlineNow?</h2>

      <p class="why-subtitle">
        Vi bygger moderna digitala lösningar som är snabba, flexibla och enkla
        att vidareutveckla.
      </p>
    </div>

    <div class="row g-4">
      <!-- Snabbt -->
      <div class="col-12 col-md-6 col-lg-3">
        <div class="why-card">
          <i class="bi bi-lightning-charge-fill why-icon">
            Snabbt
          </i>

          <p>
            Moderna tekniker och effektiv utveckling ger snabba webbplatser
            och kortare väg från idé till färdig produkt.
          </p>
        </div>
      </div>

      <!-- Responsivt -->
      <div class="col-12 col-md-6 col-lg-3">
        <div class="why-card">
          <i class="bi bi-phone-fill why-icon">
            Responsivt
          </i>

          <p>
            Lösningen skalar korrekt till alla enheter. Den fungerar på mobil,
            surfplatta och dator från första början.
          </p>
        </div>
      </div>

      <!-- Flexibelt -->
      <div class="col-12 col-md-6 col-lg-3">
        <div class="why-card">
          <i class="bi bi-palette-fill why-icon">
            Flexibelt
          </i>

          <p>
            Design, färger och funktioner kan anpassas efter företagets behov
            och varumärke.
          </p>
        </div>
      </div>

      <!-- Utbyggbart -->
      <div class="col-12 col-md-6 col-lg-3">
        <div class="why-card">
          <i class="bi bi-code-slash why-icon">
            Utbyggbart
          </i>

          <p>
            Vi bygger med återanvändbara komponenter så att lösningen kan växa
            tillsammans med företaget.
          </p>
        </div>
      </div>
    </div>
  </BContainer>

  <!-- INTERACTIVE DESIGN DEMO -->
  <BContainer fluid tag="section" class="design-demo py-5">
    <div class="design-demo-card">
      <div>
        <span class="design-demo-label">
          INTERAKTIV DEMO
        </span>

        <h2>Testa vår design själv</h2>

        <p>
          Välj en färg och se hur webbplatsens design kan anpassas
          efter ditt företags varumärke.
        </p>
      </div>

      <div class="color-options">
        <button
          class="color-button color-purple"
          aria-label="Lila"
          @click="setBrandColor('purple')"
        ></button>

        <button
          class="color-button color-blue"
          aria-label="Blå"
          @click="setBrandColor('blue')"
        ></button>

        <button
          class="color-button color-green"
          aria-label="Grön"
          @click="setBrandColor('green')"
        ></button>

        <button
          class="color-button color-orange"
          aria-label="Orange"
          @click="setBrandColor('orange')"
        ></button>

        <button
          class="reset-color-button"
          @click="resetBrandColor"
        >
          Återställ
        </button>
      </div>
    </div>
  </BContainer>

  <!-- MAIN LANDING PAGE -->
  <BContainer fluid="md" class="py-5 overflow-x-hidden">

    <!-- HERO -->
    <BContainer
      fluid
      tag="section"
      class="vh-70 d-flex flex-column flex-md-row"
    >
      <div
        class="
          order-2
          order-md-1
          flex-1
          d-flex
          flex-column
          justify-content-center
          gap-3
        "
      >
        <h1>
          Vi löser det
          <span class="fst-italic">
            tråkiga
          </span>
          tekniska
        </h1>

        <h3 class="hero-subtitle fs-4">
          Sveriges mest unika konsultbolag specialiserad inom allting IT
          vill jobba med dig, liten som stor
        </h3>

        <div class="d-flex flex-row gap-3 mt-4">
          <BButton
            variant="light"
            size="lg"
            to="/products"
          >
            Våra tjänster
          </BButton>

          <!-- Theme-aware button -->
          <BButton
            class="theme-primary-button"
            size="lg"
            to="/register"
          >
            Registrera dig
          </BButton>
        </div>
      </div>

      <div
        class="
          order-1
          order-md-2
          position-relative
          flex-1
          d-flex
          justify-content-center
          align-items-center
        "
      >
        <LandingPageDrawing
          class="landing-page-drawing w-50"
        />
      </div>
    </BContainer>

    <!-- CTA CARDS -->
    <BContainer fluid tag="section">
      <div class="w-100 d-flex flex-column flex-md-row gap-4">

        <!-- CREATE ACCOUNT -->
        <div
          class="
            theme-primary-card
            flex-basis-50
            d-flex
            flex-column
            justify-content-end
            gap-2
            px-5
            py-4
            rounded-4
          "
        >
          <h3>
            Kom igång.

            <span class="separate-line">
              Börja med ett företagskonto.
            </span>
          </h3>

          <BButton
            class="theme-outline-button max-w-50"
            to="/register"
          >
            Skapa konto
          </BButton>
        </div>

        <!-- MEET THE TEAM -->
        <div
          class="
            theme-primary-card
            flex-basis-50
            d-flex
            flex-column
            gap-2
            px-4
            py-4
            rounded-4
          "
        >
          <div
            class="
              team-drawing-container
              w-100
              d-flex
              justify-content-center
              align-items-center
              rounded-4
            "
          >
            <LandingPageTeamDrawing style="height: 120px" />
          </div>

          <RouterLink
            to="/about-us"
            class="team-link d-flex align-items-center gap-2"
          >
            <h3 class="mb-0">
              Möt teamet
            </h3>

            <i class="bi bi-arrow-up-right"></i>
          </RouterLink>
        </div>
      </div>
    </BContainer>
  </BContainer>

  <!-- WHATSAPP -->
  <div class="whatsapp-container">
    <a
      href="https://wa.me/46736871302?text=Hej!%20Jag%20vill%20chatta%20med%20OnlineNow%20AB"
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-button"
      aria-label="Chatta med oss på WhatsApp"
    >
      <span class="whatsapp-icon">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M20.52 3.48A11.8 11.8 0 0012.12 0C5.58 0 .25 5.32.25 11.87c0 2.09.55 4.14 1.58 5.94L0 24l6.37-1.67a11.8 11.8 0 005.75 1.47h.01c6.54 0 11.87-5.33 11.87-11.87 0-3.17-1.23-6.15-3.48-8.45zm-8.4 18.33h-.01a9.83 9.83 0 01-5-1.36l-.36-.21-3.78.99 1.01-3.69-.24-.38a9.86 9.86 0 01-1.52-5.29C2.22 6.39 6.65 1.96 12.12 1.96c2.63 0 5.11 1.03 6.97 2.89a9.79 9.79 0 012.89 6.97c0 5.46-4.44 9.99-9.86 9.99zm5.41-7.41c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.66.15-.19.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.24-.46-2.36-1.46-.87-.77-1.46-1.73-1.63-2.02-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.5.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.66-1.6-.91-2.19-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.52.08-.8.37-.27.3-1.04 1.01-1.04 2.46 0 1.45 1.07 2.85 1.22 3.05.15.2 2.08 3.18 5.05 4.46.71.31 1.27.49 1.7.63.72.23 1.38.2 1.9.12.58-.09 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35z"
          />
        </svg>
      </span>

      <span class="whatsapp-text">
        Chatta med oss
      </span>
    </a>
  </div>
</template>

<style scoped>
/* =========================================================
   WHY ONLINE NOW
   ========================================================= */

.why-section {
  color: var(--on-text);
}

.why-subtitle {
  color: var(--on-text-secondary);
}

.why-icon {
  color: var(--on-primary);
}

.why-card {
  height: 100%;
  padding: 1.75rem;

  background-color: var(--on-card-bg);
  color: var(--on-text);

  border: 1px solid var(--on-border);
  border-radius: 1rem;

  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.why-card:hover {
  transform: translateY(-6px);

  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.22);

  border-color: var(--on-primary);
}


/* =========================================================
   INTERACTIVE DESIGN DEMO
   ========================================================= */

.design-demo-card {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 3rem;
  padding: 2.5rem;

  background-color: var(--on-card-bg);
  color: var(--on-text);

  border: 1px solid var(--on-border);
  border-radius: 1.25rem;
}

.design-demo-card p {
  max-width: 650px;
  margin-bottom: 0;

  color: var(--on-text-secondary);
}

.design-demo-label {
  display: inline-block;

  margin-bottom: 0.5rem;

  color: var(--on-primary);

  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1rem;
}

.color-options {
  display: flex;
  align-items: center;

  gap: 0.8rem;

  flex-shrink: 0;
}

.color-button {
  width: 42px;
  height: 42px;

  border: 3px solid transparent;
  border-radius: 50%;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.color-button:hover {
  transform: scale(1.15);

  border-color: var(--on-text);
}

.color-purple {
  background-color: #8b5cf6;
}

.color-blue {
  background-color: #0d6efd;
}

.color-green {
  background-color: #20c997;
}

.color-orange {
  background-color: #fd7e14;
}

.reset-color-button {
  padding: 0.6rem 1rem;

  background: transparent;
  color: var(--on-text);

  border: 1px solid var(--on-border);
  border-radius: 0.5rem;

  cursor: pointer;
}

.reset-color-button:hover {
  border-color: var(--on-primary);
}


/* =========================================================
   HERO
   ========================================================= */

.hero-subtitle {
  color: var(--on-text-secondary);
}


/* =========================================================
   THEME-AWARE BUTTONS / CTA
   ========================================================= */

.theme-primary-button {
  background-color: var(--on-primary);
  color: var(--on-primary-text);

  border-color: var(--on-primary);
}

.theme-primary-button:hover,
.theme-primary-button:focus,
.theme-primary-button:active {
  background-color: var(--on-primary) !important;
  color: var(--on-primary-text) !important;

  border-color: var(--on-primary) !important;

  opacity: 0.85;
}


/* Colored CTA cards */
.theme-primary-card {
  background-color: var(--on-primary);
  color: var(--on-primary-text);

  transition:
    background-color 0.25s ease,
    color 0.25s ease;
}


/* Button inside colored CTA card */
.theme-outline-button {
  background-color: transparent;
  color: var(--on-primary-text);

  border: 1px solid var(--on-primary-text);
}

.theme-outline-button:hover,
.theme-outline-button:focus,
.theme-outline-button:active {
  background-color: var(--on-primary-text) !important;
  color: var(--on-primary) !important;

  border-color: var(--on-primary-text) !important;
}


/* =========================================================
   TEAM
   ========================================================= */

.team-drawing-container {
  background-color: var(--on-card-bg);

  transition: background-color 0.25s ease;
}

.team-link {
  color: var(--on-primary-text);

  text-decoration: none;
}

.team-link:hover {
  color: var(--on-primary-text);

  opacity: 0.8;
}


/* =========================================================
   GENERAL LAYOUT
   ========================================================= */

.vh-70 {
  height: 70vh;
}

.vh-80 {
  height: 80vh;
}

.flex-1 {
  flex: 1;

  min-width: 0;
  min-height: 0;
}

.flex-basis-40 {
  flex-basis: 40%;
  flex-shrink: 0;
  flex-grow: 0;
}

.flex-basis-50 {
  flex-basis: 50%;
  flex-shrink: 0;
  flex-grow: 0;
}

.flex-basis-60 {
  flex-basis: 60%;
  flex-shrink: 0;
  flex-grow: 0;
}

.flex-basis-100 {
  flex-basis: 100%;
  flex-shrink: 0;
  flex-grow: 0;
}

.no-shrink {
  flex-shrink: 0;
  min-width: 0;
}

.separate-line {
  display: block;
}


/* =========================================================
   LEGACY / REFERENCE STYLES
   ========================================================= */

.reference-company {
  display: flex;
  justify-content: center;
  align-items: center;

  flex-basis: 20%;
  flex-shrink: 0;

  padding: 0.4rem;
}

.reference-company-row {
  animation: slideLeft 24s linear infinite;
}

.reference-company-row-replacement {
  animation: slideLeftReplacement 24s linear infinite;
}

@keyframes slideLeft {
  from {
    transform: translate(0%, 0%);
  }

  to {
    transform: translate(-200%, 0%);
  }
}

@keyframes slideLeftReplacement {
  from {
    transform: translate(100%, 0%);
  }

  to {
    transform: translate(-100%, 0%);
  }
}

.employee-columns {
  position: absolute;

  top: -25%;
  left: 0;
  bottom: 0;
  right: 5%;
}

.employee-card {
  padding: 0.25rem 1.5rem;

  background-color: var(--on-card-bg);
  color: var(--on-text);

  margin-top: 0.75rem;

  box-shadow: 0 8px 16px rgba(66, 68, 90, 0.5);
}

.employee-card-1 {
  top: -30%;
  left: 0;
}

.card-shadow {
  box-shadow: 0 8px 16px rgba(66, 68, 90, 0.5);
}


/* =========================================================
   POSITION HELPERS
   ========================================================= */

.top-10 {
  top: 10%;
}

.top-20 {
  top: 20%;
}

.top-30 {
  top: 30%;
}

.top-40 {
  top: 40%;
}

.top-60 {
  top: 60%;
}

.top-70 {
  top: 70%;
}

.top-80 {
  top: 80%;
}

.top-90 {
  top: 90%;
}

.left-10 {
  left: 10%;
}

.left-20 {
  left: 20%;
}

.left-30 {
  left: 30%;
}

.left-40 {
  left: 40%;
}

.left-60 {
  left: 60%;
}

.left-70 {
  left: 70%;
}

.left-80 {
  left: 80%;
}

.left-90 {
  left: 90%;
}


/* =========================================================
   WHATSAPP
   ========================================================= */

.whatsapp-container {
  position: fixed;

  right: 24px;
  bottom: 24px;

  z-index: 1050;
}

.whatsapp-button {
  display: flex;
  align-items: center;

  gap: 10px;

  padding: 12px 18px;

  border: 1px solid #42e47f;
  border-radius: 999px;

  background-color: #25d366;
  color: #000000;

  text-decoration: none;
  font-weight: 700;

  box-shadow: 0 10px 30px rgba(37, 211, 102, 0.35);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.whatsapp-button:hover {
  color: #000000;

  transform: translateY(-3px);

  box-shadow: 0 16px 38px rgba(37, 211, 102, 0.5);
}

.whatsapp-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;

  padding: 6px;

  border-radius: 50%;

  background-color: rgba(0, 0, 0, 0.12);
}

.whatsapp-icon svg {
  width: 100%;
  height: 100%;
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 768px) {
  .design-demo-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .color-options {
    flex-wrap: wrap;
  }
}

@media (min-width: 768px) {
  .reference-company {
    padding: 1rem;
  }
}

@media (min-width: 992px) {
  .reference-company {
    padding: 2rem;
  }
}

@media (max-width: 576px) {
  .whatsapp-container {
    right: 16px;
    bottom: 16px;
  }

  .whatsapp-button {
    width: 56px;
    height: 56px;

    padding: 13px;

    justify-content: center;
  }

  .whatsapp-icon {
    width: 30px;
    height: 30px;

    padding: 3px;

    background: transparent;
  }

  .whatsapp-text {
    display: none;
  }
}
</style>