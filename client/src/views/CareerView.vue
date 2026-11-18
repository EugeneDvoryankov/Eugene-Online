<script lang="ts">
import { t } from '@/i18n';
import { BContainer } from 'bootstrap-vue-next';

interface Job {
  id: number;
  title: string;
  location: string;
  type: string;
  description: string;
}

export default {
  setup() {
    return { t };
  },
  components: { BContainer },

  computed: {
    jobs(): Job[] {
      return [
        {
          id: 1,
          title: t('career.jobFullstack'),
          location: 'Stockholm (Hybrid)',
          type: t('career.fullTime'),
          description: t('career.jobFullstackDescription'),
        },
        {
          id: 2,
          title: t('career.jobDesign'),
          location: t('career.gothenburgHybrid'),
          type: t('career.partTime'),
          description: t('career.jobDesignDescription'),
        },
        {
          id: 3,
          title: t('career.jobBackend'),
          location: 'Stockholm (Hybrid)',
          type: t('career.fullTime'),
          description: t('career.jobBackendDescription'),
        },
        {
          id: 4,
          title: t('career.jobMarketing'),
          location: t('career.gothenburgOnSite'),
          type: t('career.fullTime'),
          description: t('career.jobMarketingDescription'),
        },
      ];
    },
  },
};
</script>

<template>
  <BContainer fluid="md" class="py-5 overflow-x-hidden">
    <div class="text-center mb-5 py-5 bg-light rounded-4 shadow-sm border">
      <h1 class="display-4 fw-bold">{{ t('career.title') }}</h1>
      <p class="fs-5 text-secondary mx-auto mt-3">{{ t('career.intro') }}</p>
    </div>
        
    <div class="job-list-container mx-auto" style="max-width: 900px;">
      <h3 class="mb-4 fw-bold border-bottom pb-3 text-dark">{{ t('career.openings') }} ({{ jobs.length }})</h3>

      <div 
        v-for="job in jobs" 
        :key="job.id" 
        class="job-row d-flex flex-column flex-md-row justify-content-between align-items-md-center p-4 mb-3 bg-white rounded-4 shadow-sm"
      >
        <div class="mb-4 mb-md-0 pe-md-4">
          <h4 class="fw-bold mb-2 text-dark">{{ job.title }}</h4>
          <div class="text-secondary small d-flex gap-3 align-items-center mb-3">
            <span class="fw-medium">{{ job.location }}</span>
            <span>|</span>
            <span class="fw-medium">{{ job.type }}</span>
          </div>
          <p class="text-muted mb-0" style="font-size: 0.95rem; line-height: 1.6;">{{ job.description }}</p>
        </div>
      </div>
    </div>
  </BContainer>  
</template>

<style scoped>
.bg-light {
    background-color: #f8f9fa !important;
}

.job-row {
    border: 1px solid #eaeaea;
    border-left: 4px solid transparent;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    will-change: transform, bod-shadow;
    backface-visibility: hidden;
}

.job-row:hover {
    border-left: 4px solid var(--bs-primary);
    transform: translate(8px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
}
</style>
