<template>
  <el-form :inline="true" :model="rform" style="padding: 2px">
    <el-row>
      <el-col>
        <el-form-item label="客户" prop="customName" :label-width="formLabelWidth">
          <el-select
            v-model="rform.customName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词,如'宝开'"
            :remote-method="funClient"
          >
            <el-option v-for="item in clientOptions" :key="item.id" :label="item.customName" :value="item.customName" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="产品名称" :label-width="formLabelWidth">
          <el-select
            v-model="rform.commodityId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入产品名称"
            :remote-method="funcCommodity"
          >
            <el-option v-for="item in commodityOptions" :key="item.id" :label="item.goodsName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" />
      <el-col :span="8">
        <el-form-item label="产品sku" :label-width="formLabelWidth">
          <ComboGrid
            v-model="rform.skuName"
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
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="仓库" :label-width="formLabelWidth">
          <el-select v-model="rform.warehouseName" @focus="func">
            <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label-width="formLabelWidth" label="库区">
          <el-select v-model="rform.areaName" placeholder="请选择库区" @focus="funcArea">
            <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="库位" :label-width="formLabelWidth">
          <el-select
            v-model="rform.locationName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入库位名称"
            :remote-method="funcLL"
          >
            <el-option v-for="item in locationOptions" :key="item.id" :label="item.locationName" :value="item.locationName" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="跟踪号" :label-width="formLabelWidth">
          <el-input v-model="rform.traceCode" placeholder="请输入跟踪号" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="生产批次" :label-width="formLabelWidth">
          <el-input v-model="rform.productBatch" placeholder="请输入生产批次" clearable />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { selectArea, selectLocation, screenGoods } from '@/api/user'
import { searchcustomer, searchwarehouse, searchsku } from '@/utils/search'
export default {
  props: {
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
      lastTime: 0,
      lasttypeTime: 0,
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
  methods: {
    func() {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        searchwarehouse(window.sessionStorage.workGroupId).then(res => {
          this.warehouseOptions = res.data.results
        }
        )
        this.lastTime = now
      } else {
        if ((now - this.lastTime) > 5000) {
          this.lastTime = now
        }
      }
    },
    formatSkuText(skuName) {
      return skuName
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
    }
  }
}
</script>

<style>

.datagrid-htable, .datagrid-btable, .datagrid-ftable {
    color: #ffffff;
}
</style>

