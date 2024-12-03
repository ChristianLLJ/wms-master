<template>
  <div>
    <el-row>
      <el-col v-show="showLeft" :span="spanLeft">
        <el-row>
          <div id="btnAndSearch">
            <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
              <div class="search">
                <el-form :inline="true" :model="formSearch" label-width="120px">
                  <el-form-item label="车号">
                    <el-select v-model="formSearch.carNumber" placeholder="请选择车号" size="small" clearable>
                      <el-option />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="仓库">
                    <el-select v-model="formSearch.orderState" placeholder="请选择仓库名称" size="small" clearable>
                      <el-option size="small" style="width: 160px;" clearable />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="装车时间">
                    <el-date-picker
                      v-model="formSearch.time"
                      style="width: 260px;"
                      type="daterange"
                      size="small"
                      align="right"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions"
                    />
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
              <el-tooltip class="item" effect="dark" content="一键导出选中的装车任务单" placement="bottom-start">
                <el-button size="small" type="primary" icon="el-icon-export" @click="outSelfExcel">一键导出</el-button>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="选择显示装车任务的自定义字段" placement="bottom-start">
                <el-popover placement="bottom" width="400" trigger="click">
                  <el-checkbox-group v-model="colOptions">
                    <el-checkbox v-for="item in colSelect" :key="item" :label="item" />
                  </el-checkbox-group>
                  <el-button slot="reference" size="small" type="primary">显示自定义字段</el-button>
                </el-popover>
              </el-tooltip> -->
              <el-tooltip class="item" effect="dark" content="查看全部/今日的装车任务单" placement="bottom-start">
                <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed ? "查看全部装车任务" : "查看今日的装车任务" }}</el-button>
              </el-tooltip>
            </div>
          </div>
        </el-row>
        <el-card :body-style="{padding:'0px'}" shadow="always">
          <el-table
            ref="tableData"
            :height="tableHeight"
            :data="tableData"
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
            <el-table-column :label="labelTitle" align="center">
              <el-table-column type="selection" align="center" />
              <el-table-column
                type="index"
                label="序号"
                width="50"
                align="center"
              />
              <el-table-column v-if="false" label="id" prop="id" />
              <el-table-column label="装车单号" align="center" :show-overflow-tooltip="true" prop="loadId" />
              <el-table-column label="车号" align="center" :show-overflow-tooltip="true" prop="carNumber" />
              <el-table-column label="装车开始时间" align="center" :show-overflow-tooltip="true" prop="startTime">
                <template slot-scope="scope">{{ scope.row.startTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column label="装车完成时间" align="center" :show-overflow-tooltip="true" prop="endTime">
                <template slot-scope="scope">{{ scope.row.endTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column label="装车状态" align="center" :show-overflow-tooltip="true" prop="status" :formatter="stateFormat" />
              <el-table-column label="车型" align="center" :show-overflow-tooltip="true" prop="carType" :formatter="stateFormatCar" />
              <el-table-column label="司机" align="center" :show-overflow-tooltip="true" prop="driver" />
              <el-table-column label="装车人员" align="center" :show-overflow-tooltip="true" prop="loadPeople" />
              <el-table-column label="仓库" align="center" :show-overflow-tooltip="true" prop="warehouse" />
              <el-table-column label="体积限制" align="center" :show-overflow-tooltip="true" prop="volumeLimit" />
              <el-table-column label="重量限制" align="center" :show-overflow-tooltip="true" prop="weightLimit" />
              <el-table-column label="波次号" align="center" :show-overflow-tooltip="true" prop="waveId" />
              <el-table-column v-if="colData[0].istrue" label="用户自定义1" align="center" :show-overflow-tooltip="true" prop="userDefined1" />
              <el-table-column v-if="colData[1].istrue" label="用户自定义2" align="center" :show-overflow-tooltip="true" prop="userDefined2" />
              <el-table-column v-if="colData[2].istrue" label="用户自定义3" align="center" :show-overflow-tooltip="true" prop="userDefined3" />
              <el-table-column v-if="colData[3].istrue" label="用户自定义4" align="center" :show-overflow-tooltip="true" prop="userDefined4" />
            </el-table-column>
            <el-table-column
              width="150px"
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
          <el-table-column label="目标跟踪号" align="center" :show-overflow-tooltip="true" prop="traceCode" />
          <el-table-column label="路线" align="center" :show-overflow-tooltip="true" prop="route" />
          <el-table-column label="站点" align="center" :show-overflow-tooltip="true" prop="station" />
          <el-table-column label="客户姓名" align="center" :show-overflow-tooltip="true" prop="customName" />
          <el-table-column label="产品号" align="center" :show-overflow-tooltip="true" prop="productId" />
          <el-table-column label="收货人" align="center" :show-overflow-tooltip="true" prop="recerverName" />
          <el-table-column label="订单创建时间" align="center" :show-overflow-tooltip="true" prop="createTime">
            <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>

          </el-table-column>
          <el-table-column label="出库单号" align="center" :show-overflow-tooltip="true" prop="outCode" />
        </el-table>
        <div class="pagContainer">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[50, 100, 1000]"
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
import { changeAll } from '@/utils/statechange'
import { searchsystemid } from '@/utils/search'
import { screenLoading, screenLoadingNum, screenLoadingDetailSum, screenLoadingDetail, exportLoadingAndDetailExcel, exportLoadingAndDetailExcelSelect } from '@/api/user'
import elementResizeDetectorMaker from 'element-resize-detector'
var erd = elementResizeDetectorMaker()
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      currentDate1: null,
      currentDate: null,
      labelTitle: '装车任务单-今日的记录',
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
      optionsDes: [],
      optionsCar: [],
      laststateTime: 0,
      isRightAllButton: true,
      showLeft: true,
      showRight: false,
      spanLeft: 24,
      spanRight: 12,
      viewed: true,
      colData: [{ title: '用户自定义1', istrue: false },
        { title: '用户自定义2', istrue: false },
        { title: '用户自定义3', istrue: false },
        { title: '用户自定义4', istrue: false }],
      colOptions: [],
      colSelect: [],
      loadId: null,
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
        carNumber: null,
        carType: null,
        warehouse: null,
        waveId: null
      },
      rform: {
        traceCode: null,
        customName: null,
        productId: null,
        recerverName: null,
        outCode: null

      },
      tableData: [],
      tabledatas: [],
      laststateTimeCar: 0
    }
  },
  watch: {
    viewed: function(viewed) {
      switch (viewed) {
        case true:
          this.labelTitle = '装车任务单-进行中的记录'
          break
        case false:
          this.labelTitle = '装车任务单-所有记录'
      }
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
    // var _this = this
    // for (let i = 0; i < _this.colData.length; i++) {
    //   _this.colSelect.push(_this.colData[i].title)
    //   if (_this.colData[i].title === '用户自定义1' ||
    //   _this.colData[i].title === '用户自定义2' ||
    //   _this.colData[i].title === '用户自定义3' ||
    //   _this.colData[i].title === '用户自定义4') { // 初始化不想展示的列可以放在这个条件里
    //     continue
    //   }
    //   _this.colOptions.push(_this.colData[i].title)
    // }
  },
  methods: {
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid(6).then(res => {
          this.optionsDes = res.data
        })
        this.laststateTime = now
      } else {
        if ((now - this.laststateTime) > 5000) {
          this.laststateTime = now
        }
      }
      return changeAll(row.status, this.optionsDes)
    },
    stateFormatCar(row) {
      const now = new Date().valueOf()
      if (this.laststateTimeCar === 0) {
        searchsystemid(45).then(res => {
          this.optionsCar = res.data
        })
        this.laststateTimeCar = now
      } else {
        if ((now - this.laststateTimeCar) > 5000) {
          this.laststateTimeCar = now
        }
      }
      return changeAll(Number(row.carType), this.optionsCar)
    },
    goback() {
      this.showRight = false
      this.showLeft = true
    },
    scanHistory: throttle(function() {
      this.viewed = !this.viewed
      this.getListScan()
    }, 500, true),
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
    outExcel() {
      const data = {
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        }
      }
      exportLoadingAndDetailExcel(data).then((res) => {
        console.log(res)
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `出库装车单.xls`)
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
          exportLoadingAndDetailExcelSelect(this.multipleSelection).then((res) => {
            let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.setAttribute('download', `出库装车单.xls`)
            document.body.appendChild(a)
            a.click()
            url = window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
          })
        })
      } else {
        this.$message({
          message: '请选择至少一条装车任务',
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
      this.loadId = null
      this.form = {
        carNumber: null,
        carType: null,
        warehouse: null,
        waveId: null
      }
      this.getList()
    },
    search() {
      this.listQuery.page = 1
      this.labelTitle = '装车任务单-查询结果'
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
        customName: null,
        productId: null,
        recerverName: null,
        outCode: null
      }
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.listLoading = true
      screenLoadingDetail({ searchDTO,
        pojo: {
          loadId: this.id,
          customName: this.rform.customName,
          productId: this.rform.productId,
          recerverName: this.rform.recerverName,
          traceCode: this.rform.traceCode,
          outCode: this.rform.outCode
        }}).then(response => {
        this.tabledatas = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenLoadingDetailSum({ searchDTO,
        pojo: {
          loadId: this.id,
          customName: this.rform.customName,
          productId: this.rform.productId,
          recerverName: this.rform.recerverName,
          traceCode: this.rform.traceCode,
          outCode: this.rform.outCode
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
    getListScan() {
      if (this.viewed === false) {
        screenLoading({ searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        }
        }).then(response => {
          this.tableData = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
        screenLoadingNum({
          pojo: {
          }
        }).then(response => {
          this.total = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      } else {
        screenLoading({ searchDTO: {
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
        screenLoadingNum({
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
    getList() {
      this.listLoading = true
      screenLoading({ searchDTO: {
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
      screenLoadingNum({ searchDTO: {
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
    // add() {
    //   this.$router.push('loadinglist')
    // },
    handleSelectionChange(val) {
      this.multipleSelection = []
      // 去重获取被选中的id值存入到数组中
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

