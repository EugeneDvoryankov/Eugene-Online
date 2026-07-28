import AboutUsView from '@/views/AboutUsView.vue';
import ContactView from '@/views/ContactView.vue';
import DashboardBookingView from '@/views/DashboardBookingView.vue';
import DashboardOrderView from '@/views/DashboardOrderView.vue';
import DashboardProductView from '@/views/DashboardProductView.vue';
import DashboardUserView from '@/views/DashboardUserView.vue';
import DashboardView from '@/views/DashboardView.vue';
import LandingPageView from '@/views/LandingPageView.vue';
import LoginView from '@/views/LoginView.vue';
import OrderView from '@/views/OrderView.vue';
import ProductsView from '@/views/ProductsView.vue';
import ProfileView from '@/views/ProfileView.vue';
import RegisterView from '@/views/RegisterView.vue';
import * as auth from '../services/auth';
import { createRouter, createWebHistory } from 'vue-router';
import BlogsView from '@/views/BlogsView.vue';
import DashboardBlogView from '@/views/DashboardBlogView.vue';
import CareerView from '@/views/CareerView.vue';
import PaymentView from '@/views/PaymentView.vue';

const routes = [
  { path: '/', component: LandingPageView, meta: { title: 'Start | OnlineNow' } },
  { path: '/products', component: ProductsView, meta: { title: 'Tjänster | OnlineNow' } },
  // { path: '/order', component: OrderView, meta: { title: 'Din Order | OnlineNow' } },
  { path: '/orders/:orderId', name: 'order', component: OrderView, meta: { title: 'Order | OnlineNow' } },  
  { path: '/profile', component: ProfileView, meta: { title: 'Profil | OnlineNow' } },
  { path: '/about-us', component: AboutUsView, meta: { title: 'Om Oss | OnlineNow' } },
  { path: '/contact', component: ContactView, meta: { title: 'Kontakta Oss | OnlineNow' } },
  { path: '/career', component: CareerView },
  { path: '/register', component: RegisterView, meta: { title: 'Registrera Konto | OnlineNow' } },
  { path: '/login', component: LoginView, meta: { title: 'Logga In | OnlineNow' } },
  { path: '/orders/:orderId/payment', component: PaymentView, meta: { title: 'Betalning | OnlineNow' } },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { admin: true },
    // Children is the page content
    // When no subroute is added show the users page
    children: [
      { path: '', component: DashboardUserView, meta: { title: 'Användare | OnlineNow Dashboard' } },
      { path: 'users', component: DashboardUserView, meta: { title: 'Användare | OnlineNow Dashboard' } },
      { path: 'products', component: DashboardProductView, meta: { title: 'Produkter | OnlineNow Dashboard' } },
      { path: 'orders', component: DashboardOrderView, meta: { title: 'Beställningar | OnlineNow Dashboard' } },
      { path: 'bookings', component: DashboardBookingView, meta: { title: 'Bokningar | OnlineNow Dashboard' } },
      { path: 'blogs', component: DashboardBlogView, meta: { title: 'Bloggar | OnlineNow Dashboard' } },
    ],
  },
  { path: '/blogs', component: BlogsView, meta: { title: 'Blogg | OnlineNow' } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    // If a query parameter, scrollTop, is added with value "true"
    // then make the new page load at the top
    // This is needed for footer links, without scrollTop the footer links
    // will navigate to a page but the scroll position will be at footer
    // <RouterLink :to="{ path: '/about-us', query: { scrollTop: true } }">About</RouterLink>
    if (to.query.scrollTop === 'true') {
      return { top: 0 };
    }

    return false;
  },
});

// https://dev.to/jacobandrewsky/dynamic-page-title-and-description-with-vue-router-4oni
router.beforeEach((to) => {
  const { title } = to.meta;
  const defaultTitle = 'OnlineNow';

  document.title = title as string || defaultTitle;
});

// Navigation guard to ensure regular user do not visit the admin dashboard
router.beforeEach(async (to, from) => {
  if (to.meta.admin === true) {
    // If the user is not authenticated then redirect them to login
    if (!auth.isLoggedIn.value) {
      return '/login';
    }

    // If they are authenticated but not an admin redirect them to the profile page
    if (!auth.isAdmin.value) {
      return '/profile';
    }
  }
});

export default router;
