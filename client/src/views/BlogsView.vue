<script lang="ts">
import { formatLocale, t } from '@/i18n';
import type { Blog } from '@/types';
import { BCol, BContainer, BLink, BRow, useToast } from 'bootstrap-vue-next';
import * as api from '../api';
import { useRoute } from 'vue-router';

export default {
  components: { BContainer, BRow, BCol, BLink },
  data(): { blogs: Blog[] | null } {
    return {
      blogs: null,
    };
  },
  methods: {
    async fetchBlogs() {
      try {
        const blogs = await api.getBlogs();
        this.blogs = blogs;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.toast.create({ title: t('blog.loadError'), body: t('common.tryAgain'), variant: 'danger' });
      }
    },
  },
  setup() {
    const toast = useToast();
    const route = useRoute();
    return { t, formatLocale, toast, route };
  },
  async mounted() {
    await this.fetchBlogs();

    if (this.route.hash) {
      const el = document.querySelector(this.route.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
  watch: {
    'route.hash'(hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    },
  },
};
</script>

<template>
  <BContainer fluid>
    <BRow class="justify-content-center py-5">
      <BCol cols="8" class="d-flex flex-column gap-4">
        <h1>{{ t('blog.title') }}</h1>
        <BContainer v-if="(blogs || []).length > 0">
          <BContainer
            v-for="blog in blogs"
            :key="blog.id"
            fluid
            tag="article"
            :id="`blog-${blog.id}`"
            class="d-flex flex-column gap-2"
          >
            <div class="d-flex flex-column gap-1">
              <div class="d-flex justify-content-between align-items-center">
                <h1>{{ blog.title }}</h1>
                <BLink :to="`/blogs#blog-${blog.id}`" underline-offset="1" class="fs-4">#</BLink>
              </div>
              <span class="text-secondary">{{ t('blog.published') }} {{ new Date(blog.uploadAt).toLocaleDateString(formatLocale, { day: '2-digit', month: 'long', year: 'numeric' }) }}</span>
            </div>
            <p>{{ blog.content }}</p>
          </BContainer>
        </BContainer>
        <BContainer v-else class="text-secondary">{{ t('blog.empty') }}</BContainer>
      </BCol>
    </BRow>
  </BContainer>
</template>
