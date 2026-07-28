import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import pluginVitest from '@vitest/eslint-plugin';
import pluginOxlint from 'eslint-plugin-oxlint';
import pluginUnicorn from 'eslint-plugin-unicorn';

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/strongly-recommended'],
  vueTsConfigs.recommended,
  vueTsConfigs.strict,
  pluginUnicorn.configs['all'],

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  // By default ESLint comes with no formatting rules
  {
    name: 'app/formatting',
    rules: {
      // ---------- Core indentation ----------
      'indent': ['error', 2, { SwitchCase: 1 }],
      'linebreak-style': 'off',
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'arrow-parens': ['error', 'always'],

      // ---------- Vue SFC ----------
      'vue/script-indent': ['error', 2, { baseIndent: 0 }],
      'vue/html-indent': ['error', 2],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 3,
          multiline: 1,
        },
      ],
      'vue/singleline-html-element-content-newline': 0,
      'vue/html-self-closing': 0,
    },
  },

  {
    name: 'app/unicorn-overrides',
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-optional-catch-binding': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/no-array-sort': 'off',
      'unicorn/no-keyword-prefix': 'off',
    },
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
);
