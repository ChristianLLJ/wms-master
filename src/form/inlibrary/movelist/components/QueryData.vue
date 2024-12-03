<template>
  <div>
    <el-form :inline="true" :model="rform" size="small" style="padding: 2px">
      <el-form-item label="客户" prop="customName" :label-width="formLabelWidth">
        <el-select
          v-model="rform.customName"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词,如'宝开'"
          clearable
          :remote-method="funClient"
        >
          <el-option v-for="item in clientOptions" :key="item.id" :label="item.customName" :value="item.customName" />
        </el-select>
      </el-form-item>
      <el-form-item label="仓库" :label-width="formLabelWidth">
        <el-select v-model="rform.warehouseName" clearable @focus="func">
          <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
        </el-select>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="库区">
        <el-select v-model="rform.areaName" clearable placeholder="请选择库区" @focus="funcArea">
          <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
        </el-select>
      </el-form-item>
      <el-form-item label="库位" :label-width="formLabelWidth">
        <el-select
          v-model="rform.locationName"
          clearable
          filterable
          remote
          reserve-keyword
          placeholder="请输入库位名称"
          :remote-method="funcLL"
        >
          <el-option v-for="item in locationOptions" :key="item.id" :label="item.locationName" :value="item.locationName" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" :label-width="formLabelWidth">
        <el-select
          v-model="rform.commodityId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入商品名称"
          :remote-method="funcCommodity"
        >
          <el-option v-for="item in commodityOptions" :key="item.id" :label="item.goodsName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品sku" :label-width="formLabelWidth">
        <ComboGrid
          v-model="rform.skuName"
          clearable
          value-field="skuName"
          text-field="skuName"
          :data="skuOptions"
          :panel-style="{width:'500px'}"
          :text-formatter="formatSkuText"
          @focus="focusSku"
        >
          <DataGrid slot="grid" :border="false">
            <GridColumn v-if="false" field="id" title="序号" />
            <GridColumn field="skuName" title="sku名称" />
            <GridColumn field="skuCode" title="sku代码" />
            <GridColumn field="skuColor" title="sku颜色" />
            <GridColumn field="skuSize" title="尺寸" />
            <GridColumn field="skuSeason" title="季节" />
          </DataGrid>
        </ComboGrid>
      </el-form-item>
      <el-form-item label="生产厂家" :label-width="formLabelWidth">
        <el-input v-model="rform.productCompany" clearable placeholder="请输入生产厂家" />
      </el-form-item>
      <el-form-item label="生产批次" :label-width="formLabelWidth">
        <el-input v-model="rform.productBatch" clearable placeholder="请输入生产批次" />
      </el-form-item>
      <!-- <el-form-item label="跟踪号" :label-width="formLabelWidth">
          <el-input v-model="rform.traceCode" clearable placeholder="请输入跟踪号" />
        </el-form-item> -->
      <el-button type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
    </el-form>
    <el-table
      ref="tableData"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      :header-cell-style="{background:'#000',color: '#fff'}"
      height="500px"
      border
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      size="mini"
      style="width: 100%, font-size: 10px"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column v-if="false" label="id" prop="id" />
      <el-table-column label="箱号" align="center" width="180px" :show-overflow-tooltip="true" prop="balanceCode" />
      <el-table-column label="仓库" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
      <el-table-column label="库区" align="center" :show-overflow-tooltip="true" prop="areaName" />
      <el-table-column label="库位" align="center" width="180px" :show-overflow-tooltip="true" prop="locationName" />
      <el-table-column label="客户" align="center" width="180px" :show-overflow-tooltip="true" prop="customName" />
      <el-table-column label="商品" align="center" :show-overflow-tooltip="true" prop="commodityName" />
      <el-table-column label="商品sku" align="center" :show-overflow-tooltip="true" prop="skuName" />
      <!-- <el-table-column label="最小sku单位" align="center" :show-overflow-tooltip="true" prop="unit" :formatter="stateFormat" /> -->
      <el-table-column label="包装" align="center" :show-overflow-tooltip="true" prop="containerName" />
      <el-table-column label="库存数量(个)" align="center" :show-overflow-tooltip="true" prop="inventoryCnt" />
      <!-- <el-table-column label="跟踪号" align="center" :show-overflow-tooltip="true" prop="traceCode" /> -->
      <el-table-column label="生产厂家" align="center" :show-overflow-tooltip="true" prop="productCompany" />
      <el-table-column label="生产日期" width="180px" align="center" :show-overflow-tooltip="true" prop="productTime">
        <template slot-scope="scope">{{ scope.row.productTime| dateYMDHMSFormat }}</template>
      </el-table-column>
      <el-table-column label="生产批次" width="180px" align="center" :show-overflow-tooltip="true" prop="productBatch" />
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div></template>
<script>
import Pagination from '@/components/Pagination'

import { selectArea, selectLocation, screenGoods, searchInventoryBalanceSelective, searchInventoryBalanceNum } from '@/api/user'
import { searchsystemid, searchcustomer, searchallwarehouse, searchsku } from '@/utils/search'
export default {
  components: { Pagination },
  props: {
    // tableData: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // },
    rform: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      warehouseOptions: [],
      commodityOptions: [],
      tableData: [],
      lastTime: 0,
      listLoading: false,
      lasttypeTime: 0,
      total: 0,
      tableHeight: 50,
      listQuery: {
        page: 1,
        limit: 50
      },
      methodOptions: [],
      states: [],
      loclist: [],
      locationOptions: [],
      lastAreaTime: 0,
      areaOptions: [],
      skuOptions: [],
      cstates: [],
      comlist: [],
      clistates: [],
      clilist: [],
      clientOptions: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    func() {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        searchallwarehouse().then(res => {
          this.warehouseOptions = res.data
        }
        )
        this.lastTime = now
      } else {
        if ((now - this.lastTime) > 5000) {
          this.lastTime = now
        }
      }
    },
    selectionChangeHandle(val) {
      this.$emit('clickSelect', val)
    },
    searchData() {
      this.getList()
    },
    getList() {
      this.listLoading = true
      searchInventoryBalanceSelective({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        warehouseName: this.rform.warehouseName,
        areaName: this.rform.areaName,
        commodityName: this.rform.commodityName,
        locationName: this.rform.locationName,
        skuName: this.rform.skuName,
        packageCode: this.rform.packageCode,
        unit: this.rform.unit,
        productCompany: this.rform.productCompany,
        productBatch: this.rform.productBatch
      }}).then(response => {
        this.$emit('tableData', response.data)
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      searchInventoryBalanceNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        warehouseName: this.rform.warehouseName,
        areaName: this.rform.areaName,
        commodityName: this.rform.commodityName,
        locationName: this.rform.locationName,
        skuName: this.rform.skuName,
        packageCode: this.rform.packageCode,
        unit: this.rform.unit,
        productCompany: this.rform.productCompany,
        productBatch: this.rform.productBatch
      }}).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    funClient(query) {
      searchcustomer().then(res => {
        this.clistates = res.data
        this.clilist = this.clistates.map(item => {
          return { id: item.id, customName: item.customName, customCode: item.customCode }
        })
      }
      )
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.clientOptions = this.clilist.filter(item => {
              return item.customName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.clientOptions = []
        }
      }, 100)
    },
    formatSkuText(skuName) {
      return skuName
    },
    focusSku() {
      if (this.rform.commodityId) {
        searchsku(this.rform.commodityId).then(res => {
          this.skuOptions = res.data
        }
        )
      } else {
        this.skuOptions = []
      }
    },
    funcMethod() {
      const now = new Date().valueOf()
      if (this.lasttypeTime === 0) {
        searchsystemid(37).then(res => {
          this.methodOptions = res.data
        }
        )
        this.lasttypeTime = now
      } else {
        if ((now - this.lasttypeTime) > 5000) {
          this.lasttypeTime = now
        }
      }
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
    funcArea() {
      const now = new Date().valueOf()
      if (this.lastAreaTime === 0) {
        selectArea({ pojo: {
        }}).then(res => {
          this.areaOptions = res.data
        }
        )
        this.lastAreaTime = now
      } else {
        if ((now - this.lastAreaTime) > 5000) {
          this.lastAreaTime = now
        }
      }
    },
    funcCommodity(query) {
      this.skuOptions = []
      screenGoods({
        searchDTO: {
          num: 100000,
          page: 1
        },
        pojo: {
        }
      })
        .then(res => {
          this.cstates = res.data
          this.comlist = this.cstates.map(item => {
            return { id: item.id, goodsName: item.goodsName, code: item.code }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.commodityOptions = this.comlist.filter(item => {
              return item.goodsName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.commodityOptions = []
        }
      }, 100)
    },
    funcSku() {
      searchsku(this.rform.commodityId).then(res => {
        this.skuOptions = res.data.map(item => {
          return { id: item.id, skuName: item.skuName, skuCode: item.skuCode }
        })
      }
      )
    }
  }
}
</script>

  <style scoped>
    .el-form /deep/.el-form-item__label{
        color:rgb(255, 255, 255);
      }
  </style>

