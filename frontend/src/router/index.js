import store from '@/store/auth'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Building from '../views/Building.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import RolesEdit from '../views/roles/Edit.vue'
import RolesList from '../views/roles/List.vue'
import UsersEdit from '../views/users/Edit.vue'
import UsersList from '../views/users/List.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/logistica',
    name: 'Building',
    component: Building,
    meta: { requiresAuth: true }
  },
  {
    path: '/financeiro',
    name: 'Building',
    component: Building,
    meta: { requiresAuth: true }
  },
  {
    path: '/building',
    name: 'Building',
    component: Building,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'UsersList',
    component: UsersList,
    meta: { requiresAuth: true }
  },
  {
    path: '/users/edit/:id?',
    name: 'UsersEdit',
    component: UsersEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/roles',
    name: 'RolesList',
    component: RolesList,
    meta: { requiresAuth: true }
  },
  {
    path: '/roles/edit/:id?',
    name: 'RolesEdit',
    component: RolesEdit,
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// Simples verificação de autenticação
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = store.getters.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  if (to.path === '/login' && isAuthenticated) {
    return next('/users')
  }

  next()

})


export default router