<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" :model="form" label-width="120px">
          <!-- <el-form-item label="采购订单类型">
            <el-select v-model="orderType" placeholder="请选择采购订单类型" clearable size="small">
              <el-option v-for="item in toptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="采购订单状态">
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
            <el-button type="success" icon="el-icon-search" round size="small" @click="search()">查询</el-button>
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
      <el-button size="small" icon="el-icon-newTask" type="primary" @click="createNewForm">选择下列采购订单生成入库计划单</el-button>
      <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed ? "查看所有采购订单记录" : "返回" }}</el-button>
    </div>
    <el-dialog v-drag :visible.sync="dialogVisible" width="85%" class="showAll_dialog">
      <div class="cardContain">
        <div class="formContain">
          <el-form ref="uform" :model="uform" :rules="rules" :inline="true" size="mini">
            <el-form-item prop="inboundType">
              <el-select v-model="uform.inboundType" size="mini" placeholder="请选择入库计划单类型" @focus="funType">
                <el-option v-for="item in ptypeOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
              </el-select>
            </el-form-item>
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
            <el-table-column label="采购订单商品信息" align="center">
              <el-table-column v-if="false" label="采购订单表头Id" :show-overflow-tooltip="true" prop="orderId" />
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
              <el-table-column label="商品sku编码" :show-overflow-tooltip="true" prop="skuCode" />
              <el-table-column
                label="实际采购数量(个)"
                prop="predictNum"
              >
                <!-- :render-header="renderHeader"
                :show-overflow-tooltip="true" -->
                <template slot-scope="scope">
                  <span>
                    <el-input v-model="scope.row.predictNum" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" @blur="inputBlur" @change="changeSum(scope.row)" />
                  </span>
                  <!-- <span v-else>{{ scope.row.predictNum }}</span> -->
                </template>
              </el-table-column>
              <el-table-column
                label="实际商品包装"
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
              <el-table-column
                label="实际所需包装数量(个)"
                prop="predictContainerNum"
              >
                <!-- :render-header="renderHeader"
                :show-overflow-tooltip="true" -->
                <template slot-scope="scope">
                  <span>
                    <el-input v-model="scope.row.predictContainerNum" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" @blur="inputBlur" @change="changeSum(scope.row)" />
                  </span>
                  <!-- <span v-else>{{ scope.row.predictNum }}</span> -->
                </template>
              </el-table-column>
              <!-- <el-table-column label="预计包装数量(个)" :show-overflow-tooltip="true" prop="predictContainerNum" /> -->
              <el-table-column label="最小sku单位" :show-overflow-tooltip="true" prop="unit" />
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
        <el-button type="primary" @click="submit">分配箱码</el-button>
      </div>
    </el-dialog>
    <el-dialog v-drag :visible.sync="dialogVisibles" width="85%" class="showAll_dialog">
      <div class="cardContain">
        <div class="detailsTable2">
          <el-table
            border
            :data="tables"
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
            <el-table-column label="采购订单商品信息" align="center">
              <el-table-column v-if="false" label="采购订单表头Id" :show-overflow-tooltip="true" prop="orderId" />
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
              <el-table-column
                label="商品数量(个)"
                prop="predictNum"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="商品包装"
                width="200px"
                prop="containerName"
              />
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
              <el-table-column
                label="包装数量(个)"
                prop="predictContainerNum"
              />
              <el-table-column label="最小sku单位" :show-overflow-tooltip="true" prop="unit" />
              <el-table-column v-if="false" label="实际包装数量" :show-overflow-tooltip="true" prop="factContainerNum" />
              <el-table-column v-if="false" label="实际数量" :show-overflow-tooltip="true" prop="factNum" />
              <el-table-column label="总体积(L)" :show-overflow-tooltip="true" prop="totalVolumn" />
              <el-table-column label="总金额(元)" :show-overflow-tooltip="true" prop="totalMoney" />
              <el-table-column label="总重量(kg)" :show-overflow-tooltip="true" prop="totalWeight" />
              <el-table-column label="总净重(kg)" :show-overflow-tooltip="true" prop="totalNetWeight" />
              <el-table-column label="箱码" :show-overflow-tooltip="true" prop="containerBarcode" width="200px">
                <template slot-scope="scope">
                  <span>
                    <el-input :ref="`input${scope.row.index}`" v-model="scope.row.containerBarcode" size="mini" @keyup.enter.native="enterBox(scope.$index)" />
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-if="false" label="收货时间" :show-overflow-tooltip="true" prop="receiveTime">
                <template slot-scope="scope">{{ scope.row.receiveTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column v-if="false" label="备注" :show-overflow-tooltip="true" prop="remark" />
            </el-table-column>
            <!-- <el-table-column
              prop="action"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button-group>
                  <el-button size="mini" icon="el-icon-delete" type="primary" @click="dist(scope.row)">分配箱码</el-button>
                </el-button-group>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submits">提交</el-button>
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
        <el-table-column label="采购订单编号" align="center" width="150px" :show-overflow-tooltip="true" prop="orderId" />
        <el-table-column label="采购订单类型" width="150px" align="center" :show-overflow-tooltip="true" prop="orderType" :formatter="typeFormat" />
        <el-table-column label="采购订单状态" sortable="custom" width="150px" align="center" :show-overflow-tooltip="true" prop="orderState" :formatter="stateFormat" />
        <el-table-column label="仓库名称" sortable="custom" align="center" width="220px" :show-overflow-tooltip="true" prop="warehouseName" />
        <el-table-column width="150px" label="客户名称" sortable="custom" align="center" :show-overflow-tooltip="true" prop="customName" />
        <el-table-column label="供应商名称" sortable="custom" align="center" width="220px" :show-overflow-tooltip="true" prop="supplierName" />
        <el-table-column width="150px" label="填写人" sortable="custom" align="center" :show-overflow-tooltip="true" prop="addPersonName" />
        <el-table-column width="150px" label="修改时间" sortable="custom" align="center" :show-overflow-tooltip="true" prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <!-- <el-table-column width="150px" label="收货时间" sortable="custom" align="center" :show-overflow-tooltip="true" prop="receiveTime">
          <template slot-scope="scope">{{ scope.row.receiveTime| dateYMDHMSFormat }}</template>
        </el-table-column> -->
        <!-- <el-table-column label="审核人"  :show-overflow-tooltip="true" prop="checkPersonName" /> -->
        <el-table-column label="备注" :show-overflow-tooltip="true" prop="remark" />
      </el-table-column>

      <el-table-column
        fixed="right"
        width="300px"
        prop="action"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-view" type="primary" @click="rowDbclick(scope.row)">详细记录</el-button>
          <el-button v-if="scope.row.orderState === 1" size="mini" icon="el-icon-edit" type="primary" @click="edit(scope.row)">修改</el-button>
          <el-button
            v-if="scope.row.orderState === 2"
            size="mini"
            icon="el-icon-finish"
            type="primary"
            @click="finish(scope.row)"
          >结单</el-button>
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
// import Barcode from '@/components/Barcode'
// import { throttle } from '@/utils/throttle.js'
import { kkdeboundce } from '@/utils/kkdebounce'
import { selectPurchaseOrderDetail, selectWarehouse, delDetail, selectPurchaseOrderDetailNum, closePurchaseOrder, screenExcelOutPUR, selectExcelOutPUR, generatePURToIPL, selectPurchaseOrderNum, selectPurchaseOrder, cancelPurchaseOrder } from '@/api/user'
import { searchsystemid, searchsku, searchcon } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
export default {
  inject: ['reload'],
  components: { Pagination },
  data() {
    return {
      // 总数
      multipleSelection: [],
      expands: [],
      table: [],
      containerOptions: [],
      list: [],
      options: [],
      toptions: [],
      weight: 0,
      volume: 0,
      labelTitle: '采购订单-未生成入库计划记录',
      money: 0,
      checked: false,
      viewed: true,
      orderType: null,
      orderState: null,
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
        inboundType: [{ required: true, message: '请选择入库类型', trigger: 'change' }]
      },
      laststateTime: 0,
      lasttypeTime: 0,
      lastptypeTime: 0,
      ptypeOptions: [],
      dialogVisibles: false,
      skuOptions: [],
      tables: [],
      expandState: 0,
      sums: {},
      tablelist: {},
      tableHeight: 50,
      value: null,
      dialogVisible: false,
      stateMin: null,
      stateMax: null,
      purchaseState: false,
      warehouseOptions: [],
      formLabelWidth: '120px',
      lastconTime: 0,
      currentPage2: 1, // 当前页码
      pageSize2: 15, // 每页的数据条数
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 10, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      sortField: {},
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
      screen: '',
      tabledatas: [],
      tableData: [],
      tabClickIndex: null, // 点击的单元格
      tabClickLabel: ''
    }
  },
  watch: {
    purchaseState: function(newObj) {
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
          this.labelTitle = '采购订单-未完成入库计划记录'
          break
        case false:
          this.labelTitle = '采购订单所有记录'
      }
    }
  },
  activated() {
    console.log(1111)
  },
  created() {
    this.purchaseState = sessionStorage.getItem('purchaseState')
    if (this.purchaseState === 'true') {
      this.stateMin = null
      this.stateMax = null
    } else {
      this.stateMin = 0
      this.stateMax = 2
    }
    this.getList()
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
    // elmentui，el-table自带事件--sort-change，接受两个参数order，prop
    handleSortChange({ order, prop }) {
      // 触发的排序和缓存的排序相同时，取消该字段的排序
      this.screen = ''
      // this.screenNull = ''
      console.log(order, prop)
      if (!order || this.sortField[prop] === order) {
        this.sortField[prop] = null
      } else {
        this.sortField[prop] = order
      }
      console.log(this.sortField)
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
    enterBox(index) {
      if (index < this.tables.length - 1) {
        const a = index + 1
        const str = `input${a}`
        this.$nextTick(() => {
          this.$refs[str].focus()
        })
      } else {
        this.$message.success('读取完成！')
        const str1 = `input${index}`
        this.$refs[str1].blur()
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
        sessionStorage.setItem('purchaseState', true)
        this.stateMin = null
        this.stateMax = null
      } else {
        sessionStorage.setItem('purchaseState', false)
        this.stateMin = 0
        this.stateMax = 2
      }
      this.getList()
    }, 500),
    // 查看详细信息
    rowDbclick(row) {
      sessionStorage.setItem('childId', row.id)
      sessionStorage.setItem('orderId', row.orderId)
      this.$router.push({ path: '/tabletotal' })
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
        case '采购数量(个)':
          this.tabClickIndex = row.index
          this.tabClickLabel = column.label
          break
        case '商品包装':
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
          this.$confirm('是否确定进行分配箱码?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            for (let i = 0; i < this.table.length; i++) {
              if (this.table[i].aremark) {
                this.list.push({ remark: this.table[i].aremark })
              } else if (this.table[i].containerId) {
                this.list.push({ isSingle: 0 })
              } else {
                this.list.push({ remark: null, isSingle: 1 })
              }
            }
            for (const item of this.table) {
              this.$delete(item, 'remark')
              // this.$delete(item, 'id')
            }
            console.log(this.table[0].predictContainerNum)
            console.log(this.table)
            const obj = JSON.parse(JSON.stringify(this.table))
            const arr = []
            for (let i = 0; i < obj.length; i++) {
              const len = obj[i].predictContainerNum
              if (len === 1) {
                arr.push(this.table[i])
              } else {
                obj[i].totalWeight = this.table[i].totalWeight / this.table[i].predictContainerNum
                obj[i].totalVolumn = this.table[i].totalVolumn / this.table[i].predictContainerNum
                obj[i].totalMoney = this.table[i].totalMoney / this.table[i].predictContainerNum
                obj[i].predictNum = this.table[i].predictNum / this.table[i].predictContainerNum
                obj[i].predictContainerNum = 1
                console.log(obj[i])
                for (let j = 0; j < len; j++) {
                  arr.push(JSON.parse(JSON.stringify(obj[i])))
                }
              }
            }
            this.dialogVisible = false
            this.dialogVisibles = true
            setTimeout(() => {
              this.$message.success('请扫码输入或手动填写！')
            }, 500)
            this.tables = arr
            this.$nextTick(() => {
              this.$refs.input0.focus()
            })

            // purchaseOrderDetailHeadAndDetail: { head: {}, details: arr },
            //   generatePURToIPL({ inboundPlanDetailHeadAndDetail: { details: this.list, head: {
            //     warehouseCode: this.uform.warehouseCode,
            //     warehouseName: this.uform.warehouseName,
            //     inboundType: this.uform.inboundType,
            //     isNeedCheck: this.checked,
            //     remark: this.uform.remark,
            //     warehouseId: this.uform.warehouseId
            //   }}}).then(res => {
            //     if (res.code === 200) {
            //       this.$message.success('提交成功')
            //       this.reload()
            //     }
            //   })
            // }).catch(() => {
            // this.$message({
            //   type: 'info',
            //   message: '已取消'
            // })
          })
        }
      })
    },
    submits() {
      let index = 0
      for (let i = 0; i < this.tables.length; i++) {
        if (this.tables[i].containerBarcode) {
          index++
          this.list[i].containerBarcode = this.tables[i].containerBarcode
        } else {
          this.$message.warning('箱码还未分配完成！！！')
        }
      }
      if (index === this.tables.length) {
        generatePURToIPL({ purchaseOrderDetailHeadAndDetail: { head: {}, details: this.tables }, inboundPlanDetailHeadAndDetail: { details: this.list, head: {
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
      }
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
            a.setAttribute('download', `采购单`)
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
        orderType: 1,
        orderState: this.form.orderState,
        warehouseId: this.form.warehouseId,
        customName: this.form.customName,
        supplierName: this.form.supplierName,
        addPersonName: this.form.addPersonName
      }, workGroupId: window.sessionStorage.workGroupId, stateMin: this.stateMin,
      stateMax: this.stateMax, startTime1: this.value1[0], endTime1: this.value1[1], startTime2: this.value2[0], endTime2: this.value2[1] }
      screenExcelOutPUR(data).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `采购单`)
        document.body.appendChild(a)
        a.click()
        url = window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
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
      this.$router.push('/tablelist')
      sessionStorage.removeItem('orderId')
      sessionStorage.removeItem('childId')
    },
    refresh: kkdeboundce(function() {
      this.reload()
      this.viewed = true
    }, 500),
    finish(row) {
      this.$confirm('确定结束该条采购订单吗?', '提示', {
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
      this.$confirm('确定作废该条采购订单吗?', '提示', {
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
        orderType: 1,
        orderState: this.form.orderState,
        warehouseId: this.form.warehouseId,
        supplierName: this.form.supplierName,
        customName: this.form.customName,
        addPersonName: this.form.addPersonName
      }, workGroupId: window.sessionStorage.workGroupId, stateMin: this.stateMin,
      screen: this.screen,
      stateMax: this.stateMax, startTime: this.value1[0], endTime: this.value1[1], startTime1: this.value2[0], endTime1: this.value2[1] }).then(response => {
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
        orderType: 1,
        orderState: this.form.orderState,
        warehouseId: this.form.warehouseId,
        supplierName: this.form.supplierName,
        customName: this.form.customName,
        addPersonName: this.form.addPersonName
      }, workGroupId: window.sessionStorage.workGroupId, screen: this.screen,
      stateMin: this.stateMin,
      stateMax: this.stateMax, startTime: this.value1[0], endTime: this.value1[1], startTime1: this.value2[0], endTime1: this.value2[1] }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
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
      /* background-color: rgb(191, 189, 189); */
    }

    .btngroups {
      margin: 5px;
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

