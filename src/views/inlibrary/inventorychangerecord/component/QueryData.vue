<template>
  <el-form :inline="true" :model="rform" size="small" style="padding: 2px">
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
    <SkuChoose :skuform="skuform" />
    <LocationChoose :locationform="locationform" />
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
import SkuChoose from '@/components/SkuChoose'
import { searchcustomer } from '@/utils/search'
import LocationChoose from '@/components/LocationChoose'
export default {
  components: { SkuChoose, LocationChoose },
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
      skuform: {
        commodityId: null,
        skuName: null
      },
      locationform: {
        warehousename: null,
        areaName: null,
        locationName: null
      },
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
    }
  }
}
</script>

    <style scoped>

    </style>

