<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'bootstrap-vue-next';
import * as api from '../api';
import * as auth from '../services/auth';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const orderId = computed(() => String(route.params.orderId ?? ''));

const steps = ['Leveransadress', 'Betalning', 'Översikt'];
const currentStep = ref(0);

const fullName = ref('');
const address = ref('');
const city = ref('');
const zipCode = ref('');

const cardNumber = ref('');
const cardExpiry = ref('');
const cardCvv = ref('');
const cardName = ref('');

const paid = ref(false);
const isPaying = ref(false);

const progress = computed(() => {
  if (steps.length <= 1) return 0;
  return (currentStep.value / (steps.length - 1)) * 100;
});

const isLastStep = computed(() => currentStep.value === steps.length - 1);

const lastFourDigits = computed(() => {
  // eslint-disable-next-line unicorn/prefer-string-replace-all
  const digits = cardNumber.value.replace(/\s+/g, '');
  if (digits.length < 4) return '----';
  return digits.slice(-4);
});

const reviewShippingHtml = computed(() => {
  const n = fullName.value.trim() || '—';
  const a = address.value.trim() || '—';
  const c = city.value.trim() || '—';
  const z = zipCode.value.trim() || '—';
  return `${n}<br>${a}<br>${c}, ${z}`;
});

/**
 * Builds a short shipping summary from the entered name, address, city, and zip code.
 * It trims whitespace, removes empty values and joins the remaining parts with commas.
 * If no shipping fields are filled in, it returns "—".
 * */
const summaryShippingInfo = computed(() => {
  const parts = [fullName.value, address.value, city.value, zipCode.value]
    .map((x) => x.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : '—';
});

const summaryPaymentInfo = computed(() => `Kortet som slutar på **** ${lastFourDigits.value}`);

function showStep(stepIndex: number) {
  currentStep.value = Math.max(0, Math.min(stepIndex, steps.length - 1));
}

function fullNameValidation() {
  // eslint-disable-next-line unicorn/better-regex
  if (!/^[A-Za-zÅÄÖåäö\s-]+$/.test(fullName.value.trim())) {
    toast.create({
      title: 'Ogiltigt namn',
      body: 'Namnet får bara innehålla bokstäver, mellanslag och bindestreck',
      variant: 'danger',
    });
    return false;
  }
  return true;
}

function cityValidation() {
  // eslint-disable-next-line unicorn/better-regex
  if (!/^[A-Za-zÅÄÖåäö\s-]+$/.test(city.value.trim())) {
    toast.create({
      title: 'Ogiltigt namn',
      body: 'Orter får bara innehålla bokstäver, mellanslag och bindestreck',
      variant: 'danger',
    });
    return false;
  }
  return true;
}

function zipCodeValidation(){
  if (!/^\d{5}$/.test(zipCode.value)) {
    toast.create({
      title: 'Ogiltigt postnummer',
      body: 'Postnummer måste vara exakt 5 siffror',
      variant: 'danger',
    });
    return false;
  }
  return true;
}

function cardNumberValidation(){
  if (!/^\d{16}$/.test(cardNumber.value)) {
    toast.create({
      title: 'Ogiltigt kortnummer',
      body: 'Kortnummer måste vara exakt 16 siffror',
      variant: 'danger',
    });
    return false;
  }
  return true;
}

function cardExpiryValidation(){
  if (!/^\d{2}\/\d{2}$/.test(cardExpiry.value)) {
    toast.create({
      title: 'Ogiltigt utgångsdatum',
      body: 'Utgångsdatum måste vara i formatet MM/YY',
      variant: 'danger',
    });
    return false;
  }
  return true;
}

function cardCvvValidation(){
  if (!/^\d{3}$/.test(cardCvv.value)) {
    toast.create({
      title: 'Ogiltigt CVV',
      body: 'CVV måste vara exakt 3 siffror',
      variant: 'danger',
    });
    return false;
  }
  return true;
}

function cardNameValidation() {
  // eslint-disable-next-line unicorn/better-regex
  if (!/^[A-Za-zÅÄÖåäö\s-]+$/.test(cardName.value.trim())) {
    toast.create({
      title: 'Ogiltigt namn',
      body: 'Namnet får bara innehålla bokstäver, mellanslag och bindestreck',
      variant: 'danger',
    });
    return false;
  }
  return true;
}


function nextStep() {

  if (currentStep.value === 0) {
    if (!fullName.value.trim() || !address.value.trim() || !city.value.trim() || !zipCode.value.trim()) {
      toast.create({ title:'Leveransadressen är inte ifylld', body:'Vänligen fyll i alla fält', variant: 'danger' });
      return;
    }
    if (!fullNameValidation()) return;
    if (!cityValidation()) return;
    if (!zipCodeValidation()) return;

  }

  if (currentStep.value === 1) {
    if (!cardName.value.trim() || !cardNumber.value.trim() || !cardExpiry.value.trim() || !cardCvv.value.trim()) {
      toast.create({ title:'Betalningsuppgifterna är inte ifyllda', body:'Vänligen fyll i alla fält', variant: 'danger' });
      return;
    }
    if (!cardNameValidation()) return;
    if (!cardNumberValidation()) return;
    if (!cardExpiryValidation()) return;
    if (!cardCvvValidation()) return;

  }

  if (currentStep.value < steps.length - 1) {
    showStep(currentStep.value + 1);
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    showStep(currentStep.value - 1);
  }
}

function resetForm() {
  fullName.value = '';
  address.value = '';
  city.value = '';
  zipCode.value = '';
  cardNumber.value = '';
  cardExpiry.value = '';
  cardCvv.value = '';
  cardName.value = '';
  showStep(0);
}

function goToProfile() {
  router.push({ path: '/profile', query: { refreshed: String(Date.now()) } });
}

const goToOrder = () => {
  router.push({ path: `/orders/${route.params.orderId}` });
};

async function submitPayment() {
  if (paid.value || isPaying.value) return;

  if (!orderId.value) {
    toast.create({ title: 'Order-ID saknas', variant: 'danger' });
    return;
  }

  isPaying.value = true;
  try {
    await api.payOrder(orderId.value);
    paid.value = true;

    toast.create({ title: 'Köpet är klart!', variant: 'success' });
    toast.create({ title: 'Betald', body: `Ordern ${orderId.value} är betald`, variant: 'success' });

    resetForm();
    goToOrder();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.create({ title: 'Betalningen misslyckades', body: 'Försök igen senare', variant: 'danger' });
  } finally {
    isPaying.value = false;
  }
}

async function handleFormSubmit() {
  if (!isLastStep.value) {
    nextStep();
    return;
  }

  await submitPayment();
}

onMounted(() => {
  if (!auth.basicToken.value) {
    router.push('/login');
  }
});

</script>

<template>
  <div class="bg-light py-4">
    <div class="container" style="max-width: 900px">
      <div class="py-4 text-center">
        <div class="d-flex justify-content-center align-items-center gap-2">
          <h2 class="mb-0">Utcheckning</h2>
          <span class="badge" :class="paid ? 'bg-success' : 'bg-info'">
            {{ paid ? "Betald" : "Inte Betald" }}
          </span>
        </div>
        <p class="text-muted mb-0">Order: {{ orderId || "—" }}</p>
      </div>

      <div class="mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <div
            v-for="(label, idx) in steps"
            :key="label"
            class="step-item"
            :class="{
              active: idx === currentStep,
              completed: idx < currentStep
            }"
          >
            <span class="me-2">{{ idx + 1 }}.</span>{{ label }}
          </div>
        </div>

        <div class="progress mt-2" style="height: 8px">
          <div
            class="progress-bar progress-indicator"
            role="progressbar"
            :style="{ width: progress + '%' }"
            :aria-valuenow="progress"
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-4 order-md-2">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title mb-3">Uppgifter</h5>

              <div class="mb-2">
                <div class="text-muted small">Leveransadress</div>
                <div id="summary-shipping-info">{{ summaryShippingInfo }}</div>
              </div>

              <div class="mb-2">
                <div class="text-muted small">Betalningsmetod</div>
                <div id="summary-payment-info">{{ summaryPaymentInfo }}</div>
              </div>

              <div class="mt-3 pt-3 border-top d-flex justify-content-between">
                <span class="text-muted">Steg</span>
                <strong>{{ currentStep + 1 }}/{{ steps.length }}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-8 order-md-1">
          <form id="checkout-form" @submit.prevent="handleFormSubmit">
            <section class="form-step" :class="{ active: currentStep === 0 }">
              <h4 class="mb-3">Leveransadress</h4>

              <div class="mb-3">
                <label class="form-label" for="fullName">Fullständigt namn</label>
                <input
                  id="fullName"
                  v-model="fullName"
                  class="form-control"
                  type="text"
                />
              </div>

              <div class="mb-3">
                <label class="form-label" for="address">Adress</label>
                <input
                  id="address"
                  v-model="address"
                  class="form-control"
                  type="text"
                />
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label" for="city">Ort</label>
                  <input
                    id="city"
                    v-model="city"
                    class="form-control"
                    type="text"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="zipCode">Postnummer</label>
                  <input
                    id="zipCode"
                    v-model="zipCode"
                    class="form-control"
                    type="text"
                    maxlength="5"
                    inputmode="numeric"
                    placeholder="12345"
                  />
                </div>
              </div>

              <div class="d-flex justify-content-end mt-4">
                <button type="button" class="btn btn-primary next-btn" @click="nextStep">
                  Nästa
                </button>
              </div>
            </section>

            <section class="form-step" :class="{ active: currentStep === 1 }">
              <h4 class="mb-3">Kortuppgifter</h4>

              <div class="mb-3">
                <label class="form-label" for="cardName">Namn på kortet</label>
                <input
                  id="cardName"
                  v-model="cardName"
                  class="form-control"
                  type="text"
                />
              </div>

              <div class="mb-3">
                <label class="form-label" for="cardNumber">Kortnummer</label>
                <input
                  id="cardNumber"
                  v-model="cardNumber"
                  class="form-control"
                  type="text"
                  placeholder="1234567890123456"
                  maxlength="16"
                  inputmode="numeric"
                />
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label" for="cardExpiry">Utgångsdatum</label>
                  <input
                    id="cardExpiry"
                    v-model="cardExpiry"
                    class="form-control"
                    type="text"
                    placeholder="MM/YY"
                    maxlength="5"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="cardCvv">CVV</label>
                  <input
                    id="cardCvv"
                    v-model="cardCvv"
                    class="form-control"
                    type="text"
                    placeholder="123"
                    maxlength="3"
                  />
                </div>
              </div>

              <div class="d-flex justify-content-between mt-4">
                <button type="button" class="btn btn-outline-secondary prev-btn" @click="prevStep">
                  Tillbaka
                </button>
                <button type="button" class="btn btn-primary next-btn" @click="nextStep">
                  Nästa
                </button>
              </div>
            </section>

            <section class="form-step" :class="{ active: currentStep === 2 }">
              <h4 class="mb-3">Översikt</h4>

              <div class="card mb-3">
                <div class="card-body">
                  <h6 class="mb-2">Leveransadress</h6>
                  <div id="review-shipping" v-html="reviewShippingHtml" />
                </div>
              </div>

              <div class="card mb-3">
                <div class="card-body">
                  <h6 class="mb-2">Betalningsmetod</h6>
                  <div id="review-payment">{{ summaryPaymentInfo }}</div>
                </div>
              </div>

              <div class="d-flex justify-content-between mt-4">
                <button type="button" class="btn btn-outline-secondary prev-btn" @click="prevStep">
                  Tillbaka
                </button>
                <button
                  v-if="!paid"
                  type="submit"
                  class="btn btn-success"
                  :disabled="isPaying"
                >
                  {{ isPaying ? "Betalning pågår..." : "Bekräfta köpet" }}
                </button>
                <button
                  v-else
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="goToProfile"
                >
                  Tillbaka till profilen
                </button>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-step {
  display: none;
}
.form-step.active {
  display: block;
}

.step-item {
  user-select: none;
  opacity: 0.65;
  padding: 6px 10px;
  border-radius: 10px;
}
.step-item.active {
  opacity: 1;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.05);
}
.step-item.completed {
  opacity: 1;
  font-weight: 600;
}

</style>
