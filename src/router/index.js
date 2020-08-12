import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function loadView (view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: loadView('Home')
  },
  {
    path: '/about',
    name: 'About',
    component: loadView('About')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: loadView('Settings')
  },
  {
    path: '/transcript',
    name: 'Transcript',
    component: loadView('Transcript')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
