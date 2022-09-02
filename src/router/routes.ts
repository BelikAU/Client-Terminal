import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'IndexPage',
        component: () => import('pages/Index.vue'),
      },
      {
        path: 'terminal',
        name: 'TerminalPage',
        component: () => import('pages/Terminal.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/SetupLayout.vue'),
    children: [
      {
        path: 'control',
        name: 'ControlPage',
        component: () => import('src/pages/controll/Password.vue'),
      },
      {
        path: 'menu',
        name: 'MenuPage',
        component: () => import('src/pages/controll/Menu.vue'),
      },
      {
        path: 'stat',
        name: 'StatPage',
        component: () => import('src/pages/controll/Stat.vue'),
      },
      {
        path: 'info',
        name: 'InfoPage',
        component: () => import('src/pages/controll/Info.vue'),
      },
      {
        path: 'setup',
        name: 'SetupPage',
        component: () => import('src/pages/controll/Setup.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
