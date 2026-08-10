import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';
// Add the necessary CSS for BoostrapVueNext
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
// For Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/themes.css';

const app = createApp(App);

app.use(router);
// const axiosClient = axios.create({ baseURL: 'http://localhost:8080' });
app.use(VueAxios, axios);

app.mount('#app');
