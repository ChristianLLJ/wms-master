import Layout from '@/layout'
// 入库业务路由
const warehousingRouter = {
  path: '/receipt',
  component: Layout,
  redirect: '/purchaseOrder',
  name: 'Receipt',
  meta: { title: '入库业务', icon: '采购入库' },
  children: [
    // {
    //   path: 'orderselect',
    //   name: 'Orderselect',
    //   component: () => import('@/views/inwarehouse/orderselect/index'),
    //   meta: { title: '采购订单ERP导入', icon: '采购订单' }
    // },
    {
      path: '/table',
      name: 'Table',
      redirect: '/purchaseOrder',
      component: () => import('@/views/inwarehouse/table/index'),
      meta: { title: '订单', icon: '订单' },
      children: [{
        path: '/purchaseOrder',
        name: 'PurchaseOrder',
        component: () => import('@/views/inwarehouse/table/purchaseOrder/index'),
        meta: { title: '采购订单', icon: '采购订单' }
      },
      {
        path: '/backOrder',
        name: 'backOrder',
        component: () => import('@/views/inwarehouse/table/backOrder/index'),
        meta: { title: '退货订单', icon: '退货' }
      }
      ]
    },
    {
      path: '/tablelist',
      name: 'Tablelist',
      component: () => import('@/form/inhouse/tablelist/index'),
      meta: { title: '采购订单填写' },
      hidden: true
    },
    {
      path: '/backlist',
      name: 'Backlist',
      component: () => import('@/form/inhouse/backlist/index'),
      meta: { title: '退货订单填写' },
      hidden: true
    },
    {
      path: '/tabletotal',
      name: 'Tabletotal',
      component: () => import('@/views/iwtotal/tabletotal/index'),
      meta: { title: '采购订单详细信息' },
      hidden: true
    },
    {
      path: '/backtotal',
      name: 'Backtotal',
      component: () => import('@/views/iwtotal/backtotal/index'),
      meta: { title: '退货订单详细信息' },
      hidden: true
    },
    {
      path: '/receiptplan',
      name: 'Receiptplan',
      redirect: '/receiptorderplan',
      component: () => import('@/views/inwarehouse/receiptplan/index'),
      meta: { title: '入库计划', icon: '入库单' },
      children: [{
        path: '/receiptorderplan',
        name: 'Receiptorderplan',
        component: () => import('@/views/inwarehouse/receiptplan/receiptorderplan/index'),
        meta: { title: '有计划', icon: '计划' }
      },
      {
        path: '/receiptunorderplan',
        name: 'Receiptunorderplan',
        component: () => import('@/views/inwarehouse/receiptplan/receiptunorderplan/index'),
        meta: { title: '无计划', icon: '随机' }
      }]
    },
    {
      path: '/planlist',
      name: 'Planlist',
      component: () => import('@/form/inhouse/planlist/index'),
      meta: { title: '有计划-入库计划填写' },
      hidden: true
    },
    {
      path: '/unorderplanlist',
      name: 'Unorderplanlist',
      component: () => import('@/form/inhouse/unorderplanlist/index'),
      meta: { title: '无计划-入库计划填写' },
      hidden: true
    },
    {
      path: '/plantotal',
      name: 'Plantotal',
      component: () => import('@/views/iwtotal/plantotal/index'),
      meta: { title: '有计划-入库计划详细信息' },
      hidden: true
    },
    {
      path: '/unorderplantotal',
      name: 'Unorderplantotal',
      component: () => import('@/views/iwtotal/unorderplantotal/index'),
      meta: { title: '无计划-入库计划详细信息' },
      hidden: true
    },
    {
      path: '/quality',
      name: 'Quality',
      component: () => import('@/views/inwarehouse/quality/index'),
      meta: { title: '质检任务', icon: '质检单' }
    },
    {
      path: '/qualitylist',
      name: 'Qualitylist',
      component: () => import('@/form/inhouse/qualitylist/index'),
      meta: { title: '质检任务填写' },
      hidden: true
    },
    {
      path: '/qualitytotal',
      name: 'Qualitytotal',
      component: () => import('@/views/iwtotal/qualitytotal/index'),
      meta: { title: '质检任务详细信息' },
      hidden: true
    },
    {
      path: '/rfpackreceive',
      name: 'Rfpackreceive',
      component: () => import('@/views/iwtotal/receivetotal/rfpackreceive/index'),
      meta: { title: 'RF收箱详细信息' },
      hidden: true
    },
    {
      path: '/rfpiecereceive',
      name: 'Rfpiecereceive',
      component: () => import('@/views/iwtotal/receivetotal/rfpiecereceive/index'),
      meta: { title: 'RF收件详细信息' },
      hidden: true
    },
    {
      path: '/unorderrfpack',
      name: 'Unorderrfpack',
      component: () => import('@/views/iwtotal/receivetotal/unorderrfpack/index'),
      meta: { title: 'RF收箱详细信息' },
      hidden: true
    },
    {
      path: '/unorderrfpiece',
      name: 'Unorderrfpiece',
      component: () => import('@/views/iwtotal/receivetotal/unorderrfpiece/index'),
      meta: { title: 'RF收件详细信息' },
      hidden: true
    },
    {
      path: '/receive',
      name: 'Receive',
      redirect: '/orderReceive',
      component: () => import('@/views/inwarehouse/receive/index'),
      meta: { title: '入库收货', icon: '收货' },
      children: [{
        path: '/orderReceive',
        name: 'orderReceive',
        redirect: '/rfpackorderReceive',
        component: () => import('@/views/inwarehouse/receive/orderReceive/index'),
        meta: { title: '有计划收货', icon: '计划' },
        children: [{
          path: '/rfpackorderReceive',
          name: 'rfpackorderReceive',
          component: () => import('@/views/inwarehouse/receive/orderReceive/rfpackorderReceive/index'),
          meta: { title: 'RF收箱', icon: 'RFID' }
        },
        {
          path: '/rfpieceorderReceive',
          name: 'rfpieceorderReceive',
          component: () => import('@/views/inwarehouse/receive/orderReceive/rfpieceorderReceive/index'),
          meta: { title: 'RF收件', icon: 'RFID' }
        }]
      },
      {
        path: '/unorderReceive',
        name: 'unorderReceive',
        redirect: '/rfpackunorderReceive',
        component: () => import('@/views/inwarehouse/receive/unorderReceive/index'),
        meta: { title: '无计划收货', icon: '随机' },
        children: [{
          path: '/rfpackunorderReceive',
          name: 'rfpackunorderReceive',
          component: () => import('@/views/inwarehouse/receive/unorderReceive/rfpackunorderReceive/index'),
          meta: { title: 'RF收箱', icon: 'RFID' }
        },
        {
          path: '/rfpieceunorderReceive',
          name: 'rfpieceunorderReceive',
          component: () => import('@/views/inwarehouse/receive/unorderReceive/rfpieceunorderReceive/index'),
          meta: { title: 'RF收件', icon: 'RFID' }
        }]
      }

      ]
    },
    {
      path: '/receivetest',
      name: 'Receivetest',
      component: () => import('@/views/inwarehouse/receivetest/index'),
      meta: { title: '收货测试', icon: '收货' },
      hidden: true
    },
    {
      path: '/packing',
      name: 'Packing',
      redirect: '/normalpacking',
      component: () => import('@/views/inwarehouse/packing/index'),
      meta: { title: '装箱', icon: '装箱' },
      children: [
        {
          path: '/normalpacking',
          name: 'Normalpacking',
          component: () => import('@/views/inwarehouse/packing/normalpacking/index'),
          meta: { title: '装箱任务-有计划', icon: '装箱' }
        },
        {
          path: '/rfpacking',
          name: 'Rfpacking',
          component: () => import('@/views/inwarehouse/packing/rfpacking/index'),
          meta: { title: '装箱任务-无计划', icon: 'RFID' }
        }]
    },
    {
      path: '/packinglist',
      name: 'Packinglist',
      component: () => import('@/form/inhouse/packinglist/index'),
      meta: { title: '装箱任务单修改' },
      hidden: true
    },
    {
      path: '/packingtotal',
      name: 'Packingtotal',
      component: () => import('@/views/iwtotal/packingtotal/index'),
      meta: { title: '装箱任务-有计划详细信息' },
      hidden: true
    },
    {
      path: '/unorderpacktotal',
      name: 'Unorderpacktotal',
      component: () => import('@/views/iwtotal/unorderpacktotal/index'),
      meta: { title: '装箱任务-无计划详细信息' },
      hidden: true
    },
    {
      path: '/groupdisk',
      name: 'Groupdisk',
      redirect: '/normalgroupdisk',
      component: () => import('@/views/inwarehouse/groupdisk/index'),
      meta: { title: '码盘', icon: '物料组盘' },
      children: [
        {
          path: '/normalgroupdisk',
          name: 'Normalgroupdisk',
          component: () => import('@/views/inwarehouse/groupdisk/normalgroupdisk/index'),
          meta: { title: '码盘任务-有计划', icon: '物料组盘' }
        },
        {
          path: '/rfgroupdisk',
          name: 'Rfgroupdisk',
          component: () => import('@/views/inwarehouse/groupdisk/rfgroupdisk/index'),
          meta: { title: '码盘任务-无计划', icon: 'RFID' }
        }]
    },
    {
      path: '/normaldisktotal',
      name: 'Normaldisktotal',
      component: () => import('@/views/iwtotal/normaldisktotal/index'),
      meta: { title: '码盘任务-有计划码盘详细信息' },
      hidden: true
    },
    {
      path: '/normaldiskpacktotal',
      name: 'Normaldiskpacktotal',
      component: () => import('@/views/iwtotal/normaldiskpacktotal/index'),
      meta: { title: '码盘任务-有计划码盘装箱信息' },
      hidden: true
    },
    {
      path: '/rfdisktotal',
      name: 'Rfdisktotal',
      component: () => import('@/views/iwtotal/rfdisktotal/index'),
      meta: { title: '码盘任务-无计划码盘详细信息' },
      hidden: true
    },
    {
      path: '/rfdiskpacktotal',
      name: 'Rfdiskpacktotal',
      component: () => import('@/views/iwtotal/rfdiskpacktotal/index'),
      meta: { title: '码盘任务-无计划码盘装箱信息' },
      hidden: true
    },
    {
      path: '/disklist',
      name: 'Disklist',
      component: () => import('@/form/inhouse/disklist/index'),
      meta: { title: '码盘任务单修改' },
      hidden: true
    },
    {
      path: '/onselfstrategy',
      name: 'onselfStrategy',
      component: () => import('@/views/inwarehouse/onselfstrategy/index'),
      meta: { title: '上架策略', icon: '波次管理' }
    },
    {
      path: '/strategylist',
      name: 'Strategylist',
      component: () => import('@/form/inhouse/strategylist/index'),
      meta: { title: '上架策略填写' },
      hidden: true
    },
    {
      path: '/listingproposal',
      name: 'Listingproposal',
      component: () => import('@/views/inwarehouse/listingproposal/index'),
      meta: { title: '上架建议', icon: '上架' }
    },
    {
      path: '/proposaltotal',
      name: 'Proposaltotal',
      component: () => import('@/views/iwtotal/proposaltotal/index'),
      meta: { title: '上架建议详细信息' },
      hidden: true
    },
    {
      path: '/proposallist',
      name: 'Proposallist',
      component: () => import('@/form/inhouse/proposallist/index'),
      meta: { title: '上架任务填写' },
      hidden: true
    },
    {
      path: '/listing',
      name: 'Listing',
      component: () => import('@/views/inwarehouse/listing/index'),
      meta: { title: '上架任务', icon: '上架单管理' }
    },
    {
      path: '/listtotal',
      name: 'Listtotal',
      component: () => import('@/views/iwtotal/listtotal/index'),
      meta: { title: '上架任务详细信息' },
      hidden: true
    }
  ]
}

export default warehousingRouter
