<template>
  <div>
    <el-card style="border-radius: 20px; margin: 10px;" shadow="always">
      <el-row :gutter="20">
        <el-col :span="6">
          <div>
            <el-statistic group-separator="," :precision="2" :value="value11" title="入库数量" />
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="上架数量">
              <template slot="formatter"> {{ value22 }} </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic group-separator="," :precision="2" decimal-separator="." :value="value33" title="收货数量">
              <template slot="prefix">
                <i class="el-icon-s-flag" style="color: red" />
              </template>
              <template slot="suffix">
                <i class="el-icon-s-flag" style="color: blue" />
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic :value="value44" title="收货差异">
              <template slot="suffix">
                <span class="like">
                  <i class="el-icon-star-on" style="color:red" />
                </span>
              </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <div style="display:flex">
      <div style="margin-left: 10px">
        <el-form :inline="true" :model="form">
          <el-form-item label="客户">
            <el-input v-model="form.customName" size="small" style="width: 300px;" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="供应商" label-width="120px">
            <el-input v-model="form.supplierName" size="small" style="width: 300px;" placeholder="请输入" clearable />
          </el-form-item>
          <!-- <el-form-item label="收货时间" label-width="120px">
            <el-date-picker
              v-model="value2"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="daterange"
              size="small"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            />
          </el-form-item> -->
          <el-form-item>
            <el-button type="success" icon="el-icon-search" round size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="btngroups">
        <!-- <el-button size="small" icon="el-icon-export" type="primary" round @click="outSelfExcel">批量导出</el-button> -->
        <el-button size="small" type="warning" icon="el-icon-refresh" round @click="refresh">刷新</el-button>
      </div>
    </div>

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
      :header-cell-style="{background:'#000',color: '#fff'}"
      :height="tableHeight"
      tooltip-effect="dark"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
      :header-cell-class-name="handleHeadAddClass"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column label="入库信息" align="center">
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
        <el-table-column label="跟踪号" width="150px" :show-overflow-tooltip="true" prop="inboundTraceCode" />
        <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="commodityName" />
        <el-table-column label="商品sku" :show-overflow-tooltip="true" prop="skuName" />
        <el-table-column label="最小sku单位" :show-overflow-tooltip="true" prop="unit" />
        <el-table-column label="预计数量(个)" :show-overflow-tooltip="true" prop="num" />
        <el-table-column label="收货数量(个)" :show-overflow-tooltip="true" prop="receivedNum" />
        <el-table-column label="总重量(kg)" :show-overflow-tooltip="true" prop="totalWeight" />
        <el-table-column label="总净重(kg)" :show-overflow-tooltip="true" prop="totalNetWeight" />
        <el-table-column label="总体积(L)" :show-overflow-tooltip="true" prop="totalVolumn" />
        <el-table-column label="箱代码" :show-overflow-tooltip="true" prop="containerCode" />
        <!-- <el-table-column label="箱名称" :show-overflow-tooltip="true" prop="containerName" /> -->
        <el-table-column label="箱条码" :show-overflow-tooltip="true" width="150px" prop="containerBarcode" />
        <el-table-column label="码盘代码" :show-overflow-tooltip="true" prop="stackCode" />
        <!-- <el-table-column label="码盘名称" :show-overflow-tooltip="true" prop="stackName" /> -->
        <el-table-column label="码盘条码" :show-overflow-tooltip="true" width="150px" prop="stackBarcode" />
        <el-table-column label="客户代码" :show-overflow-tooltip="true" prop="customCode" />
        <el-table-column label="客户名称" :show-overflow-tooltip="true" prop="customName" />
        <el-table-column label="供应商名称" :show-overflow-tooltip="true" prop="supplierName" />
        <el-table-column label="供应商代码" :show-overflow-tooltip="true" prop="supplierCode" />
        <!-- <el-table-column label="备注" :show-overflow-tooltip="true" prop="remark" /> -->
        <el-table-column label="收货时间" :show-overflow-tooltip="true" prop="receiveTime">
          <template slot-scope="scope">{{ scope.row.receiveTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="生产厂家" :show-overflow-tooltip="true" prop="productCompany" />
        <el-table-column label="生产日期" :show-overflow-tooltip="true" prop="productTime">
          <template slot-scope="scope">{{ scope.row.productTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="生产批次" :show-overflow-tooltip="true" prop="productBatch" />
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { kkdeboundce } from '@/utils/kkdebounce'
import { selectExcelOutPUR, inboundReport } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      // 总数
      multipleSelection: [],
      expands: [],
      table: [],
      list: [],
      like: true,
      value11: '',
      value22: '',
      value33: '',
      value44: '',
      options: [],
      orderType: null,
      orderState: null,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value1: '',
      value2: '',
      advanced: false,
      tableLoading: true,
      listLoading: true,
      loading: true,
      id: null,
      total: 0,
      lastTime: 0,
      laststateTime: 0,
      lasttypeTime: 0,
      lastptypeTime: 0,
      ptypeOptions: [],
      skuOptions: [],
      expandState: 0,
      sums: {},
      tablelist: {},
      tableHeight: 50,
      dialogVisible: false,
      stateMin: null,
      stateMax: null,
      purchaseState: false,
      warehouseOptions: [],
      formLabelWidth: '120px',
      lastconTime: 0,
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 10, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      sortField: {},
      listQuery: {
        page: 1,
        limit: 50
      },
      form: {
        customName: null,
        addPersonName: null
      },
      screen: '',
      tabledatas: [],
      tableData: [],
      tabClickIndex: null, // 点击的单元格
      tabClickLabel: ''
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 92
      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 92
      }
    })
  },
  methods: {
    handleSortChange({ order, prop }) {
      // 触发的排序和缓存的排序相同时，取消该字段的排序
      this.screen = ''
      if (!order || this.sortField[prop] === order) {
        this.sortField[prop] = null
      } else {
        this.sortField[prop] = order
      }
      let direction = ''
      for (const i in this.sortField) {
        if (this.sortField[i] === 'ascending') {
          direction = 'asc'
        } else if (this.sortField[i] === 'descending') {
          direction = 'desc'
        } else {
          direction = 'null'
        }
        if (direction === 'null') {
          continue
        } else if (this.screen === '') {
          this.screen += i + ' ' + direction
        } else {
          this.screen += ',' + i + ' ' + direction
        }
      }
      this.getList() // 调用后端查询接口
    },
    handleHeadAddClass({ column }) {
      if (this.sortField[column.property]) {
        column.order = this.sortField[column.property]
      }
    },
    // 删除表格某一行
    deleteTable(index) {
      this.table.splice(index, 1)
    },
    outSelfExcel() {
      if (this.multipleSelection.length) {
        this.$confirm('是否确认导出所选单据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectExcelOutPUR(this.multipleSelection).then(res => {
            let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.setAttribute('download', `采购单`)
            document.body.appendChild(a)
            a.click()
            url = window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
          })
        })
      } else {
        this.$message({
          message: '请选择至少一条数据',
          type: 'warning'
        })
      }
    },
    search: kkdeboundce(function() {
      this.getList()
    }, 500),
    refresh: kkdeboundce(function() {
      this.reload()
    }, 500),
    getList() {
      this.listLoading = true
      inboundReport({
        pojo: {
          customName: this.form.customName,
          supplierName: this.supplierName
        },
        // workGroupId: window.sessionStorage.workGroupId, stateMin: this.stateMin,
        // screen: this.screen,
        startTime: this.value2[0], endTime: this.value2[1] }).then(response => {
        this.tableData = response.data.inboundPlanDetailList
        this.total = response.data.inboundPlanDetailList.length
        this.value11 = response.data.inboundNum
        this.value22 = response.data.onshelfNum
        this.value33 = response.data.receiveNum
        this.value44 = response.data.receiveDiff
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      for (let i = 0; i < val.length; i++) {
        if (this.multipleSelection.indexOf(val[i].id) === -1) {
          this.multipleSelection.push({ id: val[i].id })
        }
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
      .el-card /deep/ .el-card__header {
      padding: 5px;
      color:#fff;
      text-align: center;
      }
      .el-form /deep/.el-form-item__label{
        color:rgb(0, 0, 0);
        font-weight: bold;
      }

      .search {
        margin: 1px;
        padding-top: 10px;
        /* background-color: rgb(191, 189, 189); */
      }

      .btngroups {
        margin: 5px;
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
          .formContain {
            height: 15%;
            padding: 5px 5px;
            border: 1px solid #fff;

          }
          .detailsTable2 {
            height: 85%;
            overflow-y: auto;
       ::v-deep .el-table tbody tr:hover>td {
      background-color:#162a48!important
    }
      }
      }
        ::v-deep.el-dialog {
          margin: 10px auto !important;
          height: 90%;
          overflow: hidden;
          background-color: #262626;
          border: #fff 1px solid;
           box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
        0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);

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
    </style>

