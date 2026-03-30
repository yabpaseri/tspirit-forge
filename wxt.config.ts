import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react', '@wxt-dev/i18n/module'],
  vite: () => ({
    resolve: {
      alias: {
        // papaparse の browser フィールドは .min.js を指すが、
        // 二重 minification でパースが壊れるため非圧縮版を使う
        papaparse: 'papaparse/papaparse.js',
      },
    },
  }),
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    permissions: ['storage'],
  },
  autoIcons: {
    sizes: {
      16: './assets/icon.svg',
      32: './assets/icon.svg',
      48: './assets/icon.svg',
      128: './assets/icon.svg',
    },
  },
});
