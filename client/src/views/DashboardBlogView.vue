<script lang="ts">
import type { Blog } from '@/types';
import * as api from '../api';
import DashboardResource from '@/components/DashboardResource.vue';

export default {
  components: {
    DashboardResource,
  },
  methods: {
    fetchBlogs() {
      return api.getBlogs();
    },
    createBlog(data: Record<string, string>) {
      return api.createBlog(data as Omit<Blog, 'id' | 'uploadAt'>);
    },
    deleteBlog(id: string) {
      return api.deleteBlog(id);
    },
  },
};
</script>

<template>
  <DashboardResource
    resource-name="bloggar"
    :fields="['id', 'title', 'uploadAt']"
    :create-fields="[
      { key: 'title', label: 'Titel', placeholder: 'Din blogg titel...', type: 'text' },
      { key: 'content', label: 'Innehåll', placeholder: 'Ditt blogg innehåll...', type: 'text' },
    ]"
    :on-fetch="fetchBlogs"
    :on-create="createBlog"
    :on-delete="deleteBlog"
  />
</template>
