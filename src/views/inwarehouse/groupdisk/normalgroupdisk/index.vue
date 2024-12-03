<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" label-width="120px" :model="form">
          <el-form-item label="码盘任务单状态">
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
            <el-button type="success" round icon="el-icon-search" size="small" @click="search()">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="btngroups">
      <el-button size="small" icon="el-icon-plus" type="primary" @click="add">新建</el-button>
      <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed? "查看所有码盘任务-有计划记录" : "返回" }}</el-button>
    </div>

    <el-dialog title="请选择以下已装箱的采购订单进行码盘" :visible.sync="dialogVisible" width="75%" class="showAll_dialog">
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
          :label-table="labelTable"
          :containershow="containershow"
          :plantable="plantable"
          :data-list-selections="dataListSelections"
          @clickSelect="clickSelect"
        />
      </div>
      <div class="pagContainer">
        <el-pagination
          :current-page="currentPage3"
          :page-sizes="[50, 100]"
          :page-size="pagesize3"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount3"
          @size-change="handleSizeChange3"
          @current-change="handleCurrentChange3"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addChoose">添加</el-button>
      </div>
    </el-dialog>
    <el-dialog title="生成组盘任务单" :visible.sync="dialogDiskVisible" width="75%" class="showAll_dialog2">
      <div class="cardContain">
        <div class="formContain">
          <el-form ref="packForm" :model="packForm" :rules="rules" :inline="true" class="demo-form-inline">
            <el-form-item label="码盘任务单号">
              <el-input v-model="packForm.combineCode" size="mini" disabled style="width: 200px;" clearable />
            </el-form-item>
            <el-form-item v-if="false" label="仓库id">
              <el-input v-model="packForm.warehouseId" size="mini" style="width: 160px;" clearable />
            </el-form-item>
            <el-form-item prop="warehouseName" label="仓库">
              <el-select v-model="packForm.warehouseName" size="mini" placeholder="请选择仓库" @focus="func" @change="changePackWarehouseOptions">
                <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="false">
              <el-input v-model="packForm.warehouseCode" size="mini" style="width: 160px;" clearable />
            </el-form-item>
          </el-form>
        </div>
        <div class="detailsTable2">
          <el-table
            :data="tabledisk"
            border
            size="mini"
            :row-class-name="tableDiskName"
            :header-cell-style="{background:'#000',color: '#fff'}"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            style="width: 100%"
          >
            <el-table-column label="序号" type="index" />
            <el-table-column v-if="false" label="行数">
              <template slot-scope="scope">
                <span>
                  <el-input v-model="scope.row.rowNum" size="mini" />
                </span>
              </template>
            </el-table-column>
            <el-table-column label="码盘名称">
              <template slot-scope="scope">
                <el-select v-model="scope.row.packageCode" style="width: 200px" size="mini" placeholder="请选择" @focus="funcContainer" @change="changeConOptions(scope.row)">
                  <el-option v-for="item in containerOptions" :key="item.id" :label="item.code" :value="item.code" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="入库计划单明细选择" width="500px">
              <template slot-scope="scope">
                <ComboGrid
                  v-model="scope.row.diskTable2"
                  value-field="id"
                  text-field="commodityName"
                  :multiple="true"
                  :data="diskTable"
                  style="width: 450px"
                  :panel-style="{width:'800px'}"
                  :text-formatter="formatText"
                  @valueChange="example(scope.row)"
                >
                  <DataGrid slot="grid" :border="false">
                    <GridColumn v-if="false" field="id" title="序号" />
                    <GridColumn field="commodityName" title="商品" />
                    <GridColumn field="skuName" title="商品sku" />
                    <GridColumn field="containerName" title="包装" />
                    <GridColumn field="containerCode" title="包装代码" />
                    <GridColumn field="containerBarcode" title="包装条码" />
                  </DataGrid>
                </ComboGrid>
              </template>
            </el-table-column>
            <el-table-column v-if="false" label="包装id">
              <template slot-scope="scope">
                <span>
                  <el-input v-model="scope.row.packageId" size="mini" />
                </span>
              </template>
            </el-table-column>
            <el-table-column v-if="false" label="码盘数量">
              <template slot-scope="scope">
                <span>
                  <el-input v-model="scope.row.packageNum" disabled size="mini" />
                </span>
              </template>
            </el-table-column>
            <el-table-column label="是否混码码盘">
              <template slot-scope="scope">
                <el-select v-model="scope.row.isFix" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in foptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="action"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button-group>
                  <el-button size="mini" type="primary" @click="addDisk(scope.row)">添加</el-button>
                  <!-- <el-button size="mini" @click="delect(scope.$inde)">删除</el-button> -->
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDisk">提交</el-button>
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
        <!-- <el-table-column label="码盘人" sortable="custom" :show-overflow-tooltip="true" prop="personName" /> -->
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
import normaltable from '@/components/normaltable/index.vue'
import { kkdeboundce } from '@/utils/kkdebounce'
import SkuChoose from '@/components/SkuChoose/index.vue'
import { searchsystemid, searchcon, searchsku } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
import { selectCombineStack, selectCombineStackNum, getStackHeadCode, generateIPLToCOB, selectInboundPlanDetail, selectInboundPlanDetailNum, auditDisk, selectWarehouse, closeCombine, cancelCombine } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination, normaltable, SkuChoose },
  data() {
    return {
      multipleSelection: [],
      expands: [],
      dataListSelections: [],
      containerOptions: [],
      dialogDiskVisible: false,
      stateMin: null,
      stateMax: null,
      labelTable: '未完成码盘的采购订单',
      labelTitle: '码盘任务-有计划未完成记录',
      containershow: true,
      dialogVisible: false,
      plantable: [],
      combineState: null,
      skuOptions: [],
      advanced: false,
      viewed: true,
      skuForm: {
        commodityId: null,
        skuName: null
      },
      tableLoading: true,
      listLoading: true,
      listLoading2: true,
      normaldiskState: false,
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
      packForm: {
        warehouseId: null,
        combineCode: null,
        warehouseCode: null,
        warehouseName: null
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
      rules: {
        warehouseName: [{ required: true, message: '请选择仓库', trigger: 'change' }],
        onshelfAreaName: [{ required: true, message: '请选择库区', trigger: 'change' }],
        onshelfStrategyName: [{ required: true, message: '请选择策略', trigger: 'change' }],
        warehouseCode: [{ required: true, message: '请选择仓库代码', trigger: 'change' }],
        checkType: [{ required: true, message: '请选择质检类型', trigger: 'change' }],
        randomNum: [{ required: true, message: '请填写想要质检的商品sku数量', trigger: 'change' }]
      },
      tableHeight: 50,
      warehouseOptions: [],
      dialogTableVisible: false,
      lastconTime: 0,
      sortField: {},
      screen: '',
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 50, // 每页显示的条数
      currentPage2: 1, // 第几页
      totalCount2: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize2: 5, // 每页显示的条数
      currentPage3: 1, // 第几页
      totalCount3: 0, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize3: 50, // 每页显示的条数
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
      list: [],
      diskTotalTable: [],
      orderId: null,
      skuName: null,
      form: {
        combineCode: null,
        sourceType: null,
        warehouseCode: null,
        isFinished: null,
        personName: null,
        checkPersonName: null
      },
      rform: {
        stackCode: null,
        packageCode: null,
        combineTraceCode: null,
        planCode: null
      },
      tabledatas: [],
      diskTable: [],
      tabledisk: [
        {
        }
      ],
      tableData: []
    }
  },
  watch: {
    normaldiskState: function(newObj) {
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
          this.labelTitle = '码盘任务-有计划未完成记录'
          break
        case false:
          this.labelTitle = '码盘任务-有计划所有记录'
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
    this.normaldiskState = sessionStorage.getItem('normaldiskState')
    if (this.normaldiskState === 'true') {
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
    formatText(id) {
      return id
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
    getStackHeadCode() {
      getStackHeadCode({ code: 'COB' }).then(res => {
        if (res.code === 200) {
          this.packForm.combineCode = res.data
        }
      })
    },
    rowDbclick(row) {
      sessionStorage.setItem('combineChildId', row.id)
      sessionStorage.setItem('combineId', row.combineCode)
      this.$router.push('/normaldisktotal')
    },
    example(row) {
      if (row.diskTable2.length !== 0) {
        row.packageNum = row.diskTable2.length
      }
      this.list.push({ rowNum: row.rowNum })
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
    handleSizeChange3(val) {
      this.pagesize3 = val
      this.getListDetail(val, 1)
      this.currentPage3 = 1
    },
    // 显示第几页
    handleCurrentChange3(val) {
      this.currentPage3 = val
      this.getListDetail(this.pagesize3, val)
    },
    changeConOptions(row) {
      const item = this.containerOptions.find(item1 => item1.code === row.packageCode)
      row.packageId = item.id
      row.packageCode = item.code
    },
    changePackWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.packForm.warehouseName)
      this.packForm.warehouseCode = item.warehouseCode
      this.packForm.warehouseName = item.warehouseName
      this.packForm.warehouseId = item.id
    },
    submitDisk() {
      this.$refs.packForm.validate((valid) => {
        if (valid) {
          this.$confirm('此操作将提交所填信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            for (const item of this.tabledisk) {
              this.$delete(item, 'diskTable2')
            }
            generateIPLToCOB({ inboundPlanDetailHeadAndDetail: { head: {}, details: this.diskTotalTable }, combineHeadAndPlateDetailAndPackageDetail: { combineStackPackageDetails: this.list, combineStackDetails: this.tabledisk, combineStack: { warehouseId: this.packForm.warehouseId, warehouseCode: this.packForm.warehouseCode, warehouseName: this.packForm.warehouseName }}}).then(res => {
              if (res.code === 200) {
                this.$message.success('提交成功')
                this.reload()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      })
    },
    addDisk(row) {
      if (!row.diskTable2) {
        this.$message.warning('请先选择数据！')
      } else {
        var arrList = row.diskTable2
        for (var i = 0; i < arrList.length; i++) {
          for (var j = 0; j < this.diskTable.length; j++) {
            if (arrList[i] === this.diskTable[j].id) {
              this.diskTable.splice(j, 1)
            }
          }
        }
        if (this.diskTable.length === 0) {
          this.$message.error('您已完成组盘！')
        } else {
          const list = {
            packageId: '',
            packageCode: '',
            packageNum: '',
            isFix: '',
            rowNum: '',
            diskTable2: ''
          }
          this.tabledisk.push(list)
        }
      }
    },
    tableDiskName({ row, rowIndex }) {
      row.rowNum = rowIndex + 1
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    clickSelect(val) {
      this.dataListSelections = val
    },
    addChoose() {
      if (this.dataListSelections.length === 0) {
        this.$message.warning('请选择数据后再进行下一步操作')
      } else {
        this.dialogVisible = false
        this.dialogDiskVisible = true
        this.getStackHeadCode()
        this.diskTable = this.dataListSelections
        this.diskTotalTable = this.dataListSelections
      }
    },
    scanHistory: throttle(function() {
      this.viewed = !this.viewed
      if (this.viewed === false) {
        sessionStorage.setItem('normaldiskState', true)
        this.stateMin = null
        this.stateMax = null
      } else {
        sessionStorage.setItem('normaldiskState', false)
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
    // edit(row) {
    //   this.dialogDiskVisible = true
    //   this.editList(row)
    // },
    // editList(row) {
    //   selectCombineStack({
    //     pojo: {
    //       combineCode: row.combineCode
    //     }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
    //     this.packForm = Object.assign({}, response.data[0])
    //   })
    //   selectCombineStackDetail({
    //     pojo: {
    //       stackId: row.id
    //     }}).then(response => {
    //     this.tabledisk = response.data.list
    //   })
    //   // sessionStorage.removeItem('orderId')
    //   // sessionStorage.removeItem('childId')
    // },
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
    funcSkuName(query) {
      searchsku().then(res => {
        this.states = res.data
        this.comlist = this.states.map(item => {
          return { id: item.id, skuName: item.skuName, skuCode: item.skuCode }
        })
      })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.skuOptions = this.comlist.filter(item => {
              return item.skuName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.skuOptions = []
        }
      }, 100)
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
        sourceType: 1,
        // isFinished: this.form.isFinished,
        personName: this.form.personName,
        checkPersonName: this.form.checkPersonName
      }, workGroupId: window.sessionStorage.workGroupId, startTime: this.value1[0], endTime: this.value1[1], startTime1: this.value2[0], endTime2: this.value2[1], screen: this.screen, stateMin: this.stateMin,
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
        sourceType: 1,
        // isFinished: this.form.isFinished,
        personName: this.form.personName,
        checkPersonName: this.form.checkPersonName
      }, workGroupId: window.sessionStorage.workGroupId, screen: this.screen, startTime: this.value1[0], endTime: this.value1[1], startTime1: this.value2[0], endTime2: this.value2[1], stateMin: this.stateMin,
      stateMax: this.stateMax }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getListDetail(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      selectInboundPlanDetail({ searchDTO,
        pojo: { isPackaged: true, isPlate: 0, skuName: this.skuForm.skuName, commodityId: this.skuForm.commodityId
        }}).then(res => {
        this.plantable = res.data.list
      })
      selectInboundPlanDetailNum({ searchDTO,
        pojo: { isPackaged: true, isPlate: 0, skuName: this.skuForm.skuName, commodityId: this.skuForm.commodityId
        }}).then(res => {
        this.totalCount3 = res.data
      })
    },
    searchs() {
      this.getListDetail(this.pagesize, this.currentPage)
    },
    add() {
      this.plantable = []
      this.$notify({
        title: '成功',
        message: '正在查询需要进行码盘的表单数据，请稍等片刻！',
        type: 'success',
        duration: 1000
      })
      setTimeout(() => {
        this.dialogVisible = true
      }, 1000)
      this.getListDetail(this.pagesize, this.currentPage)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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

        .cardContain {
          height:100%;
          .formContain {
            height: 15%;
            border: 1px solid #fff;
            padding: 5px 5px;
            ::v-deep.el-form-item__label {
      color:#fff
    }
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
          background-color: #262626cb;
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

