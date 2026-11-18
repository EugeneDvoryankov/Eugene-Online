import { computed, readonly, ref } from 'vue';
import { messages } from './messages';

type Language = 'en' | 'sv';
export type MessageKey = keyof typeof messages;

const storageKey = 'onlinenow-language';

function getInitialLanguage(): Language {
  try {
    return globalThis.localStorage.getItem(storageKey) === 'sv' ? 'sv' : 'en';
  } catch {
    return 'en';
  }
}

const selectedLanguage = ref<Language>(getInitialLanguage());

export const language = readonly(selectedLanguage);
export const formatLocale = computed(() => language.value === 'sv' ? 'sv-SE' : 'en-GB');

export function t(key: MessageKey): string {
  return messages[key][language.value];
}

export function toggleLanguage(): void {
  selectedLanguage.value = language.value === 'en' ? 'sv' : 'en';
  try {
    globalThis.localStorage.setItem(storageKey, language.value);
  } catch {
    // The current tab can still change languages when storage is unavailable.
  }
}
