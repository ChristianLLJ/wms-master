<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" label-width="120px" :model="form">
          <el-form-item label="库存移动单状态">
            <el-select v-model="form.status" size="small" placeholder="请选择">
              <el-option v-for="item in stateOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="库存移动单类型">
            <el-select v-model="form.type" size="small" placeholder="请选择">
              <el-option v-for="item in typeOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="上架库位">
            <el-select
              v-model="form.locationName"
              filterable
              size="small"
              clearable
              remote
              reserve-keyword
              placeholder="请输入库位名称"
              :remote-method="funcLL"
            >
              <el-option v-for="item in locationOptions" :key="item.id" :label="item.locationName" :value="item.locationName" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="创建人">
            <el-input v-model="form.createPeople" size="small" style="width: 160px;" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="审核人">
            <el-input v-model="form.checkPersonName" size="small" style="width: 160px;" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="创建时间">
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
          <!-- <el-form-item label="移库时间">
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
          <el-form-item label="审核时间">
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
            <el-button type="primary" round icon="el-icon-search" size="small" @click="search()">搜索</el-button>
            <el-tooltip class="item" effect="dark" content="将满足筛选条件的单据导出" placement="bottom">
              <el-button type="primary" round icon="el-icon-export" size="small" @click="outExcel">筛选导出</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="btngroups">
      <el-button size="small" icon="el-icon-plus" type="primary" @click="addList">新建库存移动单</el-button>
      <!-- <el-button size="small" icon="el-icon-circle-plus-outline" type="success" @click="add">库存移动</el-button> -->
      <!-- <el-button size="small" type="warning" icon="el-icon-download" @click="outExcel">导出</el-button> -->
      <el-button size="small" type="danger" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>

    <el-dialog v-drag title="移动筛选" :visible.sync="dialogTableVisible" width="60%" class="showAll_dialog2">
      <query-data :rform="rform" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
      </div>
    </el-dialog>
    <el-dialog v-drag title="筛选结果" :visible.sync="dialogTableResultVisible" width="80%" class="showAll_dialog">
      <div class="listTable">
        <el-row>
          <el-col :span="6">
            <span>移库原因</span>
            <el-select v-model="reasonCode" placeholder="请选择移库原因" @focus="funcReason">
              <el-option v-for="item in reasonOptions" :key="item.id" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-col>
        </el-row>
      </div>
      <QueryTable
        :table-data="tableResultData"
        :data-list-selections="dataListSelections"
        @clickSelect="clickSelect"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">移动</el-button>
      </div>
    </el-dialog>
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
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="库存移动单记录" align="center">
        <el-table-column type="selection" align="center" />
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
        />
        <el-table-column v-if="false" label="id" prop="id" />
        <el-table-column label="库存移动单号" align="center" :show-overflow-tooltip="true" prop="moveCode" />
        <el-table-column v-if="false" label="来源单号" align="center" :show-overflow-tooltip="true" prop="sourceId" />
        <el-table-column label="库存移动单状态" sortable="custom" align="center" :show-overflow-tooltip="true" prop="status" :formatter="stateFormat" />
        <!-- <el-table-column label="库存移动单类型" sortable="custom" align="center" :show-overflow-tooltip="true" prop="type" :formatter="typeFormat" /> -->
        <!-- <el-table-column label="货主代码" align="center" :show-overflow-tooltip="true" prop="salerId" /> -->
        <el-table-column label="创建时间" sortable="custom" align="center" :show-overflow-tooltip="true" prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <!-- <el-table-column label="移库时间" sortable="custom" align="center" :show-overflow-tooltip="true" prop="moveTime">
          <template slot-scope="scope">{{ scope.row.moveTime| dateYMDHMSFormat }}</template>
        </el-table-column> -->
        <!-- <el-table-column label="原因代码" sortable="custom" align="center" :show-overflow-tooltip="true" prop="reasonCode" :formatter="reasonFormat" /> -->
        <el-table-column label="原因描述" sortable="custom" align="center" :show-overflow-tooltip="true" prop="moveReason" />
        <!-- <el-table-column label="来源库位代码" sortable="custom" align="center" :show-overflow-tooltip="true" prop="sourceWarehouseCode" /> -->
        <!-- <el-table-column label="目标库位代码" sortable="custom" align="center" :show-overflow-tooltip="true" prop="targetWarehouseCode" /> -->
        <!-- <el-table-column label="上架库位代码" sortable="custom" align="center" :show-overflow-tooltip="true" prop="putLocationCode" /> -->
        <!-- <el-table-column label="创建人" sortable="custom" align="center" :show-overflow-tooltip="true" prop="movePeopleName" /> -->
        <!-- <el-table-column label="备注" align="center" :show-overflow-tooltip="true" prop="remarks" /> -->
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
            <el-button v-if="scope.row.status === 1" size="mini" icon="el-icon-receive" type="primary" @click="audit(scope.row)">审核通过</el-button>
            <el-button v-if="scope.row.status === 1" size="mini" icon="el-icon-receive" type="danger" @click="unAudit(scope.row)">审核不通过</el-button>
            <el-button size="mini" type="success" icon="el-icon-view" @click="rowdbclick(scope.row)">详细记录</el-button>
            <!-- <el-button size="mini" icon="el-icon-edit" type="primary" @click="edit(scope.row)">修改</el-button> -->
            <!-- <el-button size="mini" icon="el-icon-delete" type="danger" @click="delect(scope.row)">删除</el-button> -->
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
import { searchInventoryMoveSelective, selectLocation, inventoryMoveAudit, inventoryMoveUnAudit, searchInventoryBalanceSelective, searchInventoryMoveNum, deleteInventoryMoveAndDetail, exportInventoryMoveAndDetailExcel } from '@/api/user'
import { searchsystemid } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
import QueryData from './component/QueryData'
import QueryTable from '../../../components/QureyTable'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination, QueryData, QueryTable },
  data() {
    return {
      multipleSelection: [],
      expands: [],
      predictNum: null,
      reasonCode: null,
      advanced: false,
      locationName: null,
      inventoryMoveId: null,
      status: null,
      type: null,
      screen: '',
      sortField: {},
      listLoading: true,
      id: null,
      total: 0,
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
      lasttypeTime: 0,
      laststateTime: 0,
      typeOptions: [],
      stateOptions: [],
      tableHeight: 50,
      dialogTableVisible: false,
      dataListSelections: [],
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 5, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      rform: {
        warehouseName: null,
        areaName: null,
        locationName: null,
        customName: null,
        traceCode: null,
        commodityName: null,
        skuName: null,
        productBatch: null
      },
      form: {
        status: null,
        type: null,
        locationName: null,
        createPeople: null,
        checkPersonName: null
      },
      tableData: [],
      tabledatas: [],
      states: [],
      loclist: [],
      reasonOptions: [],
      dialogTableResultVisible: false,
      locationOptions: [],
      tableResultData: [],
      lastreasonTime: 0
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
    audit(row) {
      this.$confirm('确认该任务通过审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.checkPersonId = sessionStorage.getItem('getUserId')
        inventoryMoveAudit({
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
    unAudit(row) {
      this.$confirm('确认该任务不通过审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.checkPersonId = sessionStorage.getItem('getUserId')
        inventoryMoveUnAudit({
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
    funcReason() {
      const now = new Date().valueOf()
      if (this.lastreasonTime === 0) {
        searchsystemid('MOVE_REASON').then(res => {
          this.reasonOptions = res.data
        }
        )
        this.lastreasonTime = now
      } else {
        if ((now - this.lastreasonTime) > 5000) {
          this.lastreasonTime = now
        }
      }
    },
    rowdbclick(row) {
      sessionStorage.setItem('moveChildId', row.id)
      sessionStorage.setItem('moveId', row.moveCode)
      this.$router.push({ path: '/movetotal' })
    },
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid('INVENTORY_MOVE_STATE').then(res => {
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
    // reasonFormat(row) {
    //   searchsystemid(62).then(res => {
    //     this.reasonOptions = res.data
    //   })
    //   return changeAll(row.reasonCode, this.reasonOptions)
    // },
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
    funcLL(query) {
      selectLocation({
        pojo: {
        }
      })
        .then(res => {
          this.states = res.data
          this.loclist = this.states.map(item => {
            return { id: item.id, locationName: item.locationName }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.locationOptions = this.loclist.filter(item => {
              return item.locationName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.locationOptions = []
        }
      }, 100)
    },
    clickSelect(val) {
      this.dataListSelections = val
    },
    edit(row) {
      this.$router.push('movelist')
      sessionStorage.setItem('inventoryMoveId', row.inventoryMoveId)
      sessionStorage.setItem('inventoryMoveDetailId', row.inventoryMoveDetailId)
    },
    typeFormat(row) {
      const now = new Date().valueOf()
      if (this.lasttypeTime === 0) {
        searchsystemid('INVENTORY_MOVE_TYPE').then(res => {
          this.typeOptions = res.data
        })
        this.lasttypeTime = now
      } else {
        if ((now - this.lasttypeTime) > 5000) {
          this.lasttypeTime = now
        }
      }
      return changeAll(row.type, this.typeOptions)
    },
    changeadvanced() {
      this.advanced = !this.advanced
    },
    clear() {
      this.inventoryMoveId = null
      this.type = null
      this.status = null
    },
    outExcel() {
      const data = {
        // searchDTO: {
        //   page: this.listQuery.page,
        //   num: this.listQuery.limit
        // },
        pojo: {
          status: this.form.status,
          type: this.form.type,
          locationName: this.form.locationName,
          createPeople: this.form.createPeople,
          checkPersonName: this.form.checkPersonName
        }, screen: this.screen, startTime: this.value1[0],
        endTime: this.value1[1]
      }
      exportInventoryMoveAndDetailExcel(data).then((res) => {
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `库存移动单`)
        document.body.appendChild(a)
        a.click()
        url = window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
    },
    search() {
      this.getList()
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
        deleteInventoryMoveAndDetail({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.reload()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    getList() {
      this.listLoading = true
      searchInventoryMoveSelective({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        status: this.form.status,
        type: this.form.type,
        locationName: this.form.locationName,
        createPeople: this.form.createPeople,
        checkPersonName: this.form.checkPersonName
      },
      screen: this.screen, startTime: this.value1[0],
      endTime: this.value1[1] }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      searchInventoryMoveNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        status: this.form.status,
        type: this.form.type,
        locationName: this.form.locationName,
        createPeople: this.form.createPeople,
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
      this.$router.push('/movelist')
    },
    // 批量删除
    // 选
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
