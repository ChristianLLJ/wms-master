import request from '@/utils/request'
export function initSystem(data) {
  return request({
    url: 'initSystem',
    method: 'post',
    data
  })
}
export function sendWave(data) {
  return request({
    url: 'api/lilanz/retroute/sendWave',
    method: 'post',
    data
  })
}
export function lkcktask(data) {
  return request({
    url: 'api/lilanz/retroute/lkcktask',
    method: 'post',
    data
  })
}
export function login(data) {
  return request({
    url: 'login/loginUser',
    method: 'post',
    data
  })
}
export function singleTest(data) {
  return request({
    url: 'login/singleTest',
    method: 'post',
    data
  })
}
export function getUserId(data) {
  return request({
    url: 'login/getUserId',
    method: 'post',
    data
  })
}
export function loginWorkGroup(data) {
  return request({
    url: 'login/loginWorkGroup',
    method: 'post',
    data
  })
}
export function loginOut() {
  return request({
    url: 'login/loginOut',
    method: 'post'
  })
}
export function selectPurchaseOrder(data) {
  return request({
    url: 'purchaseOrder/selectPurchaseOrder',
    method: 'post',
    data
  })
}
export function selectGroupBySelective(data) {
  return request({
    url: 'inventoryBalance/selectGroupBySelective',
    method: 'post',
    data
  })
}
export function getHeadCode(data) {
  return request({
    url: 'purchaseOrder/getHeadCode',
    method: 'post',
    data
  })
}
export function delPurDetail(data) {
  return request({
    url: 'purchaseOrder/delDetail',
    method: 'post',
    data
  })
}
export function importJindie(data) {
  return request({
    url: 'purchaseOrder/importJindie',
    method: 'post',
    data
  })
}
export function jindie(data) {
  return request({
    url: 'purchaseOrder/import',
    method: 'post',
    data
  })
}
export function closePurchaseOrder(data) {
  return request({
    url: 'purchaseOrder/closePurchaseOrder',
    method: 'post',
    data
  })
}
export function closeInboundPlan(data) {
  return request({
    url: 'inboundPlan/closeInboundPlan',
    method: 'post',
    data
  })
}
export function closeQualityCheck(data) {
  return request({
    url: 'qualityCheck/closeQualityCheck',
    method: 'post',
    data
  })
}
export function qualityUnpass(data) {
  return request({
    url: 'qualityCheck/qualityUnpass',
    method: 'post',
    data
  })
}
export function closeInPackage(data) {
  return request({
    url: 'inPackage/closeInPackage',
    method: 'post',
    data
  })
}
export function closeCombine(data) {
  return request({
    url: 'stack/closeCombine',
    method: 'post',
    data
  })
}
export function selectPurchaseOrderNum(data) {
  return request({
    url: 'purchaseOrder/selectPurchaseOrderNum',
    method: 'post',
    data
  })
}
export function selectPurchaseOrderDetail(data) {
  return request({
    url: 'purchaseOrder/selectPurchaseOrderDetail',
    method: 'post',
    data
  })
}
export function selectPurchaseOrderDetailNum(data) {
  return request({
    url: 'purchaseOrder/selectPurchaseOrderDetailNum',
    method: 'post',
    data
  })
}

export function selectInboundPlan(data) {
  return request({
    url: 'inboundPlan/selectInboundPlan',
    method: 'post',
    data
  })
}

export function updSkuContainer(data) {
  return request({
    url: 'skuContainer/upd',
    method: 'post',
    data
  })
}
export function selectSkuContainerNum(data) {
  return request({
    url: 'skuContainer/screenTableNum',
    method: 'post',
    data
  })
}
export function deleteSkuContainer(data) {
  return request({
    url: 'skuContainer/del',
    method: 'post',
    data
  })
}
export function selectSkuContainer(data) {
  return request({
    url: 'skuContainer/screenTable',
    method: 'post',
    data
  })
}
export function addSkuContainer(data) {
  return request({
    url: 'skuContainer/addList',
    method: 'post',
    data
  })
}
export function alarmByInventoryCounts(data) {
  return request({
    url: 'inventoryBalance/alarmByInventoryCount',
    method: 'post',
    data
  })
}
export function alarmByValidDates(data) {
  return request({
    url: 'inventoryBalance/alarmByValidDate',
    method: 'post',
    data
  })
}
export function alarmByRetentionDays(data) {
  return request({
    url: 'inventoryBalance/alarmByRetentionDay',
    method: 'post',
    data
  })
}
export function baokaiWcsSend(data) {
  return request({
    url: 'skuContainer/baokaiWcsSend',
    method: 'post',
    data
  })
}
export function auditPlan(data) {
  return request({
    url: 'inboundPlan/audit',
    method: 'post',
    data
  })
}
export function selectInboundPlanNum(data) {
  return request({
    url: 'inboundPlan/selectInboundPlanNum',
    method: 'post',
    data
  })
}
export function getPlanHeadCode(data) {
  return request({
    url: 'inboundPlan/getHeadCode',
    method: 'post',
    data
  })
}
export function selectInboundPlanDetail(data) {
  return request({
    url: 'inboundPlan/selectInboundPlanDetail',
    method: 'post',
    data
  })
}
export function selectInboundPlanDetailNum(data) {
  return request({
    url: 'inboundPlan/selectInboundPlanDetailNum',
    method: 'post',
    data
  })
}
export function selectQualityCheck(data) {
  return request({
    url: 'qualityCheck/selectQualityCheck',
    method: 'post',
    data
  })
}
export function auditQuality(data) {
  return request({
    url: 'qualityCheck/audit',
    method: 'post',
    data
  })
}
export function getQualityHeadCode(data) {
  return request({
    url: 'qualityCheck/getHeadCode',
    method: 'post',
    data
  })
}
export function selectQualityCheckNum(data) {
  return request({
    url: 'qualityCheck/selectQualityCheckNum',
    method: 'post',
    data
  })
}
export function selectQualityCheckDetail(data) {
  return request({
    url: 'qualityCheck/selectQualityCheckDetail',
    method: 'post',
    data
  })
}
export function selectQualityCheckDetailNum(data) {
  return request({
    url: 'qualityCheck/selectQualityCheckDetailNum',
    method: 'post',
    data
  })
}
// export function excelOutCHE(data) {
//   return request({
//     url: 'inbound/excelOutCHE',
//     method: 'post',
//     data
//   })
// }
export function selectInPackage(data) {
  return request({
    url: 'inPackage/selectInPackage',
    method: 'post',
    data
  })
}
export function auditPack(data) {
  return request({
    url: 'inPackage/audit',
    method: 'post',
    data
  })
}
export function selectInPackageNum(data) {
  return request({
    url: 'inPackage/selectInPackageNum',
    method: 'post',
    data
  })
}
export function getPackHeadCode(data) {
  return request({
    url: 'inPackage/getHeadCode',
    method: 'post',
    data
  })
}
export function selectInPackageDetail(data) {
  return request({
    url: 'inPackage/selectInPackageDetail',
    method: 'post',
    data
  })
}
export function selectInPackageDetailNum(data) {
  return request({
    url: 'inPackage/selectInPackageDetailNum',
    method: 'post',
    data
  })
}
export function selectCombineStack(data) {
  return request({
    url: 'stack/selectCombineStack',
    method: 'post',
    data
  })
}
export function selectCombineStackNum(data) {
  return request({
    url: 'stack/selectCombineStackNum',
    method: 'post',
    data
  })
}
export function getStackHeadCode(data) {
  return request({
    url: 'stack/getHeadCode',
    method: 'post',
    data
  })
}
export function auditDisk(data) {
  return request({
    url: 'stack/audit',
    method: 'post',
    data
  })
}
export function selectCombineStackDetail(data) {
  return request({
    url: 'stack/selectCombineStackDetail',
    method: 'post',
    data
  })
}
export function selectCombineStackDetailNum(data) {
  return request({
    url: 'stack/selectCombineStackDetailNum',
    method: 'post',
    data
  })
}
export function selectOnshelfAdvice(data) {
  return request({
    url: 'onshelf/selectOnshelfAdvice',
    method: 'post',
    data
  })
}
export function updateInventoryByONF(data) {
  return request({
    url: 'onshelf/updateInventoryByONF',
    method: 'post',
    data
  })
}
export function selectOnshelfAdviceNum(data) {
  return request({
    url: 'onshelf/selectOnshelfAdviceNum',
    method: 'post',
    data
  })
}
export function selectOnshelfAdviceDetail(data) {
  return request({
    url: 'onshelf/selectOnshelfAdviceDetail',
    method: 'post',
    data
  })
}
export function selectOnshelfAdviceDetailNum(data) {
  return request({
    url: 'onshelf/selectOnshelfAdviceDetailNum',
    method: 'post',
    data
  })
}
export function getOnshelfAdviceHeadCode(data) {
  return request({
    url: 'onshelf/getOnshelfAdviceHeadCode',
    method: 'post',
    data
  })
}
export function getOnshelfHeadCode(data) {
  return request({
    url: 'onshelf/getHeadCode',
    method: 'post',
    data
  })
}
export function addSysCodeAndDetail(data) {
  return request({
    url: 'baseData/addSysCodeAndDetail',
    method: 'post',
    data
  })
}
export function screenSysCode(data) {
  return request({
    url: 'baseData/screenSysCode',
    method: 'post',
    data
  })
}
export function screenSysCodeSum(data) {
  return request({
    url: 'baseData/screenSysCodeSum',
    method: 'post',
    data
  })
}
export function screenSysCodeDetailSum(data) {
  return request({
    url: 'baseData/screenSysCodeDetailSum',
    method: 'post',
    data
  })
}
export function screenSysCodeDetail(data) {
  return request({
    url: 'baseData/screenSysCodeDetail',
    method: 'post',
    data
  })
}
export function deleteSysCodeAndDetail(data) {
  return request({
    url: 'baseData/deleteSysCodeAndDetail',
    method: 'post',
    data
  })
}
export function addGoodsAndSku(data) {
  return request({
    url: 'baseData/addGoodsAndSku',
    method: 'post',
    data
  })
}
export function screenGoods(data) {
  return request({
    url: 'baseData/screenGoods',
    method: 'post',
    data
  })
}
export function screenGoodsSum(data) {
  return request({
    url: 'baseData/screenGoodsSum',
    method: 'post',
    data
  })
}
export function screenGoodsSku(data) {
  return request({
    url: 'baseData/screenGoodsSku',
    method: 'post',
    data
  })
}
export function screenGoodsSkuSum(data) {
  return request({
    url: 'baseData/screenGoodsSkuSum',
    method: 'post',
    data
  })
}
export function deleteCustom(data) {
  return request({
    url: 'baseData/deleteCustom',
    method: 'post',
    data
  })
}
export function addContainer(data) {
  return request({
    url: 'baseData/addContainer',
    method: 'post',
    data
  })
}
export function upgradeSysCodeAndDetail(data) {
  return request({
    url: 'baseData/upgradeSysCodeAndDetail',
    method: 'post',
    data
  })
}
export function screenContainer(data) {
  return request({
    url: 'baseData/screenContainer',
    method: 'post',
    data
  })
}
export function screenContainerSum(data) {
  return request({
    url: 'baseData/screenContainerSum',
    method: 'post',
    data
  })
}
export function updateContainer(data) {
  return request({
    url: 'baseData/updateContainer',
    method: 'post',
    data
  })
}
export function deleteContainer(data) {
  return request({
    url: 'baseData/deleteContainer',
    method: 'post',
    data
  })
}
export function addCustom(data) {
  return request({
    url: 'baseData/addCustom',
    method: 'post',
    data
  })
}
export function screenCustom(data) {
  return request({
    url: 'baseData/screenCustom',
    method: 'post',
    data
  })
}
export function screenCustomSum(data) {
  return request({
    url: 'baseData/screenCustomSum',
    method: 'post',
    data
  })
}
export function checkWave(data) {
  return request({
    url: 'outbound/checkWave',
    method: 'post',
    data
  })
}
export function checkWaveReject(data) {
  return request({
    url: 'outbound/checkWaveReject',
    method: 'post',
    data
  })
}
export function addExPickingAndDetail(data) {
  return request({
    url: 'outbound/addExPickingAndDetail',
    method: 'post',
    data
  })
}
export function addLoadingAndDetail(data) {
  return request({
    url: 'outbound/addLoadingAndDetail',
    method: 'post',
    data
  })
}
export function addWarehouse(data) {
  return request({
    url: 'warehouse/addWarehouse',
    method: 'post',
    data
  })
}
export function selectWarehouse(data) {
  return request({
    url: 'warehouse/selectWarehouse',
    method: 'post',
    data
  })
}
export function selectWarehouseNum(data) {
  return request({
    url: 'warehouse/selectWarehouseNum',
    method: 'post',
    data
  })
}
export function updWarehouse(data) {
  return request({
    url: 'warehouse/upd',
    method: 'post',
    data
  })
}
export function delWarehouse(data) {
  return request({
    url: 'warehouse/delWarehouse',
    method: 'post',
    data
  })
}
export function submitFreezeAndDetail(data) {
  return request({
    url: 'stockFreeze/submitFreezeAndDetail',
    method: 'post',
    data
  })
}
export function releaseFreeze(data) {
  return request({
    url: 'stockFreeze/releaseFreeze',
    method: 'post',
    data
  })
}
export function alarmByInventoryCount(data) {
  return request({
    url: 'inventoryBalance/alarmByInventoryCount',
    method: 'post',
    data
  })
}
export function alarmByRetentionDay(data) {
  return request({
    url: 'inventoryBalance/alarmByRetentionDay',
    method: 'post',
    data
  })
}
export function alarmByValidDate(data) {
  return request({
    url: 'inventoryBalance/alarmByValidDate',
    method: 'post',
    data
  })
}
export function inboundReport(data) {
  return request({
    url: 'inboundReport/inboundReport',
    method: 'post',
    data
  })
}
export function outboundReport(data) {
  return request({
    url: 'outboundReport/outboundReport',
    method: 'post',
    data
  })
}
export function baokaiWcsGetInboundTask(data) {
  return request({
    url: 'onshelf/baokaiWcsGetInboundTask',
    method: 'post',
    data
  })
}
export function shuttleStartServer(data) {
  return request({
    url: 'onshelf/shuttleStartServer',
    method: 'post',
    data
  })
}
export function inwarehouseReport(data) {
  return request({
    url: 'inwarehouseReport/inwarehouseReport',
    method: 'post',
    data
  })
}
export function countAlarmEnabled(data) {
  return request({
    url: 'inventoryBalance/countAlarmEnabled',
    method: 'post',
    data
  })
}
export function validityAlarmEnabled(data) {
  return request({
    url: 'inventoryBalance/validityAlarmEnabled',
    method: 'post',
    data
  })
}
export function updateAlarm(data) {
  return request({
    url: 'inventoryBalance/updateInventoryBalance',
    method: 'post',
    data
  })
}
export function exportCountAlarmExcel(data) {
  return request({
    url: 'inventoryBalance/exportCountAlarmExcel',
    method: 'post',
    data,
    contentType: 'application/json;charset=UTF-8',
    responseType: 'blob'

  })
}
export function exportValidAlarmExcel(data) {
  return request({
    url: 'inventoryBalance/exportValidAlarmExcel',
    method: 'post',
    data,

    contentType: 'application/json;charset=UTF-8',
    responseType: 'blob'
  })
}
export function exportRetentionAlarmExcel(data) {
  return request({
    url: 'inventoryBalance/exportRetentionAlarmExcel',
    method: 'post',
    data,
    contentType: 'application/json;charset=UTF-8',
    responseType: 'blob'
  })
}
export function fullInventory(data) {
  return request({
    url: 'stockInventory/fullInventory',
    method: 'post',
    data
  })
}
export function currentDayInventory(data) {
  return request({
    url: 'stockInventory/currentDayInventory',
    method: 'post',
    data
  })
}
export function selectLocationInventory(data) {
  return request({
    url: 'stockInventory/dynamicInventory',
    method: 'post',
    data
  })
}
export function selectDateInventory(data) {
  return request({
    url: 'stockInventory/selectDateInventory',
    method: 'post',
    data
  })
}
export function selectByWarehouseName(data) {
  return request({
    url: 'inventoryTotal/selectByWarehouseName',
    method: 'post',
    data
  })
}
export function selectByAreaName(data) {
  return request({
    url: 'inventoryTotal/selectByAreaName',
    method: 'post',
    data
  })
}
export function selectBySkuName(data) {
  return request({
    url: 'inventoryTotal/selectBySkuName',
    method: 'post',
    data
  })
}
export function selectByCustomName(data) {
  return request({
    url: 'inventoryTotal/selectByCustomName',
    method: 'post',
    data
  })
}
export function selectByProductCompany(data) {
  return request({
    url: 'inventoryTotal/selectByProductCompany',
    method: 'post',
    data
  })
}
export function selectByCommodityName(data) {
  return request({
    url: 'inventoryTotal/selectByCommodityName',
    method: 'post',
    data
  })
}
export function selectByLocationName(data) {
  return request({
    url: 'inventoryTotal/selectByLocationName',
    method: 'post',
    data
  })
}
export function selectByProductBatch(data) {
  return request({
    url: 'inventoryTotal/selectByProductBatch',
    method: 'post',
    data
  })
}
export function searchStockFreezeSelective(data) {
  return request({
    url: 'stockFreeze/searchStockFreezeSelective',
    method: 'post',
    data
  })
}
export function stockFreezeAudit(data) {
  return request({
    url: 'stockFreeze/audit',
    method: 'post',
    data
  })
}
export function stockFreezeUnAudit(data) {
  return request({
    url: 'stockFreeze/unAudit',
    method: 'post',
    data
  })
}
export function stockFreezeGetHeadCode(data) {
  return request({
    url: 'stockFreeze/getHeadCode',
    method: 'post',
    data
  })
}
export function searchStockFreezeNum(data) {
  return request({
    url: 'stockFreeze/searchStockFreezeNum',
    method: 'post',
    data
  })
}
export function searchFreezeDetailSelective(data) {
  return request({
    url: 'stockFreeze/searchFreezeDetailSelective',
    method: 'post',
    data
  })
}
export function searchFreezeDetailNum(data) {
  return request({
    url: 'stockFreeze/searchFreezeDetailNum',
    method: 'post',
    data
  })
}
export function deleteFreezeAndDetail(data) {
  return request({
    url: 'stockFreeze/deleteFreezeAndDetail',
    method: 'post',
    data
  })
}
export function selectArea(data) {
  return request({
    url: 'warehouseArea/selectArea',
    method: 'post',
    data
  })
}
export function selectAreaNum(data) {
  return request({
    url: 'warehouseArea/selectAreaNum',
    method: 'post',
    data
  })
}
export function delArea(data) {
  return request({
    url: 'warehouseArea/delArea',
    method: 'post',
    data
  })
}
export function selectLocation(data) {
  return request({
    url: 'warehouseLocation/selectLocation',
    method: 'post',
    data
  })
}
export function selectLocationNum(data) {
  return request({
    url: 'warehouseLocation/selectLocationNum',
    method: 'post',
    data
  })
}
export function delLocation(data) {
  return request({
    url: 'warehouseLocation/delLocation',
    method: 'post',
    data
  })
}
export function selectLocationGroup(data) {
  return request({
    url: 'warehousedata/selectLocationGroup',
    method: 'post',
    data
  })
}
export function selectLocationGroupNum(data) {
  return request({
    url: 'warehousedata/selectLocationGroupNum',
    method: 'post',
    data
  })
}
export function delLocationGroup(data) {
  return request({
    url: 'warehousedata/delLocationGroup',
    method: 'post',
    data
  })
}
export function selectCar(data) {
  return request({
    url: 'car/selectCar',
    method: 'post',
    data
  })
}
export function selectCarNum(data) {
  return request({
    url: 'car/selectCarNum',
    method: 'post',
    data
  })
}
export function delCar(data) {
  return request({
    url: 'car/delCar',
    method: 'post',
    data
  })
}
export function selectDevice(data) {
  return request({
    url: 'device/selectDevice',
    method: 'post',
    data
  })
}
export function selectDeviceNum(data) {
  return request({
    url: 'device/selectDeviceNum',
    method: 'post',
    data
  })
}
export function delDevice(data) {
  return request({
    url: 'device/delDevice',
    method: 'post',
    data
  })
}
export function searchStockInventorySelective(data) {
  return request({
    url: 'stockInventory/searchStockInventorySelective',
    method: 'post',
    data
  })
}
export function stockInventoryAudit(data) {
  return request({
    url: 'stockInventory/audit',
    method: 'post',
    data
  })
}
export function stockInventoryUnAudit(data) {
  return request({
    url: 'stockInventory/unAudit',
    method: 'post',
    data
  })
}
export function searchStockInventoryNum(data) {
  return request({
    url: 'stockInventory/searchStockInventoryNum',
    method: 'post',
    data
  })
}
export function deleteStockInventoryAndDetail(data) {
  return request({
    url: 'stockInventory/deleteStockInventoryAndDetail',
    method: 'post',
    data
  })
}
export function searchStockInventoryDetailSelective(data) {
  return request({
    url: 'stockInventory/searchStockInventoryDetailSelective',
    method: 'post',
    data
  })
}
export function searchStockInventoryDetailNum(data) {
  return request({
    url: 'stockInventory/searchStockInventoryDetailNum',
    method: 'post',
    data
  })
}
export function getStockInventoryHeadCode(data) {
  return request({
    url: 'stockInventory/getHeadCode',
    method: 'post',
    data
  })
}
export function searchInventoryMoveSelective(data) {
  return request({
    url: 'inventoryMove/searchInventoryMoveSelective',
    method: 'post',
    data
  })
}
export function inventoryMoveAudit(data) {
  return request({
    url: 'inventoryMove/audit',
    method: 'post',
    data
  })
}
export function inventoryMoveUnAudit(data) {
  return request({
    url: 'inventoryMove/unAudit',
    method: 'post',
    data
  })
}
export function searchInventoryMoveNum(data) {
  return request({
    url: 'inventoryMove/searchInventoryMoveNum',
    method: 'post',
    data
  })
}
export function searchInventoryMoveDetailSelective(data) {
  return request({
    url: 'inventoryMove/searchInventoryMoveDetailSelective',
    method: 'post',
    data
  })
}
export function searchInventoryMoveDetailNum(data) {
  return request({
    url: 'inventoryMove/searchInventoryMoveDetailNum',
    method: 'post',
    data
  })
}
export function deleteInventoryMoveAndDetail(data) {
  return request({
    url: 'inventoryMove/deleteInventoryMoveAndDetail',
    method: 'post',
    data
  })
}
export function submitInventoryMoveAndDetail(data) {
  return request({
    url: 'inventoryMove/submitInventoryMoveAndDetail',
    method: 'post',
    data
  })
}
export function inventoryMoveGetHeadCode(data) {
  return request({
    url: 'inventoryMove/getHeadCode',
    method: 'post',
    data
  })
}
export function searchStockChangeSelective(data) {
  return request({
    url: 'stockChange/searchStockChangeSelective',
    method: 'post',
    data
  })
}
export function stockChangeAudit(data) {
  return request({
    url: 'stockChange/audit',
    method: 'post',
    data
  })
}
export function stockChangeUnAudit(data) {
  return request({
    url: 'stockChange/unAudit',
    method: 'post',
    data
  })
}
export function searchStockChangeNum(data) {
  return request({
    url: 'stockChange/searchStockChangeNum',
    method: 'post',
    data
  })
}
export function searchStockChangeDetailSelective(data) {
  return request({
    url: 'stockChange/searchStockChangeDetailSelective',
    method: 'post',
    data
  })
}
export function searchStockChangeDetailNum(data) {
  return request({
    url: 'stockChange/searchStockChangeDetailNum',
    method: 'post',
    data
  })
}
export function deleteStockChangeAndDetail(data) {
  return request({
    url: 'stockChange/deleteStockChangeAndDetail',
    method: 'post',
    data
  })
}
export function submitStockChangeAndDetail(data) {
  return request({
    url: 'stockChange/submitStockChangeAndDetail',
    method: 'post',
    data
  })
}
export function stockChangeGetHeadCode(data) {
  return request({
    url: 'stockChange/getHeadCode',
    method: 'post',
    data
  })
}
export function selectWorkGroup(data) {
  return request({
    url: 'workGroup/selectWorkGroup',
    method: 'post',
    data
  })
}
export function selectWorkGroupNum(data) {
  return request({
    url: 'workGroup/selectWorkGroupNum',
    method: 'post',
    data
  })
}
export function delWorkgroup(data) {
  return request({
    url: 'workGroup/delWorkgroup',
    method: 'post',
    data
  })
}
export function selectStaff(data) {
  return request({
    url: 'staff/selectStaff',
    method: 'post',
    data
  })
}
export function selectStaffNum(data) {
  return request({
    url: 'staff/selectStaffNum',
    method: 'post',
    data
  })
}
export function sendPickTaskToShuttleWcs(data) {
  return request({
    url: 'pickup/sendPickTaskToShuttleWcs',
    method: 'post',
    data
  })
}
export function checkPicking(data) {
  return request({
    url: 'pickup/checkPicking',
    method: 'post',
    data
  })
}
export function selectDetailByCode(data) {
  return request({
    url: 'baseData/selectDetailByCode',
    method: 'post',
    data
  })
}
export function addDesAndDetail(data) {
  return request({
    url: 'despatch/addDesAndDetail',
    method: 'post',
    data
  })
}
export function checkDespatch(data) {
  return request({
    url: 'despatch/checkDespatch',
    method: 'post',
    data
  })
}
export function checkDespatchReject(data) {
  return request({
    url: 'despatch/checkDespatchReject',
    method: 'post',
    data
  })
}
export function screenDespatch(data) {
  return request({
    url: 'outbound/screenDespatch',
    method: 'post',
    data
  })
}
export function screenDespatchSum(data) {
  return request({
    url: 'outbound/screenDespatchSum',
    method: 'post',
    data
  })
}
export function screenDespatchDetail(data) {
  return request({
    url: 'outbound/screenDespatchDetail',
    method: 'post',
    data
  })
}
export function screenDespatchDetailSum(data) {
  return request({
    url: 'outbound/screenDespatchDetailSum',
    method: 'post',
    data
  })
}
// export function deleteDespatchWave(data) {
//   return request({
//     url: 'outbound/deleteDespatchWave',
//     method: 'post',
//     data
//   })
// }
export function findDesByTob(data) {
  return request({
    url: 'outboundDeliverNotify/findDesByTob',
    method: 'post',
    data
  })
}
export function findDesByToc(data) {
  return request({
    url: 'outboundDeliverNotify/findDesByToc',
    method: 'post',
    data
  })
}
export function tobDelDetail(data) {
  return request({
    url: 'outboundDeliverNotify/tobDelDetail',
    method: 'post',
    data
  })
}
export function tobDelTotal(data) {
  return request({
    url: 'outboundDeliverNotify/tobDelTotal',
    method: 'post',
    data
  })
}
export function tobUpd(data) {
  return request({
    url: 'outboundDeliverNotify/tobUpd',
    method: 'post',
    data
  })
}
export function toBAddDetail(data) {
  return request({
    url: 'outboundDeliverNotify/toBAddDetail',
    method: 'post',
    data
  })
}
export function tocDelDetail(data) {
  return request({
    url: 'outboundDeliverNotify/tocDelDetail',
    method: 'post',
    data
  })
}
export function tocDelTotal(data) {
  return request({
    url: 'outboundDeliverNotify/tocDelTotal',
    method: 'post',
    data
  })
}
export function tocUpd(data) {
  return request({
    url: 'outboundDeliverNotify/tocUpd',
    method: 'post',
    data
  })
}
export function toCAddDetail(data) {
  return request({
    url: 'outboundDeliverNotify/toCAddDetail',
    method: 'post',
    data
  })
}
export function tobSplit(data) {
  return request({
    url: 'outboundDeliverNotify/tobSplit',
    method: 'post',
    data
  })
}
export function tobGenerate(data) {
  return request({
    url: 'outboundDeliverNotify/tobGenerate',
    method: 'post',
    data
  })
}
export function tobAdd(data) {
  return request({
    url: 'outboundDeliverNotify/tobAdd',
    method: 'post',
    data
  })
}
export function tocAdd(data) {
  return request({
    url: 'outboundDeliverNotify/tocAdd',
    method: 'post',
    data
  })
}
export function tobScreenHead(data) {
  return request({
    url: 'outboundDeliverNotify/tobScreenHead',
    method: 'post',
    data
  })
}
export function tobScreenHeadNum(data) {
  return request({
    url: 'outboundDeliverNotify/tobScreenHeadNum',
    method: 'post',
    data
  })
}
export function tobScreenDetail(data) {
  return request({
    url: 'outboundDeliverNotify/tobScreenDetail',
    method: 'post',
    data
  })
}
export function tobScreenDetailNum(data) {
  return request({
    url: 'outboundDeliverNotify/tobScreenDetailNum',
    method: 'post',
    data
  })
}
export function toCGenerateDes(data) {
  return request({
    url: 'outboundDeliverNotify/toCGenerateDes',
    method: 'post',
    data
  })
}
export function tocScreenHead(data) {
  return request({
    url: 'outboundDeliverNotify/tocScreenHead',
    method: 'post',
    data
  })
}
export function tocScreenHeadNum(data) {
  return request({
    url: 'outboundDeliverNotify/tocScreenHeadNum',
    method: 'post',
    data
  })
}
export function tocScreenDetail(data) {
  return request({
    url: 'outboundDeliverNotify/tocScreenDetail',
    method: 'post',
    data
  })
}
export function tocScreenDetailNum(data) {
  return request({
    url: 'outboundDeliverNotify/tocScreenDetailNum',
    method: 'post',
    data
  })
}
export function addDeliverNotifyAndDetail(data) {
  return request({
    url: 'outbound/addDeliverNotifyAndDetail',
    method: 'post',
    data
  })
}
export function submitDespatchAndDetail(data) {
  return request({
    url: 'outbound/submitDespatchAndDetail',
    method: 'post',
    data
  })
}
export function ScreenPrePlatform(data) {
  return request({
    url: 'outbound/ScreenPrePlatform',
    method: 'post',
    data
  })
}
export function ScreenPrePlatformSum(data) {
  return request({
    url: 'outbound/ScreenPrePlatformSum',
    method: 'post',
    data
  })
}
export function deletePrePlatform(data) {
  return request({
    url: 'outbound/deletePrePlatform',
    method: 'post',
    data
  })
}
export function screenExPicking(data) {
  return request({
    url: 'expicking/screenTable',
    method: 'post',
    data
  })
}
export function screenExPickingSum(data) {
  return request({
    url: 'expicking/screenTableNum',
    method: 'post',
    data
  })
}
export function screenExPickingDetail(data) {
  return request({
    url: 'expicking/screenDetail',
    method: 'post',
    data
  })
}
export function screenExPickingDetailSum(data) {
  return request({
    url: 'expicking/screenDetailNum',
    method: 'post',
    data
  })
}
export function screenLoading(data) {
  return request({
    url: 'loading/screenTable',
    method: 'post',
    data
  })
}
export function screenLoadingNum(data) {
  return request({
    url: 'loading/screenTableNum',
    method: 'post',
    data
  })
}
export function screenLoadingDetail(data) {
  return request({
    url: 'outbound/screenLoadingDetail',
    method: 'post',
    data
  })
}
export function screenLoadingDetailSum(data) {
  return request({
    url: 'outbound/screenLoadingDetailSum',
    method: 'post',
    data
  })
}
export function screenDistribution(data) {
  return request({
    url: 'outbound/screenDistribution',
    method: 'post',
    data
  })
}
export function screenDistributionSum(data) {
  return request({
    url: 'outbound/screenDistributionSum',
    method: 'post',
    data
  })
}
export function screenDistributionDetail(data) {
  return request({
    url: 'outbound/screenDistributionDetail',
    method: 'post',
    data
  })
}
export function screenDistributionDetailSum(data) {
  return request({
    url: 'outbound/screenDistributionDetailSum',
    method: 'post',
    data
  })
}
export function screenTablePickup(data) {
  return request({
    url: 'pickup/screenTable',
    method: 'post',
    data
  })
}
export function screenTablePickupNum(data) {
  return request({
    url: 'pickup/screenTableNum',
    method: 'post',
    data
  })
}
export function screenDetailPickup(data) {
  return request({
    url: 'outbound/screenPickingTaskDetail',
    method: 'post',
    data
  })
}
export function screenDetailPickupNum(data) {
  return request({
    url: 'outbound/screenPickingTaskDetailSum',
    method: 'post',
    data
  })
}
export function generatePickTaskDiy(data) {
  return request({
    url: 'pickup/generatePickTaskDiy',
    method: 'post',
    data
  })
}
export function screenTableExpicking(data) {
  return request({
    url: 'expicking/screenTable',
    method: 'post',
    data
  })
}
export function screenTableExpickingNum(data) {
  return request({
    url: 'expicking/screenTableNum',
    method: 'post',
    data
  })
}
export function screenPickingTask(data) {
  return request({
    url: '/pickup/screenTableNum',
    method: 'post',
    data
  })
}
export function screenPickingTaskSum(data) {
  return request({
    url: 'outbound/screenPickingTaskSum',
    method: 'post',
    data
  })
}
export function deletePickingTask(data) {
  return request({
    url: 'outbound/deletePickingTask',
    method: 'post',
    data
  })
}
export function screenExpress(data) {
  return request({
    url: 'expresss/screenTable',
    method: 'post',
    data
  })
}
export function screenExpressNum(data) {
  return request({
    url: 'expresss/screenTableNum',
    method: 'post',
    data
  })
}
export function screenExpressDeliveryDetail(data) {
  return request({
    url: 'outbound/screenExpressDeliveryDetail',
    method: 'post',
    data
  })
}
export function screenExpressDeliveryDetailSum(data) {
  return request({
    url: 'outbound/screenExpressDeliveryDetailSum',
    method: 'post',
    data
  })
}
export function addExpressDeliveryAndDetail(data) {
  return request({
    url: 'outbound/addExpressDeliveryAndDetail',
    method: 'post',
    data
  })
}
export function exportExpressDeliveryAndDetailExcel(data) {
  return request({
    url: 'outbound/exportExpressDeliveryAndDetailExcel',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function exportExpressDeliveryAndDetailExcelSelect(data) {
  return request({
    url: 'outbound/exportExpressDeliveryAndDetailExcelSelect',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function exportLoadingAndDetailExcel(data) {
  return request({
    url: 'outbound/exportLoadingAndDetailExcel',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function exportDistributionAndDetailExcel(data) {
  return request({
    url: 'outbound/exportDistributionAndDetailExcel',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function exportStockInventoryAndDetailExcel(data) {
  return request({
    url: 'Inwarehouse/exportStockInventoryAndDetailExcel',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function exportStockChangeAndDetailExcel(data) {
  return request({
    url: 'stockChange/exportStockChangeAndDetailExcel',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function preAssignDespatch(data) {
  return request({
    url: 'outbound/preAssignDespatch',
    method: 'post',
    data
  })
}
export function deleteWaveRuleAndTimer(data) {
  return request({
    url: 'outbound/deleteWaveRuleAndTimer',
    method: 'post',
    data
  })
}
export function runAllWaveRule(data) {
  return request({
    url: 'outbound/runAllWaveRule',
    method: 'post',
    data
  })
}
export function stopAllWaveRule(data) {
  return request({
    url: 'outbound/stopAllWaveRule',
    method: 'post',
    data
  })
}
export function stopWaveRule(data) {
  return request({
    url: 'outbound/stopWaveRule',
    method: 'post',
    data
  })
}
export function runWaveRule(data) {
  return request({
    url: 'outbound/runWaveRule',
    method: 'post',
    data
  })
}
export function screenWaveRule(data) {
  return request({
    url: 'outbound/screenWaveRule',
    method: 'post',
    data
  })
}
export function screenWaveRuleSum(data) {
  return request({
    url: 'outbound/screenWaveRuleSum',
    method: 'post',
    data
  })
}
export function screenWaveRuleTimer(data) {
  return request({
    url: 'outbound/screenWaveRuleTimer',
    method: 'post',
    data
  })
}
export function screenWaveRuleTimerSum(data) {
  return request({
    url: 'outbound/screenWaveRuleTimerSum',
    method: 'post',
    data
  })
}
export function updateWave(data) {
  return request({
    url: 'outbound/updateWave',
    method: 'post',
    data
  })
}
export function addWaveRuleAndTimers(data) {
  return request({
    url: 'outbound/addWaveRuleAndTimers',
    method: 'post',
    data
  })
}
export function updateWaveRuleAndTimer(data) {
  return request({
    url: 'outbound/updateWaveRuleAndTimer',
    method: 'post',
    data
  })
}
export function generateWaveManual(data) {
  return request({
    url: 'outbound/generateWaveManual',
    method: 'post',
    data
  })
}
export function exportLoadingAndDetailExcelSelect(data) {
  return request({
    url: 'outbound/exportLoadingAndDetailExcelSelect',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
export function exportDespatchAndDetailExcel(data) {
  return request({
    url: 'outbound/exportDespatchAndDetailExcel',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function exportDespatchAndDetailExcelSelect(data) {
  return request({
    url: 'outbound/exportDespatchAndDetailExcelSelect',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function exportStockFreezeAndDetailExcel(data) {
  return request({
    url: 'stockFreeze/exportStockFreezeAndDetailExcel',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function exportInventoryMoveAndDetailExcel(data) {
  return request({
    url: 'inventoryMove/exportInventoryMoveAndDetailExcel',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function submitStockInventoryAndDetail(data) {
  return request({
    url: 'Inwarehouse/submitStockInventoryAndDetail',
    method: 'post',
    data
  })
}

export function cancelPurchaseOrder(data) {
  return request({
    url: 'purchaseOrder/cancelPurchaseOrder',
    method: 'post',
    data
  })
}

export function cancelQualityCheck(data) {
  return request({
    url: 'qualityCheck/cancelQualityCheck',
    method: 'post',
    data
  })
}

export function saveQualityCheck(data) {
  return request({
    url: 'qualityCheck/saveQualityCheck',
    method: 'post',
    data
  })
}
export function updQualityTable(data) {
  return request({
    url: 'qualityCheck/updTable',
    method: 'post',
    data
  })
}
export function delQualityDetail(data) {
  return request({
    url: 'qualityCheck/delDetail',
    method: 'post',
    data
  })
}
export function cancelInPackage(data) {
  return request({
    url: 'inPackage/cancelInPackage',
    method: 'post',
    data
  })
}
export function delPackDetail(data) {
  return request({
    url: 'inPackage/delDetail',
    method: 'post',
    data
  })
}
export function saveInPackage(data) {
  return request({
    url: 'inPackage/saveInPackage',
    method: 'post',
    data
  })
}
export function updPackTable(data) {
  return request({
    url: 'inPackage/updTable',
    method: 'post',
    data
  })
}
export function cancelCombine(data) {
  return request({
    url: 'stack/cancelCombine',
    method: 'post',
    data
  })
}
export function saveCombineStack(data) {
  return request({
    url: 'stack/saveCombineStack',
    method: 'post',
    data
  })
}
export function updStackTable(data) {
  return request({
    url: 'stack/updTable',
    method: 'post',
    data
  })
}
export function delDiskDetail(data) {
  return request({
    url: 'stack/delDetail',
    method: 'post',
    data
  })
}
export function searchInventoryBalanceSelective(data) {
  return request({
    url: 'inventoryBalance/searchInventoryBalanceSelective',
    method: 'post',
    data
  })
}
export function searchInventoryBalanceNum(data) {
  return request({
    url: 'inventoryBalance/searchInventoryBalanceNum',
    method: 'post',
    data
  })
}
export function deleteInventoryBalance(data) {
  return request({
    url: 'inventoryBalance/deleteInventoryBalance',
    method: 'post',
    data
  })
}
export function deleteInventoryTotal(data) {
  return request({
    url: 'Inwarehouse/deleteInventoryTotal',
    method: 'post',
    data
  })
}
export function updateInventoryBalance(data) {
  return request({
    url: 'inventoryBalance/updateInventoryBalance',
    method: 'post',
    data
  })
}
export function submitInventoryTotal(data) {
  return request({
    url: 'Inwarehouse/submitInventoryTotal',
    method: 'post',
    data
  })
}
export function selectCompany(data) {
  return request({
    url: 'company/selectCompany',
    method: 'post',
    data
  })
}
export function updCompany(data) {
  return request({
    url: 'company/upd',
    method: 'post',
    data
  })
}
export function selectCompanyNum(data) {
  return request({
    url: 'company/selectCompanyNum',
    method: 'post',
    data
  })
}
export function submitInventoryBalance(data) {
  return request({
    url: 'Inwarehouse/submitInventoryBalance',
    method: 'post',
    data
  })
}
export function standardInventoryByRange(data) {
  return request({
    url: 'Inwarehouse/standardInventoryByRange',
    method: 'post',
    data
  })
}
export function dynamicInventoryByRange(data) {
  return request({
    url: 'Inwarehouse/dynamicInventoryByRange',
    method: 'post',
    data
  })
}
export function randomInventoryByRange(data) {
  return request({
    url: 'Inwarehouse/randomInventoryByRange',
    method: 'post',
    data
  })
}
export function selectFunction(data) {
  return request({
    url: 'function/selectFunction',
    method: 'post',
    data
  })
}
export function selectFunctionNum(data) {
  return request({
    url: 'function/selectFunctionNum',
    method: 'post',
    data
  })
}
export function updateCustom(data) {
  return request({
    url: 'baseData/updateCustom',
    method: 'post',
    data
  })
}
export function upgradeGoodsAndSku(data) {
  return request({
    url: 'baseData/upgradeGoodsAndSku',
    method: 'post',
    data
  })
}
export function addArea(data) {
  return request({
    url: 'warehouseArea/addArea',
    method: 'post',
    data
  })
}
export function updArea(data) {
  return request({
    url: 'warehouseArea/upd',
    method: 'post',
    data
  })
}
export function addLocation(data) {
  return request({
    url: 'warehouseLocation/addLocation',
    method: 'post',
    data
  })
}
export function importLocation(data) {
  return request({
    url: 'warehouseLocation/importLocation',
    method: 'post',
    data
  })
}
export function updLocationl(data) {
  return request({
    url: 'warehouseLocation/upd',
    method: 'post',
    data
  })
}
export function updLocation(data) {
  return request({
    url: 'warehousedata/upd',
    method: 'post',
    data
  })
}
export function addLocationGroup(data) {
  return request({
    url: 'warehousedata/addLocationGroup',
    method: 'post',
    data
  })
}
export function addDevice(data) {
  return request({
    url: 'device/addDevice',
    method: 'post',
    data
  })
}
export function updDevice(data) {
  return request({
    url: 'device/upd',
    method: 'post',
    data
  })
}
export function addCar(data) {
  return request({
    url: 'car/addCar',
    method: 'post',
    data
  })
}
export function screenTable(data) {
  return request({
    url: 'shelf/screenTable',
    method: 'post',
    data
  })
}
export function screenTableNum(data) {
  return request({
    url: 'shelf/screenTableNum',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: 'shelf/add',
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: 'shelf/del',
    method: 'post',
    data
  })
}
export function updshelf(data) {
  return request({
    url: 'shelf/upd',
    method: 'post',
    data
  })
}
export function updCar(data) {
  return request({
    url: 'car/upd',
    method: 'post',
    data
  })
}
export function delCompany(data) {
  return request({
    url: 'company/delCompany',
    method: 'post',
    data
  })
}
export function addInboundPlan(data) {
  return request({
    url: 'inboundPlan/addInboundPlan',
    method: 'post',
    data
  })
}
export function screenExcelOutIPL(data) {
  return request({
    url: 'inboundPlan/screenExcelOutIPL',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function selectExcelOutIPL(data) {
  return request({
    url: 'inboundPlan/selectExcelOutIPL',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function cancelInboundPlan(data) {
  return request({
    url: 'inboundPlan/cancelInboundPlan',
    method: 'post',
    data
  })
}
export function deletescanUpdate(data) {
  return request({
    url: 'devLog/del',
    method: 'post',
    data
  })
}
export function screenscanUpdate(data) {
  return request({
    url: 'devLog/screenTable',
    method: 'post',
    data
  })
}
export function screenscanUpdateNum(data) {
  return request({
    url: 'devLog/screenTableNum',
    method: 'post',
    data
  })
}
export function addscanUpdate(data) {
  return request({
    url: 'devLog/add',
    method: 'post',
    data
  })
}

// export function deleteContainer(data) {
//   return request({
//     url: 'baseData/deleteContainer',
//     method: 'post',
//     data
//   })
// }
export function screenExcelOutCHE(data) {
  return request({
    url: 'qualityCheck/screenExcelOutCHE',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function selectExcelOutCHE(data) {
  return request({
    url: 'qualityCheck/selectExcelOutCHE',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function generateDeliverGoodsAndDetail(data) {
  return request({
    url: 'outbound/generateDeliverGoodsAndDetail',
    method: 'post',
    data
  })
}
export function screenDespatchWave(data) {
  return request({
    url: 'outbound/screenDespatchWave',
    method: 'post',
    data
  })
}
export function screenDespatchWaveSum(data) {
  return request({
    url: 'outbound/screenDespatchWaveSum',
    method: 'post',
    data
  })
}
export function screenDeliverGoods(data) {
  return request({
    url: 'outbound/screenDeliverGoods',
    method: 'post',
    data
  })
}
export function screenDeliverGoodsSum(data) {
  return request({
    url: 'outbound/screenDeliverGoodsSum',
    method: 'post',
    data
  })
}
export function screenDeliverGoodsDetail(data) {
  return request({
    url: 'outbound/screenDeliverGoodsDetail',
    method: 'post',
    data
  })
}
export function screenDeliverGoodsDetailSum(data) {
  return request({
    url: 'outbound/screenDeliverGoodsDetailSum',
    method: 'post',
    data
  })
}
export function deleteDespatchWave(data) {
  return request({
    url: 'outbound/deleteDespatchWave',
    method: 'post',
    data
  })
}
export function addDespatchWave(data) {
  return request({
    url: 'outbound/addDespatchWave',
    method: 'post',
    data
  })
}
export function screenWave(data) {
  return request({
    url: 'outbound/screenWave',
    method: 'post',
    data
  })
}
export function screenWaveSum(data) {
  return request({
    url: 'outbound/screenWaveSum',
    method: 'post',
    data
  })
}
export function deleteWave(data) {
  return request({
    url: 'outbound/deleteWave',
    method: 'post',
    data
  })
}
export function generateExPickingAndDetail(data) {
  return request({
    url: 'outbound/generateExPickingAndDetail',
    method: 'post',
    data
  })
}
export function selectOpFreezeAndDetail(data) {
  return request({
    url: 'stockFreeze/selectOpFreezeAndDetail',
    method: 'post',
    data
  })
}
export function selectOpInventoryMoveAndDetail(data) {
  return request({
    url: 'Inwarehouse/selectOpInventoryMoveAndDetail',
    method: 'post',
    data
  })
}
export function selectOpStockChangeAndDetail(data) {
  return request({
    url: 'Inwarehouse/selectOpStockChangeAndDetail',
    method: 'post',
    data
  })
}
export function addPurchaseOrder(data) {
  return request({
    url: 'purchaseOrder/addPurchaseOrder',
    method: 'post',
    data
  })
}
export function delDetail(data) {
  return request({
    url: 'purchaseOrder/delDetail',
    method: 'post',
    data
  })
}
export function generatePURToIPL(data) {
  return request({
    url: 'purchaseOrder/generatePURToIPL',
    method: 'post',
    data
  })
}
export function addInboundBatch(data) {
  return request({
    url: 'inboundPlan/addInboundBatch',
    method: 'post',
    data
  })
}
export function delPlanDetail(data) {
  return request({
    url: 'inboundPlan/delDetail',
    method: 'post',
    data
  })
}
export function getInboundPlan(data) {
  return request({
    url: 'inboundPlan/getInboundPlan',
    method: 'post',
    data
  })
}
export function generateIPLToCHE(data) {
  return request({
    url: 'inboundPlan/generateIPLToCHE',
    method: 'post',
    data
  })
}
export function screenOnshelf(data) {
  return request({
    url: 'inboundPlan/screenOnshelf',
    method: 'post',
    data
  })
}
export function screenOnshelfNum(data) {
  return request({
    url: 'inboundPlan/screenOnshelfNum',
    method: 'post',
    data
  })
}
export function saveInboundPlan(data) {
  return request({
    url: 'inboundPlan/saveInboundPlan',
    method: 'post',
    data
  })
}
export function updPlanTable(data) {
  return request({
    url: 'inboundPlan/updTable',
    method: 'post',
    data
  })
}
export function addQualityCheck(data) {
  return request({
    url: 'qualityCheck/addQualityCheck',
    method: 'post',
    data
  })
}
export function addInPackage(data) {
  return request({
    url: 'inPackage/addInPackage',
    method: 'post',
    data
  })
}
export function addOnshelf(data) {
  return request({
    url: 'onshelf/addOnshelf',
    method: 'post',
    data
  })
}
export function saveOnshelf(data) {
  return request({
    url: 'onshelf/saveOnshelf',
    method: 'post',
    data
  })
}
export function updProTable(data) {
  return request({
    url: 'onshelf/updTable',
    method: 'post',
    data
  })
}
export function delProDetail(data) {
  return request({
    url: 'onshelf/delDetail',
    method: 'post',
    data
  })
}
export function screenExcelOutPUR(data) {
  return request({
    url: 'purchaseOrder/screenExcelOutPUR',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function selectExcelOutPUR(data) {
  return request({
    url: 'purchaseOrder/selectExcelOutPUR',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function screenExcelOutIPA(data) {
  return request({
    url: 'inPackage/screenExcelOutIPA',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function selectExcelOutIPA(data) {
  return request({
    url: 'inPackage/selectExcelOutIPA',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function screenExcelOutONP(data) {
  return request({
    url: 'onshelf/screenExcelOutONP',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function selectExcelOutONP(data) {
  return request({
    url: 'onshelf/selectExcelOutONP',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
export function generateIPLToIPA(data) {
  return request({
    url: 'inboundPlan/generateIPLToIPA',
    method: 'post',
    data
  })
}
export function generateIPLToCOB(data) {
  return request({
    url: 'inboundPlan/generateIPLToCOB',
    method: 'post',
    data
  })
}
// export function generateIPAToCOB(data) {
//   return request({
//     url: 'inbound/generateIPAToCOB',
//     method: 'post',
//     data
//   })
// }
export function addCombineStack(data) {
  return request({
    url: 'stack/addCombineStack',
    method: 'post',
    data
  })
}
export function selectCombineStackPackageDetail(data) {
  return request({
    url: 'stack/selectCombineStackPackageDetail',
    method: 'post',
    data
  })
}
export function selectCombineStackPackageDetailNum(data) {
  return request({
    url: 'stack/selectCombineStackPackageDetailNum',
    method: 'post',
    data
  })
}
export function receiveTable(data) {
  return request({
    url: 'inboundPlan/receiveTable',
    method: 'post',
    data
  })
}
export function workGroupInfo(data) {
  return request({
    url: 'login/workGroupInfo',
    method: 'post',
    data
  })
}
export function addWorkGroup(data) {
  return request({
    url: 'workGroup/addWorkGroup',
    method: 'post',
    data
  })
}
export function addStaffToWorkGroup(data) {
  return request({
    url: 'workGroup/addStaffToWorkGroup',
    method: 'post',
    data
  })
}
export function addWarehouseToWorkGroup(data) {
  return request({
    url: 'workGroup/addWarehouseToWorkGroup',
    method: 'post',
    data
  })
}
export function addFunctionToWorkGroup(data) {
  return request({
    url: 'workGroup/addFunctionToWorkGroup',
    method: 'post',
    data
  })
}
export function updWorkGroup(data) {
  return request({
    url: 'workGroup/upd',
    method: 'post',
    data
  })
}
export function addStaff(data) {
  return request({
    url: 'staff/addStaff',
    method: 'post',
    data
  })
}
export function searchWorkgroup(data) {
  return request({
    url: 'authority/searchWorkgroup',
    method: 'post',
    data
  })
}
export function addFunction(data) {
  return request({
    url: 'function/addFunction',
    method: 'post',
    data
  })
}
export function updFunction(data) {
  return request({
    url: 'function/upd',
    method: 'post',
    data
  })
}
export function delFunction(data) {
  return request({
    url: 'function/delFunction',
    method: 'post',
    data
  })
}
export function delStaff(data) {
  return request({
    url: 'staff/delStaff',
    method: 'post',
    data
  })
}
export function addCompany(data) {
  return request({
    url: 'company/addCompany',
    method: 'post',
    data
  })
}
export function selectDepartment(data) {
  return request({
    url: 'company/selectDepartment',
    method: 'post',
    data
  })
}
export function selectDepartmentNum(data) {
  return request({
    url: 'company/selectDepartmentNum',
    method: 'post',
    data
  })
}
export function addDepartment(data) {
  return request({
    url: 'company/addDepartment',
    method: 'post',
    data
  })
}
export function delDepartment(data) {
  return request({
    url: 'company/delDepartment',
    method: 'post',
    data
  })
}
export function updDepartment(data) {
  return request({
    url: 'company/updDetail',
    method: 'post',
    data
  })
}
export function searchAllDespatchByWaveId(data) {
  return request({
    url: 'outbound/searchAllDespatchByWaveId',
    method: 'post',
    data
  })
}
export function searchAllDespatchByWaveIdSum(data) {
  return request({
    url: 'outbound/searchAllDespatchByWaveIdSum',
    method: 'post',
    data
  })
}
export function searchWorkGroupWarehouse(data) {
  return request({
    url: 'workGroup/searchWorkGroupWarehouse',
    method: 'post',
    data
  })
}
export function selectOnshelfStrategy(data) {
  return request({
    url: 'onshelf/selectOnshelfStrategy',
    method: 'post',
    data
  })
}
export function selectOnshelfStrategyNum(data) {
  return request({
    url: 'onshelf/selectOnshelfStrategyNum',
    method: 'post',
    data
  })
}
export function selectOnshelfStrategyDetailNum(data) {
  return request({
    url: 'onshelf/selectOnshelfStrategyDetailNum',
    method: 'post',
    data
  })
}
export function selectOnshelfStrategyDetail(data) {
  return request({
    url: 'onshelf/selectOnshelfStrategyDetail',
    method: 'post',
    data
  })
}
export function ONPtoONF(data) {
  return request({
    url: 'onshelf/ONPtoONF',
    method: 'post',
    data
  })
}
export function generateIPLToONP(data) {
  return request({
    url: 'inboundPlan/generateIPLToONP',
    method: 'post',
    data
  })
}
export function addOnshelfStrategy(data) {
  return request({
    url: 'onshelf/addOnshelfStrategy',
    method: 'post',
    data
  })
}
export function auditInventory(data) {
  return request({
    url: 'onshelf/audit',
    method: 'post',
    data
  })
}
export function selectOnshelf(data) {
  return request({
    url: 'onshelf/selectOnshelf',
    method: 'post',
    data
  })
}
export function selectOnshelfNum(data) {
  return request({
    url: 'onshelf/selectOnshelfNum',
    method: 'post',
    data
  })
}
export function selectOnshelfDetail(data) {
  return request({
    url: 'onshelf/selectOnshelfDetail',
    method: 'post',
    data
  })
}
export function selectOnshelfDetailNum(data) {
  return request({
    url: 'onshelf/selectOnshelfDetailNum',
    method: 'post',
    data
  })
}
export function deleteDesInwave(data) {
  return request({
    url: 'outbound/deleteDesInwave',
    method: 'post',
    data
  })
}
export function PreDistributionDespatchAndDetail(data) {
  return request({
    url: 'outbound/PreDistributionDespatchAndDetail',
    method: 'post',
    data
  })
}
export function preDistributionList(data) {
  return request({
    url: 'pickup/preDistributionList',
    method: 'post',
    data
  })
}
export function rePreDistribution(data) {
  return request({
    url: 'outbound/rePreDistribution',
    method: 'post',
    data
  })
}
export function screenPreDistributionRecordsNum(data) {
  return request({
    url: 'outbound/screenPreDistributionRecordsNum',
    method: 'post',
    data
  })
}
export function screenPreDistributionRecords(data) {
  return request({
    url: 'outbound/screenPreDistributionRecords',
    method: 'post',
    data
  })
}
export function oneDespatchWaveManual(data) {
  return request({
    url: 'outbound/oneDespatchWaveManual',
    method: 'post',
    data
  })
}
export function screenPickingTaskDetail(data) {
  return request({
    url: 'outbound/screenPickingTaskDetail',
    method: 'post',
    data
  })
}
export function screenPickingTaskDetailSum(data) {
  return request({
    url: 'outbound/screenPickingTaskDetailSum',
    method: 'post',
    data
  })
}
export function getMessageByDespatchs(data) {
  return request({
    url: 'outbound/getMessageByDespatchs',
    method: 'post',
    data
  })
}
export function generateByDespatchs(data) {
  return request({
    url: 'outbound/generateByDespatchs',
    method: 'post',
    data
  })
}
export function generateLoadAndDetail(data) {
  return request({
    url: 'outbound/generateLoadAndDetail',
    method: 'post',
    data
  })
}
export function searchInventoryTotalSelective(data) {
  return request({
    url: 'inventoryTotal/searchInventoryTotalSelective',
    method: 'post',
    data
  })
}
export function searchInventoryTotalNum(data) {
  return request({
    url: 'inventoryTotal/searchInventoryTotalNum',
    method: 'post',
    data
  })
}
export function searchDespatchByDis(data) {
  return request({
    url: 'outbound/searchDespatchByDis',
    method: 'post',
    data
  })
}
export function savePurchaseOrder(data) {
  return request({
    url: 'purchaseOrder/savePurchaseOrder',
    method: 'post',
    data
  })
}
export function updTable(data) {
  return request({
    url: 'purchaseOrder/updTable',
    method: 'post',
    data
  })
}

