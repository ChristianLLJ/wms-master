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
    >
      <el-table-column v-if="false" label="id" prop="id" />
      <el-table-column label="上架任务-表细信息" align="center">
        <el-table-column
          type="selection"
          show-overflow-tooltip
          reserve-selection
        />
        <el-table-column type="index" label="序号" />
        <!-- <el-table-column label="组盘跟踪号" :show-overflow-tooltip="true" prop="traceCode2" />
        <el-table-column label="装箱跟踪号" :show-overflow-tooltip="true" prop="traceCode" />
        <el-table-column label="建议单单号" :show-overflow-tooltip="true" prop="onshelfCode" /> -->
        <el-table-column label="包装条码" :show-overflow-tooltip="true" prop="containerBarcode" />
        <el-table-column label="上架库位" :show-overflow-tooltip="true" prop="factLocationName" />
        <!-- <el-table-column label="上架状态" :show-overflow-tooltip="true" prop="onshelfState" /> -->
        <!-- <el-table-column label="上架时间" :show-overflow-tooltip="true" prop="onshelfTime">
          <template slot-scope="scope">{{ scope.row.onshelfTime| dateYMDHMSFormat }}</template>
        </el-table-column> -->
        <!-- <el-table-column label="上架来源" :show-overflow-tooltip="true" prop="onshelfType" />
        <el-table-column label="上架人" :show-overflow-tooltip="true" prop="personName" /> -->
        <el-table-column label="入库批次" :show-overflow-tooltip="true" prop="inboundBatch" />
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
    selectionChangeHandle(val) {
      this.$emit('clickSelect', val)
    }
  }

}
</script>

  <style>

  </style>

