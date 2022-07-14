import { type RouteRecordRaw } from 'vue-router';
import RouterView from '@/layout/routerView/index.vue';

const moduleName = 'convertible';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/convertible',
    component: RouterView,
    redirect: '/convertible/calculate',
    meta: {
      title: '可转债',
    },
    children: [
      {
        path: 'calculate',
        name: `${moduleName}-calculate`,
        component: () => import('@/views/convertible/calculate/list.vue'),
        meta: { title: '组合策略' },
      },
      {
        path: 'comb/:id',
        name: `${moduleName}-comb`,
        component: () => import('@/views/convertible/calculate/combEdit.vue'),
        meta: { title: '组合编辑', hideInMenu: true },
      },
    ],
  },
];

export default routes;
