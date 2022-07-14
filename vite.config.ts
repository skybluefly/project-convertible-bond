import { resolve } from 'path';
import { loadEnv } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import checker from 'vite-plugin-checker';
import { viteMockServe } from 'vite-plugin-mock';
import styleImport from 'vite-plugin-style-import';
// import Components from 'unplugin-vue-components/vite';
import WindiCSS from 'vite-plugin-windicss';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import dayjs from 'dayjs';
import DefineOptions from 'unplugin-vue-define-options/vite';
import pkg from './package.json';
import type { UserConfig, ConfigEnv } from 'vite';

const CWD = process.cwd();

// 环境变量
// const BASE_ENV_CONFIG = loadEnv('', CWD);
// const DEV_ENV_CONFIG = loadEnv('development', CWD);
// const PROD_ENV_CONFIG = loadEnv('production', CWD);

const __APP_INFO__ = {
  pkg,
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  // 环境变量
  const { VITE_BASE_URL, VITE_DROP_CONSOLE } = loadEnv(mode, CWD);

  const isBuild = command === 'build';

  return {
    base: VITE_BASE_URL,
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        {
          find: '@',
          replacement: resolve(__dirname, './src'),
        },
      ],
    },
    plugins: [
      vue(),
      WindiCSS(),
      DefineOptions(), // https://github.com/sxzz/unplugin-vue-define-options
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),

      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [resolve(CWD, 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'svg-icon-[dir]-[name]',
      }),
      viteMockServe({
        ignore: /^_/,
        mockPath: 'mock',
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        logger: true,
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer';
    
          setupProdMockServer();
          `,
      }),
      // Components({
      //   resolvers: [
      //     AntDesignVueResolver({
      //       exclude: ['AButton'],
      //     }),
      //   ],
      //   directoryAsNamespace: true,
      // }),
      styleImport({
        libs: [
          {
            libraryName: 'ant-design-vue',
            esModule: true,
            resolveStyle: (name) => {
              return `ant-design-vue/es/${name}/style/index`;
            },
          },
        ],
      }),
      // https://github.com/fi3ework/vite-plugin-checker
      checker({
        typescript: true,
        // vueTsc: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{.vue,ts,tsx}"', // for example, lint .ts & .tsx
        },
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {},
          additionalData: `
            @import "ant-design-vue/lib/style/themes/default.less";
            @import "@/styles/variables.less";
          `,
        },
        // scss: {
        //   additionalData: `
        //   @use 'sass:math';
        //   @import "src/styles/global.scss";
        //   `,
        // },
      },
    },
    server: {
      host: '0.0.0.0',
      // https: true,
      port: 8088,
      proxy: {
        '/api/admin': {
          target: 'https://nest-api.buqiyuan.site/api/',
          // target: 'http://localhost:7001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/ws-api': {
          target: 'wss://nest-api.buqiyuan.site',
          // target: 'http://localhost:7002',
          changeOrigin: true, //是否允许跨域
          ws: true,
        },
        '/api/flow': {
          target: 'http://localhost:8000/',
          // target: 'http://localhost:7002',
          changeOrigin: true, //是否允许跨域
          ws: true,
        },
      },
    },
    optimizeDeps: {
      include: ['lodash-es', 'ant-design-vue/es/locale/zh_CN', 'ant-design-vue/es/locale/en_US'],
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome79',
      brotliSize: false,
      chunkSizeWarningLimit: 2000,
      // rollupOptions: {
      //   experimentalTopLevelAwait: true,
      // },
    },
  };
};
