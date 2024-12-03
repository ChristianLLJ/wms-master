import Layout from '@/layout'
// 预警管理
const warningRouter = {
  path: '/inventorywarning',
  name: 'Inventorywarning',
  redirect: '/stockWarning',
  component: Layout,
  meta: { title: '预警管理', icon: '库存预警' },
  children: [{
    path: '/stockWarning',
    name: 'StockWarning',
    component: () => import('@/views/inlibrary/inventoryWarning/stockWarning/index'),
    meta: { title: '库存数量预警', icon: '预警_高亮' }
  },
  {
    path: '/validWarning',
    name: 'ValidWarning',
    component: () => import('@/views/inlibrary/inventoryWarning/validWarning/index'),
    meta: { title: '有效期预警', icon: '效期预警' }
  },
  {
    path: '/retentionWarning',
    name: 'RetentionWarning',
    component: () => import('@/views/inlibrary/inventoryWarning/retentionWarning/index'),
    meta: { title: '滞留期预警', icon: '滞留' }
  }]
}

export default warningRouter
