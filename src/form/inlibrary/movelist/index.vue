<template>
  <div>
    <div class="btngroups">
      <el-button type="success" icon="el-icon-back" @click="goback">返回上一页</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card class="show_card1" :body-style="{padding:'20px'}">
      <div slot="header" align="center">
        <span class="title">库存移动单头</span>
      </div>
      <el-form :inline="true" class="demo-form-inline" :model="form">
        <el-form-item label="库存移动编号">
          <el-input v-model="form.moveCode" size="small" disabled />
        </el-form-item>
        <el-form-item label="原因描述">
          <el-input v-model="form.moveReason" size="small" placeholder="请填写" style="width: 200px;" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="查找需要移动的商品" :visible.sync="dialogTableVisible" width="80%" class="showAll_dialog2">
      <query-data
        :rform="rform"
        :data-list-selections="dataListSelections"
        @tableData="tableData"
        @clickSelect="clickSelect"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="searchData">确认选择表格数据进行移动</el-button>
      </div>
    </el-dialog>
    <el-card :body-style="{padding:'0px'}" shadow="always">
      <div slot="header" align="center">
        <span style="padding-right: 10px">库存移动表-表细填写</span>
        <el-button icon="el-icon-plus" size="small" type="primary" @click="add">新增</el-button>
      </div>
      <el-table
        ref="tabledatas"
        :data="tabledatas"
        size="mini"
        :height="tableHeight"
        :header-cell-style="{background:'#091f2c',color: '#fff'}"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column label="仓库" align="center" prop="warehouseName" />
        <el-table-column label="仓库代码" align="center" prop="warehouseCode" />
        <el-table-column label="客户名称" align="center" prop="customName" />
        <el-table-column label="商品" align="center" prop="commodityName" />
        <el-table-column label="商品代码" align="center" prop="commodityCode" />
        <el-table-column label="sku编码" align="center" prop="skuCode" />
        <el-table-column label="sku名称" align="center" prop="skuName" />
        <el-table-column v-if="false" label="来源仓库id" align="center" :show-overflow-tooltip="true" prop="sourceWarehouseId" />
        <el-table-column label="来源仓库名称" align="center" :show-overflow-tooltip="true" prop="sourceWarehouseName" />
        <el-table-column label="来源仓库代码" align="center" :show-overflow-tooltip="true" prop="sourceWarehouseCode" />
        <el-table-column v-if="false" label="来源库区id" align="center" :show-overflow-tooltip="true" prop="sourceAreaId" />
        <el-table-column label="来源库区名称" align="center" :show-overflow-tooltip="true" prop="sourceAreaName" />
        <el-table-column label="来源库区代码" align="center" :show-overflow-tooltip="true" prop="sourceAreaCode" />
        <el-table-column label="来源库位名称" align="center" :show-overflow-tooltip="true" prop="sourceLocationName" />
        <el-table-column v-if="false" label="来源库位id" align="center" :show-overflow-tooltip="true" prop="sourceLocationId" />
        <el-table-column label="来源库位名称" align="center" :show-overflow-tooltip="true" prop="sourceLocationCode" />
        <el-table-column label="目标仓库名称" align="center" prop="targetWarehouseName" width="200px">
          <template slot-scope="scope">
            <span>
              <el-select
                v-model="scope.row.targetWarehouseName"
                clearable
                @focus="func"
                @change="changeWarehouseOptions(scope.row)"
              >
                <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="目标仓库代码" align="center" :show-overflow-tooltip="true" prop="targetWarehouseCode" />
        <el-table-column v-if="false" label="目标仓库Id" align="center" :show-overflow-tooltip="true" prop="targetWarehouseId" />
        <el-table-column label="目标库区名称" align="center" prop="targetAreaName" width="200px">
          <template slot-scope="scope">
            <span>
              <el-select
                v-model="scope.row.targetAreaName"
                clearable
                placeholder="请选择库区"
                @focus="funcArea(scope.row)"
                @change="changeAreaOptions(scope.row)"
              >
                <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="目标库区代码" align="center" :show-overflow-tooltip="true" prop="targetAreaCode" />
        <el-table-column v-if="false" label="目标库区Id" align="center" :show-overflow-tooltip="true" prop="targetAreaId" />
        <el-table-column v-if="false" label="目标库位代码" align="center" :show-overflow-tooltip="true" prop="targetLocationCode" />
        <el-table-column v-if="false" label="目标库位Id" align="center" :show-overflow-tooltip="true" prop="targetLocationId" />

        <el-table-column label="目标库位名称" align="center" prop="targetLocationName" width="200px">
          <template slot-scope="scope">
            <span>
              <el-select
                v-model="scope.row.targetLocationName"
                filterable
                clearable
                reserve-keyword
                placeholder="请输入库位名称"
                :filter-method="funcLL"
                @focus="cusfocus(scope.row)"
                @change="changeLocationOptions(scope.row)"
              >
                <el-option v-for="item in locationOptions" :key="item.id" :label="item.locationName" :value="item.locationName" />
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" @click="delect(scope.$index)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="btnsContain">
      <div>
        <el-button size="small" icon="el-icon-save" type="success" @click="submit">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import QueryData from './components/QueryData.vue'
import { searchallwarehouse } from '@/utils/search'
import { submitInventoryMoveAndDetail, inventoryMoveGetHeadCode, selectArea, selectLocation } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { QueryData },

  data() {
    return {
      tabledatas: [],
      options: [

      ],
      tableFreeze: [],
      warehouseOptions: [],
      states: [],
      loclist: [],
      locationOptions: [],
      lastloccTime: 0,
      dialogTableVisible: false,
      dataListSelections: [],
      areaOptions: [],
      rform: {
        warehouseName: null,
        freezeType: null,
        areaName: null,
        locationName: null,
        customName: null,
        traceCode: null,
        commodityName: null,
        productCompany: null,
        skuName: null,
        productBatch: null
      },
      tableHeight: 50,
      lastTime: 0,
      form: {
        moveCode: '',
        moveReason: ''
      }
    }
  },
  created() {
    this.getHeadCode()
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tabledatas.$el.offsetTop - 83

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tabledatas.$el.offsetTop - 83
      }
    })
  },
  methods: {
    goback() {
      this.$router.go(-1)
    },
    clickSelect(val) {
      this.dataListSelections = val
    },
    tableData(val) {
      this.tableFreeze = val
    },
    changeWarehouseOptions(row) {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === row.targetWarehouseName)
      row.targetWarehouseId = item.id
      row.targetWarehouseName = item.warehouseName
      row.targetWarehouseCode = item.warehouseCode
    },
    changeLocationOptions(row) {
      const item = this.locationOptions.find(item1 => item1.locationName === row.targetLocationName)
      row.targetLocationId = item.id
      row.targetLocationName = item.locationName
      row.targetLocationCode = item.locationCode
    },
    changeAreaOptions(row) {
      const item = this.areaOptions.find(item1 => item1.areaName === row.targetAreaName)
      row.targetLocationId = item.id
      row.targetAreaName = item.areaName
      row.targetAreaCode = item.areaCode
    },
    getHeadCode() {
      inventoryMoveGetHeadCode({ code: 'MOV' }).then(res => {
        if (res.code === 200) {
          this.form.moveCode = res.data
        }
      })
    },
    funcArea(row) {
      if (!row.targetWarehouseName) {
        this.$message.warning('请先选择仓库！')
      } else {
        selectArea({ pojo: {
          warehouseName: row.targetWarehouseName

        }}).then(res => {
          this.areaOptions = res.data
        }
        )
      }
    },
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
    cusfocus(row) {
      if (!row.targetAreaName) {
        this.$message.warning('请先选择areaName！')
      } else {
        selectLocation({
          pojo: {
            warehouseName: row.targetWarehouseName,
            areaName: row.targetAreaName
          }
        })
          .then(res => {
            this.locationOptions = res.data
          })
      }
    },

    funcLL(query) {
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.locationOptions = this.locationOptions.filter(item => {
              return item.locationName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        }
      }, 100)
    },
    refresh() {
      this.reload()
    },
    // 单个删除
    delect(index) {
      this.tabledatas.splice(index, 1)
    },
    searchData() {
      this.dialogTableVisible = false
      this.dialogTableResultVisible = true
      if (this.dataListSelections.length === 0) {
        this.tabledatas = this.tableFreeze
        this.deleteId()
      } else {
        this.tabledatas = this.dataListSelections
        this.deleteId()
      }
    },
    add() {
      this.dialogTableVisible = true
    },
    deleteId() {
      for (var i = 0; i < this.tabledatas.length; i++) {
        delete this.tabledatas[i].id
        this.tabledatas[i].sourceLocationName = this.tabledatas[i].locationName
        this.tabledatas[i].sourceLocationCode = this.tabledatas[i].locationCode
        this.tabledatas[i].sourceWarehouseCode = this.tabledatas[i].warehouseCode
        this.tabledatas[i].sourceWarehouseName = this.tabledatas[i].warehouseName
        this.tabledatas[i].sourceLocationId = this.tabledatas[i].locationId
        this.tabledatas[i].sourceWarehouseId = this.tabledatas[i].warehouseId
        this.tabledatas[i].sourceAreaName = this.tabledatas[i].areaName
        this.tabledatas[i].sourceAreaCode = this.tabledatas[i].areaCode
        this.tabledatas[i].sourceAreaId = this.tabledatas[i].areaId
      }
    },
    submit() {
      this.$confirm('此操作提交所填信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        submitInventoryMoveAndDetail({ inventoryMoveDetailList: this.tabledatas, inventoryMove: {
          moveCode: this.form.moveCode,
          moveReason: this.form.moveReason,
          // createTime: this.form.createTime,
          movePeopleId: Number(sessionStorage.getItem('getUserId')),
          movePeopleName: sessionStorage.getItem('getUserName')
        }}).then(res => {
          if (res.code === 200) {
            this.$message.success('提交成功')
            this.reload()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
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
  .el-card /deep/ .el-card__header {
  padding: 5px;
  }
  </style>
    <style lang="scss" scoped>
    // 修改对话框高度
        .btnsContain {
          div{
            width: 100px;
            margin: 0 auto;
          }
        }
        .showAll_dialog2 {
               ::v-deep.el-dialog {
                 margin: 10px auto !important;
                 overflow: auto;
                //  height: 95%;
                 border: #fff 1px solid;
                  box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
               0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);
                 background-color: #091f2c;

                 .el-dialog__body {
                   line-height: 30px;
                   color: white;
                   padding: 10px 15px;
                  //  height: 85%
                 }
                 .el-dialog__title {
                   color: white;
                   caret-color: transparent;
                 }
                 .el-icon-close {
                   color: white;
                   &:hover {
                     color:rgb(9,205,219)
                   }
                 }
               }
             }
    </style>

