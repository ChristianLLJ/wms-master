<template>
  <div>
    <div style="margin: 1px">
      <el-button size="small" icon="el-icon-back" type="primary" @click="goback">返回上一页</el-button>
    </div>
    <el-card :body-style="{padding:'0px'}" class="show_card">
      <e-desc title="无计划RF收件-表头信息">
        <e-desc-item label="记录号:">
          {{ form.planId }}
        </e-desc-item>
        <e-desc-item label="仓库:">
          {{ form.warehouseName }}
        </e-desc-item>
        <e-desc-item label="客户名称:">
          {{ form.customName }}
        </e-desc-item>
        <e-desc-item label="商品收货数量:">
          {{ form.receivedNum }}
        </e-desc-item>
        <e-desc-item label="商品sku收货数量:">
          {{ form.receivedSkuNum }}
        </e-desc-item>
        <e-desc-item label="收箱数量:">
          {{ form.receivedContainerNum }}
        </e-desc-item>
        <e-desc-item label="收货时间:">
          {{ form.receiveTime| dateYMDHMSFormat }}
        </e-desc-item>
      </e-desc>
    </el-card>
    <el-card :body-style="{padding:'0px'}" class="show_card2">
      <el-form :inline="true" :model="rform" label-width="120px">
        <el-form-item label="商品">
          <el-select
            v-model="rform.commodityName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商品"
            :remote-method="funccom"
            clearable
            size="small"
          >
            <el-option v-for="item in comOptions" :key="item.id" :label="item.goodsName" :value="item.goodsName" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品sku">
          <el-input v-model="rform.skuName" size="small" />
        </el-form-item>
        <el-form-item label="最小sku单位">
          <el-input v-model="rform.commodityName" size="small" />
        </el-form-item>
        <el-form-item label="包装">
          <el-select
            v-model="rform.containerName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入包装"
            :remote-method="funccon"
            clearable
            size="small"
          >
            <el-option v-for="item in conOptions" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model="rform.customName" size="small" style="width: 160px;" placeholder="请输入客户" clearable />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="rform.supplierName" size="small" style="width: 160px;" placeholder="请输入供应商" clearable />
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model="rform.supplierName" size="small" style="width: 160px;" placeholder="请输入供应商" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchDeatils()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="detailsTable">
      <el-table
        ref="tabledatas"
        v-loading="tableLoading"
        :data="tabledatas"
        :row-class-name="tableRowClassDetailName"
        show-summary
        :summary-method="getSummaries"
        :height="tableHeight"
        border
        element-loading-text="正在加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        size="mini"
        :header-cell-style="{background:'#091f2c',color: '#fff'}"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <el-table-column label="无计划RF收件-表细信息" align="center">
          <el-table-column type="selection" width="50px" />
          <el-table-column v-if="false" label="id" prop="id" />
          <el-table-column type="index" label="序号" />
          <el-table-column label="采购订单号" width="150px" :show-overflow-tooltip="true" prop="purchaseCode" />
          <el-table-column label="跟踪号" width="150px" :show-overflow-tooltip="true" prop="inboundTraceCode" />
          <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="commodityName" />
          <el-table-column label="商品sku" :show-overflow-tooltip="true" prop="skuName" />
          <el-table-column label="最小sku单位" :show-overflow-tooltip="true" prop="unit" />
          <el-table-column label="收货数量(个)" :show-overflow-tooltip="true" prop="receivedNum" />
          <el-table-column label="客户代码" :show-overflow-tooltip="true" prop="customCode" />
          <el-table-column label="客户名称" :show-overflow-tooltip="true" prop="customName" />
          <el-table-column label="供应商名称" :show-overflow-tooltip="true" prop="supplierName" />
          <el-table-column label="供应商代码" :show-overflow-tooltip="true" prop="supplierCode" />
          <el-table-column label="备注" :show-overflow-tooltip="true" prop="remark" />
          <el-table-column label="生产厂家" :show-overflow-tooltip="true" prop="productCompany" />
          <el-table-column label="生产日期" :show-overflow-tooltip="true" prop="productTime">
            <template slot-scope="scope">{{ scope.row.productTime| dateYMDHMSFormat }}</template>
          </el-table-column>
          <el-table-column label="生产批次" :show-overflow-tooltip="true" prop="productBatch" />
        </el-table-column>
      </el-table>
    </div>
    <div class="pagContainer">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10,20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import EDesc from '@/components/Edesc'
import EDescItem from '@/components/Edescitem'
import { selectInboundPlanDetailNum, selectInboundPlan, selectInboundPlanDetail, screenContainer, screenGoods } from '@/api/user'
import { searchwarehouse, searchcustomer, searchsupplier, searchsku, searchcon, searchsystemid } from '@/utils/search'
// saveInboundPlan

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: {
    EDesc, EDescItem
  },
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
      conLoclist: [],
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
      disabled: true,
      containerOptions: [],
      currentPage2: 1, // 当前页码
      pageSize2: 10, // 每页的数据条数
      currentPage3: 1, // 当前页码
      pageSize3: 5, // 每页的数据条数
      checkOptions: [],
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
      warehouseId: null,
      warehouseCode: null,
      warehouseName: null,
      remark: null,
      advanced: false,
      diskTable: [],
      packTotalJudge: 0,
      // diskTable2: [],
      proposalTable: [],
      show: false,
      sums: {},
      inboundType: null,
      inboundState: null,
      packTotal: 0,
      tableLoading: true,
      packTotalJudge2: 0,
      listLoading: true,
      id: null,
      lastqtypeTime: 0,
      auditForm: {
        reason: null
      },
      total: 20,
      tableHeight: 50,
      typeOptions: [],
      expandState: 0,
      dialogTableVisible: false,
      dialogPackVisible: false,
      dialogDiskVisible: false,
      dialogProposalVisible: false,
      dialogVisible: false,
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 20, // 每页显示的条数
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
      tableData: [],
      tabledatas: [],
      diskTotalTable: [],
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
      this.getList()
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tabledatas.$el.offsetTop - 77

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tabledatas.$el.offsetTop - 77
      }
    })
  },
  updated() {
    this.$nextTick(() => {
      this.$refs['tabledatas'].doLayout()
      // table是在表格中ref=tabledatas
      // doLayout	对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    })
  },
  methods: {
    refresh() {
      this.reload()
    },
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
    goback() {
      this.$router.go(-1)
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
      })
      this.getListDetails(this.pagesize, this.currentPage)
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      selectInboundPlanDetail({ searchDTO,
        pojo: {
          planId: sessionStorage.getItem('planChildId'),
          commodityName: this.rform.commodityName,
          customName: this.rform.customName,
          supplierName: this.rform.supplierName,
          containerName: this.rform.containerName
        }}).then(response => {
        this.tablelist = response.data
        this.tabledatas = this.tablelist.list
        this.sums = this.tablelist.sums
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      selectInboundPlanDetailNum({ searchDTO,
        pojo: {
          planId: sessionStorage.getItem('planChildId'),
          commodityName: this.rform.commodityName,
          customName: this.rform.customName,
          supplierName: this.rform.supplierName,
          containerName: this.rform.containerName
        }}).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    // 单个删除
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
    funcSku(row) {
      if (row.commodityId === '') {
        this.$message({
          message: '请先选择商品！',
          type: 'warning'
        })
      } else {
        searchsku(row.commodityId).then(res => {
          this.skuOptions = res.data
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
    funSupplier() {
      const now = new Date().valueOf()
      if (this.lastsupTime === 0) {
        searchsupplier().then(res => {
          this.supplierOptions = res.data
        }
        )
        this.lastsupTime = now
      } else {
        if ((now - this.lastsupTime) > 5000) {
          this.lastsupTime = now
        }
      }
    },
    funClient() {
      const now = new Date().valueOf()
      if (this.lastfunTime === 0) {
        searchcustomer().then(res => {
          this.clientOptions = res.data
        }
        )
        this.lastfunTime = now
      } else {
        if ((now - this.lastfunTime) > 5000) {
          this.lastfunTime = now
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
      color:#fff
    }

    .btngroups {
      margin: 1px;
    }

    .pagContainer{
      background-color: rgb(9, 41, 71);
    }
    </style>
  <style lang="scss" scoped>
  // 修改对话框高度
  .show_card {
        background-color:#262626;
      }
.show_card2 {
      background-color:#262626;
      padding-top: 10px;
    }
    .detailsTable {
     ::v-deep .el-table tbody tr:hover>td {
    background-color:#162a48!important
  }
    }
  </style>

