<template>
  <div>
    <div style="margin: 1px">
      <el-button icon="el-icon-back" type="primary" @click="goback">返回上一页</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card :body-style="{padding:'0px'}" class="show_card">
      <e-desc title="库存移动-单头信息">
        <e-desc-item label="库存移动表单号:">
          {{ form.moveCode }}
        </e-desc-item>
        <e-desc-item label="原因描述:">
          {{ form.moveReason }}
        </e-desc-item>
        <e-desc-item label="创建人:">
          {{ form.movePersonName }}
        </e-desc-item>
        <e-desc-item label="审核人:">
          {{ form.checkPersonName }}
        </e-desc-item>
        <e-desc-item label="创建时间:">
          {{ form.createTime| dateYMDHMSFormat }}
        </e-desc-item>
        <e-desc-item label="审核时间:">
          {{ form.checkTime| dateYMDHMSFormat }}
        </e-desc-item>
        <e-desc-item label="移库时间:">
          {{ form.moveTime| dateYMDHMSFormat }}
        </e-desc-item>
      </e-desc>
    </el-card>
    <el-card :body-style="{padding:'0px'}" class="show_card2">
      <el-form :inline="true" class="demo-form-inline" :model="rform">
        <el-form-item label="客户名称" :label-width="formLabelWidth">
          <el-input v-model="rform.customName" size="mini" style="width: 160px;" placeholder="请输入客户名称" clearable />
        </el-form-item>
        <el-form-item label="sku编码" :label-width="formLabelWidth">
          <el-input v-model="rform.skuCode" size="mini" style="width: 160px;" placeholder="请输入sku编码" clearable />
        </el-form-item>
        <el-form-item label="产品名称" :label-width="formLabelWidth">
          <el-input v-model="rform.commodityName" size="mini" style="width: 160px;" placeholder="请输入产品名称" clearable />
        </el-form-item>
        <el-form-item label="包装代码" :label-width="formLabelWidth">
          <el-input v-model="rform.packageCode" size="mini" style="width: 160px;" placeholder="请输入包装代码" clearable />
        </el-form-item>
        <el-form-item label="库位代码" :label-width="formLabelWidth">
          <el-input v-model="rform.locationCode" size="mini" style="width: 160px;" placeholder="请输入库位代码" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="searchDeatils()">查询</el-button>
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
        show-summary
        :summary-method="getSummaries"
        border
        size="mini"
        row-key="id"
        :header-cell-style="{background:'#091f2c',color: '#fff'}"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <el-table-column v-if="false" label="id" prop="id" />
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column v-if="false" label="库存移动单" align="center" :show-overflow-tooltip="true" prop="inventoryMoveId" />
        <el-table-column label="商品名称" align="center" :show-overflow-tooltip="true" prop="commodityName" />
        <el-table-column label="商品代码" align="center" :show-overflow-tooltip="true" prop="commodityCode" />
        <el-table-column label="sku名称" align="center" :show-overflow-tooltip="true" prop="skuName" />
        <el-table-column label="sku编码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
        <el-table-column label="来源仓库名称" align="center" :show-overflow-tooltip="true" prop="sourceWarehouseName" />
        <el-table-column label="来源仓库代码" align="center" :show-overflow-tooltip="true" prop="sourceWarehouseCode" />
        <el-table-column label="来源库位名称" align="center" :show-overflow-tooltip="true" prop="sourceLocationName" />
        <el-table-column label="来源库位名称" align="center" :show-overflow-tooltip="true" prop="sourceLocationCode" />
        <el-table-column label="目标仓库名称" align="center" :show-overflow-tooltip="true" prop="targetWarehouseName" />
        <el-table-column label="目标仓库代码" align="center" :show-overflow-tooltip="true" prop="targetWarehouseCode" />
        <el-table-column label="目标库位名称" align="center" :show-overflow-tooltip="true" prop="targetLocationName" />
        <el-table-column label="目标库位代码" align="center" :show-overflow-tooltip="true" prop="targetLocationCode" />
        <el-table-column label="客户名称" align="center" :show-overflow-tooltip="true" prop="customName" />
        <el-table-column label="客户代码" align="center" :show-overflow-tooltip="true" prop="customCode" />
        <el-table-column label="包装" align="center" :show-overflow-tooltip="true" prop="containerName" />
        <el-table-column label="生产厂家" align="center" :show-overflow-tooltip="true" prop="productCompany" />
        <el-table-column label="生产日期" width="180px" align="center" :show-overflow-tooltip="true" prop="productTime">
          <template slot-scope="scope">{{ scope.row.productTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="生产批次" width="180px" align="center" :show-overflow-tooltip="true" prop="productBatch" />
        <!-- <el-table-column label="移动数量" align="center" :show-overflow-tooltip="true" prop="moveCnt" /> -->
        <el-table-column label="体积" align="center" :show-overflow-tooltip="true" prop="volumn" />
        <el-table-column label="毛重" align="center" :show-overflow-tooltip="true" prop="weight" />
      </el-table>
      <div class="pagContainer">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[5, 10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div></template>

<script>
import EDesc from '@/components/Edesc'
import EDescItem from '@/components/Edescitem'
import { searchInventoryMoveSelective, searchInventoryMoveDetailSelective, searchInventoryMoveDetailNum, screenContainer, screenGoods } from '@/api/user'
import { searchwarehouse, searchcustomer, searchsupplier, searchsku, searchcon } from '@/utils/search'

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
        moveCode: '',
        movePersonName: '',
        createTime: '',
        checkPersonName: '',
        checkTime: '',
        moveTime: ''
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
    // funcUnit() {
    //   const now = new Date().valueOf()
    //   if (this.lastunitTime === 0) {
    //     searchsystemid(13).then(res => {
    //       this.unitOptions = res.data
    //     }
    //     )
    //     this.lastunitTime = now
    //   } else {
    //     if ((now - this.lastunitTime) > 5000) {
    //       this.lastunitTime = now
    //     }
    //   }
    // },
    getList() {
      searchInventoryMoveSelective({
        pojo: {
          inventoryMoveId: sessionStorage.getItem('moveId')
        }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
        this.form = Object.assign({}, response.data[0])
      })
      this.getListDetails(this.pagesize, this.currentPage)
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      searchInventoryMoveDetailSelective({ searchDTO,
        pojo: {
          inventoryMoveDetailId: sessionStorage.getItem('moveChildId')
        }}).then(response => {
        this.tablelist = response.data
        this.tabledatas = this.tablelist.list
        this.sums = this.tablelist.sums
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      searchInventoryMoveDetailNum({ searchDTO,
        pojo: {
          inventoryMoveDetailId: sessionStorage.getItem('moveChildId')
        }}).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    // 单个删除
    // funType() {
    //   const now = new Date().valueOf()
    //   if (this.lasttypeTime === 0) {
    //     searchsystemid(49).then(res => {
    //       this.typeOptions = res.data
    //     }
    //     )
    //     this.lasttypeTime = now
    //   } else {
    //     if ((now - this.lasttypeTime) > 5000) {
    //       this.lasttypeTime = now
    //     }
    //   }
    // },
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

