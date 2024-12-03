import Layout from '@/layout'
// 权限路由
const authorityRouter = {
  path: '/authorization',
  component: Layout,
  redirect: 'staffauth',
  name: 'Authorization',
  meta: {
    title: '权限管理',
    icon: '权限设置'
  },
  children: [
    {
      path: '/companydata',
      name: 'companyData',
      component: () => import('@/views/authorization/companyData/index'),
      meta: { title: '公司', icon: '公司' }
    },
    {
      path: '/departmentdata',
      name: 'departmentData',
      component: () => import('@/views/authorization/departmentData/index'),
      meta: { title: '部门', icon: '部门' }
    },
    {
      path: '/function',
      name: 'Function',
      component: () => import('@/views/authorization/function/index'),
      meta: { title: '功能', icon: '功能' }
    },
    {
      path: '/workgroupauth',
      name: 'workGroupAuth',
      component: () => import('@/views/authorization/workGroupAuth/index'),
      meta: { title: '工作组', icon: '工作组' }
    },
    {
      path: '/staffauth',
      name: 'staffAuth',
      component: () => import('@/views/authorization/staffAuth/index'),
      meta: { title: '员工', icon: '员工' }
    }
  ]
}

export default authorityRouter
