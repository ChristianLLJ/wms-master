import Layout from '@/layout'
// 库内业务路由
const inlibraryRouter = {
  path: '/inlibrary',
  component: Layout,
  redirect: '/inventoryquery',
  name: 'Inlibrary',
  meta: {
    title: '库存管理',
    icon: '库存'
  },
  children: [
    {
      path: '/inventoryquery',
      name: 'Inventoryquery',
      component: () => import('@/views/inlibrary/inventoryquery/index'),
      meta: { title: '库存查询', icon: '库存-余量表' }
    },
    {
      path: '/inventorytotal',
      name: 'InventoryTotal',
      component: () => import('@/views/inlibrary/inventoryTotal/index'),
      meta: { title: '库存总量', icon: '总计' }, hidden: true
    },
    {
      path: '/inventorychangerecord',
      name: 'Inventorychangerecord',
      component: () => import('@/views/inlibrary/inventorychangerecord/index'),
      meta: { title: '库存调整', icon: '库存调整单' }
    },
    {
      path: '/changelist',
      name: 'Changelist',
      component: () => import('@/form/inlibrary/changelist/index'),
      meta: { title: '库存调整单填写' },
      hidden: true
    },
    {
      path: '/inventorymovement',
      name: 'Inventorymovement',
      component: () => import('@/views/inlibrary/inventorymovement/index'),
      meta: { title: '库存移动', icon: '库存移动' }
    },
    {
      path: '/movelist',
      name: 'Movelist',
      component: () => import('@/form/inlibrary/movelist/index'),
      meta: { title: '库存移动表填写' },
      hidden: true
    },
    {
      path: '/inventoryfreeze',
      name: 'Inventoryfreeze',
      component: () => import('@/views/inlibrary/inventoryfreeze/index'),
      meta: { title: '库存冻结', icon: '库存冻结' }
    },
    {
      path: '/freezelist',
      name: 'Freezelist',
      component: () => import('@/form/inlibrary/freezelist/index'),
      meta: { title: '库存冻结表填写' },
      hidden: true
    },
    {
      path: '/checktotal',
      name: 'Checktotal',
      component: () => import('@/views/intotal/checktotal/index'),
      meta: { title: '库存盘点单详细结果' },
      hidden: true
    },
    {
      path: '/changetotal',
      name: 'Changetotal',
      component: () => import('@/views/intotal/changetotal/index'),
      meta: { title: '库存调整单详细结果' },
      hidden: true
    },
    {
      path: '/movetotal',
      name: 'Movetotal',
      component: () => import('@/views/intotal/movetotal/index'),
      meta: { title: '库存移动单详细结果' },
      hidden: true
    },
    {
      path: '/freezetotal',
      name: 'Freezetotal',
      component: () => import('@/views/intotal/freezetotal/index'),
      meta: { title: '库存冻结单详细结果' },
      hidden: true
    },
    {
      path: '/inventorycheck',
      name: 'Inventorycheck',
      redirect: '/totalCheck',
      component: () => import('@/views/inlibrary/inventorycheck/index'),
      meta: { title: '库存盘点', icon: '库存盘点' },
      children: [{
        path: '/totalCheck',
        name: 'TotalCheck',
        component: () => import('@/views/inlibrary/inventorycheck/totalCheck/index'),
        meta: { title: '全库盘点', icon: '执行全部' }
      },
      {
        path: '/chooseCheck',
        name: 'ChooseCheck',
        component: () => import('@/views/inlibrary/inventorycheck/chooseCheck/index'),
        meta: { title: '指定盘点', icon: '库位' }
      }
      ]
    },
    {
      path: '/checklist',
      name: 'Checklist',
      component: () => import('@/form/inlibrary/checklist/index'),
      meta: { title: '库存盘点单填写' },
      hidden: true
    }
  ]
}

export default inlibraryRouter
