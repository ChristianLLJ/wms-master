<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" label-width="120px" :model="form">
          <!-- <el-form-item label="冻结原因">
            <el-select v-model="form.freezeReason" size="small" placeholder="请选择">
              <el-option v-for="item in reasonOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="冻结状态">
            <el-select v-model="form.status" size="small" placeholder="请选择">
              <el-option v-for="item in stateOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="客户名称">
            <el-input v-model="form.customName" size="small" style="width: 160px;" placeholder="请输入客户名称" clearable />
          </el-form-item> -->
          <!-- <el-form-item label="创建人">
            <el-input v-model="form.freezePersonName" size="small" style="width: 160px;" placeholder="请输入" clearable />
          </el-form-item> -->
          <el-form-item label="释放人">
            <el-input v-model="form.releasePersonName" size="small" style="width: 160px;" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="审核人">
            <el-input v-model="form.checkPersonName" size="small" style="width: 160px;" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="冻结时间">
            <el-date-picker
              v-model="value1"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="small"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="释放时间">
            <el-date-picker
              v-model="value2"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="small"
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
              v-model="value3"
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
      <el-button size="small" icon="el-icon-plus" type="primary" @click="addList">新建库存冻结单</el-button>
      <!-- <el-button size="small" icon="el-icon-circle-plus-outline" type="success" @click="add">新增冻结记录</el-button> -->
      <!-- <el-button size="small" type="warning" icon="el-icon-download" @click="outExcel">导出</el-button> -->
      <el-button size="small" type="danger" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-table
      ref="tableData"
      :data="tableData"
      :height="tableHeight"
      border
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      :header-cell-style="{background:'#000',color: '#fff'}"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
      :header-cell-class-name="handleHeadAddClass"
      @sort-change="handleSortChange"
    >
      <el-table-column label="库存冻结单记录" align="center">
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
        />
        <el-table-column v-if="false" label="id" prop="id" />
        <el-table-column label="库存冻结单号" align="center" :show-overflow-tooltip="true" prop="freezeCode" />
        <!-- <el-table-column label="冻结方法" align="center" :show-overflow-tooltip="true" prop="freezeType" :formatter="typeFormat" /> -->
        <!-- <el-table-column label="客户名称" align="center" :show-overflow-tooltip="true" prop="customName" /> -->
        <el-table-column label="冻结原因" sortable="custom" align="center" :show-overflow-tooltip="true" prop="freezeReason" />
        <el-table-column v-if="false" label="是否冻结" align="center" :show-overflow-tooltip="true" prop="isFreeze" :formatter="isFormat" />
        <el-table-column label="冻结状态" sortable="custom" align="center" :show-overflow-tooltip="true" prop="status" :formatter="stateFormat" />
        <!-- <el-table-column label="创建人" sortable="custom" align="center" :show-overflow-tooltip="true" prop="freezePersonName" /> -->
        <el-table-column label="冻结时间" sortable="custom" align="center" :show-overflow-tooltip="true" prop="freezeTime">
          <template slot-scope="scope">{{ scope.row.freezeTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="释放时间" sortable="custom" align="center" :show-overflow-tooltip="true" prop="releaseTime">
          <template slot-scope="scope">{{ scope.row.releaseTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="释放人" sortable="custom" align="center" :show-overflow-tooltip="true" prop="releasePersonName" />
        <el-table-column label="审核人" sortable="custom" align="center" :show-overflow-tooltip="true" prop="checkPersonName" />
        <el-table-column label="审核时间" sortable="custom" align="center" :show-overflow-tooltip="true" prop="checkTime">
          <template slot-scope="scope">{{ scope.row.checkTime| dateYMDHMSFormat }}</template>
        </el-table-column>

        <el-table-column
          prop="action"
          label="操作"
          width="450px"
        >
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="primary">审核通过</el-button>
              <el-button size="mini" type="success">库存释放</el-button> -->
            <el-button v-if="scope.row.status === 1" size="mini" icon="el-icon-receive" type="primary" @click="audit(scope.row)">审核通过</el-button>
            <el-button v-if="scope.row.status === 1" size="mini" icon="el-icon-receive" type="danger" @click="unAudit(scope.row)">审核不通过</el-button>
            <el-button v-if="scope.row.status === 5" size="mini" icon="el-icon-receive" type="warning" @click="releaseFreeze(scope.row)">库存释放</el-button>
            <el-button size="mini" icon="el-icon-view" type="success" @click="rowdbClick(scope.row)">详细记录</el-button>
            <!-- <el-button size="mini" type="danger" @click="delect(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
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
import { searchStockFreezeSelective, searchInventoryBalanceSelective, releaseFreeze, stockFreezeUnAudit, stockFreezeAudit, submitFreezeAndDetail, searchStockFreezeNum, deleteFreezeAndDetail, exportStockFreezeAndDetailExcel } from '@/api/user'
import { searchsystemid } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      multipleSelection: [],
      expands: [],
      reasonOptions: [],
      stateOptions: [],
      screen: '',
      sortField: {},
      freezeCode: null,
      freezeType: null,
      freezeReason: null,
      tableResultData: [],
      advanced: false,
      lasttypeTime: 0,
      typeOptions: [],
      tableLoading: true,
      listLoading: true,
      id: null,
      total: 0,
      tableHeight: 50,
      dialogTableVisible: false,
      dialogTableResultVisible: false,
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
      value3: '',
      lastreasonTime: 0,
      laststateTime: 0,
      form: {
        freezeReason: null,
        freezePersonName: null,
        customName: null,
        releasePersonName: null,
        checkPersonName: null
      },
      tableData: [],
      tabledatas: []
    }
  },
  created() {
    this.getList()
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
  methods: {
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
    releaseFreeze(row) {
      this.$confirm('确认库存释放吗吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.checkPersonId = sessionStorage.getItem('getUserId')
        releaseFreeze({
          id: row.id,
          releasePersonId: Number(sessionStorage.getItem('getUserId')) }).then(res => {
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
    unAudit(row) {
      this.$confirm('确认该任务不通过审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.checkPersonId = sessionStorage.getItem('getUserId')
        stockFreezeUnAudit({
          id: row.id,
          status: row.status,
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
    audit(row) {
      this.$confirm('确认该任务通过审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.checkPersonId = sessionStorage.getItem('getUserId')
        stockFreezeAudit({
          id: row.id,
          status: row.status,
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
    rowdbClick(row) {
      sessionStorage.setItem('freezeChildId', row.id)
      sessionStorage.setItem('freezeId', row.freezeCode)
      this.$router.push({ path: '/freezetotal' })
    },
    typeFormat(row) {
      const now = new Date().valueOf()
      if (this.lasttypeTime === 0) {
        searchsystemid('STOCK_CHANGE_TYPE').then(res => {
          this.typeOptions = res.data
        })
        this.lasttypeTime = now
      } else {
        if ((now - this.lasttypeTime) > 5000) {
          this.lasttypeTime = now
        }
      }
      return changeAll(row.freezeType, this.typeOptions)
    },
    async freeze() {
      let res
      try {
        res = await submitFreezeAndDetail({ freezeDetailList: this.tableResultData, stockFreeze: {
          freezeReason: this.freezeReason,
          freezeType: this.rform.freezeType,
          freezePersonName: sessionStorage.getItem('getUserName')
        }})
      } catch (err) {
        res = err
      }
      if (res.code === 200) {
        this.$message.success('提交成功')
        this.reload()
      }
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
      return changeAll(row.status, this.stateOptions)
    },
    reasonFormat(row) {
      const now = new Date().valueOf()
      if (this.lastreasonTime === 0) {
        searchsystemid('FREEZE_REASON').then(res => {
          this.reasonOptions = res.data
        })
        this.lastreasonTime = now
      } else {
        if ((now - this.lastreasonTime) > 5000) {
          this.lastreasonTime = now
        }
      }
      return changeAll(row.freezeReason, this.reasonOptions)
    },
    isFormat(row) {
      if (row.isFreeze === 0) {
        return '否'
      } else if (row.isFreeze === 1) {
        return '是'
      }
    },
    changeadvanced() {
      this.advanced = !this.advanced
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
    search() {
      this.getList()
    },
    outExcel() {
      const data = {
        // searchDTO: {
        //   page: this.listQuery.page,
        //   num: this.listQuery.limit
        // },
        pojo: {
          freezeReason: this.form.freezeReason,
          freezePersonName: this.form.freezePersonName,
          customName: this.form.customName,
          releasePersonName: this.form.releasePersonName,
          checkPersonName: this.form.checkPersonName
        },
        screen: this.screen,
        startTime: this.value1[0],
        endTime: this.value1[1],
        startTime1: this.value2[0],
        endTime1: this.value2[1]
      }
      exportStockFreezeAndDetailExcel(data).then((res) => {
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `库存冻结单`)
        document.body.appendChild(a)
        a.click()
        url = window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
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
        deleteFreezeAndDetail({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.reload()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '删除失败'
        })
      })
    },
    getList() {
      this.listLoading = true
      searchStockFreezeSelective({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        freezeReason: this.form.freezeReason,
        freezePersonName: this.form.freezePersonName,
        customName: this.form.customName,
        releasePersonName: this.form.releasePersonName,
        checkPersonName: this.form.checkPersonName
      },
      screen: this.screen,
      startTime: this.value1[0],
      endTime: this.value1[1],
      startTime1: this.value2[0],
      endTime1: this.value2[1]
      }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      searchStockFreezeNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        freezeReason: this.form.freezeReason,
        freezePersonName: this.form.freezePersonName,
        customName: this.form.customName,
        releasePersonName: this.form.releasePersonName,
        checkPersonName: this.form.checkPersonName
      },
      screen: this.screen,
      startTime: this.value1[0],
      endTime: this.value1[1],
      startTime1: this.value2[0],
      endTime1: this.value2[1]
      }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    addList() {
      this.$router.push('/freezelist')
    }
    // add() {
    //   this.dialogTableVisible = true
    // }
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
 .pagContainer{
    background-color: rgb(75, 200, 175);
  }
  </style>
  <style lang="scss" scoped>
           // 修改对话框高度
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
