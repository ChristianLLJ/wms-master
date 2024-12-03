<template>
  <div>
    <div class="btngroups">
      <el-button type="success" icon="el-icon-back" @click="goback">返回上一页</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card class="show_card1" :body-style="{padding:'20px'}">
      <div slot="header" align="center">
        <span class="title">采购订单单头</span>
      </div>
      <el-form ref="form" :rules="rules" :inline="true" :model="form" label-width="120px">
        <el-form-item v-if="false" label="id">
          <el-input v-model="form.id" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="采购订单编号" prop="orderId">
          <el-input v-model="form.orderId" size="mini" style="width: 160px;" disabled />
        </el-form-item>
        <el-form-item v-if="false" label="客户id">
          <el-input v-model="form.customId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="采购订单类型" prop="orderType">
          <el-select v-model="form.orderType" size="mini" @focus="funType">
            <el-option v-for="item in typeOptions" :key="item.id" :label="item.codeDetailName" :value="item.typeNumber" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户" prop="customName">
          <el-select
            v-model="form.customName"
            filterable
            clearable
            reserve-keyword
            placeholder="请输入关键词,如“宝开”"
            :filter-method="funClient"
            size="mini"
            @focus="cusfocus"
            @change="changeClientOptions"
          >
            <el-option v-for="item in clientOptions" :key="item.id" :label="item.customName" :value="item.customName" />
          </el-select>
        </el-form-item>

        <el-form-item label="供应商" prop="supplierName">
          <el-select
            v-model="form.supplierName"
            filterable
            clearable
            reserve-keyword
            placeholder="请输入关键词,如“宝开”"
            :filter-method="funSupplier"
            size="mini"
            @focus="supfocus"
            @change="changeOptions"
          >
            <el-option v-for="item in supplierOptions" :key="item.id" :label="item.customName" :value="item.customName" />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库" prop="warehouseName">
          <el-select
            v-model="form.warehouseName"
            clearable
            size="mini"
            @focus="func"
            @change="changeWarehouseOptions"
          >
            <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" maxlength="100" show-word-limit style="width: 500px" :rows="3" size="mini" clearable />
        </el-form-item>

        <el-form-item v-if="false" label="客户代码">
          <el-input v-model="form.customCode" disabled size="mini" placeholder="选择客户名称后自动填充" style="width: 180px;" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="供应商id">
          <el-input v-model="form.supplierId" size="mini" style="width: 160px;" clearable />
        </el-form-item>

        <el-form-item v-if="false" label="供应商代码">
          <el-input v-model="form.supplierCode" disabled size="mini" placeholder="选择供应商后自动填充" style="width: 180px;" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="仓库id">
          <el-input v-model="form.warehouseId" size="mini" style="width: 160px;" clearable />
        </el-form-item>

        <el-form-item v-if="false" label="仓库代码">
          <el-input v-model="form.warehouseCode" disabled size="mini" placeholder="选择仓库后自动填充" style="width: 160px;" clearable />
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
      </el-form>
    </el-card>
    <el-card class="show_card1" :body-style="{padding:'0px'}" shadow="always">
      <div slot="header" align="center">
        <span>采购订单商品信息</span><span style="padding-left: 20px"><i class="el-icon-warning" /> 请先填写商品名称，再选择对应的商品sku！</span>
        <el-button icon="el-icon-plus" type="primary" @click="add">增加明细</el-button>
      </div>
      <el-form ref="formData" :model="formData" :rules="formData.rules">
        <el-table
          ref="tabledatas"
          :data="formData.tabledatas"
          size="mini"
          border
          :height="tableHeight"
          :header-cell-style="{background:'#091f2c',color: '#fff'}"
          :row-style="{height:'20px'}"
          :cell-style="{padding:'0px'}"
          style="width: 100%, font-size: 10px"
        >
          <el-table-column type="index" label="序号" />
          <el-table-column label="商品" :render-header="renderHeader">
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
          <el-table-column label="商品sku名称" width="200px">
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
                    <GridColumn v-if="false" field="id" title="序号" />
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
          <el-table-column label="sku代码">
            <template slot-scope="scope">
              <el-form-item>
                <span>
                  <el-input v-model="scope.row.skuCode" disabled size="mini" />
                </span>
              </el-form-item>
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
          <el-table-column label="采购数量">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.predictNum'" :rules="formData.rules.predictNum">
                <el-input v-model.lazy="scope.row.predictNum" style="width: 100px" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" @change="changeSum(scope.row)" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="采购包装"
            width="200px"
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
          <el-table-column v-if="false" label="包装容量">
            <template slot-scope="scope">
              <el-form-item>
                <span>
                  <el-input v-model="scope.row.innerNum" size="mini" />
                </span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="重量">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.weight" size="mini" />
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="价格">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.money" size="mini" />
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="体积">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.volume" size="mini" />
              </span>
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
          <el-table-column label="预计包装数">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.predictContainerNum'">
                <el-input v-model="scope.row.predictContainerNum" :disabled="true" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" />
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
          <el-table-column v-if="false" label="总金额(元)" prop="totalMoney">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.totalMoney'" :rules="formData.rules.totalMoney">
                <span>{{ scope.row.totalMoney }}</span>
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
                <span>{{ scope.row.totalNetWeight }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button-group>
                <el-button v-if="!show" size="mini" icon="el-icon-delete" type="danger" @click="delect(scope.$index)">删除</el-button>
                <el-button v-if="show" size="mini" icon="el-icon-delete" type="danger" @click="delectTrue(scope.row, scope.$index)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>
    <div class="btnsContain">
      <div>
        <el-button v-if="!show" size="small" icon="el-icon-save" type="success" @click="submit">提交生成采购订单</el-button>
        <el-button v-if="show" size="small" icon="el-icon-save" type="success" @click="update">更新生成采购订单</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { addPurchaseOrder, selectPurchaseOrder, delPurDetail, screenGoods, selectPurchaseOrderDetail, updTable, getHeadCode } from '@/api/user'
import { searchallwarehouse, searchsupplier, searchcustomer, searchsku, searchcon, searchsystemid } from '@/utils/search'
import { getNowTime } from '@/utils/getTime'
import { throttle } from '@/utils/throttle'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      lastTime: 0,
      lastfunTime: 0,
      lastsupTime: 0,
      supplierOptions: [],
      formData: {
        rules: {
          commodityName: {
            required: true,
            message: '请选择商品',
            tirgger: ['change']
          },
          skuCode: {
            required: true,
            message: '请选择商品sku',
            tirgger: ['change']
          },
          unit: {
            required: true,
            message: '请选择sku单位',
            tirgger: ['change']
          },
          containerName: {
            required: true,
            message: '请选择包装',
            tirgger: ['change']
          }
        },
        tabledatas: [
        ]
      },

      lastcomTime: 0,
      lasttypeTime: 0,
      addPersonName: null,
      weight: 0,
      volume: 0,
      money: 0,
      lastconTime: 0,
      lastunitTime: 0,
      tableData: [],
      disabled: true,
      rules: {
        orderType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        warehouseName: [{ required: true, message: '请选择仓库', trigger: 'change' }],
        customName: [{ required: true, message: '请选择客户', trigger: 'change' }],
        supplierName: [{ required: true, message: '请选择供应商', trigger: 'change' }]
      },
      warehouseOptions: [],
      list: [],
      states: [],
      cstates: [],
      clilist: [],
      sstates: [],
      innerNum: null,
      suplist: [],
      comlist: [],
      codeTime: 0,
      skuOptions: [],
      show: false,
      clientOptions: [],
      containerOptions: [],
      unitOptions: [],
      typeOptions: [],
      commodityOptions: [],
      lastSkuTime: 0,
      List: [],
      tableHeight: 50,
      form: {
        id: null,
        orderId: null,
        orderType: null,
        warehouseName: null,
        warehouseId: null,
        warehouseCode: null,
        supplierId: null,
        supplierCode: null,
        supplierName: null,
        customName: null,
        customId: null,
        customCode: null,
        createTime: null,
        addPersonName: null,
        remark: null
      }
    }
  },
  created() {
    if (sessionStorage.childId && sessionStorage.orderId !== null) {
      this.getList()
      this.show = true
    } else {
      this.getHeadCode()
      this.$set(this.form, 'createTime', getNowTime(this.form.createTime))
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
    getHeadCode() {
      getHeadCode({ code: 'PUR' }).then(res => {
        if (res.code === 200) {
          this.form.orderId = res.data
        }
      })
    },
    formatSkuText(skuName) {
      return skuName
    },
    formatConText(name) {
      return name
    },
    goback() {
      this.$router.go(-1)
    },
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
    changeWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.form.warehouseName)
      this.form.warehouseId = item.id
      this.form.warehouseName = item.warehouseName
      this.form.warehouseCode = item.warehouseCode
    },
    changeClientOptions() {
      const item = this.clientOptions.find(item1 => item1.customName === this.form.customName)
      this.form.customId = item.id
      this.form.customName = item.customName
      this.form.customCode = item.customCode
    },
    getList() {
      selectPurchaseOrder({
        pojo: {
          orderId: sessionStorage.getItem('orderId')
        }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
        this.form = response.data[0]
        this.funType()
        for (var i = 0; i < this.typeOptions.length; i++) {
          if (this.form.orderType === this.typeOptions[i].typeNumber) {
            this.form.orderType = this.typeOptions[i].codeDetailName
          }
        }
        this.$set(this.form, 'createTime', getNowTime(this.form.createTime))
      })
      selectPurchaseOrderDetail({
        pojo: {
          orderId: sessionStorage.getItem('childId')
        }}).then(response => {
        this.formData.tabledatas = response.data.list
        this.tableData = JSON.parse(JSON.stringify(this.formData.tabledatas))
      })
    },
    changeOptions() {
      const item = this.supplierOptions.find(item1 => item1.customName === this.form.supplierName)
      this.form.supplierId = item.id
      this.form.supplierName = item.customName
      this.form.supplierCode = item.customCode
    },
    exampleCon(row) {
      const item = this.containerOptions.find(item1 => item1.name === row.containerName)
      row.containerId = item.id
      row.containerName = item.name
      row.containerCode = item.code
      row.innerNum = item.innerNum
      if (row.predictNum) {
        row.predictContainerNum = Math.ceil(row.predictNum / row.innerNum)
      }
    },
    changeComOptions(row) {
      const item = this.commodityOptions.find(item1 => item1.goodsName === row.commodityName)
      row.commodityId = item.id
      row.commodityName = item.goodsName
      row.commodityCode = item.code
    },
    supfocus: throttle(function() {
      searchsupplier().then(res => {
        this.supplierOptions = res.data
      }
      )
    }, 5000, true),
    funSupplier(query) {
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.supplierOptions = this.supplierOptions.filter(item => {
              return item.customName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        }
      }, 100)
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
    exampleSku(row) {
      const item = this.skuOptions.find(item1 => item1.skuName === row.skuName)
      row.skuId = item.id
      row.skuCode = item.skuCode
      row.skuName = item.skuName
      row.weight = item.weight
      row.volume = item.volume
      row.money = item.money
      if (row.predictNum) {
        row.totalWeight = Number(row.weight) * Number(row.predictNum)
        row.totalVolumn = Number(row.volume) * Number(row.predictNum)
        row.totalMoney = Number(row.money) * Number(row.predictNum)
      }
    },
    changeSum(row) {
      if (row.skuName && !this.skuOptions) {
        row.totalWeight = Number(row.weight) * Number(row.predictNum)
        row.totalVolumn = Number(row.volume) * Number(row.predictNum)
        row.totalMoney = Number(row.money) * Number(row.predictNum)
      } else if (this.skuOptions) {
        searchsku(row.commodityId).then(res => {
          this.skuOptions = res.data
          const item = this.skuOptions.find(item1 => item1.skuName === row.skuName)
          row.weight = item.weight
          row.volume = item.volume
          row.money = item.money
          row.totalWeight = Number(row.weight) * Number(row.predictNum)
          row.totalVolumn = Number(row.volume) * Number(row.predictNum)
          row.totalMoney = Number(row.money) * Number(row.predictNum)
        }
        )
      }
      if (row.containerName) {
        row.predictContainerNum = Math.ceil(row.predictNum / row.innerNum)
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
    funType() {
      const now = new Date().valueOf()
      if (this.lasttypeTime === 0) {
        searchsystemid('PURCHASE_TYPE').then(res => {
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
    cusfocus: throttle(function() {
      searchcustomer().then(res => {
        this.clientOptions = res.data
      }
      )
    }, 5000, true),
    funClient(query) {
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.clientOptions = this.clientOptions.filter(item => {
              return item.customName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        }
      }, 100)
    },
    funcCommodity(query) {
      this.skuOptions = []
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
    // 单个删除
    delect(index) {
      this.formData.tabledatas.splice(index, 1)
    },
    delectTrue(row, index) {
      if (row.id) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => {
          delPurDetail({ id: [row.id] }).then(res => {
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
      } else {
        this.formData.tabledatas.splice(index, 1)
      }
    },
    chooseData() {
      for (var i = 0; i < this.formData.tabledatas.length; i++) {
        if (JSON.stringify(this.tableData[i]) !== JSON.stringify(this.formData.tabledatas[i])) {
          this.List.push(this.formData.tabledatas[i])
        }
      }
    },
    update() {
      this.chooseData()
      if (this.formData.tabledatas.length === 0) {
        this.$message.error('商品信息不能为空！')
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$refs.formData.validate((valid) => {
              if (valid) {
                this.$confirm('是否确定更新所填信息?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  const arr = this.distribute(this.List)
                  updTable({ details: arr, head: {
                    id: this.form.id,
                    orderId: this.form.orderId,
                    customId: this.form.customId,
                    orderType: this.form.orderType,
                    customCode: this.form.customCode,
                    warehouseName: this.form.warehouseName,
                    warehouseId: this.form.warehouseId,
                    warehouseCode: this.form.warehouseCode,
                    supplierName: this.form.supplierName,
                    supplierId: this.form.supplierId,
                    supplierCode: this.form.supplierCode,
                    customName: this.form.customName,
                    createTime: this.form.createTime,
                    addPersonName: sessionStorage.getItem('getUserName'),
                    addPersonId: sessionStorage.getItem('getUserId'),
                    remark: this.form.remark
                  }}).then(res => {
                    if (res.code === 200) {
                      this.$message.success('更新成功')
                      this.reload()
                      this.$router.replace({ path: 'table' })
                      sessionStorage.removeItem('childId')
                      sessionStorage.removeItem('orderId')
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
    distribute(changeArr) {
      const arrs = []
      const arr = changeArr
      const len = changeArr.length
      for (let i = 0; i < len; i++) {
        const length = arr[i].predictContainerNum
        if (arr[i].predictContainerNum !== 1) {
          let num = Number(arr[i].predictNum)
          for (let j = 0; j < length; j++) {
            if (num - arr[i].innerNum > 0) {
              // 深拷贝
              const obj = JSON.parse(JSON.stringify(arr[i]))
              obj.predictNum = arr[i].innerNum
              obj.totalWeight = Number(arr[i].weight) * Number(obj.predictNum)
              obj.totalVolumn = Number(arr[i].volume) * Number(obj.predictNum)
              obj.totalMoney = Number(arr[i].money) * Number(obj.predictNum)
              obj.predictContainerNum = 1
              Reflect.deleteProperty(obj, 'inner')
              Reflect.deleteProperty(obj, 'weight')
              Reflect.deleteProperty(obj, 'volume')
              Reflect.deleteProperty(obj, 'money')
              arrs.push(obj)
              num = num - arr[i].innerNum
            } else {
              arr[i].predictNum = num
              arr[i].predictContainerNum = 1
              arr[i].totalWeight = Number(arr[i].weight) * Number(arr[i].predictNum)
              arr[i].totalVolumn = Number(arr[i].volume) * Number(arr[i].predictNum)
              arr[i].totalMoney = Number(arr[i].money) * Number(arr[i].predictNum)
              arrs.push(arr[i])
            }
          }
        } else {
          arrs.push(arr[i])
        }
      }
      return arrs
    },
    submit() {
      if (this.formData.tabledatas.length === 0) {
        this.$message.error('商品信息不能为空！')
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$refs.formData.validate((valid) => {
              if (valid) {
                this.$confirm('此操作提交所填信息, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  const arr = this.distribute(this.formData.tabledatas)
                  addPurchaseOrder({ details: arr, head: {
                    id: this.form.id,
                    orderId: this.form.orderId,
                    customId: this.form.customId,
                    customCode: this.form.customCode,
                    orderType: this.form.orderType,
                    warehouseName: this.form.warehouseName,
                    warehouseId: this.form.warehouseId,
                    warehouseCode: this.form.warehouseCode,
                    supplierName: this.form.supplierName,
                    supplierId: this.form.supplierId,
                    supplierCode: this.form.supplierCode,
                    customName: this.form.customName,
                    createTime: this.form.createTime,
                    addPersonName: sessionStorage.getItem('getUserName'),
                    addPersonId: sessionStorage.getItem('getUserId'),
                    remark: this.form.remark
                  }}).then(res => {
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
            })
          }
        })
      }
    },
    add() {
      const list = {
        rowNum: '',
        commodityId: '',
        commodityCode: '',
        commodityName: '',
        skuCode: '',
        containerId: '',
        containerCode: '',
        containerName: '',
        unit: '',
        predictContainerNum: '',
        predictSkuNum: '',
        totalVolumn: '',
        totalMoney: '',
        totalWeight: '',
        totalNetWeight: '',
        remark: ''
      }
      this.formData.tabledatas.push(list)
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
</style>

