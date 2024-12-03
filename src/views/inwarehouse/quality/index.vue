<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" class="demo-form-inline" :model="form" label-width="120px">
          <el-form-item label="质检任务单状态">
            <el-select v-model="form.checkState" placeholder="请选择" clearable size="small" @focus="funcState">
              <el-option v-for="item in stateOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="质检任务单类型">
            <el-select v-model="form.checkType" placeholder="请选择" clearable size="small" @focus="funcState">
              <el-option v-for="item in stateOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="仓库">
            <el-select v-model="form.warehouseId" size="small" placeholder="请选择" @focus="func">
              <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.id" />
            </el-select>
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
          <el-form-item label="审核人">
            <el-input v-model="form.checkPersonName" size="small" style="width: 200px;" placeholder="请输入" clearable />
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
      <el-button size="small" icon="el-icon-export" type="success" @click="outSelfExcel">批量导出</el-button>
      <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed?"查看所有质检任务记录" : "返回" }}</el-button>
    </div>

    <el-dialog title="请选择以下入库计划单进行质检" :visible.sync="dialogwVisible" width="75%" class="showAll_dialog">
      <div style="height: 8%;">
        <el-row>
          <el-col :span="12">
            <sku-choose :skuform="skuForm" />

          </el-col>
          <el-col :span="2">
            <el-button type="primary" icon="el-icon-search" @click="searchs">查询</el-button>

          </el-col>
        </el-row>
      </div>
      <div class="detailsTable">
        <normaltable
          :plantable="plantable"
          :label-table="labelTable"
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
        <el-button type="primary" @click="addChoose">添加</el-button>
      </div>
    </el-dialog>
    <el-dialog v-drag title="生成质检任务单" :visible.sync="dialogVisible" width="75%" class="showAll_dialog">
      <div class="cardContain">
        <div class="formContain">
          <el-form ref="qualityForm" :rules="rules" :inline="true" size="mini" :model="qualityForm">
            <el-form-item label="质检任务单号">
              <el-input v-model="qualityForm.checkCode" disabled style="width: 200px" />
            </el-form-item>
            <el-form-item v-if="false" label="仓库id">
              <el-input v-model="qualityForm.warehouseId" style="width: 180px" />
            </el-form-item>
            <el-form-item prop="warehouseName" label="仓库名称">
              <el-select v-model="qualityForm.warehouseName" placeholder="请选择仓库名称" @focus="func" @change="changeQualityOptions">
                <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="false">
              <el-input v-model="qualityForm.warehouseCode" placeholder="选择仓库名称后自动填充" disabled style="width: 180px" />
            </el-form-item>
            <el-form-item prop="checkType">
              <span slot="label">
                <span>质检类型</span>
                <el-tooltip class="item" effect="dark" :content="('全检将对以下表单全部质检，无需选择sku数量；随机检需要选择sku数量！')" placement="bottom">
                  <i class="el-icon-question" style="color:#2c68ff" />
                </el-tooltip>
              </span>
              <el-select v-model="qualityForm.checkType" placeholder="请选择质检类型" @focus="funcType" @change="changeType">
                <el-option v-for="item in checkOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
              </el-select>
            </el-form-item>
            <el-form-item label="sku数量(即随机质检入库计划单明细条目数)">
              <el-input v-model="qualityForm.randomNum" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" :disabled="disabled" placeholder="随机质检的sku数量" style="width: 160px;" clearable />
            </el-form-item>
          </el-form>
        </div>
        <div class="detailsTable2">
          <el-table
            border
            :data="table"
            size="mini"
            :row-style="{height:'20px'}"
            :header-cell-style="{background:'#000',color: '#fff'}"
            :cell-style="{padding:'0px'}"
            style="width: 100%, font-size: 10px"
          >
            <el-table-column v-if="false" label="id" prop="id" />
            <el-table-column type="index" label="序号" />
            <el-table-column label="随机质检商品数量(个)" width="180px">
              <template slot-scope="scope">
                <span>
                  <el-input v-model="scope.row.randomCheckNum" placeholder="随机质检类型下填写" oninput="value=value.replace(/[^\d.]/g,'')" :disabled="disabled" size="mini" @input="changes(scope.row)" />
                </span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="采购订单编号" :show-overflow-tooltip="true" prop="purchaseCode" /> -->
            <el-table-column label="入库计划跟踪号" :show-overflow-tooltip="true" prop="inboundTraceCode" />
            <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="commodityName" />
            <el-table-column label="商品sku名称" :show-overflow-tooltip="true" prop="skuName" />
            <el-table-column label="商品数量(个)" :show-overflow-tooltip="true" prop="num" />
            <el-table-column v-if="false" label="计划收货库位" :show-overflow-tooltip="true" prop="predictReceiveLocationCode" />
            <el-table-column v-if="false" label="总重量(kg)" :show-overflow-tooltip="true" prop="totalWeight" />
            <el-table-column v-if="false" label="总净重(kg)" :show-overflow-tooltip="true" prop="totalNetWeight" />
            <el-table-column v-if="false" label="总体积(L)" :show-overflow-tooltip="true" prop="totalVolumn" />
            <el-table-column v-if="false" label="备注" :show-overflow-tooltip="true" prop="remark" />
            <el-table-column v-if="false" label="包装名称" :show-overflow-tooltip="true" prop="containerName" />
            <el-table-column v-if="false" label="包装单位" :show-overflow-tooltip="true" prop="unit" />
            <el-table-column v-if="false" label="客户名称" :show-overflow-tooltip="true" prop="customName" />
            <el-table-column v-if="false" label="供应商名称" :show-overflow-tooltip="true" prop="supplierName" />
            <el-table-column v-if="false" label="收货时间" :show-overflow-tooltip="true" prop="receiveTime">
              <template slot-scope="scope">{{ scope.row.receiveTime| dateYMDHMSFormat }}</template>
            </el-table-column>
            <el-table-column v-if="false" label="是否质检" :show-overflow-tooltip="true" prop="isChecked" :formatter="useFormat" />
            <el-table-column v-if="false" label="是否码盘" :show-overflow-tooltip="true" prop="isPlate" :formatter="useFormat" />
            <el-table-column v-if="false" label="是否装箱" :show-overflow-tooltip="true" prop="isPackaged" :formatter="useFormat" />
            <el-table-column v-if="false" label="是否收货" :show-overflow-tooltip="true" prop="isReceived" :formatter="useFormat" />
            <el-table-column v-if="false" label="生产厂家" :show-overflow-tooltip="true" prop="productCompany" />
            <el-table-column v-if="false" label="生产日期" :show-overflow-tooltip="true" prop="productTime">
              <template slot-scope="scope">{{ scope.row.productTime| dateYMDHMSFormat }}</template>
            </el-table-column>
            <el-table-column v-if="false" label="生产批次" :show-overflow-tooltip="true" prop="productBatch" />
            <el-table-column v-if="false" label="包装代码" :show-overflow-tooltip="true" prop="containerCode" />
            <el-table-column v-if="false" label="包装条码" :show-overflow-tooltip="true" prop="containerBarcode" />
            <el-table-column v-if="false" label="收货数量" :show-overflow-tooltip="true" prop="receivedNum" />
            <el-table-column v-if="false" label="客户代码" :show-overflow-tooltip="true" prop="customCode" />
            <el-table-column v-if="false" label="供应商代码" :show-overflow-tooltip="true" prop="supplierCode" />
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
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
      :header-cell-style="{background:'#000',color: '#fff'}"
      tooltip-effect="dark"
      :height="tableHeight"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
      :header-cell-class-name="handleHeadAddClass"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" />
      <el-table-column :label="labelTitle" align="center">
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <!-- <el-table-column label="计划单编号"  :show-overflow-tooltip="true" prop="planCode" /> -->
        <el-table-column label="质检任务单号" :show-overflow-tooltip="true" width="120px" prop="checkCode" />
        <el-table-column label="质检任务单类型" :show-overflow-tooltip="true" prop="checkType" :formatter="typeFormat" />
        <el-table-column label="质检任务单状态" sortable="custom" :show-overflow-tooltip="true" width="120px" prop="checkState" :formatter="stateFormat" />
        <el-table-column label="来源类型" sortable="custom" :show-overflow-tooltip="true" prop="sourceType" width="120px" :formatter="sourceFormat" />
        <el-table-column label="仓库" sortable="custom" width="120px" :show-overflow-tooltip="true" prop="warehouseName" />
        <!-- <el-table-column label="供应商"  :show-overflow-tooltip="true" prop="supplierName" /> -->
        <el-table-column label="抽检商品种数(个)" :show-overflow-tooltip="true" prop="randomNum" />
        <el-table-column label="总合格数量(个)" :show-overflow-tooltip="true" prop="totalPassNum" />
        <el-table-column label="不合格数量(个)" :show-overflow-tooltip="true" prop="totalUnpassNum" />
        <el-table-column v-if="false" label="检验结果" :show-overflow-tooltip="true" prop="checkResult" />
        <el-table-column sortable="custom" label="修改时间" width="120px" :show-overflow-tooltip="true" prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column v-if="false" label="检验时间" width="120px" :show-overflow-tooltip="true" prop="qualityTime">
          <template slot-scope="scope">{{ scope.row.qualityTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <!-- <el-table-column sortable="custom" label="检验人" width="120px" :show-overflow-tooltip="true" prop="checkerName" /> -->
        <!-- <el-table-column label="质检是否通过"  :show-overflow-tooltip="true" :formatter="useFormat" prop="isPass" /> -->
        <el-table-column v-if="false" label="审核人id" :show-overflow-tooltip="true" prop="checkPersonId" />
        <el-table-column sortable="custom" label="审核人" width="120px" :show-overflow-tooltip="true" prop="checkPersonName" />
        <el-table-column sortable="custom" label="审核时间" width="120px" :show-overflow-tooltip="true" prop="checkTime">
          <template slot-scope="scope">{{ scope.row.checkTime| dateYMDHMSFormat }}</template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="500px"
        prop="action"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-view" type="primary" @click="rowDbclick(scope.row)">详细记录</el-button>
          <el-button v-if="scope.row.checkState === 1" size="mini" icon="el-icon-receive" type="primary" @click="audit(scope.row)">审核通过</el-button>
          <el-button v-if="scope.row.checkState === 1" size="mini" icon="el-icon-finish" type="primary" @click="unAudit(scope.row)">审核不通过</el-button>
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="edit(scope.row)">修改</el-button>
          <el-button v-if="scope.row.checkState === 2" size="mini" icon="el-icon-finish" type="primary" @click="qualityUnpass(scope.row)">质检不通过</el-button>
          <el-button v-if="scope.row.checkState === 2" size="mini" icon="el-icon-finish" type="primary" @click="qualityPass(scope.row)">质检通过结单</el-button>
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
import normaltable from '@/components/normaltable/index.vue'
import SkuChoose from '@/components/SkuChoose/index.vue'
import { kkdeboundce } from '@/utils/kkdebounce'
import { selectQualityCheck, selectQualityCheckNum, getQualityHeadCode, generateIPLToCHE, qualityUnpass, selectInboundPlanDetailNum, selectInboundPlanDetail, auditQuality, delQualityDetail, closeQualityCheck, screenExcelOutCHE, selectExcelOutCHE, selectQualityCheckDetailNum, selectQualityCheckDetail, cancelQualityCheck } from '@/api/user'
import { searchsystemid, searchallwarehouse } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination, normaltable, SkuChoose },
  data() {
    return {
      multipleSelection: [],
      expands: [],
      checkState: null,
      labelTitle: '质检任务-未完成记录',
      labelTable: '未进行质检的订单商品信息统计',
      dialogwVisible: false,
      disabled: true,
      tableLoading: true,
      unAuditDialog: false,
      dialogVisible: false,
      auditForm: {
        reason: null
      },
      orderId: null,
      skuName: null,
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
      rules: {
        warehouseName: [{ required: true, message: '请选择仓库', trigger: 'change' }],
        onshelfAreaName: [{ required: true, message: '请选择库区', trigger: 'change' }],
        onshelfStrategyName: [{ required: true, message: '请选择策略', trigger: 'change' }],
        warehouseCode: [{ required: true, message: '请选择仓库代码', trigger: 'change' }],
        checkType: [{ required: true, message: '请选择质检类型', trigger: 'change' }],
        randomNum: [{ required: true, message: '请填写想要质检的商品sku数量', trigger: 'change' }]
      },
      qualityForm: {
        checkCode: null,
        randomNum: null,
        warehouseId: null,
        warehouseName: null,
        warehouseCode: null,
        checkType: null
      },
      listLoading: true,
      lastTime: 0,
      lastwTime: 0,
      laststateTime: 0,
      viewed: true,
      sums: {},
      tablelist: {},
      spanArr: [],
      comOptions: [],
      comStates: [],
      comLoclist: [],
      conOptions: [],
      conStates: [],
      conLoclist: [],
      stateOptions: [],
      lastStaTime: 0,
      expandState: 0,
      soptions: [],
      options: [],
      id: null,
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
      total: 0,
      tableHeight: 50,
      dialogTableVisible: false,
      warehouseOptions: [],
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 0, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 50, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      skuForm: {
        commodityId: null,
        skuName: null
      },
      qualityState: false,
      form: {
        checkState: null,
        checkType: null,
        warehouseId: null,
        checkPersonName: null
      },
      tableData: [],
      skuOptions: [],
      stateMin: null,
      stateMax: null,
      states: [],
      comlist: [],
      plantable: [],
      sortField: {},
      screen: '',
      lastqtypeTime: 0,
      checkOptions: [],
      dataListSelections: [],
      table: [],
      tabledatas: []
    }
  },
  watch: {
    qualityState: function(newObj) {
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
          this.labelTitle = '质检任务-未完成记录'
          break
        case false:
          this.labelTitle = '质检任务所有记录'
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
    this.qualityState = sessionStorage.getItem('qualityState')
    if (this.qualityState === 'true') {
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
    getQualityHeadCode() {
      getQualityHeadCode({ code: 'CHE' }).then(res => {
        if (res.code === 200) {
          this.qualityForm.checkCode = res.data
        }
      })
    },
    changeQualityOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.qualityForm.warehouseName)
      this.qualityForm.warehouseCode = item.warehouseCode
      this.qualityForm.warehouseName = item.warehouseName
      this.qualityForm.warehouseId = item.id
    },
    clickSelect(val) {
      this.dataListSelections = val
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
    changeType() {
      if (this.qualityForm.checkType === 2) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
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
    submit() {
      this.$refs.qualityForm.validate((valid) => {
        if (valid) {
          this.list = []
          if (Number(this.qualityForm.randomNum) > this.table.length) {
            this.$message.error('随机质检商品sku数量不得大于提供商品sku数量！')
          } else {
            this.$confirm('此操作将提交所填信息, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              for (let i = 0; i < this.table.length; i++) {
                this.list.push({ randomCheckNum: this.table[i].randomCheckNum })
              }
              for (const item of this.table) {
                this.$delete(item, 'randomCheckNum')
              }
              generateIPLToCHE({ inboundPlanDetailHeadAndDetail: { details: this.table, head: {}}, qualityCheckDetailHeadAndDetail: { details: this.list, head: {
                randomNum: this.qualityForm.randomNum,
                checkCode: this.qualityForm.checkCode,
                checkType: this.qualityForm.checkType,
                warehouseId: this.qualityForm.warehouseId,
                warehouseName: this.qualityForm.warehouseName,
                warehouseCode: this.qualityForm.warehouseCode
              }}}).then(res => {
                if (res.code === 200) {
                  this.$message.success('提交成功')
                  this.reload()
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              })
            })
          }
        }
      })
    },
    funcType() {
      const now = new Date().valueOf()
      if (this.lastqtypeTime === 0) {
        searchsystemid('QUALITY_TYPE').then(res => {
          this.checkOptions = res.data
        }
        )
        this.lastqtypeTime = now
      } else {
        if ((now - this.lastqtypeTime) > 5000) {
          this.lastqtypeTime = now
        }
      }
    },
    scanHistory: throttle(function() {
      this.viewed = !this.viewed
      if (this.viewed === false) {
        sessionStorage.setItem('qualityState', true)
        this.stateMin = null
        this.stateMax = null
      } else {
        sessionStorage.setItem('qualityState', false)
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
    func() {
      const now = new Date().valueOf()
      if (this.lastwTime === 0) {
        searchallwarehouse().then(res => {
          this.warehouseOptions = res.data
        }
        )
        this.lastwTime = now
      } else {
        if ((now - this.lastwTime) > 5000) {
          this.lastwTime = now
        }
      }
    },
    qualityUnpass(row) {
      qualityUnpass(row).then(res => {
        if (res.code === 200) {
          this.$message.success('质检不通过，该条质检任务已结束！')
          this.reload()
        }
      })
    },
    qualityPass(row) {
      closeQualityCheck({ detail: row, code: '' }).then(res => {
        if (res.code === 200) {
          this.$message.success('质检已通过,如需收货，请去入库计划页面收货')
          this.reload()
          // this.$router.push('/receiptorderplan')
        }
      })
    },
    unAudit(row) {
      this.unAuditDialog = true
      row.checkPersonId = sessionStorage.getItem('getUserId')
      this.reasonTable = Object.assign({}, row)
    },
    submitReason() {
      this.$confirm('确定反馈审核不通过的原因吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        closeQualityCheck({ detail: this.reasonTable, code: this.auditForm.reason }).then(res => {
          if (res.code === 200) {
            this.$message.success('已反馈')
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
    useFormat(row) {
      if (row.isPass === 0) {
        return '否'
      } else if (row.isPass === 1) {
        return '是'
      }
    },
    audit(row) {
      this.$confirm('确认该任务通过审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.checkPersonId = sessionStorage.getItem('getUserId')
        auditQuality(row).then(res => {
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
          if (item.planCode === this.tabledatas[index - 1].planCode) {
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
    funcState() {
      const now = new Date().valueOf()
      if (this.lastStaTime === 0) {
        searchsystemid('QUALITY_STATE').then(res => {
          this.stateOptions = res.data
        })
        this.lastStaTime = now
      } else {
        if ((now - this.lastStaTime) > 5000) {
          this.lastStaTime = now
        }
      }
    },
    sourceFormat(row) {
      if (row.sourceType === 1) {
        return '采购计划来源'
      } else if (row.sourceType === 0) {
        return '盲收来源'
      }
    },
    deleteDetails(row) {
      this.$confirm('确定删除该条表细吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delQualityDetail({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getListDetails()
          }
        })
      })
    },
    edit(row) {
      this.$router.push('/qualitylist')
      sessionStorage.setItem('qualityChildId', row.id)
      sessionStorage.setItem('checkCode', row.checkCode)
    },
    // edit(row) {
    //   this.dialogVisible = true
    //   this.editList(row)
    // },
    // editList(row) {
    //   selectQualityCheck({
    //     pojo: {
    //       checkCode: row.checkCode
    //     }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
    //     this.qualityForm = Object.assign({}, response.data[0])
    //   })
    //   selectQualityCheckDetail({
    //     pojo: {
    //       checkCode: row.checkCode
    //     }}).then(response => {
    //     this.table = response.data.list
    //   })
    // },
    rowDbclick(row) {
      sessionStorage.setItem('qualityChildId', row.id)
      sessionStorage.setItem('checkCode', row.checkCode)
      this.$router.push('qualitytotal')
    },
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid('QUALITY_STATE').then(res => {
          this.soptions = res.data
        })
        this.laststateTime = now
      } else {
        if ((now - this.laststateTime) > 5000) {
          this.laststateTime = now
        }
      }
      return changeAll(row.checkState, this.soptions)
    },
    typeFormat(row) {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        searchsystemid('QUALITY_TYPE').then(res => {
          this.options = res.data
        })
        this.lastTime = now
      } else {
        if ((now - this.lastTime) > 5000) {
          this.lastTime = now
        }
      }
      return changeAll(row.checkType, this.options)
    },
    expandChange(row, expandedRows) {
      this.expands = []
      if (expandedRows.length > 0) {
        row ? this.expands.push(row.id) : ''
        this.id = row.id
        this.getListDetails()
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    search: kkdeboundce(function() {
      this.getList()
    }, 500),
    getListDetails() {
      var searchDTO = {
        'page': 1,
        'num': 10
      }
      this.tableLoading = true
      selectQualityCheckDetail({ searchDTO,
        pojo: {
          checkId: this.id
        }}).then(response => {
        this.tablelist = response.data
        this.tabledatas = this.tablelist.list
        this.sums = this.tablelist.sums
        this.flitterData()
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      selectQualityCheckDetailNum({ searchDTO,
        pojo: {
          checkId: this.id
        }}).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    outExcel() {
      const data = { searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        checkState: this.form.checkState,
        checkType: this.form.checkType,
        warehouseId: this.form.warehouseId,
        checkPersonName: this.form.checkPersonName
      }, workGroupId: window.sessionStorage.workGroupId, stateMin: this.stateMin,
      stateMax: this.stateMax, startTime1: this.value1[0], endTime1: this.value1[1], startTime2: this.value2[0], endTime2: this.value2[1] }
      screenExcelOutCHE(data).then((res) => {
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `质检任务单`)
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
          selectExcelOutCHE(this.multipleSelection).then((res) => {
            let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.setAttribute('download', `质检任务单`)
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
    // finish(row) {
    //   this.$confirm('确定结束该条质检单吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     closeQualityCheck(row).then(res => {
    //       if (res.code === 200) {
    //         this.$message.success('已结束')
    //         this.reload()
    //       }
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消'
    //     })
    //   })
    // },
    cancel(row) {
      this.$confirm('确定作废该条质检单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelQualityCheck({ head: {
          id: row.id,
          checkState: row.checkState
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
    refresh: kkdeboundce(function() {
      this.reload()
    }, 500),
    getList() {
      this.listLoading = true
      selectQualityCheck({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        checkState: this.form.checkState,
        checkType: this.form.checkType,
        warehouseId: this.form.warehouseId,
        checkPersonName: this.form.checkPersonName
      }, workGroupId: window.sessionStorage.workGroupId, stateMin: this.stateMin,
      stateMax: this.stateMax, screen: this.screen, startTime: this.value1[0], endTime: this.value1[1], startTime1: this.value2[0], endTime1: this.value2[1] }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectQualityCheckNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        checkState: this.form.checkState,
        checkType: this.form.checkType,
        warehouseId: this.form.warehouseId,
        checkPersonName: this.form.checkPersonName
      }, workGroupId: window.sessionStorage.workGroupId, stateMin: this.stateMin,
      stateMax: this.stateMax, screen: this.screen, startTime: this.value1[0], endTime: this.value1[1], startTime1: this.value2[0], endTime1: this.value2[1] }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    addChoose() {
      if (this.dataListSelections.length === 0) {
        this.$message.warning('请选择数据后再进行下一步操作')
      } else {
        this.dialogwVisible = false
        this.dialogVisible = true
        this.getQualityHeadCode()
        this.table = this.dataListSelections
      }
    },
    getListDetail(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      selectInboundPlanDetail({ searchDTO,
        pojo: { isChecked: 0, skuName: this.skuForm.skuName, commodityId: this.skuForm.commodityId
        }}).then(res => {
        this.plantable = res.data.list
      })
      selectInboundPlanDetailNum({ searchDTO,
        pojo: { isChecked: 0, skuName: this.skuForm.skuName, commodityId: this.skuForm.commodityId
        }}).then(res => {
        this.totalCount = res.data
      })
    },
    searchs() {
      this.getListDetail(this.pagesize, this.currentPage)
    },
    add() {
      this.plantable = []
      this.$notify({
        title: '成功',
        message: '正在查询需要进行质检的表单数据，请稍等片刻！',
        type: 'success',
        duration: 1000
      })
      setTimeout(() => {
        this.dialogwVisible = true
      }, 1000)
      this.getListDetail(this.pagesize, this.currentPage)
    },
    // 选
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
  <style scoped>
.el-form /deep/.el-form-item__label{
      color:rgb(0, 0, 0);
      font-weight: bold;
    }
  .search {
      margin: 1px;
      padding-top:10px;
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
      // height: 80%
    }
    .el-dialog__title {
      color: white;
      caret-color: transparent;
    }
    .el-dialog__footer {
      margin-top: 10px
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
