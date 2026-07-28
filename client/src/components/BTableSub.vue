<script lang="ts">
import { BTable } from 'bootstrap-vue-next';
import type { PropType } from 'vue';

// Workaround for BootstrapVueNext's BTable
// When imported into a component it changes the TypeScript types
// of the component meaning properties defined in data are not available
export default {
  components: { BTable },
  props: {
    fields: {
      type: Array as PropType<string[]>,
      required: true,
    },
    items: {
      type: Array as PropType<unknown[]>,
      required: true,
    },
  },
};
</script>

<template>
  <!-- From DashboardResource -->
  <BTable
    striped
    hover
    :fields="fields"
    :items="items"
  >
    <template
      v-for="(_, name) in $slots"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps" />
    </template>
    <!-- The code above includes the default slot -->
    <!-- <slot /> -->
  </BTable>
</template>
