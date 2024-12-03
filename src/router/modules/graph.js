import Layout from '@/layout'
// 报表路由
const graphRouter = {
  path: '/graph',
  component: Layout,
  redirect: 'graph',
  name: 'Graph',
  meta: {
    title: '报表',
    icon: '报表'
  },
  children: [
    {
      path: '/inwareGraph',
      name: 'InwareGraph',
      component: () => import('@/views/graph/inwareGraph/index'),
      meta: { title: '入库报表', icon: '入库报表' }
    },
    {
      path: '/outwareGraph',
      name: 'OutwareGraph',
      component: () => import('@/views/graph/outwareGraph/index'),
      meta: { title: '出库报表', icon: '出库报表' }
    },
    {
      path: '/inlibraryGraph',
      name: 'InlibraryGraph',
      component: () => import('@/views/graph/inlibraryGraph/index'),
      meta: { title: '库内报表', icon: '仓库报表' }
    }
  ]
}

export default graphRouter
