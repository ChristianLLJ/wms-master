<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <el-row :gutter="20">
        <el-col :span="6">
          <div>
            <el-statistic title="总发运订单数">
              <template slot="formatter"> {{ value11 }} </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="已完成的发运订单数">
              <template slot="prefix">
                <i class="el-icon-s-flag" style="color: blue" />
              </template>
              <template slot="formatter"> {{ value12 }} </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="未完成的发运订单数">
              <template slot="prefix">
                <i class="el-icon-s-flag" style="color: red" />
              </template>
              <template slot="formatter"> {{ value13 }} </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="总箱数">
              <template slot="formatter"> {{ value14 }} </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <div>
            <el-statistic title="总SKU数">
              <template slot="formatter"> {{ value21 }} </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="已发运SKU数">
              <template slot="prefix">
                <i class="el-icon-s-flag" style="color: blue" />
              </template>
              <template slot="formatter"> {{ value22 }} </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="未发运的SKU数">
              <template slot="prefix">
                <i class="el-icon-s-flag" style="color: red" />
              </template>
              <template slot="formatter"> {{ value23 }} </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" :model="form" label-width="120px">
          <el-form-item label="客户">
            <el-input v-model="form.customName" size="small" style="width: 300px;" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="供应商">
            <el-input v-model="form.supplierName" size="small" style="width: 300px;" placeholder="请输入" clearable />
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
          <el-form-item label="收货时间">
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
          <el-form-item>
            <el-button type="success" icon="el-icon-search" round size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
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
      <el-table-column label="出库信息" align="center">
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column label="发运订单号" width="115px" align="center" :show-overflow-tooltip="true" prop="despatchId" />
        <el-table-column label="仓库名称" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
        <el-table-column label="货主名称" align="center" :show-overflow-tooltip="true" prop="customerName" />
        <el-table-column label="收货人" align="center" :show-overflow-tooltip="true" prop="receiverName" />
        <!-- <el-table-column label="收货地/省" width="60px" align="center" :show-overflow-tooltip="true" prop="province" />
        <el-table-column label="市" width="60px" :show-overflow-tooltip="true" prop="city" />
        <el-table-column label="县" width="60px" :show-overflow-tooltip="true" prop="site" />
        <el-table-column label="详细地址" align="center" :show-overflow-tooltip="true" prop="address" /> -->
        <!-- <el-table-column sortable="custom" label="订单状态" align="center" :show-overflow-tooltip="true" prop="status" :formatter="stateFormat" />
        <el-table-column sortable="custom" label="是否预配" align="center" :show-overflow-tooltip="true" prop="isPreDistributed">
          <template slot-scope="scope">
            <span v-if="scope.row.isPreDistributed=== 0"><el-tag type="warning" size="mini">未预配</el-tag></span>
            <span v-if="scope.row.isPreDistributed=== 1"><el-tag type="success" size="mini">预配成功</el-tag></span>
            <span v-if="scope.row.isPreDistributed=== 2"><el-tag type="danger" size="mini">预配失败</el-tag></span>
          </template></el-table-column>
        <el-table-column sortable="custom" align="center" prop="verifyStatus" label="审核状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.verifyStatus=== 1"><el-tag type="warning" size="mini">待审核</el-tag></span>
            <span v-if="scope.row.verifyStatus=== 2"><el-tag type="success" size="mini">审核通过</el-tag></span>
            <span v-if="scope.row.verifyStatus=== 11"><el-tag type="danger" size="mini">审核未通过</el-tag></span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center" :show-overflow-tooltip="true" prop="reviewerName" /> -->
        <el-table-column width="75px" sortable="custom" label="订单创建时间" align="center" :show-overflow-tooltip="true" prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat2 }}</template>
        </el-table-column>
        <el-table-column width="75px" sortable="custom" label="要求交货时间" align="center" :show-overflow-tooltip="true" prop="requestDeliveryTime">
          <template slot-scope="scope">{{ scope.row.requestDeliveryTime| dateYMDHMSFormat2 }}</template>
        </el-table-column>
        <el-table-column width="75px" sortable="custom" label="预期发货时间" align="center" :show-overflow-tooltip="true" prop="expectSendTime">
          <template slot-scope="scope">{{ scope.row.expectSendTime| dateYMDHMSFormat2 }}</template>
        </el-table-column>
        <!-- <el-table-column width="75px" sortable="custom" label="审核时间" align="center" :show-overflow-tooltip="true" prop="reviewerTime">
          <template slot-scope="scope">{{ scope.row.reviewerTime| dateYMDHMSFormat2 }}</template>
        </el-table-column> -->
        <el-table-column label="sku名称" align="center" :show-overflow-tooltip="true" prop="skuName" />
        <el-table-column label="sku代码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
        <el-table-column label="订货数" align="center" :show-overflow-tooltip="true" prop="orderCnt" />
        <el-table-column label="预配数" align="center" :show-overflow-tooltip="true" prop="preDistributionCnt" />
        <el-table-column label="分配数" align="center" :show-overflow-tooltip="true" prop="distributionCnt" />
        <el-table-column label="拣货数" align="center" :show-overflow-tooltip="true" prop="takeCnt" />
        <el-table-column label="发货数" align="center" :show-overflow-tooltip="true" prop="deliverCnt" />
        <el-table-column label="拆零数" align="center" :show-overflow-tooltip="true" prop="pieceCnt" />
        <el-table-column label="单位" align="center" :show-overflow-tooltip="true" prop="unit" />
        <el-table-column label="体积/L" align="center" :show-overflow-tooltip="true" prop="volume" />
        <el-table-column label="重量/kg" align="center" :show-overflow-tooltip="true" prop="weight" />
        <el-table-column label="净重/kg" align="center" :show-overflow-tooltip="true" prop="netWeight" />
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
import { kkdeboundce } from '@/utils/kkdebounce'
import { selectWarehouse, screenExcelOutPUR, selectExcelOutPUR, outboundReport } from '@/api/user'
import { searchsystemid } from '@/utils/search'
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
      like: true,
      value11: '',
      value12: '',
      value13: '',
      value14: '',
      value21: '',
      value22: '',
      value23: '',
      options: [],
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
      advanced: false,
      tableLoading: true,
      listLoading: true,
      loading: true,
      id: null,
      total: 20,
      lastTime: 0,
      laststateTime: 0,
      lasttypeTime: 0,
      lastptypeTime: 0,
      ptypeOptions: [],
      skuOptions: [],
      expandState: 0,
      sums: {},
      tablelist: {},
      tableHeight: 50,
      dialogVisible: false,
      stateMin: null,
      stateMax: null,
      purchaseState: false,
      warehouseOptions: [],
      formLabelWidth: '120px',
      lastconTime: 0,
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
        addPersonName: null
      },
      screen: '',
      tabledatas: [],
      tableData: [],
      tabClickIndex: null, // 点击的单元格
      tabClickLabel: ''
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 85
      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 85
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
      this.getList() // 调用后端查询接口
    },
    handleHeadAddClass({ column }) {
      if (this.sortField[column.property]) {
        column.order = this.sortField[column.property]
      }
    },
    // 删除表格某一行
    deleteTable(index) {
      this.table.splice(index, 1)
    },
    // 合计
    funType() {
      // 不同时间取值的new Date()是可以相减的
      const now = new Date()
      if (this.lastptypeTime === 0) {
        searchsystemid(49).then(res => {
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
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid(18).then(res => {
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
        searchsystemid(17).then(res => {
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
    }, 1000),
    refresh: kkdeboundce(function() {
      this.reload()
      this.viewed = true
    }, 1000),
    getList() {
      this.listLoading = true
      outboundReport({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        customName: this.form.customName,
        supplierName: this.supplierName
      },
      // workGroupId: window.sessionStorage.workGroupId, stateMin: this.stateMin,
      screen: this.screen,
      startTime: this.value1[0], endTime: this.value1[1] }).then(response => {
        this.tableData = response.data.despatchDetailList
        this.value11 = response.data.totalDesNum
        this.value12 = response.data.desNumToOut
        this.value13 = response.data.desNumWaitOut
        this.value14 = response.data.boxesCnt
        this.value21 = response.data.skuOfTotalCnt
        this.value22 = response.data.skuOfOutCnt
        this.value23 = response.data.skuWaitoutCnt
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

