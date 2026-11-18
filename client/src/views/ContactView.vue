<template>
  <main class="contact-container">
    <h1>{{ t('nav.contact') }}</h1>
    <p>{{ t('contact.intro') }}</p>
  
    <form @submit.prevent="submitForm">
      <label>{{ t('contact.name') }}</label>
      <input v-model="form.name" type="text" required />
  
      <label>{{ t('contact.message') }}</label>
      <textarea v-model="form.message" rows="5" required></textarea>
  
      <button type="submit" class="btn btn-primary">{{ t('contact.send') }}</button>
    </form>
  
    <p v-if="mailOpened" class="success">
      {{ t('contact.success') }}
    </p>
  </main>
</template>
  
<script lang="ts" setup>
import { t } from '@/i18n';
import { reactive, ref } from 'vue';
  
const form = reactive({
  name: '',
  message: '',
});
  
const mailOpened = ref(false);
  
const submitForm = () => {
  const subject = encodeURIComponent(`${t('contact.subject')} ${form.name}`);
  const body = encodeURIComponent(form.message);
  const mailtoLink = `mailto:support@onlinenow.com?subject=${subject}&body=${body}`;
  globalThis.location.href = mailtoLink;
  
  mailOpened.value = true;
  
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