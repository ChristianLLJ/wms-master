<template>
  <div>
    <div class="btngroups">
      <el-button type="success" icon="el-icon-back" @click="goback">返回上一页</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card :body-style="{padding:'10px'}">
      <div slot="header" align="center">
        <span class="title">库存调整单-单头信息</span>
      </div>
      <el-form :inline="true" class="demo-form-inline" label-width="120px" :model="form">
        <el-form-item label="调整单编号">
          <el-input v-model="form.changeCode" disabled size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="调整原因">
          <el-input v-model="form.changeReason" size="small" placeholder="请填写" style="width: 200px;" />
          <!-- <el-select v-model="form.changeReason" size="small" placeholder="请选择" @focus="funcReason">
            <el-option v-for="item in reasonOptions" :key="item.id" :label="item.codeDetailName" :value="item.typeNumber" />
          </el-select> -->
        </el-form-item>
        <!-- <el-form-item label="客户" prop="customName">
          <el-select
            v-model="form.customName"
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
        </el-form-item> -->
      </el-form>
      <!-- <el-row>
        <el-col :span="9">
          <SkuChoose :skuform="skuform" />
        </el-col>
        <el-col :span="15">
          <LocationChoose :locationform="locationform" />
        </el-col>
      </el-row>
      <el-button type="primary" style="float: right" icon="el-icon-search" @click="search">查询</el-button> -->
    </el-card>
    <el-dialog title="查找需要调整的仓库商品" :visible.sync="dialogTableVisible" width="80%" class="showAll_dialog2">
      <query-data
        :rform="rform"
        :data-list-selections="dataListSelections"
        @tableData="tableData"
        @clickSelect="clickSelect"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="searchData">确认选择表格数据进行调整</el-button>
      </div>
    </el-dialog>
    <el-dialog title="库存盘点差异明细" :visible.sync="dialogTableVisible2" width="80%" class="showAll_dialog2">
      <WrongData
        :data-list-selections="dataListSelections"
        @tableList="tableList"
        @clickList="clickList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="searchWrongData">确认</el-button>
      </div>
    </el-dialog>
    <el-card :body-style="{padding:'0px'}" shadow="always">
      <div slot="header" align="center">
        <span style="padding-right: 10px">库存调整单-详细信息</span>
        <el-button icon="el-icon-plus" size="small" type="primary" @click="add">新增</el-button>
        <el-button icon="el-icon-plus" size="small" type="success" @click="addWrong">获取库存盘点差异明细</el-button>
      </div>
      <el-table
        ref="tabledatas"
        :data="tabledata"
        size="mini"
        :height="tableHeight"
        :header-cell-style="{background:'#000',color: '#fff'}"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column label="仓库名称" align="center" prop="warehouseName" />
        <el-table-column label="库位名称" align="center" prop="locationName" width="200px" />
        <el-table-column label="商品名称" align="center" prop="commodityName" />
        <el-table-column label="商品sku" align="center" prop="skuName" />
        <el-table-column label="库存数量" align="center" prop="inventoryCnt" />
        <el-table-column label="最小sku单位" align="center" prop="unit" :formatter="stateFormat" />
        <el-table-column label="调整数量" align="center" width="200px">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.changeNum" size="mini" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" @input="changeSum(scope.row)" />
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="调整数量" align="center" prop="changeNum" /> -->
        <!-- <el-table-column label="调整净重" align="center" prop="changeNetWeight" /> -->
        <el-table-column label="调整毛重(kg)" align="center" prop="changeWeight" />
        <el-table-column label="调整体积(L)" align="center" prop="changeVolumn" />
        <el-table-column label="调整金额(元)" align="center" prop="changePrice" />
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
        <el-button icon="el-icon-folder-add" type="success" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { submitStockChangeAndDetail, stockChangeGetHeadCode } from '@/api/user'
import QueryData from './component/QueryData.vue'
import WrongData from './component/WrongData.vue'

import { throttle } from '@/utils/throttle'
import { searchcustomer, searchsku } from '@/utils/search'
// import { searchsystemid } from '@/utils/search'

// import SkuChoose from '@/components/SkuChoose/index.vue'
// import LocationChoose from '@/components/LocationChoose/index.vue'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { QueryData, WrongData },
  data() {
    return {
      tabledatas: [],
      tabledata: [],
      tableChange: [],
      tableWrongChange: [],
      tableHeight: '50px',
      dialogTableVisible: false,
      clientOptions: [],
      skuOptions: [],
      weight: 0,
      volume: 0,
      money: 0,
      dataListSelections: [],
      dialogTableVisible2: false,
      dataList: [],
      reasonOptions: [],
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
      form: {
        changePersonName: '',
        changeCode: '',
        changeReason: ''
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tabledatas.$el.offsetTop - 85

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tabledatas.$el.offsetTop - 85
      }
    })
  },
  created() {
    this.getHeadCode()
  },
  methods: {
    add() {
      this.tabledatas = []
      this.tableChange = []
      this.dialogTableVisible = true
    },
    addWrong() {
      this.tabledatas = []
      this.tableWrongChange = []
      this.dialogTableVisible2 = true
    },
    // funcReason() {
    //   searchsystemid('51').then(res => {
    //     this.reasonOptions = res.data
    //   }
    //   )
    // },
    changeSum(row) {
      if (Number(row.changeNum) > Number(row.inventoryCnt)) {
        this.$message.warning('调整数量不允许大于商品现存数量！')
      } else {
        searchsku(null, null, row.commodityName).then(res => {
          this.skuOptions = res.data
          const item = this.skuOptions.find(item1 => item1.skuName === row.skuName)
          this.weight = item.weight
          this.volume = item.volume
          this.money = item.money
          row.changeWeight = Number(this.weight) * Number(row.changeNum)
          row.changeVolumn = Number(this.volume) * Number(row.changeNum)
          row.changePrice = Number(this.money) * Number(row.changeNum)
        }
        )
      }
    },
    tableData(val) {
      this.tableChange = val
    },
    tableList(val) {
      this.tableWrongChange = val
    },
    stateFormat(row) {
      if (row.unit === '1') {
        return '件'
      } else if (row.unit === '0') {
        return '袋'
      }
    },
    deleteId() {
      for (var i = 0; i < this.tabledatas.length; i++) {
        delete this.tabledatas[i].id
      }
    },
    deleteWrongId() {
      for (var i = 0; i < this.tabledatas.length; i++) {
        delete this.tabledatas[i].id
        this.tabledatas[i].changeNum = this.tabledatas[i].inventoryNum
      }
    },
    clickList(val) {
      this.dataList = val
    },
    clickSelect(val) {
      this.dataListSelections = val
    },
    getHeadCode() {
      stockChangeGetHeadCode({ code: 'CHG' }).then(res => {
        if (res.code === 200) {
          this.form.changeCode = res.data
        }
      })
    },
    refresh() {
      this.reload()
    },
    searchWrongData() {
      this.dialogTableVisible2 = false
      if (this.dataList.length === 0) {
        this.tabledatas = this.tableWrongChange
        this.deleteWrongId()
        this.tabledata.push(...this.tabledatas)
      } else {
        this.tabledatas = this.dataList
        this.deleteWrongId()
        this.tabledata.push(...this.tabledatas)
      }
    },
    searchData() {
      this.dialogTableVisible = false
      if (this.dataListSelections.length === 0) {
        this.tabledatas = this.tableChange
        this.deleteId()
        this.tabledata.push(...this.tabledatas)
      } else {
        this.tabledatas = this.dataListSelections
        this.deleteId()
        this.tabledata.push(...this.tabledatas)
      }
    },
    goback() {
      this.$router.go(-1)
    },
    // 单个删除
    delect(index) {
      this.tabledatas.splice(index, 1)
    },
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
    },
    submit() {
      this.$confirm('此操作提交所填信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        submitStockChangeAndDetail({ stockChangeDetailList: this.tabledata, stockChange: {
          changeCode: this.form.changeCode,
          changeReason: this.form.changeReason,
          changePersonId: Number(sessionStorage.getItem('getUserId')),
          changePersonName: sessionStorage.getItem('getUserName')
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
