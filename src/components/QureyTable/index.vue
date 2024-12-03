<template>
  <div>
    <el-table
      ref="tableData"
      :data="tableData"
      height="634px"
      :header-cell-style="{background:'#000',color: '#fff'}"
      border
      :row-class-name="tableRowClassDetailName"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
      @selection-change="selectionChangeHandle"
      @cell-click="tabClick"
    >
      <!-- <el-table-column type="selection" align="center" /> -->
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column v-if="false" label="id" prop="id" />

      <el-table-column
        width="300px"
        label="库位"
        :show-overflow-tooltip="true"
        prop="locationCode"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.index === tabClickIndex && tabClickLabel === '库位'">
            <el-select
              v-model="scope.row.locationCode"
              filterable
              remote
              reserve-keyword
              placeholder="请输入库位名称"
              :remote-method="funcLL"
              @blur="inputBlur"
            >
              <el-option v-for="item in locationOptions" :key="item.id" :label="item.locationName" :value="item.locationName" />
            </el-select>
          </span>
          <span v-else>{{ scope.row.locationCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库" align="center" :show-overflow-tooltip="true" prop="warehouseCode" />
      <el-table-column label="库区" align="center" :show-overflow-tooltip="true" prop="areaCode" />
      <el-table-column label="商品" align="center" :show-overflow-tooltip="true" prop="commodityCode" />
      <el-table-column label="商品sku" width="200px" align="center" :show-overflow-tooltip="true" prop="skuName" />
      <!-- <el-table-column label="商品sku单位" align="center" :show-overflow-tooltip="true" prop="unit" /> -->
      <!-- <el-table-column label="包装代码" align="center" :show-overflow-tooltip="true" prop="packageCode" /> -->
      <!-- <el-table-column label="库存数量(个)" align="center" :show-overflow-tooltip="true" prop="inventoryCnt" />
      <el-table-column label="预配数量(个)" align="center" :show-overflow-tooltip="true" prop="preDistributionCnt" />
      <el-table-column label="分配数量(个)" align="center" :show-overflow-tooltip="true" prop="distributionCnt" />
      <el-table-column label="冻结数量(个)" align="center" :show-overflow-tooltip="true" prop="freezeCnt" /> -->
      <el-table-column
        width="120px"
        label="可用数量(个)"
        :show-overflow-tooltip="true"
        prop="availableCnt"
      />
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
import { selectLocation } from '@/api/user'

export default {
  props: {
    tableData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      tabClickIndex: null, // 点击的单元格
      tabClickLabel: '',
      states: [],
      loclist: [],
      locationOptions: []
    }
  },
  methods: {
    selectionChangeHandle(val) {
      this.$emit('clickSelect', val)
    },
    tableRowClassDetailName({ row, rowIndex }) {
      row.index = rowIndex
    },
    inputBlur(row, event, column) {
      this.tabClickIndex = null
      this.tabClickLabel = ''
    },
    funcLL(query) {
      selectLocation({
        pojo: {
        }
      })
        .then(res => {
          this.states = res.data
          this.loclist = this.states.map(item => {
            return { id: item.id, locationName: item.locationName }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.locationOptions = this.loclist.filter(item => {
              return item.locationName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.locationOptions = []
        }
      }, 100)
    },
    tabClick(row, column) {
      switch (column.label) {
        case '库位':
          this.tabClickIndex = row.index
          this.tabClickLabel = column.label
          break
      }
    }
  }

}
</script>
