<template>
  <main class="contact-container">
    <h1>Kontakta oss</h1>
    <p>Har du frågor? Skicka ett meddelande så hör vi av oss!</p>
  
    <form @submit.prevent="submitForm">
      <label>Namn</label>
      <input v-model="form.name" type="text" required />
  
      <label>Meddelande</label>
      <textarea v-model="form.message" rows="5" required></textarea>
  
      <button type="submit" class="btn btn-primary">Skicka</button>
    </form>
  
    <p v-if="successMessage" class="success">
      {{ successMessage }}
    </p>
  </main>
</template>
  
<script lang="ts" setup>
import { reactive, ref } from 'vue';
  
const form = reactive({
  name: '',
  message: '',
});
  
const successMessage = ref('');
  
const submitForm = () => {
  const mailtoLink = `mailto:support@onlinenow.com?subject=Kontakt från ${form.name}&body=${form.message}`;
  globalThis.location.href = mailtoLink;
  
  successMessage.value = 'Tack! Ditt mailprogram öppnas nu.';
  
  form.name = '';
  form.message = '';
};
</script>
  
  <style scoped>
  .contact-container {
    max-width: 600px;
    margin: 50px auto;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 10px;
    margin: 10px 0 20px 0;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
  
  .success {
    margin-top: 20px;
  }
  </style>