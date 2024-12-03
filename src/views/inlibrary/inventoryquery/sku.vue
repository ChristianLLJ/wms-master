<template>
  <div>
    <el-form :inline="true" :model="skuform" size="small">

      <el-form-item v-show="comShow" label="商品名称">
        <el-select
          v-model="skuform.commodityName"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="请输入商品名称"
          :remote-method="funcCommodity"
        >
          <el-option v-for="item in commodityOptions" :key="item.id" :label="item.goodsName" :value="item.goodsName" />
        </el-select>
      </el-form-item>
      <el-form-item v-show="skuShow" label="商品sku">
        <ComboGrid
          v-model="skuform.skuName"
          value-field="skuName"
          text-field="skuName"
          :data="skuOptions"
          clearable
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

    </el-form>

  </div>
</template>
<script>
import { screenGoods } from '@/api/user'
import { searchsku } from '@/utils/search'
export default {
  props: {
    skuform: {
      type: Object,
      default() {
        return {}
      }
    },
    comShow: {
      type: Boolean,
      default: false
    },
    skuShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      commodityOptions: [],
      skuOptions: [],
      cstates: [],
      comlist: []
    }
  },
  methods: {
    formatSkuText(skuName) {
      return skuName
    },
    focusSku() {
      if (this.skuform.commodityName) {
        this.$message.warning('请先填写商品！')
        searchsku().then(res => {
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

