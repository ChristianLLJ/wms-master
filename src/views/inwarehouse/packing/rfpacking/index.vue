<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" class="demo-form-inline" :model="form">
          <el-form-item label="装箱任务状态">
            <el-select v-model="form.packingState" placeholder="请选择" clearable size="small" @focus="funcState">
              <el-option v-for="item in stateOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item>
          <el-form-item label="仓库">
            <el-select v-model="form.warehouseId" size="small" placeholder="请选择" @focus="func">
              <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="装箱人">
            <el-input v-model="form.packingName" placeholder="请输入" size="small" style="width: 160px;" clearable />
          </el-form-item>
          <el-form-item label="审核人">
            <el-input v-model="form.checkPersonName" placeholder="请输入" size="small" style="width: 160px;" clearable />
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
          <!-- <el-form-item label="装箱时间">
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
          </el-form-item>
          <el-form-item label="审核时间">
            <el-date-picker
              v-model="value3"
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
            <el-button type="success" icon="el-icon-search" round size="small" @click="search()">查询</el-button>
            <!-- <el-tooltip class="item" effect="dark" content="将满足筛选条件的单据导出" placement="bottom">
              <el-button type="primary" round icon="el-icon-export" size="small" @click="outExcel">筛选导出</el-button>
            </el-tooltip> -->
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="btngroups">
      <el-button size="small" icon="el-icon-export" type="primary" @click="outSelfExcel">批量导出</el-button>
      <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed? "查看所有装箱任务-无计划记录" : "返回" }}</el-button>
    </div>

    <el-dialog title="选择添加" :visible.sync="dialogVisible" width="75%" class="showAll_dialog">
      <div class="detailsTable">
        <el-table
          border
          :data="plantable"
          size="small"
          row-key="id"
          :row-style="{height:'20px'}"
          :cell-style="{padding:'0px'}"
          :header-cell-style="{background:'#262626',color: '#fff'}"
          style="width: 100%, font-size: 10px"
          @selection-change="selectionChangeHandle"
        >
          <el-table-column
            type="selection"
            show-overflow-tooltip
            reserve-selection
          />
          <el-table-column v-if="false" label="id" prop="id" />
          <el-table-column type="index" label="序号" />
          <el-table-column label="采购订单号" width="150px" :show-overflow-tooltip="true" prop="purchaseCode" />
          <el-table-column label="跟踪号" width="150px" :show-overflow-tooltip="true" prop="inboundTraceCode" />
          <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="commodityName" />
          <el-table-column label="商品sku" :show-overflow-tooltip="true" prop="skuName" />
          <el-table-column label="最小sku单位" :show-overflow-tooltip="true" prop="unit" />
          <el-table-column label="数量(个)" :show-overflow-tooltip="true" prop="num" />
          <el-table-column label="客户名称" :show-overflow-tooltip="true" prop="customName" />
          <el-table-column label="供应商名称" :show-overflow-tooltip="true" prop="supplierName" />
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addChoose">添加</el-button>
      </div>
    </el-dialog>

    <el-dialog title="生成装箱任务" :visible.sync="dialogPackVisible" width="75%" class="showAll_dialog2">
      <div class="cardContain">
        <div class="formContain">
          <el-form ref="packForm" :model="packForm" :rules="rules" :inline="true" class="demo-form-inline">
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
          <el-form ref="formData" :model="formData" :rules="formData.rules">
            <el-table
              border
              :data="formData.tablepack"
              size="mini"
              :row-style="{height:'20px'}"
              :cell-style="{padding:'0px'}"
              style="width: 100%, font-size: 10px"
            >
              <el-table-column v-if="false" label="id" prop="id" />
              <el-table-column type="index" label="序号" />
              <el-table-column v-if="false" label="装箱Id">
                <template slot-scope="scope">
                  <span>
                    <el-input v-model="scope.row.packageId" disabled size="mini" />
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="包装代码" width="200px">
                <template slot-scope="scope">
                  <el-form-item :prop="'tablepack.' + scope.$index + '.packageCode'">
                    <ComboGrid
                      v-model="scope.row.packageCode"
                      value-field="code"
                      text-field="code"
                      :data="packageOptions"
                      :panel-style="{width:'500px'}"
                      :text-formatter="formatPackText"
                      @valueChange="examplePack(scope.row)"
                    >
                      <DataGrid slot="grid" :border="false">
                        <GridColumn v-if="false" field="id" />
                        <GridColumn field="name" title="包装名称" />
                        <GridColumn field="code" title="包装代码" />
                        <GridColumn field="innerNum" title="包装容量" />
                      </DataGrid>
                    </ComboGrid>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="商品装箱数量(个)" width="200px" prop="commodityNum">
                <template slot-scope="scope">
                  <el-form-item :prop="'tablepack.' + scope.$index + '.commodityNum'" :rules="formData.rules.commodityNum">
                    <el-input
                      v-model="scope.row.commodityNum"
                      placeholder="根据商品数量填写"
                      oninput="value=value.replace(/[^\d.]/g,'')"
                      size="mini"
                      @input="changes(scope.row)"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column v-if="false" label="采购订单表头Id" :show-overflow-tooltip="true" prop="planId" />
              <el-table-column v-if="false" label="采购订单编号" :show-overflow-tooltip="true" prop="purchaseCode" />
              <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="commodityName" />
              <el-table-column label="商品sku" :show-overflow-tooltip="true" prop="skuName" />
              <el-table-column label="商品数量(个)" :show-overflow-tooltip="true" prop="num" />
              <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button v-if="scope.row.expandState !== 1 " size="mini" type="primary" @click="expand(scope.row,scope.$index)">拆分多箱</el-button>
                    <el-button v-if="scope.row.expandState === 1 " size="mini" @click="cancelTable(scope.$index)">删除</el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPack">提交</el-button>
      </div>
    </el-dialog>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      :row-key="getRowKeys"
      tooltip-effect="dark"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      :header-cell-style="{background:'#000',color: '#fff'}"
      border
      size="mini"
      :height="tableHeight"
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
        <el-table-column v-if="false" label="id" prop="id" />
        <el-table-column label="装箱任务单号" :show-overflow-tooltip="true" prop="packingId" />
        <el-table-column label="装箱任务状态" sortable="custom" :show-overflow-tooltip="true" prop="packingState" :formatter="packFormat" />
        <el-table-column label="来源类型" :show-overflow-tooltip="true" prop="sourceType" :formatter="sourceFormat" />
        <el-table-column label="仓库" sortable="custom" :show-overflow-tooltip="true" prop="warehouseCode" />
        <el-table-column label="修改时间" sortable="custom" :show-overflow-tooltip="true" prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="装箱时间" sortable="custom" :show-overflow-tooltip="true" prop="packingTime">
          <template slot-scope="scope">{{ scope.row.packingTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="装箱人" sortable="custom" :show-overflow-tooltip="true" prop="packingName" />
        <el-table-column v-if="false" label="审核人id" :show-overflow-tooltip="true" prop="checkPersonId" />
        <el-table-column label="审核人" sortable="custom" :show-overflow-tooltip="true" prop="checkPersonName" />
        <el-table-column label="审核时间" sortable="custom" :show-overflow-tooltip="true" prop="checkTime">
          <template slot-scope="scope">{{ scope.row.checkTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="备注" :show-overflow-tooltip="true" prop="remark" />
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作"
        width="320px"
      >
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-view" type="primary" @click="rowDbclick(scope.row)">详细记录</el-button>
          <el-button v-if="scope.row.packingState === 1" size="mini" icon="el-icon-receive" type="primary" @click="audit(scope.row)">审核通过</el-button>
          <el-button v-if="scope.row.packingState === 1" size="mini" icon="el-icon-edit" type="primary" @click="edit(scope.row)">修改</el-button>
          <el-button v-if="scope.row.packingState === 2" size="mini" icon="el-icon-finish" type="primary" @click="finish(scope.row)">结单</el-button>
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
import { selectInPackage, screenContainer, selectInPackageNum, closeInPackage, generateIPLToIPA, searchWorkGroupWarehouse, selectInboundPlanDetail, auditPack, screenGoods, delPackDetail, selectInPackageDetailNum, screenExcelOutIPA, selectExcelOutIPA, selectInPackageDetail, cancelInPackage } from '@/api/user'
import { searchsystemid } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      multipleSelection: [],
      dialogPackVisible: false,
      packageOptions: [],
      expands: [],
      table: [],
      rules: {
        warehouseName: [{ required: true, message: '请选择仓库', trigger: 'change' }],
        onshelfAreaName: [{ required: true, message: '请选择库区', trigger: 'change' }],
        onshelfStrategyName: [{ required: true, message: '请选择策略', trigger: 'change' }],
        warehouseCode: [{ required: true, message: '请选择仓库代码', trigger: 'change' }],
        checkType: [{ required: true, message: '请选择质检类型', trigger: 'change' }],
        randomNum: [{ required: true, message: '请填写想要质检的商品sku数量', trigger: 'change' }]
      },
      packForm: {
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null
      },
      plantable: [],
      labelTitle: '装箱任务-无计划未完成记录',
      advanced: false,
      packingState: null,
      viewed: true,
      tableLoading: true,
      dialogVisible: false,
      rfpackState: false,
      comOptions: [],
      spanArr: [],
      comStates: [],
      comLoclist: [],
      dataListSelections: [],
      formData: {
        rules: {
          packageCode: [{
            required: true,
            message: '请选择包装',
            tirgger: ['change']
          }],
          // commodityNum: [{
          //   required: true,
          //   message: '请正确填写商品装箱数量',
          //   tirgger: ['blur']
          // }],
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
      sums: {},
      tablelist: {},
      listLoading: true,
      expandState: 0,
      lastTime: 0,
      id: null,
      total: 0,
      list: [],
      options: [],
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
      tableHeight: 50,
      dialogTableVisible: false,
      stateOptions: [],
      lastStaTime: 0,
      formLabelWidth: '120px',
      packTotalJudge2: 0,
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
      warehouseOptions: [],
      lastPackTime: 0,
      lastwTime: 0,
      startTime: null,
      endTime: null,
      form: {
        packingState: null,
        warehouseId: null,
        packingName: null,
        checkPersonName: null
      },
      rform: {
        commodityName: null,
        customName: null,
        supplierName: null
      },
      sortField: {},
      screen: '',
      tabledatas: [],
      tableData: []
    }
  },
  watch: {
    rfpackState: function(newObj) {
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
          this.labelTitle = '装箱任务-无计划未完成记录'
          break
        case false:
          this.labelTitle = '装箱任务-无计划所有记录'
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
    this.rfpackState = sessionStorage.getItem('rfpackState')
    if (this.rfpackState === 'true') {
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
    formatPackText(code) {
      return code
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
    expand(row, index) {
      this.packTotal = 0
      if (!row.commodityNum) {
        this.$message.error('请先填写装箱数量!')
      } else if (Number(row.commodityNum) === Number(row.num)) {
        this.$message.error('请勿再次拆分！')
      } else if (Number(row.commodityNum) === 0) {
        this.$message.error('装箱数量禁止填写为0!')
      } else {
        for (let j = 0; j < this.formData.tablepack.length; j++) {
          if (this.formData.tablepack[index].id === this.formData.tablepack[j].id) {
            this.packTotal += Number(this.formData.tablepack[j].commodityNum)
          }
        }
        if (Number(row.num) === Number(this.packTotal)) {
          this.$message.error('该商品已分配装箱，无须再次拆分！')
        } else {
          const listPack = Object.assign({}, row)
          const key = 'expandState'
          const value = 1
          listPack[key] = value
          listPack.packageCode = null
          listPack.packageId = null
          listPack.commodityNum = null
          this.formData.tablepack.splice(index + 1, 0, listPack)
        }
      }
    },
    cancelTable(index) {
      this.formData.tablepack.splice(index, 1)
    },
    examplePack(row) {
      const item = this.packageOptions.find(item1 => item1.code === row.packageCode)
      row.packageId = item.id
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
    addChoose() {
      if (this.dataListSelections.length === 0) {
        this.$message.warning('请选择数据后再进行下一步操作')
      } else {
        this.dialogVisible = false
        this.dialogPackVisible = true
        this.funPackage()
        this.formData.tablepack = this.dataListSelections
      }
    },
    submitPack() {
      this.packTotalJudge2 = 0
      this.$refs.packForm.validate((valid) => {
        if (valid) {
          this.$refs.formData.validate((valid) => {
            if (valid) {
              for (let j = 0; j < this.formData.tablepack.length; j++) {
                this.packTotalJudge2 += Number(this.formData.tablepack[j].commodityNum)
              }
              console.log(this.packTotalJudge2)
              if (this.packTotalJudge !== this.packTotalJudge2) {
                this.$message.error('数量填写有误，提交失败！')
              } else {
                this.$confirm('此操作将提交所填信息, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  for (let i = 0; i < this.formData.tablepack.length; i++) {
                    this.list.push({ packageId: this.formData.tablepack[i].packageId, packageCode: this.formData.tablepack[i].packageCode, inboundTraceCode: this.formData.tablepack[i].inboundTraceCode, commodityNum: this.formData.tablepack[i].commodityNum })
                  }
                  for (const item of this.formData.tablepack) {
                    this.$delete(item, 'packageId')
                    this.$delete(item, 'packageCode')
                    this.$delete(item, 'commodityNum')
                    this.$delete(item, 'expandState')
                  }
                  for (const item of this.tablepack1) {
                    this.$delete(item, 'packageId')
                    this.$delete(item, 'packageCode')
                    this.$delete(item, 'commodityNum')
                    this.$delete(item, 'expandState')
                  }
                  generateIPLToIPA({ inboundPlanDetailHeadAndDetail: { details: this.tablepack1, head: {}}, packingDetailHeadAndDetail: { details: this.list, head: {
                    warehouseId: this.packForm.warehouseId,
                    warehouseCode: this.packForm.warehouseCode,
                    warehouseName: this.packForm.warehouseName
                  }}}).then(res => {
                    if (res.code === 200) {
                      this.$message.success('提交成功')
                      this.$refs.formData.resetFields()
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
            }
          })
        }
      })
    },
    changePackWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.packForm.warehouseName)
      this.packForm.warehouseCode = item.warehouseCode
      this.packForm.warehouseName = item.warehouseName
      this.packForm.warehouseId = item.id
    },
    func() {
      const now = new Date().valueOf()
      if (this.lastwTime === 0) {
        searchWorkGroupWarehouse({
          id: window.sessionStorage.workGroupId,
          page: 1,
          num: 1
        }).then(res => {
          this.warehouseOptions = res.data.results
        }
        )
        this.lastwTime = now
      } else {
        if ((now - this.lastwTime) > 5000) {
          this.lastwTime = now
        }
      }
    },
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    scanHistory: throttle(function() {
      this.viewed = !this.viewed
      if (this.viewed === false) {
        sessionStorage.setItem('rfpackState', true)
        this.stateMin = null
        this.stateMax = null
      } else {
        sessionStorage.setItem('rfpackState', false)
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
    audit(row) {
      this.$confirm('确认该任务通过审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.checkPersonId = sessionStorage.getItem('getUserId')
        auditPack(row).then(res => {
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
    // continueWrite(row) {
    //   this.$router.push('packinglist')
    //   sessionStorage.setItem('packChildId', row.id)
    //   sessionStorage.setItem('packingId', row.packingId)
    // },
    edit(row) {
      this.$router.push('/packinglist')
      sessionStorage.setItem('packChildId', row.id)
      sessionStorage.setItem('packingId', row.packingId)
    },
    rowDbclick(row) {
      sessionStorage.setItem('packChildId', row.id)
      sessionStorage.setItem('packingId', row.packingId)
      this.$router.push('/unorderpacktotal')
    },
    deleteDetails(row) {
      this.$confirm('确定删除该条表细吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPackDetail({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getListDetails(this.pagesize, this.currentPage)
          }
        })
      })
    },
    funcState() {
      const now = new Date().valueOf()
      if (this.lastStaTime === 0) {
        searchsystemid('INPACKAGE_STATE').then(res => {
          this.stateOptions = res.data
        })
        this.lastStaTime = now
      } else {
        if ((now - this.lastStaTime) > 5000) {
          this.lastStaTime = now
        }
      }
    },
    packFormat(row) {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        searchsystemid('INPACKAGE_STATE').then(res => {
          this.options = res.data
        })
        this.lastTime = now
      } else {
        if ((now - this.lastTime) > 5000) {
          this.lastTime = now
        }
      }
      return changeAll(row.packingState, this.options)
    },
    expandChange(row, expandedRows) {
      this.expands = []
      if (expandedRows.length > 0) {
        row ? this.expands.push(row.id) : ''
        this.id = row.id
        this.getListDetails()
      }
    },
    clear: kkdeboundce(function() {
      this.packingState = null
      this.form = {
        sourceType: null,
        startTime: null,
        endTime: null,
        packingId: null,
        inboundBatch: null,
        packingName: null,
        checkPersonName: null
      }
    }, 500),
    sourceFormat(row) {
      if (row.sourceType === 1) {
        return '采购计划来源'
      } else if (row.sourceType === 0) {
        return '盲收来源'
      }
    },
    outSelfExcel() {
      if (this.multipleSelection.length) {
        this.$confirm('是否确认导出所选单据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectExcelOutIPA(this.multipleSelection).then((res) => {
            let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.setAttribute('download', `装箱任务单`)
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
          packingState: this.form.packingState,
          warehouseId: this.warehouseId,
          packingName: this.form.packingName,
          checkPersonName: this.form.checkPersonName
        },
        workGroupId: window.sessionStorage.workGroupId, stateMin: this.stateMin,
        stateMax: this.stateMax, startTime1: this.value1[0], endTime1: this.value1[1], startTime2: this.value2[0], endTime2: this.value2[1]
      }
      screenExcelOutIPA(data).then((res) => {
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `装箱任务单`)
        document.body.appendChild(a)
        a.click()
        url = window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
    },
    finish(row) {
      this.$confirm('确定结束该项装箱任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        closeInPackage(row).then(res => {
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
    cancel(row) {
      this.$confirm('确定作废该项装箱任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelInPackage(row).then(res => {
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
    getListDetails() {
      var searchDTO = {
        'page': 1,
        'num': 10
      }
      this.tableLoading = true
      selectInPackageDetail({ searchDTO,
        pojo: {
          packingId: this.id
        }}).then(response => {
        this.tablelist = response.data
        this.tabledatas = this.tablelist.list
        this.sums = this.tablelist.sums
        this.flitterData()
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      selectInPackageDetailNum({ searchDTO,
        pojo: {
          packingId: this.id
        }}).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    changeadvanced() {
      this.expandState = 0
      this.advanced = !this.advanced
    },
    refresh: kkdeboundce(function() {
      this.reload()
    }, 500),
    getList() {
      this.listLoading = true
      selectInPackage({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        sourceType: 0,
        packingState: this.form.packingState,
        warehouseId: this.warehouseId,
        packingName: this.form.packingName,
        checkPersonName: this.form.checkPersonName
      },
      workGroupId: window.sessionStorage.workGroupId, stateMin: this.stateMin,
      stateMax: this.stateMax, screen: this.screen, startTime: this.value1[0], endTime: this.value1[1], startTime1: this.value2[0], endTime1: this.value2[1], startTime2: this.value3[0], endTime2: this.value3[1] }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectInPackageNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        sourceType: 0,
        packingState: this.form.packingState,
        warehouseId: this.warehouseId,
        packingName: this.form.packingName,
        checkPersonName: this.form.checkPersonName
      },
      workGroupId: window.sessionStorage.workGroupId, stateMin: this.stateMin,
      stateMax: this.stateMax, screen: this.screen, startTime: this.value1[0], endTime: this.value1[1], startTime1: this.value2[0], endTime1: this.value2[1], startTime2: this.value3[0], endTime2: this.value3[1] }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    changes(row) {
      if (row.commodityNum > row.num || row.randomCheckNum > row.num) {
        row.commodityNum = row.num
        row.randomCheckNum = row.num
      }
    },
    add: kkdeboundce(async function() {
      this.dialogVisible = true
      const res = await selectInboundPlanDetail({ pojo: {}})
      this.plantable = res.data.list
    }, 500),
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
    .btngroups {
      margin: 5px;
    }

    .el-form /deep/.el-form-item__label{
      color:rgb(0, 0, 0);
      font-weight: bold;
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

  .detailsTable {
    height: 100%;
    border: 1px solid #fff;
    overflow-y: auto;
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
  </style>

