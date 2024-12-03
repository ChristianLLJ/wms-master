<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" label-width="120px" :model="form">
          <el-form-item label="库存调整单状态">
            <el-select v-model="form.changeState" size="small" placeholder="请选择">
              <el-option v-for="item in stateOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="库存调整原因">
            <el-select v-model="form.changeReason" size="small" placeholder="请选择">
              <el-option v-for="item in reasonOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="客户名称">
            <el-input v-model="form.customName" size="small" style="width: 160px;" placeholder="请输入客户名称" clearable />
          </el-form-item>
          <el-form-item label="仓库" :label-width="formLabelWidth">
            <el-select v-model="form.warehouseName" size="small" @focus="func">
              <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="申请人">
            <el-input v-model="form.changePersonName" size="small" style="width: 160px;" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="审核人">
            <el-input v-model="form.checkPersonName" size="small" style="width: 160px;" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="value1"
              type="daterange"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <!-- <el-form-item label="审核时间">
            <el-date-picker
              v-model="value2"
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
            <el-button type="success" round icon="el-icon-search" size="small" @click="search()">搜索</el-button>
            <el-tooltip class="item" effect="dark" content="将满足筛选条件的单据导出" placement="bottom">
              <el-button type="primary" round icon="el-icon-export" size="small" @click="outExcel">筛选导出</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>

      </div>
    </el-card>
    <div class="btngroups">
      <el-button size="small" icon="el-icon-plus" type="primary" @click="addList">新增库存调整单</el-button>
      <!-- <el-button size="small" icon="el-icon-circle-plus-outline" type="success" @click="add">库存调整</el-button> -->
      <!-- <el-button size="small" type="warning" icon="el-icon-download" @click="outExcel">导出</el-button> -->
      <el-button size="small" type="danger" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>

    <el-dialog v-drag title="调整筛选" :visible.sync="dialogTableVisible" width="60%" class="showAll_dialog2">
      <query-data :rform="rform" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
      </div>
    </el-dialog>
    <el-dialog v-drag title="筛选结果" :visible.sync="dialogTableResultVisible" width="80%" class="showAll_dialog">
      <Changetable
        :table-data="tableResultData"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">调整</el-button>
      </div>
    </el-dialog>
    <el-table
      ref="tableData"
      :data="tableData"
      :height="tableHeight"
      border
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      :row-class-name="tableRowClassName"
      :header-cell-style="{background:'#000',color: '#fff'}"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
      :header-cell-class-name="handleHeadAddClass"
      @expand-change="expandChange"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column label="库存调整单记录" align="center">
        <el-table-column type="selection" align="center" />
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
        />
        <el-table-column v-if="show" label="id" prop="id" />
        <el-table-column label="库存调整单号" align="center" :show-overflow-tooltip="true" prop="changeCode" />
        <el-table-column prop="changeState" sortable="custom" label="库存调整单状态" align="center" :formatter="stateFormat" />
        <!-- <el-table-column label="客户名称" sortable="custom" align="center" :show-overflow-tooltip="true" prop="customName" /> -->
        <el-table-column label="创建时间" sortable="custom" align="center" :show-overflow-tooltip="true" prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <!-- <el-table-column label="仓库名称" sortable="custom" align="center" :show-overflow-tooltip="true" prop="warehouseName" /> -->
        <el-table-column label="调整原因" sortable="custom" align="center" :show-overflow-tooltip="true" prop="changeReason" />
        <el-table-column label="申请人" sortable="custom" align="center" :show-overflow-tooltip="true" prop="changePersonName" />
        <el-table-column label="审核人" sortable="custom" align="center" :show-overflow-tooltip="true" prop="checkPersonName" />
        <el-table-column label="审核时间" sortable="custom" align="center" :show-overflow-tooltip="true" prop="checkTime">
          <template slot-scope="scope">{{ scope.row.checkTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column
          width="350px"
          prop="action"
          label="操作"
        >
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="primary">审核通过</el-button>
              <el-button size="mini" type="warning">取消调整</el-button> -->
            <el-button v-if="scope.row.changeState === 1" size="mini" icon="el-icon-receive" type="primary" @click="audit(scope.row)">审核通过</el-button>
            <el-button v-if="scope.row.changeState === 1" size="mini" icon="el-icon-receive" type="danger" @click="unAudit(scope.row)">审核不通过</el-button>
            <el-button size="mini" icon="el-icon-view" type="success" @click="rowdbClick(scope.row)">详细记录</el-button>
            <!-- <el-button size="mini" icon="el-icon-delete" type="danger" @click="delect(scope.row)">删除</el-button> -->
          </template></el-table-column>
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
import { searchsystemid } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
import Changetable from '../../../components/ChangeTable'
import QueryData from './component/QueryData'
import { searchStockChangeSelective, selectWarehouse, stockChangeAudit, stockChangeUnAudit, searchInventoryBalanceSelective, searchStockChangeNum, deleteStockChangeAndDetail, searchStockChangeDetailNum, searchStockChangeDetailSelective, exportStockChangeAndDetailExcel } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination, Changetable, QueryData },
  data() {
    return {
      multipleSelection: [],
      changeReason: null,
      reasonOptions: [],
      stateOptions: [],
      expands: [],
      changeCode: null,
      screen: '',
      sortField: {},
      show: false,
      advanced: false,
      laststateTime: 0,
      options: [],
      listLoading: true,
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
      rform: {
        warehouseName: null,
        areaName: null,
        commodityName: null,
        locationName: null,
        skuName: null,
        traceCode: null,
        customName: null,
        productBatch: null
      },
      form: {
        warehouseName: null,
        changeState: null,
        changeReason: null,
        changePersonName: null,
        checkPersonName: null
      },
      dialogTableResultVisible: false,
      tableData: [],
      tableResultData: [],
      warehouseOptions: [],
      lastTime: 0,
      lastreasonTime: 0,
      tabledatas: []
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tableData.$el.offsetTop - 82

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tableData.$el.offsetTop - 82
      }
    })
  },
  created() {
    this.getList()
  },
  methods: {
    func() {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        selectWarehouse({
          pojo: {
          }}).then(res => {
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
    handleSortChange({ order, prop }) {
      // 触发的排序和缓存的排序相同时，取消该字段的排序
      this.screen = ''
      // this.screenNull = ''
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
      // this.screen = this.screenNull
      this.getList() // 调用后端查询接口
    },
    handleHeadAddClass({ column }) {
      if (this.sortField[column.property]) {
        column.order = this.sortField[column.property]
      }
    },
    audit(row) {
      this.$confirm('确认该任务通过审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.checkPersonId = sessionStorage.getItem('getUserId')
        stockChangeAudit({
          id: row.id,
          changeState: row.changeState,
          checkPersonId: Number(sessionStorage.getItem('getUserId')) }).then(res => {
          if (res.code === 200) {
            this.reload()
            this.$message.success('已通过')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    unAudit(row) {
      this.$confirm('确认该任务不通过审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.checkPersonId = sessionStorage.getItem('getUserId')
        stockChangeUnAudit({
          id: row.id,
          changeState: row.changeState,
          checkPersonId: Number(sessionStorage.getItem('getUserId')) }).then(res => {
          if (res.code === 200) {
            this.reload()
            this.$message.success('已完成')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    searchData() {
      this.dialogTableVisible = false
      this.dialogTableResultVisible = true
      searchInventoryBalanceSelective({ searchDTO: {
        page: 1,
        num: 100
      },
      pojo: {
        warehouseName: this.rform.warehouseName,
        areaName: this.rform.areaName,
        commodityName: this.rform.commodityName,
        locationName: this.rform.locationName,
        skuName: this.rform.skuName,
        traceCode: this.rform.traceCode,
        customName: this.rform.customName,
        productBatch: this.rform.productBatch
      }}).then(response => {
        this.tableResultData = response.data
      })
    },
    changeadvanced() {
      this.advanced = !this.advanced
    },
    rowdbClick(row) {
      sessionStorage.setItem('changeChildId', row.id)
      sessionStorage.setItem('changeCode', row.changeCode)
      this.$router.push({ path: '/changetotal' })
    },
    expandChange(row, expandedRows) {
      this.expands = []
      if (expandedRows.length > 0) {
        row ? this.expands.push(row.id) : ''
        this.id = row.id
        this.getListDetails(this.pagesize, this.currentPage)
      }
    },
    clear() {
      this.changeCode = null
      this.changeState = null
      this.customName = null
      this.warehouseName = null
    },
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid('STOCK_CHANGE_STATE').then(res => {
          this.stateOptions = res.data
        })
        this.laststateTime = now
      } else {
        if ((now - this.laststateTime) > 5000) {
          this.laststateTime = now
        }
      }
      return changeAll(row.changeState, this.stateOptions)
    },
    search() {
      this.getList()
    },
    // searchDeatils() {
    //   this.getListDetails(this.pagesize, this.currentPage)
    //   this.clearDetails()
    //   this.dialogTableVisible = false
    // },
    outExcel() {
      const data = {
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
          changeState: this.form.changeState,
          customName: this.form.customName,
          warehouseName: this.form.warehouseName,
          changePersonName: this.form.changePersonName,
          checkPersonName: this.form.checkPersonName
        },
        screen: this.screen, startTime: this.value1[0],
        endTime: this.value1[1]
      }
      exportStockChangeAndDetailExcel(data).then((res) => {
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `库存调整单`)
        document.body.appendChild(a)
        a.click()
        url = window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
    },
    // clearDetails() {
    //   this.rform = {
    //     customName: null,
    //     skuCode: null,
    //     commodityName: null,
    //     traceCode: null,
    //     packageCode: null,
    //     locationCode: null
    //   }
    // },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      searchStockChangeDetailSelective({ searchDTO,
        pojo: {
          changeId: this.id,
          customName: this.rform.customName,
          skuCode: this.rform.skuCode,
          commodityName: this.rform.commodityName,
          traceCode: this.rform.traceCode,
          packageCode: this.rform.packageCode,
          locationCode: this.rform.locationCode
        },
        screen: this.screen }).then(response => {
        this.tabledatas = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      searchStockChangeDetailNum({ searchDTO,
        pojo: {
          changeId: this.id,
          customName: this.rform.customName,
          skuCode: this.rform.skuCode,
          commodityName: this.rform.commodityName,
          traceCode: this.rform.traceCode,
          packageCode: this.rform.packageCode,
          locationCode: this.rform.locationCode
        },
        screen: this.screen }).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
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
    tableRowClassName({ row, rowIndex }) {
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
    refresh() {
      this.reload()
    },
    // 单个删除
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStockChangeAndDetail({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.reload()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getList() {
      this.listLoading = true
      searchStockChangeSelective({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        changeState: this.form.changeState,
        customName: this.form.customName,
        warehouseName: this.form.warehouseName,
        changePersonName: this.form.changePersonName,
        checkPersonName: this.form.checkPersonName
      },
      screen: this.screen, startTime: this.value1[0],
      endTime: this.value1[1] }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      searchStockChangeNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        changeState: this.form.changeState,
        customName: this.form.customName,
        warehouseName: this.form.warehouseName,
        changePersonName: this.form.changePersonName,
        checkPersonName: this.form.checkPersonName
      },
      screen: this.screen, startTime: this.value1[0],
      endTime: this.value1[1] }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    add() {
      this.dialogTableVisible = true
    },
    addList() {
      this.$router.push('/changelist')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

  <style scoped>
  .search {
    margin: 1px;
    padding-top: 10px;
  }
     .el-form /deep/.el-form-item__label{
    color:rgb(0, 0, 0)
  }
  .btngroups {
    margin: 5px;
  }
    .pagContainer{
    background-color: rgb(75, 200, 175);
  }
  </style>
   <style lang="scss" scoped>
  .showAll_dialog2 {
    ::v-deep.el-dialog {
      margin: 100px auto !important;
      overflow: hidden;
      height: 60%;
      border: #fff 1px solid;
       box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
    0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);
      background-color: #091f2c;

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
  .showAll_dialog {
              .listTable {
                margin-top:2px;
                margin-bottom: 2px;
                span {
                  color:#fff
                }
              }
               ::v-deep.el-dialog {
                 margin: 20px auto !important;
                 overflow: hidden;
                 height: 90%;
                 border: #fff 1px solid;
                  box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
               0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);
                 background-color: #091f2c;

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
  </style>
