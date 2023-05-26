import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/editor',
    component: () => import('@/views/home/editor.vue'),
  },
];

export default routes;
