<template>
  <div>
    <el-table
      border
      :data="plantable"
      size="mini"
      row-key="id"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      :row-class-name="tableRowClassDetailName"
      :header-cell-style="{background:'#262626',color: '#fff'}"
      style="width: 100%, font-size: 10px"
      height="600px"
      @selection-change="selectionChangeHandle"
      @cell-click="tabClick"
    >
      <el-table-column
        type="selection"
        show-overflow-tooltip
        reserve-selection
      />
      <el-table-column v-if="false" label="id" prop="id" />
      <el-table-column :label="labelTable" align="center">
        <el-table-column type="index" label="序号" />
        <!-- <el-table-column label="订单号" width="150px" :show-overflow-tooltip="true" prop="purchaseCode" /> -->
        <el-table-column v-if="containershow" label="箱条码" :show-overflow-tooltip="true" width="150px" prop="containerBarcode" />
        <el-table-column v-if="stackshow" label="码盘条码" :show-overflow-tooltip="true" width="150px" prop="stackBarcode" />
        <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="commodityName" />
        <el-table-column label="商品sku" :show-overflow-tooltip="true" prop="skuName" />
        <el-table-column label="商品sku编码" :show-overflow-tooltip="true" prop="skuCode" />
        <!-- <el-table-column label="最小sku单位" :show-overflow-tooltip="true" prop="unit" /> -->
        <el-table-column
          label="箱内数量(个)"
          :show-overflow-tooltip="true"
          prop="num"
        >
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.index === tabClickIndex && tabClickLabel === '数量(个)'">
              <el-input v-model="scope.row.num" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" @blur="inputBlur" />
            </span>
            <span v-else>{{ scope.row.num }}</span>
          </template> -->
        </el-table-column>
        <el-table-column v-if="containershow" label="箱名称" :show-overflow-tooltip="true" prop="containerName" />
        <el-table-column v-if="stackshow" label="码盘名称" :show-overflow-tooltip="true" prop="stackName" />
        <el-table-column label="客户名称" :show-overflow-tooltip="true" prop="customName" />
        <el-table-column label="供应商名称" :show-overflow-tooltip="true" prop="supplierName" />
        <el-table-column label="跟踪号" width="150px" :show-overflow-tooltip="true" prop="inboundTraceCode" />
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
export default {
  props: {
    plantable: {
      type: Array,
      default: () => []
    },
    labelTable: {
      type: String,
      default: ''
    },
    stackshow: {
      type: Boolean,
      default: false
    },
    containershow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tabClickIndex: null, // 点击的单元格
      tabClickLabel: ''
    }
  },
  methods: {
    tableRowClassDetailName({ row, rowIndex }) {
      row.index = rowIndex
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    tabClick(row, column) {
      switch (column.label) {
        case '数量(个)':
          this.tabClickIndex = row.index
          this.tabClickLabel = column.label
          break
        default: return
      }
    },
    // 失去焦点初始化
    inputBlur(row, event, column) {
      this.tabClickIndex = null
      this.tabClickLabel = ''
    },
    selectionChangeHandle(val) {
      this.$emit('clickSelect', val)
    }
  }

}
</script>

<style>

</style>
