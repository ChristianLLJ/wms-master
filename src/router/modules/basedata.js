import Layout from '@/layout'
// 基础数据路由
const basedataRouter = {
  path: '/basedata',
  component: Layout,
  redirect: 'systemdata',
  name: 'baseData',
  meta: {
    title: '基础数据',
    icon: '基础数据管理'
  },
  children: [
    {
      path: '/systemdata',
      name: 'systemData',
      component: () => import('@/views/baseData/systemData/index'),
      meta: { title: '系统代码', icon: '系统代码' }
    },
    {
      path: '/systemlist',
      name: 'Systemlist',
      component: () => import('@/form/baseData/systemlist/index'),
      meta: { title: '系统代码填写' },
      hidden: true
    },
    {
      path: '/despatchwave',
      name: 'despatchwave',
      component: () => import('@/views/baseData/despatchwave/index'),
      meta: { title: '波次规则', icon: '波次管理' }
    },
    {
      path: '/commoditydata',
      name: 'commodityData',
      component: () => import('@/views/baseData/commodityData/index'),
      meta: { title: '商品', icon: '商品' }
    },
    {
      path: '/commoditylist',
      name: 'Commoditylist',
      component: () => import('@/form/baseData/commoditylist/index'),
      meta: { title: '新增商品' },
      hidden: true
    },
    {
      path: '/containerdata',
      name: 'containerData',
      component: () => import('@/views/baseData/containerData/index'),
      meta: { title: '包装', icon: '包装' }
    },
    {
      path: '/skucontainerdata',
      name: 'skuContainerData',
      component: () => import('@/views/baseData/skucontainerdata/index'),
      meta: { title: '商品货码', icon: '包装' }
    },
    {
      path: '/customdata',
      name: 'customData',
      component: () => import('@/views/baseData/customData/index'),
      meta: { title: '客户', icon: '客户' }
    },
    {
      path: '/warehouse',
      component: () => import('@/views/baseData/warehouse/index'),
      redirect: '/warehousedata',
      name: 'wareHouse',
      meta: {
        title: '仓库数据',
        icon: '仓库数据'
      },
      children: [
        {
          path: '/warehousedata',
          name: 'wareHouseData',
          component: () => import('@/views/baseData/warehouse/warehouseData/index'),
          meta: { title: '仓库', icon: '仓库' }
        },
        {
          path: '/areadata',
          name: 'areaData',
          component: () => import('@/views/baseData/warehouse/areaData/index'),
          meta: { title: '库区', icon: '库区' }
        },
        {
          path: '/hardwaredata',
          name: 'hardwareData',
          component: () => import('@/views/baseData/warehouse/hardwareData/index'),
          meta: { title: '货架', icon: '货架' }
        },
        {
          path: '/locationgroupdata',
          name: 'locationGroupData',
          component: () => import('@/views/baseData/warehouse/locationGroupData/index'),
          meta: { title: '库位组', icon: '库位组' }
        },
        {
          path: '/warehouselocationdata',
          name: 'warehouseLocationData',
          component: () => import('@/views/baseData/warehouse/warehouseLocationData/index'),
          meta: { title: '库位', icon: '库位' }
        },
        {
          path: '/devicedata',
          name: 'deviceData',
          component: () => import('@/views/baseData/warehouse/deviceData/index'),
          meta: { title: '设备', icon: '设备' }
        },
        {
          path: 'moondata',
          name: 'moonData',
          component: () => import('@/views/baseData/warehouse/moonData/index'),
          meta: { title: '月台', icon: '仓储-月台管理' },
          hidden: true
        },
        {
          path: 'cardata',
          name: 'carData',
          component: () => import('@/views/baseData/warehouse/carData/index'),
          meta: { title: '车辆', icon: '车辆信息' }
        }
      ]
    }
  ]
}

export default basedataRouter
