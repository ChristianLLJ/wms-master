<template>
  <div>
    <el-table
      border
      :data="tableData"
      height="634px"
      size="mini"
      row-key="id"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      :row-class-name="tableRowClassDetailName"
      :header-cell-style="{background:'#262626',color: '#fff'}"
      style="width: 100%, font-size: 10px"
      @cell-click="tabClick"
    >
      <el-table-column v-if="false" label="id" prop="id" />
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column v-if="false" label="id" prop="id" />
      <el-table-column
        label="目标数量(个)"
        :show-overflow-tooltip="true"
        prop="availableCnt"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.index === tabClickIndex && tabClickLabel === '目标数量(个)'">
            <el-input v-model="scope.row.availableCnt" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" @blur="inputBlur" />
          </span>
          <span v-else>{{ scope.row.availableCnt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库" align="center" :show-overflow-tooltip="true" prop="warehouseCode" />
      <el-table-column label="库区" align="center" :show-overflow-tooltip="true" prop="areaCode" />
      <el-table-column
        width="300px"
        label="库位"
        :show-overflow-tooltip="true"
        prop="locationCode"
      />
      <el-table-column label="商品" align="center" :show-overflow-tooltip="true" prop="commodityCode" />
      <el-table-column label="商品sku" width="200px" align="center" :show-overflow-tooltip="true" prop="skuName" />
      <!-- <el-table-column label="商品sku单位" align="center" :show-overflow-tooltip="true" prop="unit" /> -->
      <!-- <el-table-column label="包装代码" align="center" :show-overflow-tooltip="true" prop="packageCode" /> -->
      <!-- <el-table-column label="库存数量(个)" align="center" :show-overflow-tooltip="true" prop="inventoryCnt" />
        <el-table-column label="预配数量(个)" align="center" :show-overflow-tooltip="true" prop="preDistributionCnt" />
        <el-table-column label="分配数量(个)" align="center" :show-overflow-tooltip="true" prop="distributionCnt" />
        <el-table-column label="冻结数量(个)" align="center" :show-overflow-tooltip="true" prop="freezeCnt" /> -->
      <el-table-column label="体积(L)" align="center" :show-overflow-tooltip="true" prop="volume" />
      <el-table-column label="毛重(kg)" align="center" :show-overflow-tooltip="true" prop="weight" />
      <el-table-column label="跟踪号" width="200px" align="center" :show-overflow-tooltip="true" prop="traceCode" />
      <el-table-column label="生产厂家" width="180px" align="center" :show-overflow-tooltip="true" prop="productCompany" />
      <el-table-column label="生产日期" width="180px" align="center" :show-overflow-tooltip="true" prop="productTime">
        <template slot-scope="scope">{{ scope.row.productTime| dateYMDHMSFormat }}</template>
      </el-table-column>
      <el-table-column label="生产批次" width="180px" align="center" :show-overflow-tooltip="true" prop="productBatch" />
    </el-table>
  </div>

</template>

<script>

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
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
        case '目标数量(个)':
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
    }
  }

}
</script>

  <style>

  </style>

