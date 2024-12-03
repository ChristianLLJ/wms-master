import Vue from 'vue'
import Router from 'vue-router'
import warehousingRouter from '@/router/modules/warehousing'
import inlibraryRouter from './modules/inlibrary'
import authorityRouter from './modules/authority'
import basedataRouter from './modules/basedata'
import warningRouter from './modules/warning'
import graphRouter from './modules/graph'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import issueRouter from './modules/Issue'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/scanUpdate',
    component: () => import('@/views/update'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: '首页' }
    }]
  },
  warehousingRouter,
  issueRouter,
  inlibraryRouter,
  warningRouter,
  graphRouter,
  authorityRouter,
  basedataRouter,
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
