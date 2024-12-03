<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" :model="form" label-width="120px">
          <el-form-item label="退货订单状态">
            <el-select v-model="form.orderState" placeholder="请选择" size="small" clearable>
              <el-option v-for="item in options" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item>
          <el-form-item label="仓库">
            <el-select v-model="form.warehouseId" size="small" placeholder="请选择" @focus="func">
              <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="客户">
            <el-input v-model="form.customName" size="small" style="width: 300px;" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="供应商">
            <el-input v-model="form.supplierName" size="small" style="width: 300px;" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="填写人">
            <el-input v-model="form.addPersonName" size="small" style="width: 200px;" placeholder="请输入" clearable />
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
          <!-- <el-form-item label="收货时间">
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
            <!-- <el-button type="warning" icon="el-icon-circle-close" size="small" @click="clear()">清空</el-button> -->
            <el-button type="success" round icon="el-icon-search" size="small" @click="search()">查询</el-button>
            <!-- <el-tooltip class="item" effect="dark" content="将满足筛选条件的单据导出" placement="bottom">
              <el-button type="primary" round icon="el-icon-export" size="small" @click="outExcel">筛选导出</el-button>
            </el-tooltip> -->
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="btngroups">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="add">新建</el-button>
      <el-button size="small" icon="el-icon-export" type="success" @click="outSelfExcel">批量导出</el-button>
      <el-button size="small" icon="el-icon-newTask" type="primary" @click="createNewForm">选择下列退货订单生成退货入库计划单</el-button>
      <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed ? "查看所有退货订单记录" : "返回" }}</el-button>
    </div>

    <el-dialog v-drag title="生成退货入库计划单" :visible.sync="dialogVisible" width="75%" class="showAll_dialog">
      <div class="cardContain">
        <div class="formContain">
          <el-form ref="uform" :model="uform" :rules="rules" :inline="true" size="mini">
            <el-form-item v-if="false" label="仓库id">
              <el-input v-model="uform.warehouseId" />
            </el-form-item>
            <el-form-item prop="warehouseName">
              <el-select v-model="uform.warehouseName" placeholder="请选择仓库" @focus="func" @change="changeWarehouseOptions">
                <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-if="false" v-model="uform.warehouseCode" disabled style="width: 180px" />
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="checked">是否进行质检</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-input v-model="uform.remark" type="textarea" maxlength="100" show-word-limit style="width: 300px" :rows="3" placeholder="请填写备注" clearable />
            </el-form-item>
          </el-form>
        </div>
        <div class="detailsTable2">
          <el-table
            border
            :data="table"
            size="mini"
            show-summary
            :summary-method="getSummaries2"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            :row-class-name="tableRowClassNames"
            :header-cell-style="{background:'#262626',color: '#fff'}"
            style="width: 100%, font-size: 10px"
            @cell-click="tabClick"
          >
            <el-table-column v-if="false" label="id" prop="id" />
            <el-table-column type="index" />
            <el-table-column label="退货订单商品信息" align="center">
              <el-table-column v-if="false" label="退货订单表头Id" :show-overflow-tooltip="true" prop="orderId" />
              <el-table-column v-if="false" label="备注">
                <template slot-scope="scope">
                  <span>
                    <el-input v-model="scope.row.aremark" size="mini" />
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-if="false" label="行号" :show-overflow-tooltip="true" prop="rowNum" />
              <el-table-column v-if="false" label="商品Id" :show-overflow-tooltip="true" prop="commodityId" />
              <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="commodityName" />
              <el-table-column label="商品sku名称" :show-overflow-tooltip="true" prop="skuName" />
              <el-table-column v-if="false" label="商品包装名称" :show-overflow-tooltip="true" prop="containerName" />
              <el-table-column v-if="false" label="包装数量(个)" :show-overflow-tooltip="true" prop="predictContainerNum" />
              <el-table-column label="最小sku单位" :show-overflow-tooltip="true" prop="unit" />
              <el-table-column
                label="退货数量(个)"
                :render-header="renderHeader"
                :show-overflow-tooltip="true"
                prop="predictNum"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.index === tabClickIndex && tabClickLabel === '退货数量(个)'">
                    <el-input v-model="scope.row.predictNum" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" @blur="inputBlur" @change="changeSum(scope.row)" />
                  </span>
                  <span v-else>{{ scope.row.predictNum }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="商品包装"
                width="200px"
              >
                <template slot-scope="scope">
                  <ComboGrid
                    v-model="scope.row.containerName"
                    value-field="name"
                    text-field="name"
                    :data="containerOptions"
                    :panel-style="{width:'500px'}"
                    :text-formatter="formatConText"
                    @focus="focusCon"
                    @valueChange="exampleCon(scope.row)"
                  >
                    <DataGrid slot="grid" :border="false">
                      <GridColumn v-if="false" field="id" title="序号" />
                      <GridColumn field="name" title="包装名称" />
                      <GridColumn field="code" title="包装代码" />
                      <GridColumn field="innerNum" title="包装容量" />
                      <GridColumn field="length" title="长(m)" />
                      <GridColumn field="width" title="宽(m)" />
                      <GridColumn field="highth" title="高(m)" />
                    </DataGrid>
                  </ComboGrid>
                </template>
              </el-table-column>
              <el-table-column v-if="false" label="包装id">
                <template slot-scope="scope">
                  <span>
                    <el-input v-model="scope.row.containerId" size="mini" />
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-if="false" label="包装代码">
                <template slot-scope="scope">
                  <span>
                    <el-input v-model="scope.row.containerCode" size="mini" />
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-if="false" label="件/箱">
                <template slot-scope="scope">
                  <span>
                    <el-input v-model="scope.row.isSingle" size="mini" />
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-if="false" label="实际包装数量" :show-overflow-tooltip="true" prop="factContainerNum" />
              <el-table-column v-if="false" label="实际数量" :show-overflow-tooltip="true" prop="factNum" />
              <el-table-column label="总体积(L)" :show-overflow-tooltip="true" prop="totalVolumn" />
              <el-table-column label="总金额(元)" :show-overflow-tooltip="true" prop="totalMoney" />
              <el-table-column label="总重量(kg)" :show-overflow-tooltip="true" prop="totalWeight" />
              <el-table-column label="总净重(kg)" :show-overflow-tooltip="true" prop="totalNetWeight" />
              <el-table-column v-if="false" label="收货时间" :show-overflow-tooltip="true" prop="receiveTime">
                <template slot-scope="scope">{{ scope.row.receiveTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column v-if="false" label="备注" :show-overflow-tooltip="true" prop="remark" />
            </el-table-column>
            <el-table-column
              prop="action"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button-group>
                  <el-button size="mini" icon="el-icon-delete" type="primary" @click="deleteTable(scope.row)">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <el-table
      ref="table"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      :row-key="getRowKeys"
      border
      size="mini"
      :header-cell-style="{background:'#000',color: '#fff'}"
      :height="tableHeight"
      tooltip-effect="dark"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
      :header-cell-class-name="handleHeadAddClass"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column
        type="selection"
        show-overflow-tooltip
        reserve-selection
      />
      <el-table-column :label="labelTitle" align="center">
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column v-if="false" prop="id" />
        <el-table-column align="center" label="退货订单编号" width="150px" :show-overflow-tooltip="true" prop="orderId" />
        <el-table-column align="center" width="150px" label="订单类型" :show-overflow-tooltip="true" prop="orderType" :formatter="typeFormat" />
        <el-table-column align="center" width="150px" label="退货订单状态" sortable="custom" :show-overflow-tooltip="true" prop="orderState" :formatter="stateFormat" />
        <el-table-column align="center" sortable="custom" label="仓库名称" width="220px" :show-overflow-tooltip="true" prop="warehouseName" />
        <el-table-column label="客户名称" align="center" width="150px" sortable="custom" :show-overflow-tooltip="true" prop="customName" />
        <el-table-column align="center" sortable="custom" label="供应商名称" width="220px" :show-overflow-tooltip="true" prop="supplierName" />
        <el-table-column align="center" width="150px" sortable="custom" label="填写人" :show-overflow-tooltip="true" prop="addPersonName" />
        <el-table-column label="修改时间" align="center" width="150px" sortable="custom" :show-overflow-tooltip="true" prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <!-- <el-table-column align="center" width="150px" sortable="custom" label="收货时间" :show-overflow-tooltip="true" prop="receiveTime">
          <template slot-scope="scope">{{ scope.row.receiveTime| dateYMDHMSFormat }}</template>
        </el-table-column> -->
        <!-- <el-table-column label="审核人"  :show-overflow-tooltip="true" prop="checkPersonName" /> -->
        <el-table-column label="备注" :show-overflow-tooltip="true" prop="remark" />
      </el-table-column>

      <el-table-column
        fixed="right"
        width="250px"
        prop="action"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-view" type="primary" @click="rowDbclick(scope.row)">详细记录</el-button>
          <el-button v-if="scope.row.orderState === 1" size="mini" icon="el-icon-edit" type="primary" @click="edit(scope.row)">修改</el-button>
          <!-- <el-button size="mini" :disabled="scope.row.orderState === 3" icon="el-icon-finish" type="primary" @click="finish(scope.row)">结单</el-button> -->
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
// import { throttle } from '@/utils/throttle.js'
import { kkdeboundce } from '@/utils/kkdebounce'
import { selectPurchaseOrderDetail, selectWarehouse, delDetail, selectPurchaseOrderDetailNum, closePurchaseOrder, screenExcelOutPUR, selectExcelOutPUR, generatePURToIPL, selectPurchaseOrderNum, selectPurchaseOrder, cancelPurchaseOrder } from '@/api/user'
import { searchsystemid, searchsku, searchcon } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      // 总数
      multipleSelection: [],
      expands: [],
      table: [],
      list: [],
      options: [],
      toptions: [],
      labelTitle: '退货订单-未完成退货入库计划记录',
      weight: 0,
      volume: 0,
      money: 0,
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
      checked: true,
      viewed: true,
      orderType: null,
      orderState: null,
      uform: {
        warehouseCode: null,
        warehouseName: null,
        inboundType: null,
        warehouseId: null,
        remark: null
      },
      advanced: false,
      tableLoading: true,
      listLoading: true,
      loading: true,
      id: null,
      total: 20,
      lastTime: 0,
      rules: {
        warehouseName: [{ required: true, message: '请选择仓库', trigger: 'change' }],
        inboundType: [{ required: true, message: '请选择出库类型', trigger: 'change' }]
      },
      laststateTime: 0,
      lasttypeTime: 0,
      lastptypeTime: 0,
      ptypeOptions: [],
      containerOptions: [],
      skuOptions: [],
      expandState: 0,
      sums: {},
      tablelist: {},
      tableHeight: 50,
      dialogVisible: false,
      backState: false,
      stateMin: null,
      stateMax: null,
      warehouseOptions: [],
      formLabelWidth: '120px',
      currentPage2: 1, // 当前页码
      pageSize2: 15, // 每页的数据条数
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
      form: {
        orderState: null,
        warehouseId: null,
        customName: null,
        supplierName: null,
        addPersonName: null
      },
      sortField: {},
      screen: '',
      tabledatas: [],
      tableData: [],
      tabClickIndex: null, // 点击的单元格
      tabClickLabel: ''
    }
  },
  watch: {
    backState: function(newObj) {
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
          this.labelTitle = '退货订单-未完成退货入库计划记录'
          break
        case false:
          this.labelTitle = '退货订单所有记录'
      }
    }
  },
  created() {
    this.backState = sessionStorage.getItem('backState')
    if (this.backState === 'true') {
      this.stateMin = null
      this.stateMax = null
      this.getList()
    } else {
      this.stateMin = 0
      this.stateMax = 1
      this.getList()
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 82
      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 82
      }
    })
  },
  methods: {
    // 仓库联动赋值
    changeWarehouseOptions() {
      // 返回数组中第一个通过测试元素的值
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.uform.warehouseName)
      this.uform.warehouseCode = item.warehouseCode
      this.uform.warehouseName = item.warehouseName
      this.uform.warehouseId = item.id
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
    exampleCon(row) {
      const item = this.containerOptions.find(item1 => item1.name === row.containerName)
      row.isSingle = 0
      row.containerId = item.id
      row.containerName = item.name
      row.containerCode = item.code
    },
    formatConText(name) {
      return name
    },
    focusCon() {
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
    // 删除表格某一行
    deleteTable(index) {
      this.table.splice(index, 1)
    },
    // 防抖访问---杜绝连击
    scanHistory: kkdeboundce(function() {
      this.viewed = !this.viewed
      if (!this.viewed) {
        sessionStorage.setItem('backState', true)
        this.stateMin = null
        this.stateMax = null
      } else {
        sessionStorage.setItem('backState', false)
        this.stateMin = 0
        this.stateMax = 1
      }
      this.getList()
    }, 500),
    // 查看详细信息
    rowDbclick(row) {
      sessionStorage.setItem('childId', row.id)
      sessionStorage.setItem('orderId', row.orderId)
      this.$router.push('/backtotal')
    },
    // 改变数量后总体积、总重量、总金额改变
    async changeSum(row) {
      const res = await searchsku(row.commodityId, row.skuName)
      this.skuOptions = res.data
      this.weight = this.skuOptions[0].weight
      this.volume = this.skuOptions[0].volume
      this.money = this.skuOptions[0].volume
      row.totalWeight = Number(this.weight) * Number(row.predictNum)
      row.totalVolumn = Number(this.volume) * Number(row.predictNum)
      row.totalMoney = Number(this.money) * Number(row.predictNum)
    },
    // 单击表格可编辑
    tabClick(row, column) {
      switch (column.label) {
        case '退货数量(个)':
          this.tabClickIndex = row.index
          this.tabClickLabel = column.label
          break
        default: return
      }
    },
    // 失去焦点初始化
    inputBlur() {
      this.tabClickIndex = null
      this.tabClickLabel = ''
    },
    tableRowClassNames({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    // 合计
    getSummaries2(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else if (index > 3) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          }
        }
      })

      return sums
    },
    // 合计
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
    funType() {
      // 不同时间取值的new Date()是可以相减的
      const now = new Date()
      if (this.lastptypeTime === 0) {
        searchsystemid('PURCHASE_TYPE').then(res => {
          this.ptypeOptions = res.data
        }
        )
        this.lastptypeTime = now
      } else {
        if ((now - this.lastptypeTime) > 5000) {
          this.lastptypeTime = now
        }
      }
    },
    func() {
      const now = new Date()
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
      this.$router.push('/tablelist')
      sessionStorage.setItem('childId', row.id)
      sessionStorage.setItem('orderId', row.orderId)
    },
    submit() {
      this.$refs.uform.validate((valid) => {
        if (valid) {
          this.$confirm('此操作将提交所填信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            for (let i = 0; i < this.table.length; i++) {
              if (this.table[i].aremark) {
                this.list.push({ remark: this.table[i].aremark })
              } else {
                this.list.push({ remark: null })
              }
            }
            for (const item of this.table) {
              this.$delete(item, 'remark')
            }
            generatePURToIPL({ purchaseOrderDetailHeadAndDetail: { head: {}, details: this.table }, inboundPlanDetailHeadAndDetail: { details: this.list, head: {
              warehouseCode: this.uform.warehouseCode,
              warehouseName: this.uform.warehouseName,
              inboundType: this.uform.inboundType,
              isNeedCheck: this.checked,
              remark: this.uform.remark,
              warehouseId: this.uform.warehouseId
            }}}).then(res => {
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
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid('PURCHASE_STATE').then(res => {
          this.options = res.data
        })
        this.laststateTime = now
      } else {
        if ((now - this.laststateTime) > 5000) {
          this.laststateTime = now
        }
      }
      return changeAll(row.orderState, this.options)
    },
    typeFormat(row) {
      const now = new Date()
      if (this.lasttypeTime === 0) {
        searchsystemid('PURCHASE_TYPE').then(res => {
          this.toptions = res.data
        })
        this.lasttypeTime = now
      } else {
        if ((now - this.lasttypeTime) > 5000) {
          this.lasttypeTime = now
        }
      }
      return changeAll(row.orderType, this.toptions)
    },
    createNewForm() {
      this.list = []
      this.table = []
      if (this.multipleSelection.length) {
        this.$notify({
          title: '成功',
          message: '正在生成入库计划单，请稍等片刻！',
          type: 'success',
          duration: 2000
        })
        setTimeout(() => {
          this.dialogVisible = true
        }, 2000)
        for (var i = 0; i < this.multipleSelection.length; i++) {
          selectPurchaseOrderDetail({
            pojo: {
              orderId: this.multipleSelection[i].id
            }}).then(response => {
            for (var j = 0; j < response.data.list.length; j++) {
              this.table.push(response.data.list[j])
            }
          })
        }
      } else {
        this.$message({
          message: '请选择至少一条数据',
          type: 'warning'
        })
      }
    },
    deleteDetails(row) {
      this.$confirm('确定删除该条表细吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDetail({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getListDetails()
          }
        })
      })
    },
    renderHeader(h, { column }) { // 悬浮提示的文字内容
      const info = '可根据实况点击单元格修改商品数量'
      return h(
        'div', [h('span', column.label), // placement指定悬浮显示方向
          h('el-tooltip', { props: { placement: 'bottom', effect: 'light' }}, [
            // style 调文字颜色样式
            h('div', { slot: 'content', style: { whiteSpace: 'normal', color: 'blue' }}, info),
            // el-icon-warning是element图标, style 调图标颜色
            h('i', { class: 'el-icon-warning', style: 'color: #409EFF; margin-left: 5px;' })
          ])])
    },
    outSelfExcel() {
      if (this.multipleSelection.length) {
        this.$confirm('是否确认导出所选单据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectExcelOutPUR(this.multipleSelection).then(res => {
            let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.setAttribute('download', `退货单`)
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
      const data = { searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        orderType: 2,
        orderState: this.orderState,
        warehouseId: this.form.warehouseId,
        customName: this.form.customName,
        supplierName: this.form.supplierName,
        addPersonName: this.form.addPersonName
      }, workGroupId: window.sessionStorage.workGroupId, stateMin: this.stateMin, stateMax: this.stateMax, startTime1: this.value1[0], endTime1: this.value1[1], startTime2: this.value2[0], endTime2: this.value2[1] }
      screenExcelOutPUR(data).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `退货单`)
        document.body.appendChild(a)
        a.click()
        url = window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
    },
    // clear: kkdeboundce(function() {
    //   this.orderType = null
    //   this.orderState = null
    //   this.form = {
    //     orderId: null,
    //     warehouseId: null,
    //     customName: null,
    //     startTime1: null,
    //     endTime1: null,
    //     startTime: null,
    //     endTime: null,
    //     addPersonName: null,
    //     checkPersonName: null
    //   }
    // }, 500),
    search: kkdeboundce(function() {
      this.getList()
    }, 500),
    getListDetails() {
      var searchDTO = {
        'page': 1,
        'num': 10
      }
      this.tableLoading = true
      selectPurchaseOrderDetail({ searchDTO,
        pojo: {
          orderId: this.id
        }}).then(response => {
        this.tablelist = response.data
        this.tabledatas = this.tablelist.list
        this.sums = this.tablelist.sums
        this.tableLoading = false
      })
      selectPurchaseOrderDetailNum({ searchDTO,
        pojo: {
          orderId: this.id
        }}).then(response => {
        this.totalCount = response.data
        this.tableLoading = false
      })
    },
    add() {
      this.$router.push('/backlist')
      sessionStorage.removeItem('orderId')
      sessionStorage.removeItem('childId')
    },
    refresh: kkdeboundce(function() {
      this.reload()
      this.viewed = true
    }, 500),
    finish(row) {
      this.$confirm('确定结束该条退货订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        closePurchaseOrder(row).then(res => {
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
      this.$confirm('确定作废该条退货订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelPurchaseOrder({ head: {
          id: row.id,
          orderState: row.orderState
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
    getList() {
      this.listLoading = true
      selectPurchaseOrder({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        orderType: 2,
        orderState: this.orderState,
        warehouseId: this.form.warehouseId,
        customName: this.form.customName,
        supplierName: this.form.supplierName,
        addPersonName: this.form.addPersonName
      }, workGroupId: window.sessionStorage.workGroupId, screen: this.screen, stateMin: this.stateMin, stateMax: this.stateMax, startTime: this.value1[0], endTime: this.value1[1], startTime1: this.value2[0], endTime1: this.value2[1] }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectPurchaseOrderNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        orderType: 2,
        orderState: this.orderState,
        warehouseId: this.form.warehouseId,
        customName: this.form.customName,
        supplierName: this.form.supplierName,
        addPersonName: this.form.addPersonName
      }, workGroupId: window.sessionStorage.workGroupId, screen: this.screen,
      stateMin: this.stateMin, stateMax: this.stateMax, startTime: this.value1[0], endTime: this.value1[1], startTime1: this.value2[0], endTime1: this.value2[1] }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      for (let i = 0; i < val.length; i++) {
        // 去重
        if (this.multipleSelection.indexOf(val[i].id) === -1) {
          this.multipleSelection.push({ id: val[i].id })
        }
      }
    }
  }
}
</script>
    <style scoped>
    .el-card /deep/ .el-card__header {
    padding: 5px;
    color:#fff;
    text-align: center;
    }
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
      background-color: rgb(46, 153, 132);
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
          padding: 5px 5px;
          border: 1px solid #fff;

        }
        .detailsTable2 {
          height: 85%;
          overflow-y: auto;
     ::v-deep .el-table tbody tr:hover>td {
    background-color:#162a48!important
  }
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
  </style>

