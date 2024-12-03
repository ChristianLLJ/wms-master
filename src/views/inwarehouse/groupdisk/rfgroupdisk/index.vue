<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" label-width="120px" :model="form">
          <el-form-item label="码盘任务状态">
            <el-select v-model="combineState" placeholder="请选择码盘任务状态" clearable size="small" @focus="funcState">
              <el-option v-for="item in stateOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item>
          <el-form-item label="仓库">
            <el-select v-model="form.warehouseCode" size="small" placeholder="请选择仓库" @focus="func">
              <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseCode" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="码盘人">
            <el-input v-model="form.personName" size="small" style="width: 160px;" placeholder="请输入" clearable />
          </el-form-item> -->

          <el-form-item label="修改时间">
            <el-date-picker
              v-model="value1"
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
          </el-form-item>
          <el-form-item label="审核人">
            <el-input v-model="form.checkPersonName" size="small" style="width: 160px;" placeholder="请输入" clearable />
          </el-form-item>
          <!-- <el-form-item label="审核时间">
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
            <el-button-group>
              <el-button type="success" icon="el-icon-search" size="small" @click="search()">搜索</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="btngroups">
      <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed? "查看所有码盘任务-无计划记录" : "返回" }}</el-button>
    </div>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :height="tableHeight"
      :data="tableData"
      :header-cell-style="{background:'#000',color: '#fff'}"
      :row-key="getRowKeys"
      border
      size="mini"
      :expand-row-keys="expands"
      tooltip-effect="dark"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
      :header-cell-class-name="handleHeadAddClass"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column :label="labelTitle" align="center">
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column label="码盘任务单号" :show-overflow-tooltip="true" prop="combineCode" />
        <el-table-column label="码盘任务状态" sortable="custom" :show-overflow-tooltip="true" prop="combineState" :formatter="stateFormat" />
        <el-table-column label="仓库代码" sortable="custom" :show-overflow-tooltip="true" prop="warehouseCode" />
        <el-table-column label="来源类型" :show-overflow-tooltip="true" prop="sourceType" :formatter="sourceFormat" />
        <el-table-column label="修改时间" sortable="custom" :show-overflow-tooltip="true" prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <!-- <el-table-column label="是否码盘完成"  :show-overflow-tooltip="true" prop="isFinished" :formatter="useFormat" /> -->
        <el-table-column label="码盘人" sortable="custom" :show-overflow-tooltip="true" prop="personName" />
        <el-table-column v-if="false" label="审核人id" :show-overflow-tooltip="true" prop="checkPersonId" />
        <el-table-column label="审核人" sortable="custom" :show-overflow-tooltip="true" prop="checkPersonName" />
        <el-table-column label="审核时间" sortable="custom" :show-overflow-tooltip="true" prop="checkTime">
          <template slot-scope="scope">{{ scope.row.checkTime| dateYMDHMSFormat }}</template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        prop="action"
        label="操作"
        width="400px"
      >
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-view" type="primary" @click="rowDbclick(scope.row)">查看码盘信息</el-button>
          <!-- <el-button v-if="scope.row.combineState ===0" size="mini" icon="el-icon-edit" type="primary" @click="continueWrite(scope.row)">继续填写</el-button> -->
          <el-button v-if="scope.row.combineState ===1 " size="mini" icon="el-icon-receive" type="primary" @click="audit(scope.row)">审核通过</el-button>
          <!-- <el-button size="mini" icon="el-icon-close" type="primary" @click="cancel(scope.row)">作废</el-button> -->
          <el-button v-if="scope.row.combineState ===1 " size="mini" icon="el-icon-edit" type="primary" @click="edit(scope.row)">修改</el-button>
          <el-button v-if="scope.row.combineState ===2 " size="mini" icon="el-icon-close" type="primary" @click="finish(scope.row)">结单</el-button>
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
import { selectCombineStack, selectCombineStackNum, auditDisk, selectCombineStackPackageDetailNum, selectWarehouse, selectCombineStackPackageDetail, closeCombine, selectCombineStackDetail, delDiskDetail, selectCombineStackDetailNum, cancelCombine } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      multipleSelection: [],
      expands: [],
      combineState: null,
      advanced: false,
      stateMin: null,
      stateMax: null,
      viewed: true,
      labelTitle: '码盘任务-无计划未完成记录',
      tableLoading: true,
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
      listLoading: true,
      listLoading2: true,
      rfdiskState: false,
      id: null,
      listId: null,
      startTime: null,
      endTime: null,
      sumss: {},
      sums: {},
      tablelist: {},
      tablelists: {},
      stateOptions: [],
      expandLists: [],
      tableList: [],
      lastStaTime: 0,
      total: 0,
      laststateTime: 0,
      lastTime: 0,
      soptions: [],
      foptions: [
        {
          value: 0,
          label: '否'
        },
        {
          value: 1,
          label: '是'
        }
      ],
      tableHeight: 50,
      warehouseOptions: [],
      dialogTableVisible: false,
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 10, // 每页显示的条数
      currentPage2: 1, // 第几页
      totalCount2: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize2: 5, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      getRowListtKeys(row) {
        return row.id
      },
      toptions: [
        // {
        //   value: 2,
        //   label: '生成来源'
        // },
        {
          value: 1,
          label: '采购计划来源'
        },
        {
          value: 0,
          label: '盲收来源'
        }
      ],
      listQuery: {
        page: 1,
        limit: 50
      },
      form: {
        combineCode: null,
        sourceType: null,
        warehouseCode: null,
        isFinished: null,
        personName: null,
        checkPersonName: null
      },
      sortField: {},
      screen: '',
      rform: {
        stackCode: null,
        packageCode: null,
        combineTraceCode: null,
        planCode: null
      },
      tabledatas: [],
      tableData: []
    }
  },
  watch: {
    rfdiskState: function(newObj) {
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
          this.labelTitle = '码盘任务-无计划未完成记录'
          break
        case false:
          this.labelTitle = '码盘任务-无计划所有记录'
      }
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
  created() {
    this.rfdiskState = sessionStorage.getItem('rfdiskState')
    if (this.rfdiskState === 'true') {
      this.stateMin = null
      this.stateMax = null
      this.getList()
    } else {
      this.stateMin = 1
      this.stateMax = 3
      this.getList()
    }
  },
  methods: {
    useFormat(row) {
      if (row.isFinished === 0 || row.isFix === 0 || row.stackState === 0 || row.isStacked === 0) {
        return '否'
      } else if (row.isFinished === 1 || row.isFix === 1 || row.stackState === 1 || row.isStacked === 1) {
        return '是'
      }
    },
    rowDbclick(row) {
      sessionStorage.setItem('combineChildId', row.id)
      sessionStorage.setItem('combineId', row.combineCode)
      this.$router.push('/rfdisktotal')
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
    scanHistory: throttle(function() {
      this.viewed = !this.viewed
      if (this.viewed === false) {
        sessionStorage.setItem('rfdiskState', true)
        this.stateMin = null
        this.stateMax = null
      } else {
        sessionStorage.setItem('rfdiskState', false)
        this.stateMin = 1
        this.stateMax = 3
      }
      this.getList()
    }, 500, true),
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
    edit(row) {
      this.$router.push('/disklist')
      sessionStorage.setItem('diskChildId', row.id)
      sessionStorage.setItem('combineCode', row.combineCode)
    },
    deleteDetails(row) {
      this.$confirm('确定删除该条表细吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDiskDetail({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getListDetails(this.pagesize, this.currentPage)
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
        row.checkPersonId = sessionStorage.getItem('getUserId')
        auditDisk(row).then(res => {
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
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    funcState() {
      const now = new Date().valueOf()
      if (this.lastStaTime === 0) {
        searchsystemid('STACK_STATE').then(res => {
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
        searchsystemid('STACK_STATE').then(res => {
          this.soptions = res.data
        })
        this.laststateTime = now
      } else {
        if ((now - this.laststateTime) > 5000) {
          this.laststateTime = now
        }
      }
      return changeAll(row.combineState, this.soptions)
    },
    clear: kkdeboundce(function() {
      this.combineState = null
      this.form = {
        combineCode: null,
        warehouseCode: null,
        sourceType: null,
        isFinished: null,
        personName: null,
        checkPersonName: null
      }
    }, 500),
    search: kkdeboundce(function() {
      this.getList()
    }, 500),
    sourceFormat(row) {
      if (row.sourceType === 1) {
        return '采购计划来源'
      } else if (row.sourceType === 0) {
        return '盲收来源'
      }
    },
    searchDeatils() {
      this.getListDetails(this.pagesize, this.currentPage)
    },
    clearDetails() {
      this.rform = {
        stackCode: null,
        packageCode: null,
        combineTraceCode: null,
        planCode: null
      }
    },
    getDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.listLoading2 = true
      selectCombineStackPackageDetail({ searchDTO,
        pojo: {
          detailId: this.listId
        }}).then(response => {
        this.tablelists = response.data
        this.tableList = this.tablelists.list
        this.sums = this.tablelists.sums
        setTimeout(() => {
          this.listLoading2 = false
        }, 0.5 * 1000)
      })
      selectCombineStackPackageDetailNum({ searchDTO,
        pojo: {
          detailId: this.listId
        }}).then(response => {
        this.totalCount2 = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      selectCombineStackDetail({ searchDTO,
        pojo: {
          stackId: this.id,
          stackCode: this.rform.stackCode,
          combineTraceCode: this.rform.combineTraceCode,
          // packageBarcode: this.rform.packageBarcode,
          planCode: this.rform.planCode
        }}).then(response => {
        this.tablelist = response.data
        this.tabledatas = this.tablelist.list
        this.sumss = this.tablelist.sums
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      selectCombineStackDetailNum({ searchDTO,
        pojo: {
          stackId: this.id,
          stackCode: this.rform.stackCode,
          combineTraceCode: this.rform.combineTraceCode,
          // packageBarcode: this.rform.packageBarcode,
          planCode: this.rform.planCode
        }}).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    finish(row) {
      this.$confirm('确定结束该条装箱单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        closeCombine(row).then(res => {
          if (res.code === 200) {
            this.$message.success('已结束')
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消结束'
        })
      })
    },
    cancel(row) {
      this.$confirm('确定取消该条装箱单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelCombine({ head: {
          id: row.id,
          combineState: row.combineState
        }}).then(res => {
          if (res.code === 200) {
            this.$message.success('已取消')
            this.reload()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消取消'
        })
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
    handleSizeChange2(val) {
      this.pagesize2 = val
      this.getDetails(val, 1)
      this.currentPage2 = 1
    },
    // 显示第几页
    handleCurrentChange2(val) {
      this.currentPage = val
      this.getDetails2(this.pagesize2, val)
    },
    changeadvanced() {
      this.advanced = !this.advanced
    },
    refresh: kkdeboundce(function() {
      this.reload()
    }, 500),
    getList() {
      this.listLoading = true
      selectCombineStack({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        combineCode: this.form.combineCode,
        warehouseCode: this.form.warehouseCode,
        combineState: this.combineState,
        sourceType: 0,
        // isFinished: this.form.isFinished,
        personName: this.form.personName,
        checkPersonName: this.form.checkPersonName
      }, workGroupId: window.sessionStorage.workGroupId, screen: this.screen, stateMin: this.stateMin,
      stateMax: this.stateMax }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectCombineStackNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        combineCode: this.form.combineCode,
        warehouseCode: this.form.warehouseCode,
        combineState: this.combineState,
        sourceType: 0,
        // isFinished: this.form.isFinished,
        personName: this.form.personName,
        checkPersonName: this.form.checkPersonName
      }, workGroupId: window.sessionStorage.workGroupId, screen: this.screen, stateMin: this.stateMin,
      stateMax: this.stateMax }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    add() {
      this.$router.push('/disklist')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
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
    .pagContainer2{
      background-color: rgb(36, 101, 88);
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
       .detailsTable2 {
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
  </style>

