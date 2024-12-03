<template>
  <div>
    <div style="margin: 1px">
      <el-button icon="el-icon-back" type="primary" @click="goback">返回上一页</el-button>
      <el-button type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card :body-style="{padding:'0px'}" class="show_card">
      <e-desc title="上架建议-单头信息">
        <e-desc-item label="上架建议单号:">
          {{ form.onshelfCode }}
        </e-desc-item>
        <e-desc-item label="仓库:">
          {{ form.warehouseName }}
        </e-desc-item>
        <e-desc-item label="上架库区:">
          {{ form.onshelfAreaName }}
        </e-desc-item>
        <!-- <e-desc-item label="上架策略:">
          {{ form.onshelfStrategyName }}
        </e-desc-item> -->
        <!-- <e-desc-item label="审核人:">
          {{ form.checkPersonName }}
        </e-desc-item>
        <e-desc-item label="审核时间:">
          {{ form.checkTime| dateYMDHMSFormat }}
        </e-desc-item> -->
        <e-desc-item label="创建时间:">
          {{ form.createTime| dateYMDHMSFormat }}
        </e-desc-item>
      </e-desc>
    </el-card>
    <el-card :body-style="{padding:'0px'}" class="show_card2">
      <!-- <LocationChoose :locationform="locationform" /> -->
      <el-form size="small" :inline="true" :model="rform">
        <el-form-item label="上架库位" :label-width="formLabelWidth">
          <el-input v-model="rform.locationName" style="width: 400px;" placeholder="请输入" clearable />
        </el-form-item>
        <!-- <el-form-item label="上架人" :label-width="formLabelWidth">
          <el-input v-model="rform.personName" style="width: 160px;" placeholder="请输入上架人" clearable />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" round icon="el-icon-search" size="small" @click="searchDeatils()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="detailsTable">
      <el-table
        ref="tabledatas"
        v-loading="tableLoading"
        element-loading-text="正在加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="tabledatas"
        :height="tableHeight"
        border
        :header-cell-style="{background:'#091f2c',color: '#fff'}"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <el-table-column type="selection" width="50px" />
        <el-table-column v-if="false" label="id" prop="id" />
        <el-table-column type="index" label="序号" />
        <el-table-column label="上架建议-表细信息" align="center">
          <el-table-column label="组盘跟踪号" :show-overflow-tooltip="true" prop="traceCode" />
          <el-table-column label="装箱跟踪号" :show-overflow-tooltip="true" prop="traceCode2" />
          <el-table-column label="建议单单号" :show-overflow-tooltip="true" prop="onshelfCode" />
          <el-table-column label="包装条码" :show-overflow-tooltip="true" prop="containerBarcode" />
          <el-table-column label="上架库位" :show-overflow-tooltip="true" prop="adviceLocationName" />
          <el-table-column label="sku名称" :show-overflow-tooltip="true" prop="skuName" />
          <el-table-column label="sku代码" :show-overflow-tooltip="true" prop="skuCode" />
          <el-table-column label="总重量(kg)" :show-overflow-tooltip="true" prop="totalWeight" />
          <el-table-column label="总体积(L)" :show-overflow-tooltip="true" prop="totalVolumn" />
          <!-- <el-table-column label="上架状态" :show-overflow-tooltip="true" prop="onshelfState" /> -->
          <!-- <el-table-column label="上架时间" :show-overflow-tooltip="true" prop="onshelfTime">
            <template slot-scope="scope">{{ scope.row.onshelfTime| dateYMDHMSFormat }}</template>
          </el-table-column> -->
          <!-- <el-table-column label="上架来源" :show-overflow-tooltip="true" prop="onshelfType" /> -->
          <!-- <el-table-column label="上架人" :show-overflow-tooltip="true" prop="personName" />
          <el-table-column label="入库批次" :show-overflow-tooltip="true" prop="inboundBatch" /> -->
        </el-table-column>
        <el-table-column
          align="center"
          width="200px"
          prop="action"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button-group>
              <el-button v-print="'#single-info'" size="mini" type="primary" round icon="el-icon-printer" @click="printRow(scope.row)">打印</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
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
    <div class="pagContainer">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20]"
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
// import LocationChoose from '@/components/LocationChoose'
import { selectOnshelfAdviceDetailNum, selectOnshelfAdviceDetail, selectOnshelfAdvice, screenGoods } from '@/api/user'
import { searchwarehouse, searchcustomer, searchsupplier, searchsku, searchcon, searchsystemid } from '@/utils/search'

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
      locationform: {
        warehouseName: null,
        areaName: null,
        locationName: null
      },
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
      resetCascader: 0,
      packageOptions: [],
      stateOptions: [],
      lastStaTime: 0,
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
      barcodeValue: '',
      dialogVisible: false,
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
        locationName: null,
        personName: null
      },
      tableData: [],
      tabledatas: [],
      states: [],
      diskTotalTable: [],
      lastloccTime: 0,
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
    this.getList()
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
    getList() {
      selectOnshelfAdvice({
        pojo: {
          onshelfCode: sessionStorage.getItem('onshelfId')
        }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
        this.form = Object.assign({}, response.data[0])
        // this.funType()
        // for (var i = 0; i < this.typeOptions.length; i++) {
        //   if (this.form.inboundType === this.typeOptions[i].typeNumber) {
        //     this.form.inboundType = this.typeOptions[i].codeDetailName
        //   }
        // }
      })
      this.getListDetails(this.pagesize, this.currentPage)
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      selectOnshelfAdviceDetail({ searchDTO,
        pojo: {
          onshelfId: sessionStorage.getItem('onshelfChildId'),
          locationName: this.rform.locationName,
          personName: this.rform.personName
        }}).then(response => {
        this.tabledatas = response.data
        // this.tabledatas = this.tablelist.list
        // this.sums = this.tablelist.sums
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      selectOnshelfAdviceDetailNum({ searchDTO,
        pojo: {
          onshelfId: sessionStorage.getItem('onshelfChildId'),
          locationName: this.rform.locationName,
          personName: this.rform.personName
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
    prints() {
      this.$print(this.$refs.print)
    },
    printRow(code) {
      this.dialogVisible = true
      this.barcodeValue = code.containerBarcode
    },
    goback() {
      this.$router.go(-1)
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

