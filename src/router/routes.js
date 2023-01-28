
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), name: 'Início'},
      { path: '/about', component: () => import('pages/about.vue'), name: 'Sobre' },
      { path: '/todo', component: () => import('pages/todo.vue'), name: 'Tarefas' },
      { path: '/settings', component: () => import('pages/settings.vue'), name: 'Configurações' },
      { path: '/settings/helpe', component: () => import('pages/helpe.vue'), name: 'Tutorial' },
      { path: '/rev', component: () => import('pages/revisao.vue'), name: 'Lembretes' },
      { path: '/auth', component: () => import('pages/Auth.vue'), name: 'Login' },
      { path: '/plan', component: () => import('pages/plan.vue'), name: 'Organização' },
      { path: '/plan/tasks/:id', component: () => import('pages/todo.vue'), name: 'Novas' }
    ]
  },
  {
    path: '/law',
    component: () => import('layouts/LawLayout.vue'),
    children: [
      { path: '/law/:id', component: () => import('pages/law.vue'), name: 'Estudo da Lei' },
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
