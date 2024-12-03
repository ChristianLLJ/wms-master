<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" label-width="120px" :model="form">
          <el-form-item label="上架任务单状态">
            <el-select v-model="onshelfState" placeholder="请选择" clearable size="small" @focus="funcState">
              <el-option v-for="item in stateOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
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
          <el-form-item label="仓库">
            <el-select v-model="form.warehouseId" size="small" placeholder="请选择仓库" @focus="func">
              <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="上架库区">
            <el-select v-model="form.onshelfAreaName" size="small" placeholder="请选择" @focus="funcAreaw">
              <el-option v-for="item in wareaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="上架人">
            <el-input v-model="form.onshelfPersonName" size="small" placeholder="请输入" style="width: 400px;" clearable />
          </el-form-item> -->
          <el-form-item label="审核人">
            <el-input v-model="form.checkPersonName" size="small" placeholder="请输入" style="width: 400px;" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="el-icon-search" round size="small" @click="search()">查询</el-button>
            <!-- <el-tooltip class="item" effect="dark" content="将满足筛选条件的单据导出" placement="bottom">
              <el-button type="primary" round icon="el-icon-export" size="small" @click="outExcel">筛选导出</el-button>
            </el-tooltip> -->
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="btngroups">
      <el-button size="small" type="info" icon="el-icon-plus" @click="add">生成wcs任务</el-button>
      <!-- <el-button size="small" type="success" icon="el-icon-video-play" @click="add">启动OPC</el-button> -->
      <!-- <el-button size="small" icon="el-icon-export" type="primary" @click="outSelfExcel">批量导出</el-button> -->
      <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed? "查看上架任务所有记录" : "返回" }}</el-button>
    </div>
    <el-dialog title="请选择" :visible.sync="dialogVisible" width="75%" class="showAll_dialog">
      <!-- <div style="height: 8%;">
        <el-row>
          <el-col :span="12">
            <sku-choose :skuform="skuForm" />

          </el-col>
          <el-col :span="2">
            <el-button type="primary" icon="el-icon-search" @click="searchs">查询</el-button>

          </el-col>
        </el-row>
      </div> -->
      <div class="detailsTable">
        <normaltable
          :label-table="labelTable"
          :plantable="taskTable"
          :data-list-selections="dataListSelections"
          @clickSelect="clickSelect"
        />
      </div>
      <div class="pagContainer">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[50, 100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createWcs">生成wcs任务</el-button>
        <!-- <el-button type="primary" @click="openOPC">opc提交</el-button> -->

      </div>
    </el-dialog>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :height="tableHeight"
      :data="tableData"
      border
      size="mini"
      :header-cell-style="{background:'#000',color: '#fff'}"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      tooltip-effect="dark"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
      :header-cell-class-name="handleHeadAddClass"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" />
      <el-table-column :label="labelTitle" align="center">
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column label="上架任务单编号" :show-overflow-tooltip="true" prop="onshelfCode" />
        <!-- <el-table-column label="建议单编号" :show-overflow-tooltip="true" prop="adviceCode" /> -->
        <el-table-column label="来源类型" sortable="custom" :show-overflow-tooltip="true" prop="sourceType" :formatter="sourceFormat" />
        <el-table-column label="创建时间" sortable="custom" :show-overflow-tooltip="true" prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="上架任务单状态" sortable="custom" :show-overflow-tooltip="true" prop="onshelfState" :formatter="stateFormat" />
        <!-- <el-table-column label="上架单类型"  :show-overflow-tooltip="true" prop="onshelfType" :formatter="typeFormat" /> -->
        <!-- <el-table-column label="打印次数" :show-overflow-tooltip="true" prop="printAccount" /> -->
        <el-table-column v-if="false" label="是否启用" :show-overflow-tooltip="true" prop="isUsable" :formatter="useFormat" />
        <el-table-column label="仓库名称" sortable="custom" :show-overflow-tooltip="true" prop="warehouseName" />
        <el-table-column label="上架库区" sortable="custom" :show-overflow-tooltip="true" prop="onshelfAreaName" />
        <!-- <el-table-column label="上架人" sortable="custom" :show-overflow-tooltip="true" prop="onshelfPersonName" /> -->
        <el-table-column v-if="false" label="审核人id" :show-overflow-tooltip="true" prop="checkPersonId" />
        <el-table-column label="审核人" sortable="custom" :show-overflow-tooltip="true" prop="checkPersonName" />
        <el-table-column label="审核时间" sortable="custom" :show-overflow-tooltip="true" prop="checkTime">
          <template slot-scope="scope">{{ scope.row.checkTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="备注" :show-overflow-tooltip="true" prop="remark" />
      </el-table-column>
      <el-table-column
        width="400px"
        prop="action"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-view" type="primary" @click="rowdbClick(scope.row)">详细记录</el-button>
          <el-button v-if="scope.row.onshelfState === 1" size="mini" icon="el-icon-receive" type="primary" @click="audit(scope.row)">审核通过</el-button>
          <el-button v-if="scope.row.onshelfState === 1" size="mini" icon="el-icon-edit" type="primary" @click="edit(scope.row)">修改</el-button>
          <el-button v-if="scope.row.onshelfState === 2" size="mini" icon="el-icon-finish" type="primary" @click="finish(scope.row)">结单</el-button>
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
import { throttle } from '@/utils/throttle.js'
import { kkdeboundce } from '@/utils/kkdebounce'
import { searchsystemid } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
import normaltable from '@/components/TaskTable/index.vue'
import { selectOnshelf, selectOnshelfDetail, auditInventory, shuttleStartServer, baokaiWcsGetInboundTask, selectArea, selectOnshelfNum, selectWarehouse, updateInventoryByONF } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination, normaltable },
  data() {
    return {
      multipleSelection: [],
      expands: [],
      onshelfState: null,
      advanced: false,
      tableLoading: true,
      stateMin: null,
      stateMax: null,
      listState: false,
      labelTitle: '上架任务-未完成记录',
      viewed: true,
      toptions: [],
      taskTable: [],
      listLoading: true,
      stateOptions: [],
      dataListSelections: [],
      labelTable: '可分配任务单',
      dialogVisible: false,
      sums: {},
      tablelist: {},
      lastStaTime: 0,
      skuForm: {
        commodityId: null,
        skuName: null
      },
      startTime: null,
      sortField: {},
      screen: '',
      endTime: null,
      id: null,
      total: 0,
      laststateTime: 0,
      lastTime: 0,
      warehouseOptions: [],
      soptions: [],
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
      onshelf: null,
      tableHeight: 50,
      expandState: 0,
      dialogTableVisible: false,
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 50, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      wareaOptions: [],
      form: {
        startTime: null,
        endTime: null,
        onshelfCode: null,
        onshelfAreaName: null,
        warehouseName: null,
        onshelfPersonName: null,
        checkPersonName: null
      },
      tableData: [],
      tabledatas: []
    }
  },
  watch: {
    listState: function(newObj) {
      switch (newObj) {
        case 'true':
          this.viewed = false
          break
        case 'false':
          this.viewed = true
      }
    },
    viewed: function(newViewed) {
      switch (newViewed) {
        case true:
          this.labelTitle = '上架任务-未完成记录'
          break
        case false:
          this.labelTitle = '上架任务-所有记录'
      }
    }
  },
  created() {
    this.listState = sessionStorage.getItem('listState')
    if (this.listState === 'true') {
      this.stateMin = null
      this.stateMax = null
      this.getList()
    } else {
      this.stateMin = 1
      this.stateMax = 3
      this.getList()
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 82

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.multipleTable.$el.offsetTop - 82
      }
    })
  },
  methods: {
    finish(row) {
      this.$confirm('确定结束该条装箱单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateInventoryByONF(row).then(res => {
          if (res.code === 200) {
            this.$message.success('已结束')
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    clickSelect(val) {
      this.dataListSelections = val
    },
    searchs() {
      this.getListDetail(this.pagesize, this.currentPage)
    },
    createWcs() {
      let list = []
      if (this.dataListSelections.length) {
        this.$confirm('确认提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          list = this.dataListSelections.map((item) => {
            return { id: item.id }
          })
          // this.openOPC()
          baokaiWcsGetInboundTask(list).then((res) => {
            if (res.code === 200) {
              this.$message.success('提交成功！')
              this.refresh()
            }
          })
        })
      } else {
        this.$message({
          message: '请选择至少一条数据',
          type: 'warning'
        })
      }
    },
    openOPC() {
      let list = []
      if (this.dataListSelections.length) {
        this.$confirm('确认提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          list = this.dataListSelections.map((item) => {
            return { id: item.id }
          })
          // this.openOPC()
          shuttleStartServer(list).then((res) => {
            if (res.code === 200) {
              this.$message.success('提交成功！')
              this.refresh()
            }
          })
        })
      } else {
        this.$message({
          message: '请选择至少一条数据',
          type: 'warning'
        })
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
    funcAreaw() {
      selectArea({ pojo: {
      }}).then(res => {
        this.wareaOptions = res.data
      })
    },
    rowdbClick(row) {
      sessionStorage.setItem('onshelfChildId', row.id)
      sessionStorage.setItem('onshelfId', row.onshelfCode)
      this.$router.push('/listtotal')
    },
    scanHistory: throttle(function() {
      this.onshelf = null
      this.viewed = !this.viewed
      if (this.viewed === false) {
        sessionStorage.setItem('listState', true)
        this.stateMin = null
        this.stateMax = null
      } else {
        sessionStorage.setItem('listState', false)
        this.stateMin = 1
        this.stateMax = 3
      }
      this.getList()
    }, 500, true),
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else {
          for (var key in this.sums) {
            if (key === column.property) {
              sums[index] = this.sums[key]
            }
          }
        }
      })
      return sums
    },
    audit(row) {
      this.$confirm('确认该任务通过审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.checkPersonId = sessionStorage.getItem('getUserId')
        auditInventory(row).then(res => {
          if (res.code === 200) {
            this.getList()
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
    funcState() {
      const now = new Date().valueOf()
      if (this.lastStaTime === 0) {
        searchsystemid('ONSHELF_STATE').then(res => {
          this.stateOptions = res.data
        })
        this.lastStaTime = now
      } else {
        if ((now - this.lastStaTime) > 5000) {
          this.lastStaTime = now
        }
      }
    },
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid('ONSHELF_STATE').then(res => {
          this.soptions = res.data
        })
        this.laststateTime = now
      } else {
        if ((now - this.laststateTime) > 5000) {
          this.laststateTime = now
        }
      }
      return changeAll(row.onshelfState, this.soptions)
    },
    edit(row) {
      this.$router.push('/proposallist')
      sessionStorage.setItem('proChildId', row.id)
      sessionStorage.setItem('onshelfCode', row.onshelfCode)
    },
    typeFormat(row) {
      const now = new Date().valueOf()
      if (this.lasttypeTime === 0) {
        searchsystemid('ONSHELF_TYPE').then(res => {
          this.toptions = res.data
        })
        this.lasttypeTime = now
      } else {
        if ((now - this.lasttypeTime) > 5000) {
          this.lasttypeTime = now
        }
      }
      return changeAll(row.onshelfType, this.toptions)
    },
    sourceFormat(row) {
      if (row.sourceType === 1) {
        return '采购计划来源'
      } else if (row.sourceType === 0) {
        return '盲收来源'
      }
    },
    useFormat(row) {
      if (row.isUsable === 0) {
        return '否'
      } else if (row.isUsable === 1) {
        return '是'
      }
    },
    onshelfFormat(row) {
      if (row.onshelfType === 1) {
        return '补码后上架'
      } else if (row.onshelfState === 2) {
        return '补码后组盘上架'
      } else if (row.onshelfState === 3) {
        return '装箱上架'
      } else if (row.onshelfType === 4) {
        return '装箱后组盘上架'
      }
    },
    changeadvanced() {
      this.expandState = 0
      this.advanced = !this.advanced
    },
    add() {
      this.taskTable = []
      this.dialogVisible = true
      this.getListDetail(this.pagesize, this.currentPage)
    },
    getListDetail(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      selectOnshelf({
        pojo: {
          onshelfState: 2
        }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
        const res = response.data
        res.forEach((item) => {
          selectOnshelfDetail({ searchDTO,
            pojo: {
              onshelfId: item.id
            }}).then(res => {
            this.taskTable.push(...res.data.list)
          })
        })
      })
      this.totalCount = this.taskTable.length
    },
    clear: kkdeboundce(function() {
      this.onshelfState = null
      this.form = {
        startTime: null,
        endTime: null,
        onshelfCode: null,
        warehouseName: null,
        onshelfPersonName: null,
        checkPersonName: null
      }
    }, 500),
    // outSelfExcel() {
    //   if (this.multipleSelection.length) {
    //     this.$confirm('是否确认导出所选单据?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       selectExcelOutONP(this.multipleSelection).then((res) => {
    //         let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
    //         const a = document.createElement('a')
    //         a.style.display = 'none'
    //         a.href = url
    //         a.setAttribute('download', `上架任务单`)
    //         document.body.appendChild(a)
    //         a.click()
    //         url = window.URL.revokeObjectURL(url)
    //         document.body.removeChild(a)
    //       })
    //     })
    //   } else {
    //     this.$message({
    //       message: '请选择至少一条数据',
    //       type: 'warning'
    //     })
    //   }
    // },
    // outExcel() {
    //   const data = {
    //     searchDTO: {
    //       page: this.listQuery.page,
    //       num: this.listQuery.limit
    //     },
    //     pojo: {
    //       onshelfCode: this.form.onshelfCode,
    //       onshelfState: this.onshelfState,
    //       onshelfAreaName: this.form.onshelfAreaName,
    //       warehouseName: this.form.warehouseName,
    //       onshelfPersonName: this.form.onshelfPersonName,
    //       checkPersonName: this.form.checkPersonName
    //     },
    //     workGroupId: window.sessionStorage.workGroupId,
    //     stateMin: this.stateMin,
    //     screen: this.screen,
    //     stateMax: this.stateMax
    //   }
    //   screenExcelOutONP(data).then((res) => {
    //     let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
    //     const a = document.createElement('a')
    //     a.style.display = 'none'
    //     a.href = url
    //     a.setAttribute('download', `上架任务单`)
    //     document.body.appendChild(a)
    //     a.click()
    //     url = window.URL.revokeObjectURL(url)
    //     document.body.removeChild(a)
    //   })
    // },
    search: kkdeboundce(function() {
      this.getList()
    }, 500),
    handleSizeChange(val) {
      this.pagesize = val
      this.getListDetail(val, 1)
      this.currentPage = 1
    },
    // 显示第几页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getListDetail(this.pagesize, val)
    },
    refresh: kkdeboundce(function() {
      this.reload()
    }, 500),
    getList() {
      this.listLoading = true
      selectOnshelf({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        onshelfCode: this.form.onshelfCode,
        onshelfState: this.onshelfState,
        warehouseName: this.form.warehouseName,
        onshelfAreaName: this.form.onshelfAreaName,
        onshelfPersonName: this.form.onshelfPersonName,
        checkPersonName: this.form.checkPersonName
      }, workGroupId: window.sessionStorage.workGroupId, screen: this.screen, startTime: this.value1[0],
      endTime: this.value1[1],
      startTime1: this.value2[0],
      endTime1: this.value2[1],
      stateMin: this.stateMin,
      stateMax: this.stateMax }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectOnshelfNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        onshelfCode: this.form.onshelfCode,
        onshelfState: this.onshelfState,
        warehouseName: this.form.warehouseName,
        onshelfAreaName: this.form.onshelfAreaName,
        onshelfPersonName: this.form.onshelfPersonName,
        checkPersonName: this.form.checkPersonName
      }, workGroupId: window.sessionStorage.workGroupId, screen: this.screen, startTime: this.value1[0],
      endTime: this.value1[1],
      startTime1: this.value2[0],
      endTime1: this.value2[1],
      stateMin: this.stateMin,
      stateMax: this.stateMax }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    }
    // handleSelectionChange(val) {
    //   this.multipleSelection = []
    //   // 去重获取被选中的id值存入到数组中
    //   for (let i = 0; i < val.length; i++) {
    //     if (this.multipleSelection.indexOf(val[i].id) === -1) {
    //       this.multipleSelection.push({ id: val[i].id })
    //     }
    //   }
    // }
  }
}
</script>
  <style scoped>
   .el-form /deep/.el-form-item__label{
      color:rgb(0, 0, 0);
      font-weight: bold;
    }
  .search {
      margin: 1px;
      padding-top: 10px;
    }
  .btngroups {
    margin: 5px;
  }
  .pagContainer{
    background-color: rgb(75, 200, 175);
  }
  </style>
  <style lang="scss" scoped>
// 修改对话框高度
.show_card {
      background-color:#262626;
    }
          .detailsTable {
   ::v-deep .el-table tbody tr:hover>td {
  background-color:#162a48!important
}
  }
  .showAll_dialog2 {
    ::v-deep.el-dialog {
      margin: 100px auto !important;
      overflow: hidden;
      background-color: #091f2cee;

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
        ::v-deep.el-form-item__label {
      color:#fff
    }
    .detailsTable {
      height: 95%;
      border: 1px solid #fff;
      overflow-y: auto;
    }
    .pagContainer{
      background-color: transparent;
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
    .el-dialog__footer {
      margin-top: 10px;
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
