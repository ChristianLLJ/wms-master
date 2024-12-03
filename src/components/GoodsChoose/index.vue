<template>
  <div>
    <el-form :inline="true" :model="goodsform" size="small" label-width="120px">

      <el-form-item label="商品名称">
        <el-select
          v-model="goodsform.commodityId"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="请输入产品名称"
          :remote-method="funcCommodity"
        >
          <el-option v-for="item in commodityOptions" :key="item.id" :label="item.goodsName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品sku">
        <ComboGrid
          v-model="goodsform.skuName"
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
      <el-form-item label="商品包装">
        <ComboGrid
          v-model="goodsform.containerName"
          value-field="name"
          text-field="name"
          :data="containerOptions"
          :panel-style="{width:'500px'}"
          :text-formatter="formatConText"
          @focus="focusCon"
        >
          <DataGrid slot="grid" :border="false">
            <GridColumn v-if="false" field="id" title="序号" />
            <GridColumn field="name" title="包装名称" />
            <GridColumn field="code" title="包装代码" />
            <GridColumn field="innerNum" title="包装容量" />
            <GridColumn field="length" title="长(m)" />
            <GridColumn field="width" title="宽(m)" />
            <GridColumn field="highth" title="高(m)" />
          </DataGrid>
        </ComboGrid>
      </el-form-item>
      <el-form-item label="最小sku单位">
        <el-select v-model="goodsform.unit" size="mini" placeholder="请选择" @focus="funcUnit">
          <el-option v-for="item in unitOptions" :key="item.id" :label="item.codeDetailName" :value="item.codeDetailName" />
        </el-select>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { screenGoods } from '@/api/user'
import { searchsku, searchcon, searchsystemid } from '@/utils/search'
export default {
  props: {
    goodsform: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      commodityOptions: [],
      skuOptions: [],
      cstates: [],
      comlist: [],
      unitOptions: [],
      lastconTime: 0,
      lastunitTime: 0,
      containerOptions: []
    }
  },
  methods: {
    formatSkuText(skuName) {
      return skuName
    },
    formatConText(name) {
      return name
    },
    focusSku() {
      if (this.goodsform.commodityId) {
        searchsku(this.goodsform.commodityId).then(res => {
          this.skuOptions = res.data
        }
        )
      } else {
        this.$message.warning('请先填写商品名称')
        this.skuOptions = []
      }
    },
    focusCon() {
      const now = new Date().valueOf()
      if (this.lastconTime === 0) {
        searchcon().then(res => {
          this.containerOptions = res.data
        }
        )
        this.lastconTime = now
      } else {
        if ((now - this.lastconTime) > 5000) {
          this.lastconTime = now
        }
      }
    },
    funcUnit() {
      const now = new Date().valueOf()
      if (this.lastunitTime === 0) {
        searchsystemid('SKU_UNIT').then(res => {
          this.unitOptions = res.data
        }
        )
        this.lastunitTime = now
      } else {
        if ((now - this.lastunitTime) > 5000) {
          this.lastunitTime = now
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
    }
  }
}
</script>
  <style>

  .datagrid-htable, .datagrid-btable, .datagrid-ftable {
      color: #ffffff;
  }
  </style>
  <style scoped>
  .el-form /deep/.el-form-item__label{
  color:#fff
  }
  </style>

