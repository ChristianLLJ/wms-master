<template>
  <div>
    <el-row>
      <el-col v-show="showLeft" :span="spanLeft">
        <el-row>
          <div id="btnAndSearch">
            <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
              <div class="search">
                <el-form :inline="true" :model="formSearch" label-width="120px">
                  <el-form-item label="收货人地址">
                    <el-select v-model="formSearch.orderState" placeholder="请选择收货人地址" size="small" clearable>
                      <el-option v-for="item in options" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="快递公司">
                    <el-select v-model="formSearch.orderState" placeholder="请选择快递公司" size="small" clearable>
                      <el-option size="small" style="width: 160px;" clearable />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button-group>
                      <el-button type="success" icon="el-icon-search" size="medium" @click="search()">查询</el-button>
                    </el-button-group>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
            <div class="btngroups">
              <el-tooltip class="item" effect="dark" content="重新获取当前页面数据" placement="bottom-start">
                <el-button size="small" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="一键导出选中的快递任务单" placement="bottom-start">
                <el-button size="small" type="primary" icon="el-icon-export" @click="outSelfExcel">一键导出</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看全部/今日的快递任务" placement="bottom-start">
                <el-button size="small" type="primary" icon="el-icon-view" @click="scanHistory">{{ viewed ? "查看全部快递任务" : "查看今日的快递任务" }}</el-button>
              </el-tooltip>
            </div>
          </div>
        </el-row>
        <el-card :body-style="{padding:'0px'}" shadow="always">
          <el-table
            ref="tableData"
            :data="tableData"
            :height="tableHeight"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            :row-class-name="tableRowClassName"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            size="mini"
            style="width: 100%, font-size: 10px"
            :header-cell-style="{background:'#000',color: '#fff'}"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="快递任务单（默认显示今日的快递任务单）" align="center">
              <el-table-column type="selection" align="center" />
              <el-table-column
                type="index"
                label="序号"
                width="50"
                align="center"
              />
              <el-table-column v-if="false" label="id" prop="id" />
              <el-table-column label="快递单号" align="center" :show-overflow-tooltip="true" prop="expressDeliveryId" />
              <el-table-column label="发运订单号" align="center" :show-overflow-tooltip="true" prop="expressDeliveryId" />
              <el-table-column label="收货人" align="center" :show-overflow-tooltip="true" prop="receiverName" />
              <el-table-column label="收货人电话" align="center" :show-overflow-tooltip="true" prop="receiverNum" />
              <el-table-column label="收货人地址" align="center" :show-overflow-tooltip="true" prop="receiverAddress" />
              <el-table-column label="发货人" align="center" :show-overflow-tooltip="true" prop="shipperName" />
              <el-table-column label="发货人电话" align="center" :show-overflow-tooltip="true" prop="shipperNum" />
              <el-table-column label="发货人地址" align="center" :show-overflow-tooltip="true" prop="shipperAddress" />
              <el-table-column label="快递跟踪单号" align="center" :show-overflow-tooltip="true" prop="expressTraceId" />
              <el-table-column label="快递类型" align="center" :show-overflow-tooltip="true" prop="expressType" />
              <el-table-column label="快递公司" align="center" :show-overflow-tooltip="true" prop="expressCompamy" />
              <el-table-column label="毛重" align="center" :show-overflow-tooltip="true" prop="weight" />
              <el-table-column label="长" align="center" :show-overflow-tooltip="true" prop="length" />
              <el-table-column label="宽" align="center" :show-overflow-tooltip="true" prop="wide" />
              <el-table-column label="高" align="center" :show-overflow-tooltip="true" prop="high" />
              <el-table-column label="数量" align="center" :show-overflow-tooltip="true" prop="cnt" />
              <el-table-column label="体积" align="center" :show-overflow-tooltip="true" prop="volumn" />
            </el-table-column>
            <el-table-column
              fixed="right"
              prop="action"
              label="操作"
              align="center"
            >
              <template>
                <el-button-group>
                  <el-button size="mini" type="success">打印条码</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          />
        </el-card>
      </el-col>
      <el-col v-show="showRight" :span="spanRight">
        <el-button-group>
          <el-tooltip class="item" effect="dark" content="返回toB客户订单页面" placement="bottom-start">
            <el-button type="warning" icon="el-icon-back" @click="goback">返回上一页</el-button>
          </el-tooltip>
        </el-button-group>
        <el-table
          :data="tabledatas"
          :row-class-name="tableRowClassDetailName"
          border
          size="mini"
          :row-style="{height:'20px'}"
          :cell-style="{padding:'0px'}"
          style="width: 100%, font-size: 10px"
        >
          <el-table-column type="selection" />
          <el-table-column v-if="false" label="id" :show-overflow-tooltip="true" prop="id" />
          <el-table-column type="index" label="序号" :show-overflow-tooltip="true" align="center" />
          <el-table-column label="sku代码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
          <el-table-column label="sku数量" align="center" :show-overflow-tooltip="true" prop="skuCnt" />
          <el-table-column label="sku条码" align="center" :show-overflow-tooltip="true" prop="skuBarCode" />
          <el-table-column label="sku单价" align="center" :show-overflow-tooltip="true" prop="skuPrice" />
          <el-table-column label="尺寸" align="center" :show-overflow-tooltip="true" prop="goodsSize" />
          <el-table-column label="颜色" align="center" :show-overflow-tooltip="true" prop="goodsColor" />
          <el-table-column label="供应商编号" align="center" :show-overflow-tooltip="true" prop="supplierNumber" />
          <el-table-column label="供应商名称" align="center" :show-overflow-tooltip="true" prop="supplierName" />
          <el-table-column label="生产厂家" align="center" :show-overflow-tooltip="true" prop="productCompany" />
          <el-table-column label="生产日期" align="center" :show-overflow-tooltip="true" prop="productTime" />
          <el-table-column label="生产批次" align="center" :show-overflow-tooltip="true" prop="productBatch" />
          <el-table-column label="跟踪号" align="center" :show-overflow-tooltip="true" prop="traceCode" />
        </el-table>
        <div class="pagContainer">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[2, 5]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { throttle } from '@/utils/throttle.js'
import { screenExpress, screenExpressNum, screenExpressDeliveryDetailSum, screenExpressDeliveryDetail, exportExpressDeliveryAndDetailExcel, exportExpressDeliveryAndDetailExcelSelect } from '@/api/user'
import elementResizeDetectorMaker from 'element-resize-detector'
var erd = elementResizeDetectorMaker()
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      currentDate1: null,
      currentDate: null,
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
      formSearch: {},
      formTitle: {
      },
      isRightAllButton: true,
      showLeft: true,
      showRight: false,
      spanLeft: 24,
      spanRight: 12,
      viewed: true,
      expressDeliveryId: null,
      multipleSelection: [],
      expands: [],
      listLoading: true,
      id: null,
      total: 0,
      tableHeight: 50,
      dialogTableVisible: false,
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 5, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      form: {
        expressTraceId: null,
        receiverName: null,
        shipperName: null,
        expressCompamy: null
      },
      rform: {
        traceCode: null,
        skuCode: null,
        skuBarCode: null,
        productCompany: null,
        productTime: null,
        productBatch: null
      },
      tableData: [],
      tabledatas: []
    }
  },
  mounted: function() {
    erd.listenTo(document.getElementById('btnAndSearch'), (element) => {
      var height = element.offsetHeight
      this.tableHeight = window.innerHeight - height - 90
    })
    erd.listenTo(document.getElementById('btnRight'), (element) => {
      var height = element.offsetHeight
      this.tableHeightRight = window.innerHeight - height - 122
    })
  },
  created() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    this.currentDate = `${year}-${month}-${day} 00:00:00`
    this.currentDate1 = `${year}-${month}-${day + 1} 00:00:00`
    this.getListScan()
  },
  methods: {
    scanHistory: throttle(function() {
      this.viewed = !this.viewed
      this.getListScan()
    }, 500, true),
    goback() {
      this.showRight = false
      this.showLeft = true
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleChange(val) {
      console.log(val)
    },
    expandChange(row, expandedRows) {
      this.expands = []
      if (expandedRows.length > 0) {
        row ? this.expands.push(row.id) : ''
        this.id = row.id
        this.getListDetails(this.pagesize, this.currentPage)
      }
    },
    changeadvanced() {
      this.advanced = !this.advanced
    },
    outExcel() {
      const data = {
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        }
      }
      exportExpressDeliveryAndDetailExcel(data).then((res) => {
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `快递单.xls`)
        document.body.appendChild(a)
        a.click()
        url = window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
    },
    outSelfExcel() {
      if (this.multipleSelection.length) {
        this.$confirm('是否确认导出所选单据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exportExpressDeliveryAndDetailExcelSelect(this.multipleSelection).then((res) => {
            let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.setAttribute('download', `快递单.xls`)
            document.body.appendChild(a)
            a.click()
            url = window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
          })
        })
      } else {
        this.$message({
          message: '请选择至少一条快递任务',
          type: 'warning'
        })
      }
    },
    refresh() {
      this.reload()
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    clear() {
      this.expressDeliveryId = null
      this.form = {
        expressTraceId: null,
        receiverName: null,
        shipperName: null,
        expressCompamy: null
      }
      this.getList()
    },
    search() {
      this.listQuery.page = 1
      this.labelTitle = '快递任务单-查询结果'
      this.getList()
    },
    searchDeatils() {
      this.getListDetails(this.pagesize, this.currentPage)
      this.clearDetails()
      this.dialogTableVisible = false
    },
    clearDetails() {
      this.rform = {
        traceCode: null,
        skuCode: null,
        skuBarCode: null,
        productCompany: null,
        productTime: null,
        productBatch: null
      }
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.listLoading = true
      screenExpressDeliveryDetail({ searchDTO,
        pojo: {
          expressDeliveryId: this.id,
          skuBarCode: this.rform.skuBarCode,
          skuCode: this.rform.skuCode,
          productCompany: this.rform.productCompany,
          productTime: this.rform.productTime,
          productBatch: this.rform.productBatch
        }}).then(response => {
        this.tabledatas = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenExpressDeliveryDetailSum({ searchDTO,
        pojo: {
          expressDeliveryId: this.id,
          skuBarCode: this.rform.skuBarCode,
          skuCode: this.rform.skuCode,
          productCompany: this.rform.productCompany,
          productTime: this.rform.productTime,
          productBatch: this.rform.productBatch
        }}).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getListDetails(val, 1)
      this.currentPage = 1
    },
    // 显示第几页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getListDetails(this.pagesize, val)
    },
    getList() {
      this.listLoading = true
      screenExpress({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
      }}).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenExpressNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
      }}).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getListScan() {
      if (this.viewed === false) {
        screenExpress({ searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        }}).then(response => {
          this.tableData = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
        screenExpressNum({ searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        }}).then(response => {
          this.total = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      } else {
        screenExpress({ searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        },
        startTime: this.currentDate,
        endTime: this.currentDate1
        }).then(response => {
          this.tableData = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
        screenExpressNum({ searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        },
        startTime: this.currentDate,
        endTime: this.currentDate1
        }).then(response => {
          this.total = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      }
    },
    add() {
      this.$router.push('expresslist')
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      // 去重获取被选中的id值存入到数组中
      for (let i = 0; i < val.length; i++) {
        if (this.multipleSelection.indexOf(val[i].id) === -1) {
          this.multipleSelection.push({ id: val[i].id })
        }
      }
      console.log(this.multipleSelection)
    }
  }
}
</script>

<style>
.el-table .d-row{
  background: rgb(194, 45, 45);
}
.el-table .o-row{
  background: #bbca4a;
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
  color:#fff;
padding: 5px;
}
 .el-form /deep/.el-form-item__label{
  color:rgb(0, 0, 0);
  font-weight: bold;
}
.search {
      margin: 1px;
      padding-top: 10px;
      background-color: rgb(255, 255, 255);
    }
  .btngroups {
    margin: 5px;
  }
    .pagContainer{
    background-color: rgb(75, 200, 175);
  }
  </style>
