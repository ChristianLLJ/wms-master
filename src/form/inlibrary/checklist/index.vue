<template>
  <div>
    <div class="btngroups">
      <el-button type="success" icon="el-icon-back" @click="goback">返回上一页</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card :body-style="{padding:'10px'}">
      <el-form :inline="true" class="demo-form-inline" :model="form">
        <el-form-item label="盘点编号">
          <el-input v-model="form.inventoryCode" disabled size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="盘点类型">
          <el-select
            v-model="form.inventoryType"
            filterable
            clearable
            reserve-keyword
            size="mini"
          >
            <el-option v-for="item in checkOptions" :key="item.id" :label="item.label" :value="item.label" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="仓库名称">
          <el-input v-model="form.warehouseName" size="mini" style="width: 160px;" clearable />
        </el-form-item> -->
        <el-row :gutter="12">
          <el-col :span="12">
            <el-card>
              <div slot="header" class="clearfix">
                <span class="title">指定日期</span>
              </div>
              <el-form-item label="请选择日期范围">
                <el-date-picker
                  v-model="dateRange"
                  :disabled="disabledDate"
                  type="daterange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item v-if="show" label="快捷选项">
                <fast-date-select
                  @select="setDate"
                />
              </el-form-item>
            </el-card>

          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-dialog title="指定库位盘点" :visible.sync="dialogTableVisible" width="80%" class="showAll_dialog2">
      <query-data
        :rform="rform"
        :data-list-selections="dataListSelections"
        @tableData="tableData"
        @clickSelect="clickSelect"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="searchData">确认选择表格数据进行盘点</el-button>
      </div>
    </el-dialog>
    <el-card v-show="!disabled" :body-style="{padding:'0px'}" shadow="always">
      <div slot="header" align="center">
        <span style="padding-right: 10px">盘点任务</span>
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
        <el-table-column label="商品" align="center" prop="commodityName" />
        <el-table-column label="sku编码" align="center" prop="skuCode" />
        <el-table-column label="sku名称" align="center" prop="skuName" />
        <el-table-column label="库位代码" align="center" prop="locationCode" />
        <!-- <el-table-column label="包装代码" align="center" prop="packageCode" /> -->
        <el-table-column label="生产厂家" align="center" prop="productCompany" />
        <el-table-column label="可用数量(个)" align="center" :show-overflow-tooltip="true" prop="availableCnt" />
        <el-table-column align="center" label="生产日期" :show-overflow-tooltip="true" prop="productTime">
          <template slot-scope="scope">{{ scope.row.productTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="生产批次" align="center" prop="productBatch" />
        <el-table-column label="跟踪号" align="center" prop="traceCode" />
        <el-table-column label="客户名称" align="center" prop="customName" />
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" type="danger" @click="delect(scope.$index)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="btnsContain">
      <div>
        <el-button v-if="invenShow" size="small" type="success" icon="el-icon-standardInventoryByRange" @click="startCheck">生成盘点任务</el-button>
        <el-button v-if="dateShow" size="small" type="primary" icon="el-icon-dynamicInventoryByRange" @click="chooseDateCheck">生成盘点任务</el-button>
        <el-button v-if="todayShow" size="small" type="success" icon="el-icon-standardInventoryByRange" @click="startDateCheck">生成盘点任务</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { selectLocationInventory, getStockInventoryHeadCode, selectDateInventory, currentDayInventory } from '@/api/user'
import moment from 'moment'
import QueryData from './component/QueryData.vue'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { QueryData },
  data() {
    return {
      moment: moment,
      disabled: true,
      tabledata: [],
      tableData: [],
      tableChange: [],
      disabledDate: true,
      dialogTableVisible: false,
      invenShow: false,
      dateShow: false,
      todayShow: false,
      dataListSelections: [],
      show: false,
      tabledatas: [],
      tableHeight: 50,
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
      dateRange: [
        moment().subtract(7, 'd').toDate(),
        moment().subtract().toDate()
      ],
      searchDateRange: [
        moment().subtract(7, 'd').toDate(),
        moment().subtract().toDate()
      ],
      checkOptions: [{
        value: 1,
        label: '指定库位盘点'
      },
      {
        value: 2,
        label: '指定日期盘点'
      },
      {
        value: 3,
        label: '当日盘点'
      }
      ],
      form: {
        inventoryType: '',
        inventoryCode: ''
      }
    }
  },
  watch: {
    'form.inventoryType'(newVal, oldVal) {
      if (newVal === '指定库位盘点') {
        this.disabledDate = true
        this.invenShow = true
        this.dateShow = false
        this.todayShow = false
        this.show = false
        this.disabled = false
      } else if (newVal === '指定日期盘点') {
        this.disabledDate = false
        this.invenShow = false
        this.dateShow = true
        this.todayShow = false
        this.show = true
        this.disabled = true
      } else if (newVal === '当日盘点') {
        this.disabledDate = true
        this.invenShow = false
        this.dateShow = false
        this.todayShow = true
        this.show = false
        this.disabled = true
      } else {
        this.disabledDate = true
        this.invenShow = false
        this.dateShow = false
        this.todayShow = false
        this.show = false
        this.disabled = true
      }
    },
    deep: true
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
    setDate(date) {
      this.dateRange = date
    },
    searchData() {
      this.dialogTableVisible = false
      if (this.dataListSelections.length === 0) {
        this.tabledatas = this.tableChange
        // this.deleteId()
        // this.tabledata.push(...this.tabledatas)
      } else {
        this.tabledatas = this.dataListSelections
        // this.deleteId()
        // this.tabledata.push(...this.tabledatas)
      }
    },
    // deleteId() {
    //   for (var i = 0; i < this.tabledatas.length; i++) {
    //     this.tabledata.push(this.tabledatas[i].id)
    //   }
    // },
    clickSelect(val) {
      this.dataListSelections = val
    },
    refresh() {
      this.reload()
    },
    add() {
      this.tabledatas = []
      this.tableChange = []
      this.dialogTableVisible = true
    },
    getHeadCode() {
      getStockInventoryHeadCode({ code: 'INV' }).then(res => {
        if (res.code === 200) {
          this.form.inventoryCode = res.data
        }
      })
    },
    async startDateCheck() {
      let res
      try {
        res = await currentDayInventory({
          inventoryPersonId: sessionStorage.getItem('getUserId')
        })
      } catch (err) {
        res = err
      }
      if (res.code === 200) {
        this.$message.success('已成功生成盘点任务！请在页面查看详细内容')
        this.refresh()
      }
    },
    async chooseDateCheck() {
      let res
      try {
        res = await selectDateInventory(this.dateRange)
      } catch (err) {
        res = err
      }
      if (res.code === 200) {
        this.$message.success('已成功生成盘点任务！请在页面查看详细内容')
        this.refresh()
      }
    },
    async startCheck() {
      let res
      try {
        res = await selectLocationInventory({
          stockInventory: {
            inventoryCode: this.form.inventoryCode,
            inventoryPersonId: sessionStorage.getItem('getUserId'),
            inventoryPersonName: sessionStorage.getItem('getUserName')
          },
          inventoryBalanceList: this.tabledatas
        })
      } catch (err) {
        res = err
      }
      if (res.code === 200) {
        this.$message.success('已成功生成盘点任务！请在页面查看详细内容')
        this.refresh()
      }
    },
    // 单个删除
    delect(index) {
      this.tabledatas.splice(index, 1)
    },
    goback() {
      this.$router.go(-1)
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
