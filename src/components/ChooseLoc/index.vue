<template>
  <div>
    <div class="selectContain">
      <el-select v-model="warehouseId" placeholder="请选择仓库" @focus="getWarehouseList" @change="changeWarehouse">
        <el-option
          v-for="item in warehouseOptions"
          :key="item.id"
          :label="item.warehouseName"
          :value="item.id"
        />
      </el-select>
      <el-select v-if="areaShow" v-model="areaName" placeholder="请选择库区" @focus="getAreaList" @change="changeArea">
        <el-option
          v-for="item in areaOptions"
          :key="item.id"
          :label="item.areaName"
          :value="item.areaName"
        />
      </el-select>
      <el-select v-if="tableShow" v-model="tableName" placeholder="请选择库区" @focus="getTableList" @change="changeTable">
        <el-option
          v-for="item in tableOptions"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <span class="fast-tip">
        <i class="el-icon-question" />
        请在左侧表格中选择您想盘点的库位！将表格更改为未选中状态即可取消选择！
      </span>
    </div>
    <el-row v-if="locShow">
      <el-col :span="12">
        <div class="tableContain1">
          <el-table
            ref="multipleTable"
            border
            size="mini"
            :data="locData"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column v-if="false" label="id" prop="id" />
            <el-table-column type="index" label="序号" />
            <el-table-column
              prop="locationName"
              label="库位名称"
            />
            <el-table-column
              prop="locationCode"
              label="库位代码"
            />
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="tableContain2">
          <el-table
            ref="multipleTable"
            border
            size="mini"
            :data="chooseData"
            tooltip-effect="dark"
          >
            <el-table-column v-if="false" label="id" prop="id" />
            <el-table-column type="index" label="序号" />
            <el-table-column
              prop="locationName"
              label="库位名称"
            />
            <el-table-column
              prop="locationCode"
              label="库位代码"
            />
          </el-table>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import { selectWarehouse, selectArea, screenTable, selectLocation } from '@/api/user'
export default {
  props: {
    chooseData: {
      type: Array,
      default() {
        return []
      }
    }
  },

  data() {
    return {
      warehouseOptions: [],
      warehouseId: null,
      areaOptions: [],
      tableOptions: [],
      locShow: false,
      locData: [],
      areaName: null,
      tableName: null,
      areaShow: false,
      tableShow: false
    }
  },
  methods: {
    // 获取仓库数据
    async getWarehouseList() {
      const res = await selectWarehouse({ pojo: {}})
      this.warehouseOptions = res.data.map(item => {
        return { id: item.id, warehouseName: item.warehouseName }
      })
    },
    // 父组件操作子组件数据
    handleSelectionChange(val) {
      this.$emit('clickSelect', val)
    },
    // 仓库数据选中更改后
    changeWarehouse() {
      this.areaShow = true
      this.areaName = null
      this.tableName = null
      this.locData = []
    },
    // 库区数据选中更改后
    changeArea() {
      this.tableShow = true
      this.tableName = null
      this.locData = []
    },
    // 货架数据选中更改后
    changeTable() {
      this.locShow = true
      this.getLocList()
    },
    // 获取库位
    async getLocList() {
      const res = await selectLocation({ pojo: { containerCode: this.tableName }})
      this.locData = res.data.map(item => {
        return { id: item.id, locationName: item.locationName, locationCode: item.locationCode }
      })
    },
    // 获取库区
    async getAreaList() {
      const res = await selectArea({ pojo: { warehouseId: this.warehouseId }})
      this.areaOptions = res.data.map(item => {
        return { id: item.id, areaName: item.areaName }
      })
    },
    // 获取货架
    async getTableList() {
      const res = await screenTable({ pojo: { areaName: this.areaName }, workGroupId: sessionStorage.workGroupId })
      this.tableOptions = res.data.map(item => {
        return { id: item.id, name: item.name }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .tableContain1{
height: 500px;
overflow:auto ;
    }
    .tableContain2{
height: 500px;
overflow:auto ;
    }

</style>
