<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="btngroups">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="exportErp">ERP导入</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      ref="table"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      :row-key="getRowKeys"
      border
      size="mini"
      :expand-row-keys="expands"
      :header-cell-style="{background:'#000',color: '#fff'}"
      :height="tableHeight"
      tooltip-effect="dark"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="采购订单" align="center">
        <el-table-column
          type="selection"
          show-overflow-tooltip
          reserve-selection
        />
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column v-if="false" prop="id" />
        <el-table-column label="采购订单编号" width="150px" :show-overflow-tooltip="true" prop="orderId" />
        <el-table-column label="采购订单类型" :show-overflow-tooltip="true" prop="orderType" :formatter="typeFormat" />
        <el-table-column label="采购订单状态" :show-overflow-tooltip="true" prop="orderState" :formatter="stateFormat" />
        <el-table-column label="仓库名称" width="250px" :show-overflow-tooltip="true" prop="warehouseName" />
        <el-table-column label="客户名称" :show-overflow-tooltip="true" prop="customName" />
        <el-table-column label="供应商名称" width="200px" :show-overflow-tooltip="true" prop="supplierName" />
        <el-table-column label="填写人" :show-overflow-tooltip="true" prop="addPersonName" />
        <el-table-column label="修改时间" :show-overflow-tooltip="true" prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="收货时间" :show-overflow-tooltip="true" prop="receiveTime">
          <template slot-scope="scope">{{ scope.row.receiveTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <!-- <el-table-column label="审核人"  :show-overflow-tooltip="true" prop="checkPersonName" /> -->
        <el-table-column label="备注" :show-overflow-tooltip="true" prop="remark" />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import { importJindie, jindie } from '@/api/user'
import { searchsystemid } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  //   components: { Pagination },
  data() {
    return {
      // 总数
      multipleSelection: [],
      expands: [],
      table: [],
      list: [],
      erpList: [],
      options: [],
      toptions: [],
      comOptions: [],
      comStates: [],
      comLoclist: [],
      conOptions: [],
      checked: true,
      viewed: true,
      conStates: [],
      conLoclist: [],
      orderType: null,
      orderState: null,
      advanced: false,
      tableLoading: true,
      listLoading: true,
      loading: true,
      id: null,
      total: 20,
      lastTime: 0,
      laststateTime: 0,
      lasttypeTime: 0,
      lastptypeTime: 0,
      ptypeOptions: [],
      skuOptions: [],
      lastStaTime: 0,
      expandState: 0,
      sums: {},
      tablelist: {},
      tableHeight: 50,
      dialogVisible: false,
      dialogTableVisible: false,
      startTime: null,
      endTime: null,
      warehouseOptions: [],
      stateOptions: [],
      formLabelWidth: '120px',
      currentPage2: 1, // 当前页码
      pageSize2: 15, // 每页的数据条数
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 10, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      tabledatas: [],
      tableAll: [],
      tableData: [],
      tabClickIndex: null, // 点击的单元格
      tabClickLabel: ''
    }
  },
  created() {
    // this.getList()
    this.importERP()
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 77
      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 77
      }
    })
  },
  methods: {
    importERP() {
      this.listLoading = true
      if (this.$store.state.tableAll.length === 0) {
        importJindie().then(res => {
          this.tableAll = res.data
          this.$store.commit('DataListMutation', res.data)
          const list = []
          for (let i = 0; i < this.tableAll.length; i++) {
            list.push(this.tableAll[i].head)
          }
          this.tableData = list
          setTimeout(() => {
            this.listLoading = false
          }, 2 * 1000)
        })
      } else {
        this.tableAll = this.$store.state.tableAll
        const list = []
        for (let i = 0; i < this.tableAll.length; i++) {
          list.push(this.tableAll[i].head)
        }
        this.tableData = list
        setTimeout(() => {
          this.listLoading = false
        }, 2 * 1000)
      }
    },
    exportErp() {
      if (this.multipleSelection.length) {
        for (var i = 0; i < this.multipleSelection.length; i++) {
          for (var j = 0; j < this.tableAll.length; j++) {
            if (this.multipleSelection[i].orderId === this.tableAll[j].head.orderId) {
              this.erpList.push(this.tableAll[j])
            }
          }
        }
        jindie(this.erpList).then(res => {
          if (res.code === 200) {
            this.$message.success('导入成功！')
          }
        })
      } else {
        this.$message({
          message: '请选择至少一条数据',
          type: 'warning'
        })
      }
    },
    funType() {
      const now = new Date().valueOf()
      if (this.lastptypeTime === 0) {
        searchsystemid('INBOUND_ADVICE_TYPE').then(res => {
          this.ptypeOptions = res.data
        }
        )
        this.lastptypeTime = now
      } else {
        if ((now - this.lastptypeTime) > 5000) {
          this.lastptypeTime = now
        }
      }
    },
    funcState() {
      const now = new Date().valueOf()
      if (this.lastStaTime === 0) {
        searchsystemid('PURCHASE_STATE').then(res => {
          this.stateOptions = res.data
        })
        this.lastStaTime = now
      } else {
        if ((now - this.lastStaTime) > 5000) {
          this.lastStaTime = now
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex

      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid('PURCHASE_STATE').then(res => {
          this.options = res.data
        })
        this.laststateTime = now
      } else {
        if ((now - this.laststateTime) > 5000) {
          this.laststateTime = now
        }
      }
      return changeAll(row.orderState, this.options)
    },
    typeFormat(row) {
      const now = new Date().valueOf()
      if (this.lasttypeTime === 0) {
        searchsystemid('PURCHASE_TYPE').then(res => {
          this.toptions = res.data
        })
        this.lasttypeTime = now
      } else {
        if ((now - this.lasttypeTime) > 5000) {
          this.lasttypeTime = now
        }
      }
      return changeAll(row.orderType, this.toptions)
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      for (let i = 0; i < val.length; i++) {
        if (this.multipleSelection.indexOf(val[i].orderId) === -1) {
          this.multipleSelection.push({ orderId: val[i].orderId })
        }
      }
    }
  }
}
</script>
<style>
.el-table .d-row{
  background: rgb(194, 45, 45);
}
.el-table .o-row{
  background: #0e295d;
}
.el-table .dd-row{
  background: rgb(97, 165, 186);
}
.el-table .do-row{
  background: #6f6dda;
}

</style>
  <style scoped>
  .el-card /deep/ .el-card__header {
  padding: 5px;
  color:#fff;
  text-align: center;
  }
   .el-form /deep/.el-form-item__label{
    color:#fff
  }

  .search {
    margin: 1px;
    float: right
  }
  .btngroups {
    margin: 1px;
  }

  .pagContainer{
    background-color: rgb(46, 153, 132);
  }
  </style>
<style lang="scss" scoped>
// 修改对话框高度
.show_card {
      background-color:#262626;
    }
  .showAll_dialog {
    .cardContain {
      height:100%;
      .show_card1 {
      height:20%;
      background-color:#262626;
    }
    .show_card2 {
      height:80%;
      background-color:#262626;
    }
  }
    ::v-deep.el-dialog {
      margin: 10px auto !important;
      height: 90%;
      overflow: hidden;
      background-color: #262626;

      .el-dialog__body {
        line-height: 30px;
        color: white;
        padding: 10px 15px;
        height: 80%
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
  .detailsTable {
   ::v-deep .el-table tbody tr:hover>td {
  background-color:#162a48!important
}
  }
    .detailsTable2 {
   ::v-deep .el-table tbody tr:hover>td {
  background-color:#162a48!important
}
  }
</style>
