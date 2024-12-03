<template>
  <div>
    <div class="btngroups">
      <el-button-group>
        <el-button type="success" icon="el-icon-back" @click="goback">返回上一页</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      </el-button-group>
    </div>
    <el-dialog v-drag title="选择添加" :visible.sync="dialogVisible" width="75%" class="showAll_dialog">
      <div class="detailsTable">
        <el-table
          border
          :data="table"
          size="mini"
          row-key="id"
          :row-style="{height:'20px'}"
          :cell-style="{padding:'0px'}"
          :row-class-name="tableRowClassDetailName"
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
          <el-table-column type="index" />
          <el-table-column v-if="false" label="采购订单表头Id" :show-overflow-tooltip="true" prop="orderId" />
          <el-table-column v-if="false" label="行号" :show-overflow-tooltip="true" prop="rowNum" />
          <el-table-column v-if="false" label="商品Id" :show-overflow-tooltip="true" prop="commodityId" />
          <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="commodityName" />
          <el-table-column label="商品sku名称" :show-overflow-tooltip="true" prop="skuName" />
          <el-table-column label="商品包装名称" :show-overflow-tooltip="true" prop="containerName" />
          <el-table-column label="包装数量(个)" :show-overflow-tooltip="true" prop="predictContainerNum" />
          <el-table-column label="最小sku单位" :show-overflow-tooltip="true" prop="unit" />
          <el-table-column
            label="采购数量(个)"
            :show-overflow-tooltip="true"
            prop="predictNum"
          />
          <el-table-column label="总体积(L)" :show-overflow-tooltip="true" prop="totalVolumn" />
          <el-table-column label="总金额(元)" :show-overflow-tooltip="true" prop="totalMoney" />
          <el-table-column label="总重量(kg)" :show-overflow-tooltip="true" prop="totalWeight" />
          <el-table-column label="总净重(kg)" :show-overflow-tooltip="true" prop="totalNetWeight" />
          <el-table-column label="备注" :show-overflow-tooltip="true" prop="remark" />
        </el-table>
      </div>
      <div class="pagContainer">

        <pagination
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="chooseAdd"
        />
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top: 20px">
        <el-button type="primary" @click="addChoose">添加</el-button>
      </div>
    </el-dialog>
    <el-card class="show_card1" :body-style="{padding:'20px'}">
      <div slot="header" class="clearfix">
        <span class="title">入库计划-无计划单头</span>
      </div>
      <el-form ref="form" :inline="true" :rules="rules" :model="form">
        <el-form-item v-if="false" label="id">
          <el-input v-model="form.id" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="入库计划-无计划单号">
          <el-input v-model="form.planId" disabled size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="入库类型" prop="inboundType">
          <el-select v-model="form.inboundType" size="mini" @focus="funType">
            <el-option v-for="item in typeOptions" :key="item.id" :label="item.codeDetailName" :value="item.typeNumber" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" label="仓库id">
          <el-input v-model="form.warehouseId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-select v-model="form.warehouseName" size="mini" placeholder="请选择" @focus="func" @change="changeWarehouseOptions">
            <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="false">
          <el-input v-model="form.warehouseCode" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="预期所需箱数(个)" prop="predictContainerNum">
          <el-input v-model="form.predictContainerNum" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="预期商品sku数(个)" prop="predictSkuNum">
          <el-input v-model="form.predictSkuNum" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="预期商品数量(个)" prop="predictNum">
          <el-input v-model="form.predictNum" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="修改时间">
          <el-date-picker
            v-model="form.createTime"
            size="mini"
            type="date"
            placeholder="请选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            readonly
          />
        </el-form-item>
        <el-form-item prop="isNeedCheck">
          <el-checkbox v-model="form.isNeedCheck">是否需要质检</el-checkbox>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="show_card1" :body-style="{padding:'0px'}">
      <div slot="header" align="center">
        <span>商品信息</span><span style="padding-left: 20px"><i class="el-icon-warning" /> 请先填写商品名称，再选择对应的商品sku！</span>
        <el-button v-if="!show" icon="el-icon-plus" type="primary" @click="add">新增</el-button>
        <el-button v-if="!show" icon="el-icon-folder-add" type="primary" @click="chooseAdd">选择添加</el-button>
      </div>
      <el-form ref="formData" :model="formData" :rules="formData.rules">
        <el-table
          ref="tabledatas"
          :data="formData.tabledatas"
          tooltip-effect="dark"
          border
          :row-class-name="tableRowClassDetailName"
          :header-cell-style="{background:'#091f2c',color: '#fff'}"
          :row-style="{height:'20px'}"
          :cell-style="{padding:'0px'}"
          :height="tableHeight"
          size="mini"
          style="width: 100%, font-size: 10px"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
          />
          <el-table-column label="商品名称" :render-header="renderHeader">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.commodityName'" :rules="formData.rules.commodityName">
                <el-select
                  v-model="scope.row.commodityName"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入商品名称"
                  :remote-method="funcCommodity"
                  size="mini"
                  @change="changeComOptions(scope.row)"
                >
                  <el-option v-for="item in commodityOptions" :key="item.id" :label="item.goodsName" :value="item.goodsName" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="商品id">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.commodityId" size="mini" />
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="商品代码">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.commodityCode" size="mini" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="商品sku">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.skuName'" :rules="formData.rules.skuName">
                <ComboGrid
                  v-model="scope.row.skuName"
                  value-field="skuName"
                  text-field="skuName"
                  :data="skuOptions"
                  :panel-style="{width:'500px'}"
                  :text-formatter="formatSkuText"
                  @focus="focusSku(scope.row)"
                  @valueChange="exampleSku(scope.row)"
                >
                  <DataGrid slot="grid" :border="false">
                    <GridColumn v-if="false" field="id" />
                    <GridColumn field="skuName" title="sku名称" />
                    <GridColumn field="skuCode" title="sku代码" />
                    <GridColumn field="skuColor" title="sku颜色" />
                    <GridColumn field="skuSize" title="尺寸" />
                    <GridColumn field="skuSeason" title="季节" />
                  </DataGrid>
                </ComboGrid>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="skuId">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.skuId" size="mini" />
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="sku名称">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.skuName" size="mini" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="最小sku单位">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.unit'" :rules="formData.rules.unit">
                <el-select v-model="scope.row.unit" size="mini" placeholder="请选择" @focus="funcUnit">
                  <el-option v-for="item in unitOptions" :key="item.id" :label="item.codeDetailName" :value="item.codeDetailName" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="采购数量" :show-overflow-tooltip="true" width="120px">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.num'" :rules="formData.rules.num">
                <el-input v-model="scope.row.num" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" @input="changeSum(scope.row)" />
              </el-form-item>
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
          <el-table-column
            label="商品包装"
          >
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.containerName'">
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
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="客户Id" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.customId" size="mini" style="width: 160px;" clearable />
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="客户代码" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.customCode" size="mini" style="width: 160px;" clearable />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="客户名称" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.customName'" :rules="formData.rules.customName">
                <el-select
                  v-model="scope.row.customName"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词,如“宝开”"
                  :remote-method="funClient"
                  size="mini"
                  @change="changeClientOptions(scope.row)"
                >
                  <el-option v-for="item in clientOptions" :key="item.id" :label="item.customName" :value="item.customName" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="供应商Id" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.supplierId" size="mini" style="width: 160px;" clearable />
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="供应商代码" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.supplierCode" size="mini" style="width: 160px;" clearable />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="供应商名称" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.supplierName'" :rules="formData.rules.supplierName">
                <el-select
                  v-model="scope.row.supplierName"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词,如“宝开”"
                  :remote-method="funSupplier"
                  size="mini"
                  @change="changeOptions(scope.row)"
                >
                  <el-option v-for="item in supplierOptions" :key="item.id" :label="item.customName" :value="item.customName" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="总体积(L)" prop="totalVolumn">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.totalVolumn'" :rules="formData.rules.totalVolumn">
                <span>{{ scope.row.totalVolumn }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="总重量(kg)" prop="totalWeight">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.totalWeight'" :rules="formData.rules.totalWeight">
                <span>{{ scope.row.totalWeight }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="总净重(kg)" prop="totalNetWeight">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.totalNetWeight'" :rules="formData.rules.totalNetWeight">
                <span> {{ scope.row.totalNetWeight }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- <el-table-column label="跟踪号"  :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>
                  <el-input v-model="scope.row.inboundTraceCode" size="mini" />
                </span>
              </template>
            </el-table-column> -->
          <!-- <el-table-column label="备注"  :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>
                  <el-input
                    v-model="scope.row.remark"
                    size="mini"
                  />
                </span>
              </template>
            </el-table-column> -->
          <el-table-column
            prop="action"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" icon="el-icon-delete" type="danger" @click="delect(scope.$index)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>
    <div class="btnsContain">
      <div>
        <el-button v-if="!show" icon="el-icon-folder-add" type="success" @click="submit">保存</el-button>
        <el-button v-if="show" icon="el-icon-folder-add" type="success" @click="update">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { addInboundPlan, selectInboundPlan, selectInboundPlanDetail, screenGoods, getPlanHeadCode, updPlanTable, selectPurchaseOrderDetail, selectPurchaseOrderDetailNum } from '@/api/user'
import { searchwarehouse, searchcustomer, searchsupplier, searchsku, searchcon, searchsystemid } from '@/utils/search'
import { getNowTime } from '@/utils/getTime'
import { throttle } from '@/utils/throttle'
import { kkdeboundce } from '@/utils/kkdebounce'
import Pagination from '@/components/Pagination'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      lastTime: 0,
      table: [],
      total: 0,
      show: false,
      listQuery: {
        page: 1,
        limit: 50
      },
      dialogVisible: false,
      formData: {
        rules: {
          commodityName: {
            required: true,
            tirgger: ['change']
          },
          skuName: {
            required: true,
            tirgger: ['change']
          },
          containerName: {
            required: true,
            tirgger: ['change']
          },
          unit: {
            required: true,
            tirgger: ['change']
          },
          customName: {
            required: true,
            message: '请选择客户',
            tirgger: ['change']
          },
          supplierName: {
            required: true,
            tirgger: ['change']
          }
        },
        tabledatas: []
      },
      states: [],
      comlist: [],
      weight: 0,
      volume: 0,
      lastfunTime: 0,
      tableHeight: 50,
      warehouseOptions: [],
      typeOptions: [],
      supplierOptions: [],
      cstates: [],
      clilist: [],
      sstates: [],
      suplist: [],
      lastsupTime: 0,
      lastunitTime: 0,
      unitOptions: [],
      clientOptions: [],
      lastcomTime: 0,
      lastconTime: 0,
      lasttypeTime: 0,
      lastSkuTime: 0,
      List: [],
      tableData: [],
      sum: 0,
      skuOptions: [],
      containerOptions: [],
      dataListSelections: [],
      commodityOptions: [],
      rules: {
        inboundType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        warehouseName: [{ required: true, message: '请选择仓库名称', trigger: 'change' }]
      },
      form: {
        id: '',
        planId: '',
        createTime: '',
        inboundType: '',
        predictContainerNum: '',
        isNeedCheck: true,
        warehouseName: '',
        warehouseCode: '',
        predictSkuNum: '',
        warehouseId: '',
        predictNum: ''
      }
    }
  },
  created() {
    if (sessionStorage.planChildId && sessionStorage.planId !== null) {
      this.show = true
      this.getList()
    } else {
      this.getPlanHeadCode()
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tabledatas.$el.offsetTop - 83

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tabledatas.$el.offsetTop - 83
      }
    })
  },
  methods: {
    refresh() {
      this.reload()
    },
    getPlanHeadCode() {
      getPlanHeadCode({ code: 'IPL' }).then(res => {
        if (res.code === 200) {
          this.form.planId = res.data
        }
      })
    },
    chooseAdd: kkdeboundce(async function() {
      this.dialogVisible = true
      const res = await selectPurchaseOrderDetail({
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
          isGenerate: 0
        }})
      const resDetail = await selectPurchaseOrderDetailNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        isGenerate: 0
      }})
      this.total = resDetail.data
      this.table = res.data.list
    }, 1000),
    addChoose() {
      this.dialogVisible = false
      this.formData.tabledatas = this.dataListSelections
    },
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    focusSku: throttle(function(row) {
      if (row.commodityId) {
        searchsku(row.commodityId).then(res => {
          this.skuOptions = res.data
        }
        )
      } else {
        this.skuOptions = []
      }
    }, 5000, true),
    renderHeader(h, { column }) { // 悬浮提示的文字内容
      const info = '输入商品关键字即可'
      return h(
        'div', [h('span', column.label), // placement指定悬浮显示方向
          h('el-tooltip', { props: { placement: 'bottom', effect: 'light' }}, [
            // style 调文字颜色样式
            h('div', { slot: 'content', style: { whiteSpace: 'normal', color: 'blue' }}, info),
            // el-icon-warning是element图标, style 调图标颜色
            h('i', { class: 'el-icon-warning', style: 'color: #409EFF; margin-left: 5px;' })
          ])])
    },
    formatSkuText(skuName) {
      return skuName
    },
    formatConText(name) {
      return name
    },
    exampleSku(row) {
      const item = this.skuOptions.find(item1 => item1.skuName === row.skuName)
      row.skuId = item.id
      row.skuCode = item.skuCode
      row.skuName = item.skuName
      this.weight = item.weight
      this.volume = item.volume
      if (row.predictNum) {
        row.totalWeight = Number(this.weight) * Number(row.predictNum)
        row.totalVolumn = Number(this.volume) * Number(row.predictNum)
      }
    },
    funcUnit() {
      const now = new Date().valueOf()
      if (this.lastunitTime === 0) {
        searchsystemid('SKU_UNIT').then(res => {
          this.unitOptions = res.data
        }
        )
        this.lastunitTime = now
      } else {
        if ((now - this.lastunitTime) > 5000) {
          this.lastunitTime = now
        }
      }
    },
    chooseData() {
      this.tableData = []
      selectInboundPlanDetail({
        pojo: {
          planId: sessionStorage.getItem('planChildId')
        }}).then(res => {
        this.tableData = res.data.list
        for (let i = 0; i < this.formData.tabledatas.length; i++) {
          if (JSON.stringify(this.tableData[i]) !== JSON.stringify(this.formData.tabledatas[i])) {
            this.List.push(this.formData.tabledatas[i])
          }
        }
      })
    },
    getList() {
      selectInboundPlan({
        pojo: {
          planId: sessionStorage.getItem('planId')
        }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
        this.form = Object.assign({}, response.data[0])
        this.funType()
        for (var i = 0; i < this.typeOptions.length; i++) {
          if (this.form.inboundType === this.typeOptions[i].typeNumber) {
            this.form.inboundType = this.typeOptions[i].codeDetailName
          }
        }
        this.$set(this.form, 'createTime', getNowTime(this.form.createTime))
      })
      selectInboundPlanDetail({
        pojo: {
          planId: sessionStorage.getItem('planChildId')
        }}).then(response => {
        this.formData.tabledatas = response.data.list
      })
    },
    // 单个删除
    delect(index) {
      this.formData.tabledatas.splice(index, 1)
    },
    tableRowClassDetailName({ rowIndex }) {
      return 'db-row'
    },
    funType() {
      const now = new Date().valueOf()
      if (this.lasttypeTime === 0) {
        searchsystemid('INBOUND_ADVICE_TYPE').then(res => {
          this.typeOptions = res.data
        }
        )
        this.lasttypeTime = now
      } else {
        if ((now - this.lasttypeTime) > 5000) {
          this.lasttypeTime = now
        }
      }
    },
    changeWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.form.warehouseName)
      this.form.warehouseId = item.id
      this.form.warehouseName = item.warehouseName
      this.form.warehouseCode = item.warehouseCode
    },
    exampleCon(row) {
      const item = this.containerOptions.find(item1 => item1.name === row.containerName)
      row.isSingle = 1
      row.containerId = item.id
      row.containerName = item.name
      row.containerCode = item.code
    },
    changeComOptions(row) {
      const item = this.commodityOptions.find(item1 => item1.goodsName === row.commodityName)
      row.commodityId = item.id
      row.commodityName = item.goodsName
      row.commodityCode = item.code
    },
    changeClientOptions(row) {
      const item = this.clientOptions.find(item1 => item1.customName === row.customName)
      row.customId = item.id
      row.customName = item.customName
      row.customCode = item.customCode
    },
    changeOptions(row) {
      const item = this.suplierOptions.find(item1 => item1.customName === row.supplierName)
      row.supplierId = item.id
      row.supplierName = item.customName
      row.supplierCode = item.customCode
    },
    changeSku(row) {
      const item = this.skuOptions.find(item1 => item1.skuName === row.skuName)
      row.skuId = item.id
      row.skuCode = item.skuCode
      row.skuName = item.skuName
      this.weight = item.weight
      this.volume = item.volume
      if (row.num) {
        row.totalWeight = Number(this.weight) * Number(row.num)
        row.totalVolumn = Number(this.volume) * Number(row.num)
      }
    },
    changeSum(row) {
      if (row.skuName && !this.skuOptions) {
        row.totalWeight = Number(this.weight) * Number(row.num)
        row.totalVolumn = Number(this.volume) * Number(row.num)
      } else if (this.skuOptions) {
        searchsku(row.commodityId).then(res => {
          this.skuOptions = res.data
          const item = this.skuOptions.find(item1 => item1.skuName === row.skuName)
          this.weight = item.weight
          this.volume = item.volume
          row.totalWeight = Number(this.weight) * Number(row.num)
          row.totalVolumn = Number(this.volume) * Number(row.num)
        }
        )
      }
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
    funcCommodity(query) {
      screenGoods({
        searchDTO: {
          num: 100000,
          page: 1
        },
        pojo: {
        }
      })
        .then(res => {
          this.states = res.data
          this.comlist = this.states.map(item => {
            return { id: item.id, goodsName: item.goodsName, code: item.code }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.commodityOptions = this.comlist.filter(item => {
              return item.goodsName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.commodityOptions = []
        }
      }, 100)
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
    func() {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        searchwarehouse(window.sessionStorage.workGroupId).then(res => {
          this.warehouseOptions = res.data.results
        }
        )
        this.lastTime = now
      } else {
        if ((now - this.lastTime) > 5000) {
          this.lastTime = now
        }
      }
    },
    funSupplier(query) {
      searchsupplier().then(res => {
        this.sstates = res.data
        this.suplist = this.sstates.map(item => {
          return { id: item.id, customName: item.customName, customCode: item.customCode }
        })
      }
      )
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.supplierOptions = this.suplist.filter(item => {
              return item.customName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.supplierOptions = []
        }
      }, 100)
    },
    funClient(query) {
      searchcustomer().then(res => {
        this.cstates = res.data
        this.clilist = this.cstates.map(item => {
          return { id: item.id, customName: item.customName, customCode: item.customCode }
        })
      }
      )
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.clientOptions = this.clilist.filter(item => {
              return item.customName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.clientOptions = []
        }
      }, 100)
    },
    // save() {
    //   this.$refs.form.validate((valid) => {
    //     if (valid) {
    //       this.$confirm('是否要暂存所填信息?', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       }).then(() => {
    //         saveInboundPlan({ details: this.formData.tabledatas, head: {
    //           inboundType: this.form.inboundType,
    //           predictContainerNum: this.form.predictContainerNum,
    //           warehouseId: this.form.warehouseId,
    //           createTime: this.form.createTime,
    //           warehouseName: this.form.warehouseName,
    //           predictSkuNum: this.form.predictSkuNum,
    //           predictNum: this.form.predictNum
    //         }}).then(res => {
    //           if (res.code === 200) {
    //             this.$message.success('暂存成功')
    //             this.reload()
    //           }
    //         })
    //       }).catch(() => {
    //         this.$message({
    //           type: 'info',
    //           message: '已取消'
    //         })
    //       })
    //     }
    //   })
    // },
    update() {
      this.chooseData()
      if (this.formData.tabledatas.length === 0) {
        this.$message.error('商品信息不能为空！')
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$refs.formData.validate((valid) => {
              if (valid) {
                this.$confirm('确定保存更新信息吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  for (var i = 0; i < this.formData.tabledatas.length; i++) {
                    this.sum += this.formData.tabledatas[i].num
                  }
                  this.form.predictContainerNum = this.formData.tabledatas.length
                  this.form.predictNum = this.sum
                  this.form.predictSkuNum = this.formData.tabledatas.length
                  updPlanTable({ details: this.List, head: {
                    id: this.form.id,
                    planId: this.form.planId,
                    inboundType: this.form.inboundType,
                    isNeedCheck: this.form.isNeedCheck,
                    predictContainerNum: this.form.predictContainerNum,
                    warehouseId: this.form.warehouseId,
                    createTime: this.form.createTime,
                    warehouseName: this.form.warehouseName,
                    warehouseCode: this.form.warehouseCode,
                    predictSkuNum: this.form.predictSkuNum,
                    predictNum: this.form.predictNum
                  }}).then(res => {
                    if (res.code === 200) {
                      this.$message.success('更新成功')
                      this.reload()
                      this.$router.replace({ path: 'receiptplan' })
                      sessionStorage.removeItem('planChildId')
                      sessionStorage.removeItem('planId')
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
          }
        })
      }
    },
    submit() {
      if (this.formData.tabledatas.length === 0) {
        this.$message.error('商品信息不能为空！')
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$refs.formData.validate((valid) => {
              if (valid) {
                this.$confirm('确定保存填写信息吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  for (var i = 0; i < this.formData.tabledatas.length; i++) {
                    this.sum += this.formData.tabledatas[i].num
                  }
                  this.form.predictContainerNum = this.formData.tabledatas.length
                  this.form.predictNum = this.sum
                  this.form.predictSkuNum = this.formData.tabledatas.length
                  addInboundPlan({ details: this.formData.tabledatas, head: {
                    id: this.form.id,
                    planId: this.form.planId,
                    inboundType: this.form.inboundType,
                    predictContainerNum: this.form.predictContainerNum,
                    isNeedCheck: this.form.isNeedCheck,
                    warehouseId: this.form.warehouseId,
                    createTime: this.form.createTime,
                    warehouseName: this.form.warehouseName,
                    warehouseCode: this.form.warehouseCode,
                    predictSkuNum: this.form.predictSkuNum,
                    predictNum: this.form.predictNum
                  }}).then(res => {
                    if (res.code === 200) {
                      this.$message.success('保存成功')
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
          }
        })
      }
    },
    goback() {
      this.$router.go(-1)
    },
    add() {
      const list = {
        purchaseCode: '',
        commodityId: '',
        commodityCode: '',
        commodityName: '',
        skuCode: '',
        predictReceiveLocationCode: '',
        totalWeight: '',
        totalNetWeight: '',
        totalVolumn: '',
        isSingle: 0,
        receiveTime: '',
        num: '',
        inboundTraceCode: '',
        remark: '',
        containerId: '',
        containerCode: '',
        containerName: '',
        customName: '',
        customId: '',
        customCode: '',
        supplierId: '',
        supplierName: '',
        supplierCode: ''
      }
      this.formData.tabledatas.push(list)
    }
  }
}
</script>
  <style>
    .el-table .db-row{
    background:#262626;
  }
  .datagrid-htable, .datagrid-btable, .datagrid-ftable {
      color: #ffffff;
  }
  </style>
    <style scoped>
    .el-card /deep/ .el-card__header {
    padding: 10px;

    }
    </style>
    <style lang="scss" scoped>
  // 修改对话框高度
      .btnsContain {
        div{
          width: 100px;
          margin: 0 auto;
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

