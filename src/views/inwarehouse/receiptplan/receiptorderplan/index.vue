<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" :model="form" label-width="120px">
          <el-form-item label-width="180px" label="入库计划-有计划单类型">
            <el-select v-model="form.inboundType" placeholder="请选择" clearable size="small">
              <el-option v-for="item in toptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item>
          <el-form-item label="入库计划-有计划单状态" label-width="160px">
            <el-select v-model="form.inboundState" placeholder="请选择" clearable size="small" @focus="funcState">
              <el-option v-for="item in stateOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item>
          <el-form-item label="入库批次">
            <el-input v-model="form.inboundBatch" size="small" style="width: 200px;" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="仓库">
            <el-select v-model="form.warehouseId" size="small" placeholder="请选择" @focus="func">
              <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="审核人">
            <el-input v-model="form.checkPersonName" size="small" style="width: 160px;" placeholder="请输入" clearable />
          </el-form-item>
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
            <el-button round type="success" icon="el-icon-search" size="small" @click="search()">搜索</el-button>
            <!-- <el-tooltip class="item" effect="dark" content="将满足筛选条件的单据导出" placement="bottom">
              <el-button type="primary" round icon="el-icon-export" size="small" @click="outExcel">筛选导出</el-button>
            </el-tooltip> -->
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="btngroups">
      <el-button size="small" icon="el-icon-plus" type="primary" @click="add">新建</el-button>
      <el-button size="small" type="success" icon="el-icon-addInboundBatch" @click="addInboundBatch">选择下列入库计划单生成同一入库批次</el-button>
      <!-- <el-button size="small" icon="el-icon-newTask" type="primary">生成分拣任务</el-button> -->
      <el-button size="small" icon="el-icon-export" type="primary" @click="outSelfExcel">批量导出</el-button>
      <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed ? "查看所有入库计划-有计划记录" : "返回" }}</el-button>
    </div>

    <el-dialog title="审核不通过理由填写" :visible.sync="unAuditDialog" class="showAll_dialog2">
      <el-form ref="auditForm" :model="auditForm" :rules="rules">
        <el-form-item>
          <el-input v-model="auditForm.reason" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReason">提交</el-button>
      </div>
    </el-dialog>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="tableData"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :row-key="getRowKeys"
      border
      size="mini"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      :header-cell-style="{background:'#000',color: '#fff'}"
      :height="tableHeight"
      style="width: 100%, font-size: 10px"
      :header-cell-class-name="handleHeadAddClass"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column v-if="false" label="id" prop="id" />
      <el-table-column type="selection" :reserve-selection="true" />
      <el-table-column :label="labelTitle" align="center">
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column align="center" label="入库计划-有计划单编号" :show-overflow-tooltip="true" prop="planId" width="150px" />
        <el-table-column align="center" sortable="custom" label="入库计划-有计划单类型" :show-overflow-tooltip="true" prop="inboundType" width="120px" :formatter="typeFormat" />
        <el-table-column align="center" label="入库批次" :show-overflow-tooltip="true" prop="inboundBatch" width="120px" />
        <el-table-column align="center" sortable="custom" prop="inboundState" label="入库计划-有计划单状态" width="120px" :formatter="stateFormat" />
        <el-table-column align="center" sortable="custom" label="仓库名称" width="120px" :show-overflow-tooltip="true" prop="warehouseName" />
        <el-table-column align="center" label="来源类型" width="120px" :show-overflow-tooltip="true" prop="sourceType" :formatter="sourceFormat" />
        <el-table-column align="center" sortable="custom" label="修改时间" :show-overflow-tooltip="true" width="120px" prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column v-if="false" prop="isUsable" label="是否启用" :formatter="useFormat" />
        <!-- <el-table-column label="预期容器数量(个)" :show-overflow-tooltip="true" prop="predictContainerNum" /> -->
        <el-table-column align="center" sortable="custom" label="预期sku数量(个)" :show-overflow-tooltip="true" prop="predictSkuNum" />
        <el-table-column align="center" sortable="custom" label="预期物品数量(个)" :show-overflow-tooltip="true" prop="predictNum" />
        <!-- <el-table-column label="收货sku数量(个)"  :show-overflow-tooltip="true" prop="receivedSkuNum" />
        <el-table-column label="收货物品数量(个)"  :show-overflow-tooltip="true" prop="receivedNum" />
        <el-table-column label="收货容器数量(个)"  :show-overflow-tooltip="true" prop="receivedContainerNum" /> -->
        <!-- <el-table-column prop="isAllChecke" label="质检数量"  :formatter="useFormat" />
          <el-table-column prop="isReceived" label="是否收货"  :formatter="useFormat" />
          <el-table-column label="是否装箱完成"  :show-overflow-tooltip="true" prop="isPackaged" :formatter="puseFormat" />
          <el-table-column label="是否码盘完成"  :show-overflow-tooltip="true" prop="isStacked" :formatter="puseFormat" /> -->
        <el-table-column v-if="false" label="审核人id" :show-overflow-tooltip="true" prop="checkPersonId" />
        <el-table-column align="center" width="120px" sortable="custom" label="审核人" :show-overflow-tooltip="true" prop="checkPersonName" />
        <el-table-column align="center" sortable="custom" label="审核时间" :show-overflow-tooltip="true" width="120px" prop="checkTime">
          <template slot-scope="scope">{{ scope.row.checkTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column align="center" label="结单理由" width="150px" :show-overflow-tooltip="true" prop="closeReason" />
        <el-table-column align="center" label="备注" width="150px" :show-overflow-tooltip="true" prop="remark" />
      </el-table-column>

      <el-table-column
        fixed="right"
        prop="action"
        label="操作"
        width="440px"
      >
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-view" type="primary" @click="rowDbclick(scope.row)">详细记录</el-button>
          <el-button v-if="scope.row.inboundState === 1" size="mini" icon="el-icon-receive" type="primary" @click="audit(scope.row)">审核通过</el-button>
          <el-button v-if="scope.row.inboundState === 1" size="mini" icon="el-icon-finish" type="primary" @click="unAudit(scope.row)">审核不通过</el-button>
          <el-button v-if="scope.row.inboundState === 1" size="mini" icon="el-icon-edit" type="primary" @click="edit(scope.row)">修改</el-button>
          <!-- <el-button size="mini" icon="el-icon-close" type="primary" @click="cancel(scope.row)">作废</el-button> -->
          <el-button v-if="scope.row.inboundState === 4" size="mini" icon="el-icon-receive" type="primary" @click="getAll(scope.row)">整计划收货</el-button>
          <!-- <el-button v-if="false" size="mini" icon="el-icon-finish" type="primary" @click="finish(scope.row)">结单</el-button> -->
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
import { searchsystemid, searchcon, searchallwarehouse } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
import { selectInboundPlan, auditPlan, screenContainer, receiveTable, selectArea, screenGoods, delPlanDetail, selectOnshelfStrategy, selectInboundPlanNum, closeInboundPlan, cancelInboundPlan, addInboundBatch, selectInboundPlanDetailNum, selectInboundPlanDetail, screenExcelOutIPL, selectExcelOutIPL } from '@/api/user'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  // diskUse,
  data() {
    return {
      multipleSelection: [],
      expands: [],
      table: [],
      list: [],
      toptions: [],
      comOptions: [],
      reasonTable: {},
      unAuditDialog: false,
      comStates: [],
      comLoclist: [],
      conOptions: [],
      conStates: [],
      labelTitle: '入库计划-有计划未完成记录',
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
      conLoclist: [],
      formData: {
        rules: {
          packageCode: [{
            required: true,
            message: '请选择包装',
            tirgger: ['change']
          }],
          commodityNum: [{
            required: true,
            message: '请正确填写商品装箱数量',
            tirgger: ['change']
          }],
          containerName: [{
            required: true,
            message: '请选择商品包装',
            tirgger: ['change']
          }],
          unit: [{
            required: true,
            message: '请选择单位',
            tirgger: ['change']
          }]
        },
        tablepack: []
      },
      spanArr: [],
      totalNum: 0,
      tabledisk: [
        {
        }
      ],
      tablepack1: [],
      packageOptions: [],
      stateOptions: [],
      lastStaTime: 0,
      packForm: {
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null
      },
      qualityForm: {
        randomNum: null,
        warehouseId: null,
        warehouseName: null,
        warehouseCode: null,
        checkType: null
      },
      rules: {
        warehouseName: [{ required: true, message: '请选择仓库', trigger: 'change' }],
        onshelfAreaName: [{ required: true, message: '请选择库区', trigger: 'change' }],
        onshelfStrategyName: [{ required: true, message: '请选择策略', trigger: 'change' }],
        warehouseCode: [{ required: true, message: '请选择仓库代码', trigger: 'change' }],
        checkType: [{ required: true, message: '请选择质检类型', trigger: 'change' }],
        randomNum: [{ required: true, message: '请填写想要质检的商品sku数量', trigger: 'change' }]
      },
      disabled: true,
      containerOptions: [],
      currentPage2: 1, // 当前页码
      pageSize2: 10, // 每页的数据条数
      currentPage3: 1, // 当前页码
      pageSize3: 5, // 每页的数据条数
      checkOptions: [],
      sumss: {},
      tablelist: {},
      lastPackTime: 0,
      lastTime: 0,
      laststateTime: 0,
      lasttypeTime: 0,
      lastAreaTime: 0,
      lastStrTime: 0,
      lastconTime: 0,
      warehouseOptions: [],
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
      options: [
        {
          value: 0,
          label: '否'
        },
        {
          value: 1,
          label: '是'
        }
      ],
      areaOptions: [],
      strategyOptions: [],
      planForm: {
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        onshelfAreaId: null,
        onshelfAreaName: null,
        onshelfAreaCode: null,
        onshelfStrategyId: null,
        onshelfStrategyName: null,
        onshelfStrategyCode: null
      },
      warehouseId: null,
      warehouseCode: null,
      warehouseName: null,
      viewed: true,
      remark: null,
      advanced: false,
      diskTable: [],
      packTotalJudge: 0,
      // diskTable2: [],
      proposalTable: [],
      show: false,
      sums: [],
      inboundType: null,
      inboundState: null,
      packTotal: 0,
      tableLoading: true,
      startTime: null,
      endTime: null,
      packTotalJudge2: 0,
      listLoading: true,
      id: null,
      lastqtypeTime: 0,
      auditForm: {
        reason: null
      },
      total: 20,
      tableHeight: 50,
      expandState: 0,
      dialogTableVisible: false,
      dialogPackVisible: false,
      dialogDiskVisible: false,
      dialogProposalVisible: false,
      dialogVisible: false,
      receiptorderState: false,
      formLabelWidth: '120px',
      packId: null,
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
      rform: {
        commodityName: null,
        customName: null,
        supplierName: null,
        containerName: null
      },
      sortField: {},
      screen: '',
      // screenNull: '',
      stateMin: null,
      stateMax: null,
      form: {
        inboundBatch: null,
        inboundState: null,
        inboundType: null,
        warehouseId: null,
        checkPersonName: null
      },
      tableData: [],
      tabledatas: [],
      diskTotalTable: []
    }
  },
  watch: {
    receiptorderState: function(newObj) {
      switch (newObj) {
        case 'true':
          this.viewed = false
          break
        case 'false':
          this.viewed = true
      }
    },
    advanced: function(newObj) {
      switch (newObj) {
        case true:
          this.expandState = 1
          break
        case false:
          this.expandState = 0
      }
    },
    viewed: function(newViewed) {
      switch (newViewed) {
        case true:
          this.labelTitle = '入库计划-有计划未完成记录'
          break
        case false:
          this.labelTitle = '入库计划-有计划所有记录'
      }
    }
  },
  created() {
    this.receiptorderState = sessionStorage.getItem('receiptorderState')
    if (this.receiptorderState === 'true') {
      this.stateMin = null
      this.stateMax = null
      this.getList()
    } else {
      this.stateMin = 1
      this.stateMax = 13
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
    scanHistory: throttle(function() {
      this.viewed = !this.viewed
      if (this.viewed === false) {
        sessionStorage.setItem('receiptorderState', true)
        this.stateMin = null
        this.stateMax = null
      } else {
        sessionStorage.setItem('receiptorderState', false)
        this.stateMin = 1
        this.stateMax = 13
      }
      this.getList()
    }, 500, true),
    renderHeader(h, { column }) { // 悬浮提示的文字内容
      const info = '质检任务，装箱任务，码盘任务，上架建议均由入库计划生成！'
      return h(
        'div', [h('span', column.label), // placement指定悬浮显示方向
          h('el-tooltip', { props: { placement: 'bottom', effect: 'light' }}, [
            // style 调文字颜色样式
            h('div', { slot: 'content', style: { whiteSpace: 'normal', color: 'blue' }}, info),
            // el-icon-warning是element图标, style 调图标颜色
            h('i', { class: 'el-icon-warning', style: 'color: #409EFF; margin-left: 5px;' })
          ])])
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
    submitReason() {
      this.$confirm('确定反馈审核不通过的原因吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        closeInboundPlan({ detail: this.reasonTable, code: this.auditForm.reason }).then(res => {
          if (res.code === 200) {
            this.$message.success('已反馈')
            this.unAuditDialog = false
            this.auditForm.reason = null
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
    rowDbclick(row) {
      sessionStorage.setItem('planChildId', row.id)
      sessionStorage.setItem('planId', row.planId)
      this.$router.push('/plantotal')
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else {
          for (var key in this.sumss) {
            if (key === column.property) {
              if (key === 'totalMoney') {
                sums[index] = this.sums[key].toFixed(2)
              } else {
                sums[index] = this.sums[key]
              }
            }
          }
        }
      })
      return sums
    },
    typeFormat(row) {
      const now = new Date().valueOf()
      if (this.lasttypeTime === 0) {
        searchsystemid('INBOUND_ADVICE_TYPE').then(res => {
          this.toptions = res.data
        })
        this.lasttypeTime = now
      } else {
        if ((now - this.lasttypeTime) > 5000) {
          this.lasttypeTime = now
        }
      }
      return changeAll(row.inboundType, this.toptions)
    },
    funcState() {
      const now = new Date().valueOf()
      if (this.lastStaTime === 0) {
        searchsystemid('INBOUND_ADVICE_STATE').then(res => {
          this.stateOptions = res.data
        })
        this.lastStaTime = now
      } else {
        if ((now - this.lastStaTime) > 5000) {
          this.lastStaTime = now
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    flitterData: function() {
      let contactDot = 0
      const spanArr = []
      this.tabledatas.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1)
        } else {
          if (item.purchaseCode === this.tabledatas[index - 1].purchaseCode && this.tabledatas[index - 1].purchaseCode !== '') {
            spanArr[contactDot] += 1
            spanArr.push(0)
          } else {
            contactDot = index
            spanArr.push(1)
          }
        }
      })
      this.spanArr = spanArr
    },
    edit(row) {
      this.$router.push('/planlist')
      sessionStorage.setItem('planChildId', row.id)
      sessionStorage.setItem('planId', row.planId)
    },
    funccom(query) {
      screenGoods({
        searchDTO: {
          page: 1,
          num: 1000
        },
        pojo: {
        }
      })
        .then(res => {
          this.comStates = res.data
          this.comLoclist = this.comStates.map(item => {
            return { id: item.id, goodsName: item.goodsName }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.comOptions = this.comLoclist.filter(item => {
              return item.goodsName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.comOptions = []
        }
      }, 100)
    },
    funccon(query) {
      screenContainer({
        searchDTO: {
          page: 1,
          num: 1000
        },
        pojo: {
        }
      })
        .then(res => {
          this.conStates = res.data
          this.conLoclist = this.conStates.map(item => {
            return { id: item.id, name: item.name }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.conOptions = this.conLoclist.filter(item => {
              return item.name.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.conOptions = []
        }
      }, 100)
    },
    audit(row) {
      this.$confirm('确认该任务通过审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.checkPersonId = sessionStorage.getItem('getUserId')
        auditPlan(row).then(res => {
          if (res.code === 200) {
            this.$message.success('审核已通过，如需质检，请去质检任务页面操作')
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
    unAudit(row) {
      this.unAuditDialog = true
      row.checkPersonId = sessionStorage.getItem('getUserId')
      this.reasonTable = Object.assign({}, row)
    },
    deleteDetails(row) {
      this.$confirm('确定删除该条表细吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPlanDetail({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getListDetails()
          }
        })
      })
    },
    funcContainer() {
      const now = new Date().valueOf()
      if (this.lastconTime === 0) {
        searchcon().then(res => {
          this.containerOptions = res.data
        }
        )
        this.lastconTime = now
      } else {
        if ((now - this.lastconTime) > 5000) {
          this.lastconTime = now
        }
      }
    },
    func() {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        searchallwarehouse().then(res => {
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
    funPackage() {
      const now = new Date().valueOf()
      if (this.lastPackTime === 0) {
        screenContainer({ searchDTO: {
          page: 1,
          num: 100
        }, pojo: {}
        }).then(res => {
          this.packageOptions = res.data
        }
        )
        this.lastPackTime = now
      } else {
        if ((now - this.lastPackTime) > 5000) {
          this.lastPackTime = now
        }
      }
    },
    funcArea() {
      if (!this.planForm.warehouseName) {
        this.$message.error('请先选择仓库！')
      } else {
        selectArea({ pojo: {
          warehouseId: this.planForm.warehouseId
        }}).then(res => {
          this.areaOptions = res.data
        }
        )
      }
    },
    funcStrategy() {
      const now = new Date().valueOf()
      if (this.lastStrTime === 0) {
        selectOnshelfStrategy({ pojo: {
        }, workGroupId: window.sessionStorage.workGroupId }).then(res => {
          this.strategyOptions = res.data
        }
        )
        this.lastStrTime = now
      } else {
        if ((now - this.lastStrTime) > 5000) {
          this.lastStrTime = now
        }
      }
    },
    changeWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.warehouseName || item1.warehouseCode === this.warehouseCode)
      this.warehouseCode = item.warehouseCode
      this.warehouseName = item.warehouseName
      this.warehouseId = item.id
    },
    changeQualityOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.qualityForm.warehouseName)
      this.qualityForm.warehouseCode = item.warehouseCode
      this.qualityForm.warehouseName = item.warehouseName
      this.qualityForm.warehouseId = item.id
    },
    changePlanWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.planForm.warehouseName)
      this.planForm.warehouseCode = item.warehouseCode
      this.planForm.warehouseName = item.warehouseName
      this.planForm.warehouseId = item.id
    },
    changePackWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.packForm.warehouseName)
      this.packForm.warehouseCode = item.warehouseCode
      this.packForm.warehouseName = item.warehouseName
      this.packForm.warehouseId = item.id
    },
    changeAreaOptions() {
      const item = this.areaOptions.find(item1 => item1.areaName === this.planForm.onshelfAreaName)
      this.planForm.onshelfAreaName = item.areaName
      this.planForm.onshelfAreaCode = item.areaCode
      this.planForm.onshelfAreaId = item.id
    },
    changePackOptions(row) {
      const item = this.packageOptions.find(item1 => item1.code === row.packageCode)
      row.packageCode = item.code
      row.packageId = item.id
    },
    changeStrategyOptions() {
      const item = this.strategyOptions.find(item1 => item1.strategyName === this.planForm.onshelfStrategyName)
      this.planForm.onshelfStrategyName = item.strategyName
      this.planForm.onshelfStrategyCode = item.strategyCode
      this.planForm.onshelfStrategyId = item.id
    },
    useFormat(row) {
      if (row.isAllChecke || row.isReceived === 0) {
        return '否'
      } else if (row.isAllChecke || row.isReceived === 1) {
        return '是'
      }
    },
    puseFormat(row) {
      if (row.isPackaged || row.isStacked === false) {
        return '否'
      } else if (row.isPackaged || row.isStacked === true) {
        return '是'
      }
    },
    sourceFormat(row) {
      if (row.sourceType === 1) {
        return '采购计划来源'
      } else if (row.sourceType === 2) {
        return '生成来源'
      } else if (row.sourceType === 3) {
        return '盲收来源'
      }
    },
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid('INBOUND_ADVICE_STATE').then(res => {
          this.options = res.data
        })
        this.laststateTime = now
      } else {
        if ((now - this.laststateTime) > 5000) {
          this.laststateTime = now
        }
      }
      return changeAll(row.inboundState, this.options)
    },
    tableDiskName({ row, rowIndex }) {
      row.rowNum = rowIndex + 1
    },
    getAll(row) {
      this.$confirm('确定整表收货吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        receiveTable({
          id: row.id
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('已收货')
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
    cancel(row) {
      this.$confirm('确定作废该条入库计划单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelInboundPlan({ head: {
          id: row.id,
          inboundState: row.inboundState
        }}).then(res => {
          if (res.code === 200) {
            this.$message.success('已作废')
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
    search: kkdeboundce(function() {
      this.getList()
    }, 500),
    outSelfExcel() {
      if (this.multipleSelection.length) {
        this.$confirm('是否确认导出所选单据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectExcelOutIPL(this.multipleSelection).then((res) => {
            let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.setAttribute('download', `入库计划单`)
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
    outExcel() {
      const data = {
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
          inboundBatch: this.form.inboundBatch,
          sourceType: 1,
          checkPersonName: this.form.checkPersonName,
          inboundState: this.form.inboundState,
          inboundType: this.form.inboundType,
          warehouseId: this.form.warehouseId
        },
        workGroupId: window.sessionStorage.workGroupId,
        stateMin: this.stateMin,
        stateMax: this.stateMax,
        startTime1: this.value1[0], endTime1: this.value1[1], startTime2: this.value2[0], endTime2: this.value2[1]
      }
      screenExcelOutIPL(data).then((res) => {
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `入库计划单`)
        document.body.appendChild(a)
        a.click()
        url = window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
    },
    addInboundBatch() {
      if (this.multipleSelection.length) {
        this.$confirm('是否确认生成入库批次?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          addInboundBatch(this.multipleSelection).then((res) => {
            if (res.code === 200) {
              this.$message.success('已生成')
              this.$refs.multipleTable.clearSelection()
              this.reload()
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
    getListDetails() {
      var searchDTO = {
        'page': 1,
        'num': 10
      }
      this.tableLoading = true
      selectInboundPlanDetail({ searchDTO,
        pojo: {
          planId: this.id
        }}).then(response => {
        this.tablelist = response.data
        this.tabledatas = this.tablelist.list
        this.sumss = this.tablelist.sums
        this.flitterData()
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      selectInboundPlanDetailNum({ searchDTO,
        pojo: {
          planId: this.id
        }}).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    refresh() {
      this.reload()
    },
    getList() {
      this.listLoading = true
      selectInboundPlan({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        inboundBatch: this.form.inboundBatch,
        sourceType: 1,
        checkPersonName: this.form.checkPersonName,
        inboundState: this.form.inboundState,
        inboundType: this.form.inboundType,
        warehouseId: this.form.warehouseId
      }, workGroupId: window.sessionStorage.workGroupId, screen: this.screen, stateMin: this.stateMin,
      stateMax: this.stateMax, startTime: this.value1[0], endTime: this.value1[1], startTime1: this.value2[0], endTime1: this.value2[1] }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectInboundPlanNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        inboundBatch: this.form.inboundBatch,
        sourceType: 1,
        checkPersonName: this.form.checkPersonName,
        inboundState: this.form.inboundState,
        inboundType: this.form.inboundType,
        warehouseId: this.form.warehouseId
      }, workGroupId: window.sessionStorage.workGroupId, screen: this.screen, stateMin: this.stateMin,
      stateMax: this.stateMax, startTime: this.value1[0], endTime: this.value1[1], startTime1: this.value2[0], endTime1: this.value2[1] }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    add() {
      this.$router.push('/planlist')
      sessionStorage.removeItem('planChildId')
      sessionStorage.removeItem('planId')
    },
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
    .datagrid-htable, .datagrid-btable, .datagrid-ftable {
      color: #ffffff;
  }

  </style>
    <style scoped>

.search {
      margin: 1px;
      padding-top: 10px;
    }
      .el-card /deep/ .el-card__header {
    padding: 5px;
    color:#fff;
    text-align: center;
    }
    .el-form /deep/.el-form-item__label{
      color:rgb(0, 0, 0);
      font-weight: bold;
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
      .showAll_dialog {
      .cardContain {
        height:100%;
        .formContain {
          height: 15%;
          border: 1px solid #fff;
          padding: 5px 5px;
        }
        .detailsTable2 {
          height: 85%;
          overflow-y: auto;
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
    .show_card_p {
      .cardContain {
        height:100%;
    }
     ::v-deep.el-dialog {
        background-color: #262626;
        border: #fff 1px solid;
         box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
      0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);

        .el-dialog__body {
          line-height: 30px;
          color: white;
          padding: 10px 15px;
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
     .showAll_dialog2 {
      ::v-deep.el-dialog {
        background-color: #091f2c;

        .el-dialog__body {
          line-height: 30px;
          color: white;
          padding: 10px 15px;
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

