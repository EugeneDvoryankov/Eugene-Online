<script lang="ts">
import { BButton, BContainer, BDropdown, BDropdownItem, BForm, BFormGroup, BFormInput, BModal, BSpinner, useToast } from 'bootstrap-vue-next';
import type { PropType } from 'vue';
import BTableSub from './BTableSub.vue';

// Not all input types, only those that the fits the update modal
type InputType = 'date'
  | 'datetime-local'
  | 'email'
  | 'month'
  | 'number'
  | 'password'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

interface DashboardUserViewData {
  resources: unknown[] | null;
  errorMessage: string;
  selectedId: string;
  createModal: boolean;
  createModalData: Record<string, string>;
  updateModal: boolean;
  updateModalData: Record<string, string>;
  deleteModal: boolean;
}

export default {
  components: {
    BContainer,
    // BTable causes a lot of TypeScript errors
    // Add workaround by wrapping BTable
    // BTable,
    BTableSub,
    BSpinner,
    BDropdown,
    BDropdownItem,
    BModal,
    BForm,
    BFormGroup,
    BFormInput,
    BButton,
  },
  props: {
    resourceName: {
      type: String,
      required: false,
      default: 'objekt',
    },
    fields: {
      type: Array as PropType<string[]>,
      required: true,
    },
    idColumn: {
      type: String,
      required: false,
      default: 'id',
    },
    createFields: {
      type: Array as PropType<{ key: string, label: string, placeholder: string, type: InputType, }[]>,
      required: false,
      default: () => [],
    },
    updateFields: {
      type: Array as PropType<{ key: string, label: string, placeholder: string, type: InputType, }[]>,
      required: false,
      default: () => [],
    },
    onFetch: {
      type: Function as PropType<() => Promise<unknown[]> | unknown[]>,
      required: true,
    },
    onCreate: {
      type: Function as PropType<(data: Record<string, string>) => Promise<unknown> | unknown>,
      required: false,
      default: null,
    },
    onUpdate: {
      type: Function as PropType<(id: string, data: Record<string, string>) => Promise<void> | void>,
      required: false,
      default: null,
    },
    onDelete: {
      type: Function as PropType<(id: string) => Promise<void> | void>,
      required: false,
      default: null,
    },
  },
  data(): DashboardUserViewData {
    return {
      resources: null,
      errorMessage: '',
      selectedId: '',
      createModal: false,
      createModalData: {},
      updateModal: false,
      updateModalData: {},
      deleteModal: false,
    };
  },
  methods: {
    async fetchResources(): Promise<void> {
      this.errorMessage = '';
      try {
        const resources = await this.onFetch();
        this.resources = resources;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.errorMessage = 'Kunde inte hämta objekt.';
      }
    },
    async createResource(): Promise<void> {
      try {
        await this.onCreate(this.createModalData);
        this.toast.create({ title: 'Objekt har skapats', body: 'Sidan är uppdaterad.', variant: 'success' });
        // Reset create modal fields
        this.createModalData = {};
        // Fetch resources again to show the created resource
        await this.fetchResources();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.toast.create({ title: 'Kunde inte skapa objekt', body: 'Försök igen senare.', variant: 'danger' });
      }
    },
    async updateResource(): Promise<void> {
      try {
        // Remove any fields that have value "", they should not be updated
        const nonEmptyFields = Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(this.updateModalData).filter(([k, v]) => v),
        );
        await this.onUpdate(this.selectedId, nonEmptyFields);
        this.toast.create({ title: 'Objekt har uppdaterats', body: 'Sidan är uppdaterad.', variant: 'success' });
        // Reset update modal fields
        this.updateModalData = {};
        // Fetch resources again to get the updated resource
        await this.fetchResources();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.toast.create({ title: 'Kunde inte uppdatera objekt', body: 'Försök igen senare.', variant: 'danger' });
      }
    },
    async deleteResource(): Promise<void> {
      try {
        await this.onDelete(this.selectedId);
        this.toast.create({ title: 'Objekt har raderats', body: 'Sidan är uppdaterad.', variant: 'success' });
        // Fetch resources again to get the updated list without the deleted resource
        await this.fetchResources();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.toast.create({ title: 'Kunde inte radera objekt', body: 'Försök igen senare.', variant: 'danger' });
      }
    },
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  async mounted() {
    await this.fetchResources();
  },
};
</script>

<template>
  <!-- Create modal -->
  <BModal
    v-model="createModal"
    :title="`Skapa ${resourceName}`"
    @ok="createResource"
    role="dialog"
    aria-modal="true"
    aria-labelledby="Skapa objekt"
  >
    <BForm>
      <BFormGroup v-for="field in createFields" :key="field.key" :label="field.label">
        <BFormInput v-model="createModalData[field.key]" :type="field.type" :placeholder="field.placeholder" />
      </BFormGroup>
    </BForm>
  </BModal>

  <!-- Update modal -->
  <BModal
    v-model="updateModal"
    :title="`Uppdatera ${selectedId}`"
    @ok="updateResource"
    role="dialog"
    aria-modal="true"
    aria-labelledby="Uppdatera objekt"
  >
    <BForm>
      <BFormGroup v-for="field in updateFields" :key="field.key" :label="field.label">
        <BFormInput v-model="updateModalData[field.key]" :type="field.type" :placeholder="field.placeholder" />
      </BFormGroup>
    </BForm>
  </BModal>

  <!-- Delete modal -->
  <BModal
    v-model="deleteModal"
    :title="`Radera ${selectedId}`"
    @ok="deleteResource"
    role="dialog"
    aria-modal="true"
    aria-labelledby="Radera objekt"
  >
    <span>Är du säker på att du vill ta bort objektet?</span>
  </BModal>

  <BContainer class="d-flex flex-column">
    <div class="d-flex justify-content-between align-items-center">
      <h2>Lista av {{ resourceName }}</h2>
      <div class="d-flex align-items-center gap-1">
        <BButton variant="light" @click="fetchResources">
          <i class="bi bi-arrow-clockwise"></i>
        </BButton>
        <BButton v-if="onCreate" variant="primary" @click="createModal = true">Skapa</BButton>
      </div>
    </div>
    <BTableSub
      v-if="resources"
      striped
      hover
      :fields="[...fields, 'hantera']"
      :items="resources"
    >
      <!-- Actions dropdown -->
      <!-- This is a named slot that you need to forward to BTable -->
      <template #cell(hantera)="data">
        <BDropdown
          variant="light"
          text="&#8942;"
          class="me-2"
          no-caret
        >
          <BDropdownItem v-if="onUpdate" @click="updateModal = true; selectedId = (data.item as Record<string, string>)[idColumn] as string">Uppdatera</BDropdownItem>
          <BDropdownItem v-if="onDelete" @click="deleteModal = true; selectedId = (data.item as Record<string, string>)[idColumn] as string">Radera</BDropdownItem>
        </BDropdown>
      </template>
    </BTableSub>
    <span v-else-if="errorMessage" class="text-danger">{{ errorMessage }}</span>
    <span v-else class="d-flex justify-content-center">
      <BSpinner
        variant="primary"
        label="Spinning"
        class="mx-1"
      />
    </span>
  </BContainer>
</template>
