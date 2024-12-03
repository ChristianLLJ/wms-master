<template>
  <div>
    <div style="margin: 1px">
      <el-button icon="el-icon-back" type="primary" @click="goback">返回上一页</el-button>
      <el-button type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card :body-style="{padding:'0px'}" class="show_card">
      <e-desc title="有计划-入库计划-单头信息">
        <e-desc-item label="入库计划单编号:">
          {{ form.planId }}
        </e-desc-item>
        <e-desc-item label="仓库:">
          {{ form.warehouseName }}
        </e-desc-item>
        <e-desc-item label="客户名称:">
          {{ form.customName }}
        </e-desc-item>
        <e-desc-item label="预期sku数量:">
          {{ form.predictSkuNum }}
        </e-desc-item>
        <e-desc-item label="预期物品数量:">
          {{ form.predictNum }}
        </e-desc-item>
        <e-desc-item label="审核人:">
          {{ form.checkPersonName }}
        </e-desc-item>
        <e-desc-item label="审核时间:">
          {{ form.checkTime| dateYMDHMSFormat }}
        </e-desc-item>
        <e-desc-item label="修改时间:">
          {{ form.createTime| dateYMDHMSFormat }}
        </e-desc-item>
        <e-desc-item label="结单理由:">
          {{ form.closeReason }}
        </e-desc-item>
      </e-desc>
    </el-card>
    <el-card :body-style="{padding:'0px'}" class="show_card2">
      <GoodsChoose :goodsform="goodsform" />
      <el-form :inline="true" :model="rform" label-width="120px">
        <el-form-item label="客户">
          <el-input v-model="rform.customName" size="small" style="width: 400px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="rform.supplierName" size="small" style="width: 400px;" placeholder="请输入" clearable />
        </el-form-item>
        <!-- <el-form-item label="生产厂家">
          <el-input v-model="rform.supplierName" size="small" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" round size="small" @click="searchDeatils()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="detailsTable">
      <el-table
        ref="tabledatas"
        v-loading="tableLoading"
        :data="tabledatas"
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
        <el-table-column label="采购订单" align="center">
          <el-table-column type="selection" width="50px" />
          <el-table-column v-if="false" label="id" prop="id" />
          <el-table-column type="index" label="序号" />
          <el-table-column label="采购订单号" width="150px" :show-overflow-tooltip="true" prop="purchaseCode" />
          <el-table-column label="跟踪号" width="150px" :show-overflow-tooltip="true" prop="inboundTraceCode" />
          <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="commodityName" />
          <el-table-column label="商品sku" :show-overflow-tooltip="true" prop="skuName" />
          <el-table-column label="最小sku单位" :show-overflow-tooltip="true" prop="unit" />
          <el-table-column label="预计数量(个)" :show-overflow-tooltip="true" prop="num" />
          <!-- <el-table-column label="计划收货库位"  :show-overflow-tooltip="true" prop="predictReceiveLocationCode" /> -->
          <el-table-column label="总重量(kg)" :show-overflow-tooltip="true" prop="totalWeight" />
          <el-table-column label="总净重(kg)" :show-overflow-tooltip="true" prop="totalNetWeight" />
          <el-table-column label="总体积(L)" :show-overflow-tooltip="true" prop="totalVolumn" />
          <el-table-column label="箱代码" :show-overflow-tooltip="true" prop="containerCode" />
          <el-table-column label="箱名称" :show-overflow-tooltip="true" prop="containerName" />
          <el-table-column label="箱条码" :show-overflow-tooltip="true" width="150px" prop="containerBarcode" />
          <el-table-column label="码盘代码" :show-overflow-tooltip="true" prop="stackCode" />
          <el-table-column label="码盘名称" :show-overflow-tooltip="true" prop="stackName" />
          <el-table-column label="码盘条码" :show-overflow-tooltip="true" width="150px" prop="stackBarcode" />
          <el-table-column label="收货数量(个)" :show-overflow-tooltip="true" prop="receivedNum" />
          <el-table-column label="客户代码" :show-overflow-tooltip="true" prop="customCode" />
          <el-table-column label="客户名称" :show-overflow-tooltip="true" prop="customName" />
          <el-table-column label="供应商名称" :show-overflow-tooltip="true" prop="supplierName" />
          <el-table-column label="供应商代码" :show-overflow-tooltip="true" prop="supplierCode" />
          <el-table-column label="备注" :show-overflow-tooltip="true" prop="remark" />
          <!-- <el-table-column label="收货时间" :show-overflow-tooltip="true" prop="receiveTime">
            <template slot-scope="scope">{{ scope.row.receiveTime| dateYMDHMSFormat }}</template>
          </el-table-column> -->
          <el-table-column label="生产厂家" :show-overflow-tooltip="true" prop="productCompany" />
          <el-table-column label="生产日期" :show-overflow-tooltip="true" prop="productTime">
            <template slot-scope="scope">{{ scope.row.productTime| dateYMDHMSFormat }}</template>
          </el-table-column>
          <el-table-column label="生产批次" :show-overflow-tooltip="true" prop="productBatch" />
          <el-table-column v-if="false" label="装箱数" :show-overflow-tooltip="true" prop="skuSplitContainerNum" />
        </el-table-column>

        <el-table-column
          align="center"
          width="200px"
          prop="action"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" icon="el-icon-delete" type="danger" round @click="deleteDetails(scope.row)">删除</el-button>
              <el-button v-print="'#single-info'" size="mini" type="primary" round icon="el-icon-printer" @click="printRow(scope.row)">打印</el-button>
            </el-button-group>
          </template>
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
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div id="print" ref="print">
        <barcode id="imgcode" :value="barcodeValue">
          显示失败
        </barcode>
        <div class="title">箱码</div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="prints">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EDesc from '@/components/Edesc'
import EDescItem from '@/components/Edescitem'
import GoodsChoose from '@/components/GoodsChoose'
import { selectInboundPlanDetailNum, selectInboundPlan, selectInboundPlanDetail } from '@/api/user'
import { searchsystemid } from '@/utils/search'
// saveInboundPlan

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: {
    EDesc, EDescItem, GoodsChoose
  },
  data() {
    return {
      multipleSelection: [],
      expands: [],
      table: [],
      list: [],
      barcodeValue: '',
      toptions: [],
      comOptions: [],
      title: '',
      reasonTable: {},
      unAuditDialog: false,
      dialogVisible: false,
      comStates: [],
      comLoclist: [],
      conOptions: [],
      conStates: [],
      goodsform: {
        commodityId: null,
        skuName: null,
        containerName: null,
        unit: null
      },
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
        customName: null,
        supplierName: null,
        productCompany: null
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
    searchDeatils() {
      this.getListDetails(this.pagesize, this.currentPage)
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
    prints() {
      this.$print(this.$refs.print)
    },
    printRow(code) {
      this.dialogVisible = true
      this.barcodeValue = code.containerBarcode
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
          customName: this.rform.customName,
          supplierName: this.rform.supplierName,
          productCompany: this.rform.productCompany,
          commodityId: this.goodsform.commodityId,
          skuName: this.goodsform.skuName,
          containerName: this.goodsform.containerName,
          unit: this.goodsform.unit
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
          customName: this.rform.customName,
          supplierName: this.rform.supplierName,
          productCompany: this.rform.productCompany,
          commodityId: this.goodsform.commodityId,
          skuName: this.goodsform.skuName,
          containerName: this.goodsform.containerName,
          unit: this.goodsform.unit
        }}).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    // 单个删除
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
    goback() {
      this.$router.go(-1)
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

  .search {
    margin: 1px;
    float: right
  }
  .btngroups {
    margin: 1px;
  }

  .pagContainer{
    background-color: rgb(9, 41, 71);
  }
  </style>
<style lang="scss" scoped>
#imgcode {
  margin-top: 20px;
}
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 20px;
  }
// 修改对话框高度
.show_card2 {
      background-color:#262626;
      padding-top: 10px;
    }
    .show_card {
      background-color:#262626;
    }
  .detailsTable {
   ::v-deep .el-table tbody tr:hover>td {
  background-color:#162a48!important
}
  }
</style>
