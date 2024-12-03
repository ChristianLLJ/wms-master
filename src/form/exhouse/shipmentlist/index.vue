<template>
  <div>
    <div id="btnAndSearch" class="show_card1">
      <el-button-group>
        <el-tooltip class="item" effect="dark" content="返回发运订单页面" placement="bottom-start">
          <el-button type="warning" icon="el-icon-back" @click="goback">返回上一页</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="重新填写发运订单，会重置所有已填写的数据" placement="bottom-start">
          <el-button type="danger" icon="el-icon-refresh" @click="refresh">重填</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="提交填写好的发运订单" placement="bottom-start">
          <el-button type="primary" icon="el-icon-s-claim" @click="submit">提交</el-button>
        </el-tooltip>
      </el-button-group>
    </div>
    <el-card class="show_card1" :body-style="{padding:'0px'}">
      <div slot="header" align="center">
        <span class="title">发运订单 单头信息</span>
      </div>
      <el-form ref="form" :inline="true" :model="formTitle.data">
        <el-card :body-style="{padding:'0px'}">
          <e-desc>
            <e-desc-item label="客户订单号">
              <el-input v-model="formTitle.data.orderId" size="small" readonly />
            </e-desc-item>
            <e-desc-item label="仓库">
              <el-select v-model="formTitle.data.warehouseCode" placeholder="请选择仓库名称" size="small" style="width: 100%;" clearable filterable @change="changeWarehouse($event)">
                <el-option v-for="item in optionsWarehouse" :key="item.id" :label="item.warehouseName" :value="item.warehouseCode" />
              </el-select>
            </e-desc-item>
            <e-desc-item label="要求发货时间">
              <el-date-picker
                v-model="formTitle.data.requestDeliveryTime"
                type="datetime"
                placeholder="请选择要求发货时间"
                style="width: 100%;"
                size="small"
                align="right"
                unlink-panels
                :picker-options="pickerOptions"
              />
            </e-desc-item>
            <e-desc-item label="货主名称">
              <el-select v-model="formTitle.data.customerId" placeholder="请选择货主名称" size="small" style="width: 100%;" clearable filterable @change="selectCustomer($event)">
                <el-option v-for="item in optionsCustom" :key="item.id" :label="item.customName" :value="item.id" />
              </el-select>
            </e-desc-item>
            <e-desc-item label="收货人">
              <el-select v-model="formTitle.data.receiverName" placeholder="请选择收货人" size="small" style="width: 100%;" clearable filterable @change="selectReciever($event)">
                <el-option v-for="item in optionsReceiver" :key="item.id" :label="item.customName" :value="item.id" />
              </el-select>
            </e-desc-item>
            <e-desc-item label="联系电话">
              <el-input v-model="formTitle.data.phone" placeholder="请输入联系电话" size="small" />
            </e-desc-item>
            <e-desc-item label="收货地址/省市县">
              <el-select v-model="formTitle.data.province" filterable clearable size="small" placeholder="请选择省份" @change="selectProvinceFun($event)">
                <el-option v-for="(item, index) in city" :key="index" :value="item" :label="item.label" />
              </el-select>
              <el-select v-model="formTitle.data.city" filterable clearable size="small" placeholder="请选择城市" @change="selectCityFun($event)">
                <el-option v-for="(item, index) in cityList" :key="index" :value="item" :label="item.label" />
              </el-select>
              <el-select v-model="formTitle.data.site" filterable clearable size="small" placeholder="请选择区县" @change="selectAreaFun($event)">
                <el-option v-for="(item, index) in siteList" :key="index" :value="item" :label="item.label" />
              </el-select>
            </e-desc-item>
            <e-desc-item label="详细地址">
              <el-input v-model="formTitle.data.address" placeholder="请输入详细地址" size="small" />
            </e-desc-item>
          </e-desc>
        </el-card>
      </el-form>
    </el-card>
    <el-card class="show_card1" :body-style="{padding:'0px'}" shadow="always">
      <div slot="header" align="center">
        <span class="title">发运订单 商品信息</span><span style="padding-left: 20px" />
        <el-button icon="el-icon-plus" type="primary" @click="add">新增</el-button>
      </div>
      <el-form ref="formData" :model="formData" :rules="formData.rules">
        <el-table
          ref="tabledatas"
          :data="formData.tabledatas"
          :summary-method="getSummaries"
          show-summary
          size="mini"
          border
          :height="tableHeight"
          :row-class-name="tableRowClassDetailName"
          :header-cell-style="{background:'#091f2c',color: '#fff'}"
          :row-style="{height:'20px'}"
          :cell-style="{padding:'0px'}"
          style="width: 100%, font-size: 10px"
        >
          <el-table-column type="index" label="序号" />
          <el-table-column label="sku名称" width="200px">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.skuName'" :rules="formData.rules.skuName">
                <ComboGrid
                  v-model="scope.row.skuName"
                  value-field="skuName"
                  text-field="skuName"
                  :editable="true"
                  :data="skuOptionsNow"
                  :panel-style="{width:'500px'}"
                  :text-formatter="formatSkuText"
                  @filterChange="changedinput($event)"
                  @valueChange="exampleSku(scope.row)"
                >
                  <DataGrid slot="grid" :border="false">
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
          <el-table-column label="尺寸" prop="skuSize" />
          <el-table-column label="颜色" prop="skuColor" />
          <el-table-column label="订货数量" prop="orderCnt">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.orderCnt'" :rules="formData.rules.orderCnt">
                <el-input v-model.number="scope.row.orderCnt" type="number" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" @input="changeSum(scope.row)" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="总金额(元)" prop="totalMoney">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.totalMoney'" :rules="formData.rules.totalMoney">
                <span>{{ scope.row.totalMoney }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button-group>
                <el-button icon="el-icon-delete" type="danger" @click="delect(scope.$index)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import city from '@/assets/city.json'
import EDesc from '@/components/Edesc'
import EDescItem from '@/components/Edescitem'
import { getHeadCode, addDesAndDetail } from '@/api/user'
import { searchallwarehouse, searchsku, searchreceiver, searchcustomer } from '@/utils/search'
import elementResizeDetectorMaker from 'element-resize-detector'
var erd = elementResizeDetectorMaker()

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: {
    EDesc, EDescItem
  },
  data() {
    return {
      optionsWarehouse: [],
      goodsAmount: null,
      checkSubmitTitle: true, // 验证提交时的表头数据
      optionsCustom: [],
      optionsReceiver: [],
      selectProvince: {},
      selectCity: {},
      selectArea: {},
      city: city,
      cityList: [],
      siteList: [],
      lastTime: 0,
      lastfunTime: 0,
      lastsupTime: 0,
      supplierOptions: [],
      formData: {
        rules: {
          skuName: {
            required: true,
            message: '请选择商品sku',
            tirgger: ['change']
          },
          orderCnt: {
            required: true,
            message: '请输入订货数量',
            tirgger: ['change'],
            type: 'number'
          }
        },
        tabledatas: [{
          skuId: '',
          skuCode: '',
          skuBarcode: '',
          skuName: '',
          skuColor: '',
          skuSize: '',
          skuPrice: '',
          totalMoney: '',
          orderCnt: ''
        }]
      },
      lastcomTime: 0,
      lasttypeTime: 0,
      addPersonName: null,
      weight: 0,
      volume: 0,
      money: 0,
      lastconTime: 0,
      lastunitTime: 0,
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
      suplist: [],
      comlist: [],
      skuOptions: [],
      skuOptionsNow: [],
      show: false,
      clientOptions: [],
      containerOptions: [],
      unitOptions: [],
      typeOptions: [],
      commodityOptions: [],
      lastSkuTime: 0,
      tableHeight: 515,
      formTitle: {
        data: {
          id: null,
          orderId: null,
          customName: null,
          phone: null,
          receiverName: null,
          receiverId: null,
          province: { label: null },
          city: { label: null },
          site: { label: null },
          address: null,
          requestDeliveryTime: null,
          customerId: null,
          customerName: null,
          customerCode: null,
          warehouseCode: null,
          warehouseId: null,
          warehouseName: null
        }
      },
      pickerOptions: {
        shortcuts: [{
          text: '明天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '后天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
            picker.$emit('pick', date)
          }
        }, {
          text: '三天后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 3)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }, {
          text: '两周后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 14)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  created() {
    this.getList()
    getHeadCode({
      code: 'DES'
    }).then(res => {
      this.formTitle.data.orderId = res.data
    })
    searchcustomer().then(res => {
      this.optionsCustom = res.data
    }
    )
    searchreceiver().then(res => {
      this.optionsReceiver = res.data
    }
    )
    searchallwarehouse().then(res => {
      this.optionsWarehouse = res.data
    })
  },
  mounted: function() {
    erd.listenTo(document.getElementById('btnAndSearch'), (element) => {
      var height = element.offsetHeight
      this.tableHeight = window.innerHeight - height - 315
    })
  },
  methods: {
    changeWarehouse(event) {
      console.log(event)
      const item = this.optionsWarehouse.find(item1 => item1.warehouseCode === event)
      this.formTitle.data.warehouseName = item.warehouseName
      this.formTitle.data.warehouseId = item.id
      console.log(this.formTitle.data)
    },
    changedinput(even) {
      var reg = new RegExp(even.filterValue)
      this.skuOptionsNow = []
      for (var i = 0; i < this.skuOptions.length; i++) {
        if (reg.test(this.skuOptions[i].skuName)) {
          this.skuOptionsNow.push(this.skuOptions[i])
        }
      }
    },
    selectCustomer(event) {
      console.log(event)
      const item = this.optionsCustom.find(item1 => item1.id === event)
      this.formTitle.data.customerName = item.customName
      this.formTitle.data.customerCode = item.customCode
      console.log(this.formTitle.data)
    },
    selectReciever(event) {
      console.log(event)
      const item = this.optionsReceiver.find(item1 => item1.id === event)
      this.formTitle.data.receiverName = item.customName
      this.formTitle.data.receiverId = item.id
      this.formTitle.data.phone = item.phone
      this.formTitle.data.address = item.address
      this.formTitle.data.province = item.province
      this.formTitle.data.city = item.city
      this.formTitle.data.site = item.site
      console.log(this.formTitle.data)
    },
    selectProvinceFun(event) {
      if (event) {
        this.formTitle.data.province = event.label
        this.cityList = event.children
      } else {
        this.cityList = []
      }
      this.siteList = []
      this.formTitle.data.city = null
      this.formTitle.data.site = null
      console.log(this.formTitle.data)
    },
    selectCityFun(event) {
      if (event) {
        this.formTitle.data.city = event.label
        this.siteList = event.children
      } else {
        this.siteList = []
        this.formTitle.data.site = null
      }
      console.log(this.formTitle.data)
    },
    selectAreaFun(event) {
      if (event) {
        this.formTitle.data.site = event.label
      }
    },
    goback() {
      this.$confirm('新增发运订单尚未提交，是否返回发运订单列表?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('shipmentorder')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消返回'
        })
      })
    },
    refresh() {
      this.$confirm('此操作将清空所有已填写信息，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.reload()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    formatSkuText(skuName) {
      return skuName
    },
    formatConText(name) {
      return name
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
    getList() {
      searchsku().then(res => {
        this.skuOptions = res.data
      })
    },
    exampleSku(row) {
      const item = this.skuOptions.find(item1 => item1.skuName === row.skuName)
      console.log(row)
      console.log(item)
      row.skuId = item.id
      row.skuPrice = item.money
      row.money = item.money
      row.volume = item.volume
      row.weight = item.weight
      row.skuName = item.skuName
      row.skuColor = item.skuColor
      row.skuBarcode = item.skuBarcode
      row.skuSize = item.skuSize
      row.skuCode = item.skuCode
      this.weight = item.weight
      this.volume = item.volume
      this.skuPrice = item.money
      if (row.orderCnt) {
        // row.totalWeight = Number(this.weight) * Number(row.orderCnt)
        // row.totalVolumn = Number(this.volume) * Number(row.orderCnt)
        row.totalMoney = Number(this.skuPrice) * Number(row.orderCnt)
      }
    },
    changeSum(row) {
      if (row.skuName && !this.skuOptions) {
        row.totalMoney = Number(this.skuPrice) * Number(row.orderCnt)
      } else if (this.skuOptions) {
        searchsku(row.commodityId).then(res => {
          this.skuOptions = res.data
          const item = this.skuOptions.find(item1 => item1.skuName === row.skuName)
          this.skuPrice = item.money
          row.totalMoney = Number(this.skuPrice) * Number(row.orderCnt)
        }
        )
      }
    },
    // 单个删除
    delect(index) {
      this.formData.tabledatas.splice(index, 1)
    },
    tableRowClassDetailName({ rowIndex }) {
      return 'db-row'
    },
    submit() {
      console.log(this.formTitle)
      this.checkSubmitTitleFun()
      if (this.checkSubmitTitle) {
        if (this.formData.tabledatas.length === 0) {
          this.$message.error('商品信息不能为空！')
        } else {
          this.$refs.formData.validate((valid) => {
            if (valid) {
              this.$confirm('提交所填客户订单信息, 是否确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.goodsAmount = 0
                for (const item in this.formData.tabledatas) {
                  this.goodsAmount += this.formData.tabledatas[item].orderCnt
                }
                addDesAndDetail({ head: {
                  'type': 3,
                  'warehouseId': this.formTitle.data.warehouseId,
                  'warehouseName': this.formTitle.data.warehouseName,
                  'warehouseCode': this.formTitle.data.warehouseCode,
                  'customerName': this.formTitle.data.customerName,
                  'customerCode': this.formTitle.data.customerCode,
                  'province': this.formTitle.data.province,
                  'city': this.formTitle.data.city,
                  'site': this.formTitle.data.site,
                  'address': this.formTitle.data.address,
                  'receiverName': this.formTitle.data.receiverName,
                  'receiverId': this.formTitle.data.receiverId,
                  'phoneNumber': this.formTitle.data.phone,
                  'requestDeliveryTime': this.formTitle.data.requestDeliveryTime,
                  'day': 0,
                  'remarks': null,
                  'goodsAmount': this.goodsAmount
                },
                details: this.formData.tabledatas }).then(res => {
                  if (res.code === 200) {
                    this.$message.success('提交成功')
                    this.$router.push('shipmentorder')
                  }
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消提交'
                })
              })
            } else {
              this.$message.error('请检查商品信息！')
            }
          })
        }
      }
    },
    checkSubmitTitleFun() {
      this.checkSubmitTitle = true
      if (!this.formTitle.data.customerId) {
        this.$message.error('单头信息未填写完整，请选择货主名称！')
        this.checkSubmitTitle = false
      } else if (!this.formTitle.data.receiverName) {
        this.$message.error('单头信息未填写完整，请选择收货人！')
        this.checkSubmitTitle = false
      } else if (!this.formTitle.data.phone) {
        this.$message.error('单头信息未填写完整，请输入联系电话！')
        this.checkSubmitTitle = false
      } else if (!this.formTitle.data.province) {
        this.$message.error('单头信息未填写完整，请选择收货地址/省！')
        this.checkSubmitTitle = false
      } else if (!this.formTitle.data.city) {
        this.$message.error('单头信息未填写完整，请选择收货地址/市！')
        this.checkSubmitTitle = false
      } else if (!this.formTitle.data.site) {
        this.$message.error('单头信息未填写完整，请选择收货地址/区县！')
        this.checkSubmitTitle = false
      } else if (!this.formTitle.data.address) {
        this.$message.error('单头信息未填写完整，请输入详细地址！')
        this.checkSubmitTitle = false
      } else if (!this.formTitle.data.requestDeliveryTime) {
        this.$message.error('单头信息未填写完整，请选择要求发货时间！')
        this.checkSubmitTitle = false
      }
    },
    add() {
      const list = {
        skuId: '',
        skuCode: '',
        skuBarcode: '',
        skuName: '',
        skuColor: '',
        skuSize: '',
        skuPrice: '',
        totalMoney: '',
        orderCnt: ''
      }
      this.formData.tabledatas.push(list)
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        // 第一个显示为合计
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map((item) => item[column.property])
        // 对表格数据进行循环
        values.map((item) => {
          // 判断返回的是否为number数据类型
          if (typeof item === 'number' && item !== Infinity && !isNaN(item)) {
            // 判断是否为时间戳
            if (item > 1600000000000) {
              // 若为时间戳则置为--
              sums[index] = '--'
              return
            } else {
              // 对number数据进行累加
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  // 解决js计算小数出现小数点后多位数字的问题
                  return Math.floor((prev + curr) * 100) / 100
                } else {
                  return prev
                }
              }, 0)
            }
          } else {
            // 不为number类型则置为--
            sums[index] = '--'
            return
          }
        })
      })
      return sums
    }
  }
}
</script>
<style>
  .el-table .db-row{
  background: #262626;
}
.datagrid-htable, .datagrid-btable, .datagrid-ftable {
    color: #ffffff;
}
</style>
 <style scoped>
  .el-card /deep/ .el-card__header {
  color:#fff;
  }
  .el-form /deep/.el-form-item__label{
    color:#fff
  }
  </style>
  <style lang="scss" scoped>
// 修改对话框高度
    .show_card1 {
      background-color:#081b26c3;
    }
</style>

