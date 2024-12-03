import Layout from '@/layout'
// 出库业务路由
const issueRouter = {
  path: '/exwarehouse',
  component: Layout,
  name: 'Exwarehouse',
  redirect: 'customerorder',
  meta: {
    title: '出库业务',
    icon: '采购出库'
  },
  children: [
    {
      path: '/customerorder',
      component: () => import('@/views/exwarehouse/customerorder/index'), // Parent router-view
      name: 'Customerorder',
      meta: { title: '客户订单-toB', icon: '生成发运单' }
    },
    {
      path: '/customerorderC',
      component: () => import('@/views/exwarehouse/customerorderC/index'), // Parent router-view
      name: 'CustomerorderC',
      meta: { title: '客户订单-toC', icon: '生成发运单' }
    },
    {
      path: '/customerlist',
      name: 'Customerlist',
      component: () => import('@/form/exhouse/customerlist/index'),
      meta: { title: '新增toB客户订单' },
      hidden: true
    },
    {
      path: '/toccustomerlist',
      name: 'tocCustomerlist',
      component: () => import('@/form/exhouse/toccustomerlist/index'),
      meta: { title: '新增toC客户订单' },
      hidden: true
    },
    {
      path: '/shipmentorder',
      component: () => import('@/views/exwarehouse/shipmentorder/index'), // Parent router-view
      name: 'Shipmentorder',
      meta: { title: '发运订单', icon: '生成预发运单' }
    },
    {
      path: '/shipmentlist',
      name: 'Shipmentlist',
      component: () => import('@/form/exhouse/shipmentlist/index'),
      meta: { title: '发运订单填写' },
      hidden: true
    },
    {
      path: '/waveplan',
      component: () => import('@/views/exwarehouse/waveplan/index'),
      name: 'Waveplan',
      meta: { title: '波次计划', icon: '添加计划' }
    },
    {
      path: '/sortingOrder',
      name: 'sortingOrder',
      component: () => import('@/views/exwarehouse/sorting/sorting/index'),
      meta: { title: '分拣任务', icon: '分拣单' }
    },
    // {
    //   path: '/sorting',
    //   component: () => import('@/views/exwarehouse/sorting/index'),
    //   name: 'Sorting',
    //   meta: { title: '分拣', icon: '分拣单' },
    //   children: [{
    //     path: '/sortingOrder',
    //     name: 'sortingOrder',
    //     component: () => import('@/views/exwarehouse/sorting/sorting/index'),
    //     meta: { title: '分拣任务', icon: '采购订单' }
    //   },
    //   {
    //     path: '/expacking',
    //     component: () => import('@/views/exwarehouse/expacking/index'),
    //     name: 'Expacking',
    //     meta: { title: '分拣结果', icon: '收货' },
    //     hidden: true
    //   },
    //   {
    //     path: '/sortingResult',
    //     name: 'sortingResult',
    //     component: () => import('@/views/exwarehouse/sorting/sortingResult/index'),
    //     meta: { title: '分拣结果', icon: '收货' }
    //   }
    //   ]
    // },
    {
      path: '/moon',
      name: 'Moon',
      component: () => import('@/views/exwarehouse/moon/index'),
      meta: { title: '合单结果', icon: '仓储-月台管理' }
    },
    // {
    //   path: 'expackinglist',
    //   name: 'Expackinglist',
    //   component: () => import('@/form/exhouse/expackinglist/index'),
    //   meta: { title: '装箱任务填写' },
    //   hidden: true
    // },
    {
      path: 'loading',
      component: () => import('@/views/exwarehouse/loading/index'),
      name: 'Loading',
      meta: { title: '装车任务', icon: '装车单' }
    },
    {
      path: 'distribution',
      component: () => import('@/views/exwarehouse/distribution/index'),
      name: 'Distribution',
      meta: { title: '配送任务', icon: '配送单' },
      hidden: true
    },
    // {
    //   path: 'loadinglist',
    //   name: 'loadinglist',
    //   component: () => import('@/form/exhouse/loadinglist/index'),
    //   meta: { title: '装车任务填写' },
    //   hidden: true
    // },
    {
      path: '/express',
      component: () => import('@/views/exwarehouse/express/index'),
      name: 'Express',
      meta: { title: '快递任务', icon: '快递' }
    },
    {
      path: '/expresslist',
      name: 'expresslist',
      component: () => import('@/form/exhouse/expresslist/index'),
      meta: { title: '快递任务填写' },
      hidden: true
    }
  ]
}

export default issueRouter
