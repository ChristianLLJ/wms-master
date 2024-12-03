<template>
  <div>
    <div>
      <el-table
        :data="table"
        border
        size="mini"
        :row-class-name="tableRowClassDetailName"
        :header-cell-style="{background:'#000',color: '#fff'}"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <el-table-column v-if="false" label="id" prop="id" />
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column v-if="false" prop="purchaseId" label="序号" align="center" />
        <el-table-column v-if="false" label="采购订单表头Id" align="center" :show-overflow-tooltip="true" prop="planId" />
        <el-table-column v-if="false" label="备注" align="center" width="200px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.aremark" size="mini" />
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="商品" align="center" :show-overflow-tooltip="true" prop="commodityName" />
        <el-table-column v-if="false" label="商品sku" align="center" :show-overflow-tooltip="true" prop="skuName" />
        <el-table-column v-if="false" label="商品数量(个)" align="center" :show-overflow-tooltip="true" prop="num" />
        <el-table-column v-if="false" label="计划收货库位" align="center" :show-overflow-tooltip="true" prop="predictReceiveLocationCode" />
        <el-table-column v-if="false" label="总重量(kg)" align="center" :show-overflow-tooltip="true" prop="totalWeight" />
        <el-table-column v-if="false" label="总净重(kg)" align="center" :show-overflow-tooltip="true" prop="totalNetWeight" />
        <el-table-column v-if="false" label="总体积(L)" align="center" :show-overflow-tooltip="true" prop="totalVolumn" />
        <el-table-column v-if="false" label="备注" align="center" :show-overflow-tooltip="true" prop="remark" />
        <el-table-column v-if="false" label="包装名称" align="center" :show-overflow-tooltip="true" prop="containerName" />
        <el-table-column label="箱代码" align="center" :show-overflow-tooltip="true" prop="containerCode" />
        <el-table-column label="箱条码" align="center" :show-overflow-tooltip="true" prop="containerBarcode" />
        <el-table-column label="码盘代码" :show-overflow-tooltip="true" prop="stackCode" />
        <!-- <el-table-column label="码盘名称"  :show-overflow-tooltip="true" prop="stackName" /> -->
        <el-table-column label="码盘条码" :show-overflow-tooltip="true" width="150px" prop="stackBarcode" />
        <el-table-column v-if="false" label="单位" align="center" :show-overflow-tooltip="true" prop="unit" />
        <el-table-column label="客户" align="center" :show-overflow-tooltip="true" prop="customName" />
        <el-table-column v-if="false" label="供应商" align="center" :show-overflow-tooltip="true" prop="supplierName" />
        <el-table-column v-if="false" label="收货时间" align="center" :show-overflow-tooltip="true" prop="receiveTime">
          <template slot-scope="scope">{{ scope.row.receiveTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column v-if="false" label="是否质检" align="center" :show-overflow-tooltip="true" prop="isChecked" :formatter="useFormat" />
        <el-table-column v-if="false" label="是否码盘" align="center" :show-overflow-tooltip="true" prop="isPlate" :formatter="useFormat" />
        <el-table-column v-if="false" label="是否装箱" align="center" :show-overflow-tooltip="true" prop="isPackaged" :formatter="useFormat" />
        <el-table-column v-if="false" label="是否收货" align="center" :show-overflow-tooltip="true" prop="isReceived" :formatter="useFormat" />
        <el-table-column v-if="false" label="生产厂家" align="center" :show-overflow-tooltip="true" prop="productCompany" />
        <el-table-column v-if="false" label="生产日期" align="center" :show-overflow-tooltip="true" prop="productTime">
          <template slot-scope="scope">{{ scope.row.receiveTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column v-if="false" label="生产批次" align="center" :show-overflow-tooltip="true" prop="productBatch" />
        <el-table-column v-if="false" label="收货数量" align="center" :show-overflow-tooltip="true" prop="receivedNum" />
        <el-table-column label="采购订单编号" align="center" :show-overflow-tooltip="true" prop="purchaseCode" />
        <el-table-column label="入库计划跟踪号" align="center" :show-overflow-tooltip="true" prop="inboundTraceCode" />
        <el-table-column v-if="false" label="客户代码" align="center" :show-overflow-tooltip="true" prop="customCode" />
        <el-table-column v-if="false" label="供应商代码" align="center" :show-overflow-tooltip="true" prop="supplierCode" />
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProposalUse',
  props: {
    table: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  methods: {
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    useFormat(row) {
      if (row.isUsable === 0) {
        return '否'
      } else if (row.isUsable === 1) {
        return '是'
      }
    }
  }
}
</script>
<style>
.el-table .dd-row{
  background: rgb(97, 165, 186);
}
.el-table .do-row{
  background: #6f6dda;
}
</style>
