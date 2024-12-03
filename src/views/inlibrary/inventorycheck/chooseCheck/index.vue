<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" label-width="120px" :model="form">
          <el-form-item label="盘点类型">
            <el-select
              v-model="form.inventoryType"
              filterable
              clearable
              reserve-keyword
              size="small"
            >
              <el-option v-for="item in checkOptions" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="库存盘点单状态">
            <el-select v-model="form.inventoryState" size="small" placeholder="请选择">
              <el-option v-for="item in stateOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item>
          <el-form-item label="盘点人">
            <el-input v-model="form.inventoryPersonName" size="small" style="width: 160px;" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="盘点日期">
            <el-date-picker
              v-model="value1"
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
          <el-form-item label="审核人">
            <el-input v-model="form.checkPersonName" size="small" style="width: 160px;" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="审核日期">
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
          </el-form-item>
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
      <el-button size="small" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
      <el-button size="small" type="danger" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <!-- <el-button size="small" type="warning" icon="el-icon-download" @click="outExcel">导出</el-button> -->
    </div>
    <el-table
      ref="tableData"
      :data="tableData"
      :height="tableHeight"
      :row-key="getRowKeys"
      border
      :expand-row-keys="expands"
      :header-cell-style="{background:'#000',color: '#fff'}"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
      :header-cell-class-name="handleHeadAddClass"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column v-if="false" label="id" prop="id" />
      <el-table-column label="盘点单号" width="180px" align="center" :show-overflow-tooltip="true" prop="inventoryCode" />
      <el-table-column label="盘点类型" sortable="custom" align="center" :show-overflow-tooltip="true" prop="inventoryType" :formatter="typeFormat" />
      <el-table-column label="盘点单状态" sortable="custom" align="center" :show-overflow-tooltip="true" prop="inventoryState" :formatter="stateFormat" />
      <el-table-column label="盘点日期" sortable="custom" align="center" :show-overflow-tooltip="true" prop="applyTime">
        <template slot-scope="scope">{{ scope.row.applyTime| dateYMDHMSFormat }}</template>
      </el-table-column>
      <el-table-column label="盘点人" sortable="custom" align="center" :show-overflow-tooltip="true" prop="inventoryPersonName" />
      <el-table-column label="盘点结果" sortable="custom" align="center" :show-overflow-tooltip="true" prop="inventoryDes" />
      <el-table-column label="盘点结论" sortable="custom" align="center" :show-overflow-tooltip="true" prop="inventoryDes" />
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
          <!-- <el-button size="mini" type="primary">生成盘盈入库单</el-button>
                  <el-button size="mini" type="warning">生成盘亏出库单</el-button>
                  <el-button size="mini" type="success">打印条码</el-button> -->
          <el-button size="mini" icon="el-icon-receive" type="success" @click="audit(scope.row)">审核通过</el-button>
          <el-button size="mini" icon="el-icon-receive" type="danger" @click="unAudit(scope.row)">审核不通过</el-button>
          <el-button size="mini" icon="el-icon-view" type="primary" @click="scanResult(scope.row)">详细结果</el-button>
        </template>
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
// import checkdetails from '@/views/details/checkdetails'
import { searchStockInventorySelective, searchStockInventoryNum, stockInventoryUnAudit, stockInventoryAudit, deleteStockInventoryAndDetail, exportStockInventoryAndDetailExcel } from '@/api/user'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      multipleSelection: [],
      chooseData: [],
      expands: [],
      locDialogVisible: false,
      screen: '',
      sortField: {},
      form: {
        inventoryState: null,
        inventoryType: null,
        inventoryPersonName: null,
        checkPersonName: null
      },
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
      warehouseName: null,
      dialogTableVisible: false,
      formLabelWidth: '120px',
      startData: [],
      listLoading: true,
      checkOptions: [{
        value: 2,
        label: '指定库位盘点'
      },
      {
        value: 3,
        label: '指定日期盘点'
      },
      {
        value: 4,
        label: '当日盘点'
      }
      ],
      tableHeight: 50,
      lasttypeTime: 0,
      laststateTime: 0,
      typeOptions: [],
      stateOptions: [],
      min1: null,
      max1: null,
      tableLoading: true,
      tabledatas: [],
      total: 0,
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 5, // 每页显示的条数
      advanced: false,
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      inventoryType: null,
      inventoryState: null,
      tableData: []
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
    this.min1 = 2
    this.max1 = 4
    this.getList()
  },
  methods: {
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid('STOCK_INVENTORY_STATE').then(res => {
          this.stateOptions = res.data
        })
        this.laststateTime = now
      } else {
        if ((now - this.laststateTime) > 5000) {
          this.laststateTime = now
        }
      }
      return changeAll(row.inventoryState, this.stateOptions)
    },
    audit(row) {
      this.$confirm('确认该任务通过审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.checkPersonId = sessionStorage.getItem('getUserId')
        stockInventoryAudit({
          id: row.id,
          inventoryState: row.inventoryState,
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
        stockInventoryUnAudit({
          id: row.id,
          inventoryState: row.inventoryState,
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
    scanResult(row) {
      sessionStorage.setItem('checkChildId', row.id)
      sessionStorage.setItem('checkOrderId', row.id)
      this.$router.push({ path: '/checktotal' })
    },
    clickSelect(val) {
      this.chooseData = val
    },
    typeFormat(row) {
      const now = new Date().valueOf()
      if (this.lasttypeTime === 0) {
        searchsystemid('STOCK_INVENTORY_TYPE').then(res => {
          this.typeOptions = res.data
        })
        this.lasttypeTime = now
      } else {
        if ((now - this.lasttypeTime) > 5000) {
          this.lasttypeTime = now
        }
      }
      return changeAll(row.inventoryType, this.typeOptions)
    },
    search() {
      this.getList()
    },
    refresh() {
      this.reload()
    },
    outExcel() {
      const data = {
        // searchDTO: {
        //   page: this.listQuery.page,
        //   num: this.listQuery.limit
        // },
        pojo: {
          inventoryPersonName: this.form.inventoryPersonName,
          inventoryType: 1,
          inventoryState: this.form.inventoryState,
          checkPersonName: this.form.checkPersonName
        },
        screen: this.screen, startTime: this.value1[0],
        endTime: this.value1[1], startTime1: this.value2[0], endTime1: this.value2[1] }

      exportStockInventoryAndDetailExcel(data).then((res) => {
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `库存盘点单.xlsx`)
        document.body.appendChild(a)
        a.click()
        url = window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
    },
    // 单个删除
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStockInventoryAndDetail({ id: row.id }).then(res => {
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
      searchStockInventorySelective({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        inventoryPersonName: this.form.inventoryPersonName,
        inventoryState: this.form.inventoryState,
        inventoryType: this.form.inventoryType,
        checkPersonName: this.form.checkPersonName
      },
      min1: this.min1,
      max1: this.max1,
      screen: this.screen, startTime: this.value1[0],
      endTime: this.value1[1], startTime1: this.value2[0], endTime1: this.value2[1] }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      searchStockInventoryNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        inventoryPersonName: this.form.inventoryPersonName,
        inventoryType: this.form.inventoryType,
        inventoryState: this.form.inventoryState,
        checkPersonName: this.form.checkPersonName
      },
      min: this.min,
      max: this.max,
      screen: this.screen, startTime: this.value1[0],
      endTime: this.value1[1], startTime1: this.value2[0], endTime1: this.value2[1] }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    add() {
      this.$router.push('/checklist')
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
    .btngroups {
     margin: 5px;
    }
             .el-form /deep/.el-form-item__label{
      color:rgb(0, 0, 0)
    }
      </style>
      <style lang="scss" scoped>
        // 修改对话框高度
          .stock_code {
            ::v-deep.el-dialog {
              margin: 10px auto !important;
              height: 80%;
              overflow: hidden;
              background-color: #091f2cee;
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
        </style>

