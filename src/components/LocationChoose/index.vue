<template>
  <div>
    <el-form :inline="true" :model="locationform" size="small" label-width="120px">
      <el-form-item label="仓库">
        <el-select
          v-model="locationform.warehouseName"
          clearable
          @focus="func"
        >
          <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
        </el-select>
      </el-form-item>
      <el-form-item label="库区">
        <el-select v-model="locationform.areaName" clearable placeholder="请选择库区" @focus="funcArea">
          <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
        </el-select>
      </el-form-item>
      <el-form-item label="库位">
        <el-select
          v-model="locationform.locationName"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入库位名称"
          :remote-method="funcLL"
        >
          <el-option v-for="item in locationOptions" :key="item.id" :label="item.locationName" :value="item.locationName" />
        </el-select>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { selectArea, selectLocation } from '@/api/user'
import { searchallwarehouse } from '@/utils/search'
export default {
  props: {
    locationform: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      warehouseOptions: [],
      lastTime: 0,
      states: [],
      loclist: [],
      locationOptions: [],
      areaOptions: []
    }
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
    funcLL(query) {
      if (!this.locationform.areaName) {
        this.$message.warning('请先选择库区！')
      } else {
        selectLocation({
          pojo: {
            warehouseName: this.locationform.warehouseName,
            areaName: this.locationform.areaName
          }
        })
          .then(res => {
            this.states = res.data
            this.loclist = this.states.map(item => {
              return { id: item.id, locationName: item.locationName }
            })
            console.log(this.loclist)
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
      }
    },
    funcArea() {
      if (!this.locationform.warehouseName) {
        this.$message.warning('请先选择仓库！')
      } else {
        selectArea({ pojo: {
          warehouseName: this.locationform.warehouseName

        }}).then(res => {
          this.areaOptions = res.data
        }
        )
      }
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
/* .el-form /deep/.el-form-item__label{
color:#fff
} */
</style>
