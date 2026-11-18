import { brandName } from '@/branding';
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
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import type { MessageKey } from '@/i18n';
import BlogsView from '@/views/BlogsView.vue';
import DashboardBlogView from '@/views/DashboardBlogView.vue';
import CareerView from '@/views/CareerView.vue';
import PaymentView from '@/views/PaymentView.vue';

declare module 'vue-router' {
  interface RouteMeta {
    titleKey?: MessageKey;
  }
}

const routes: RouteRecordRaw[] = [
  { path: '/', component: LandingPageView, meta: { titleKey: 'pages.home' } },
  { path: '/products', component: ProductsView, meta: { titleKey: 'pages.services' } },
  { path: '/orders/:orderId', name: 'order', component: OrderView, meta: { titleKey: 'pages.order' } },
  { path: '/profile', component: ProfileView, meta: { titleKey: 'pages.profile' } },
  { path: '/about-us', component: AboutUsView, meta: { titleKey: 'pages.about' } },
  { path: '/contact', component: ContactView, meta: { titleKey: 'pages.contact' } },
  { path: '/career', component: CareerView, meta: { titleKey: 'pages.careers' } },
  { path: '/register', component: RegisterView, meta: { titleKey: 'pages.register' } },
  { path: '/login', component: LoginView, meta: { titleKey: 'pages.login' } },
  { path: '/orders/:orderId/payment', component: PaymentView, meta: { titleKey: 'pages.payment' } },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { admin: true },
    // Children is the page content
    // When no subroute is added show the users page
    children: [
      { path: '', component: DashboardUserView, meta: { title: `Användare | ${brandName} Dashboard` } },
      { path: 'users', component: DashboardUserView, meta: { title: `Användare | ${brandName} Dashboard` } },
      { path: 'products', component: DashboardProductView, meta: { title: `Produkter | ${brandName} Dashboard` } },
      { path: 'orders', component: DashboardOrderView, meta: { title: `Beställningar | ${brandName} Dashboard` } },
      { path: 'bookings', component: DashboardBookingView, meta: { title: `Bokningar | ${brandName} Dashboard` } },
      { path: 'blogs', component: DashboardBlogView, meta: { title: `Bloggar | ${brandName} Dashboard` } },
    ],
  },
  { path: '/blogs', component: BlogsView, meta: { titleKey: 'pages.blog' } },
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
