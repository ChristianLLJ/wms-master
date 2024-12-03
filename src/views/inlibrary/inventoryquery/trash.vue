<template>
  <div>
    <el-form :inline="true" :model="trashform" size="small">
      <el-form-item
        v-show="customer"
        label="客户"
      >
        <el-select
          v-model="trashform.customName"
          filterable
          clearable
          reserve-keyword
          placeholder="请输入关键词,如“宝开”"
          :filter-method="funClient"
          size="mini"
          @focus="cusfocus"
        >
          <el-option v-for="item in clientOptions" :key="item.id" :label="item.customName" :value="item.customName" />
        </el-select>
      </el-form-item>
      <el-form-item v-show="commodityType" label="商品类型">
        <el-input v-model="trashform.cargoType" clearable placeholder="请填写" />
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { searchcustomer } from '@/utils/search'
import { throttle } from '@/utils/throttle'

export default {
  props: {
    trashform: {
      type: Object,
      default() {
        return {}
      }
    },
    customer: {
      type: Boolean,
      default: false
    },
    commodityType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      clientOptions: []
    }
  },
  methods: {
    cusfocus: throttle(function() {
      searchcustomer().then(res => {
        this.clientOptions = res.data
      }
      )
    }, 5000, true),
    funClient(query) {
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.clientOptions = this.clientOptions.filter(item => {
              return item.customName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
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
  <!-- <style scoped>
  .el-form /deep/.el-form-item__label{
  color:#fff
  }
  </style> -->

