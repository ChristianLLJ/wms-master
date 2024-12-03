<template>
  <div>
    <div style="margin: 1px">
      <el-button icon="el-icon-back" type="primary" @click="goback">返回上一页</el-button>
      <el-button type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card :body-style="{padding:'0px'}" class="show_card">
      <e-desc title="上架任务-单头信息">
        <e-desc-item label="上架单编号:">
          {{ form.onshelfCode }}
        </e-desc-item>
        <e-desc-item label="仓库:">
          {{ form.warehouseName }}
        </e-desc-item>
        <e-desc-item label="上架库区:">
          {{ form.onshelfAreaName }}
        </e-desc-item>
        <!-- <e-desc-item label="上架人:">
          {{ form.onshelfPersonName }}
        </e-desc-item> -->
        <e-desc-item label="审核人:">
          {{ form.checkPersonName }}
        </e-desc-item>
        <e-desc-item label="审核时间:">
          {{ form.checkTime| dateYMDHMSFormat }}
        </e-desc-item>
        <e-desc-item label="创建时间:">
          {{ form.createTime| dateYMDHMSFormat }}
        </e-desc-item>
      </e-desc>
    </el-card>
    <el-card :body-style="{padding:'0px'}" class="show_card2">
      <!-- <LocationChoose :locationform="locationform" /> -->
      <el-form size="small" :inline="true" :model="rform">
        <!-- <el-form-item label="包装条码" :label-width="formLabelWidth">
          <el-input v-model="rform.containerBarcode" style="width: 160px;" placeholder="请输入包装条码" clearable />
        </el-form-item> -->
        <el-form-item label="实际上架库位" :label-width="formLabelWidth">
          <el-input v-model="rform.factLocationName" style="width: 400px;" placeholder="请输入" clearable />
        </el-form-item>
        <!-- <el-form-item label="上架人" :label-width="formLabelWidth">
          <el-input v-model="rform.personName" style="width: 160px;" placeholder="请输入上架人" clearable />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchDeatils()">查询</el-button>
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
        border
        :height="tableHeight"
        :header-cell-style="{background:'#091f2c',color: '#fff'}"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <el-table-column type="selection" width="50px" />
        <el-table-column v-if="false" label="id" prop="id" />
        <el-table-column type="index" label="序号" />
        <el-table-column label="上架任务-表细信息" align="center">
          <el-table-column label="组盘跟踪号" :show-overflow-tooltip="true" prop="traceCode" />
          <el-table-column label="装箱跟踪号" :show-overflow-tooltip="true" prop="traceCode2" />
          <el-table-column label="建议单单号" :show-overflow-tooltip="true" prop="onshelfCode" />
          <el-table-column label="包装条码" :show-overflow-tooltip="true" prop="containerBarcode" />
          <el-table-column label="实际上架库位" :show-overflow-tooltip="true" prop="factLocationName" />
          <!-- <el-table-column label="上架状态" :show-overflow-tooltip="true" prop="onshelfState" /> -->
          <!-- <el-table-column label="上架时间" :show-overflow-tooltip="true" prop="onshelfTime">
            <template slot-scope="scope">{{ scope.row.onshelfTime| dateYMDHMSFormat }}</template>
          </el-table-column> -->
          <!-- <el-table-column label="上架来源" :show-overflow-tooltip="true" prop="onshelfType" /> -->
          <!-- <el-table-column label="上架人" :show-overflow-tooltip="true" prop="personName" /> -->
          <!-- <el-table-column label="入库批次" :show-overflow-tooltip="true" prop="inboundBatch" /> -->
        </el-table-column>
      </el-table>
    </div>
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
import { selectOnshelfDetailNum, selectOnshelfDetail, selectOnshelf, screenContainer, screenGoods } from '@/api/user'
import { searchwarehouse, searchcustomer, searchsupplier, searchsku } from '@/utils/search'

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
        containerBarcode: null,
        personName: null,
        locationName: null
      },
      locationform: {
        warehouseName: null,
        areaName: null,
        locationName: null
      },
      tableData: [],
      tabledatas: [],
      lastloccTime: 0,
      states: [],
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
    getList() {
      selectOnshelf({
        pojo: {
          onshelfCode: sessionStorage.getItem('onshelfId')
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
      selectOnshelfDetail({ searchDTO,
        pojo: {
          onshelfId: sessionStorage.getItem('onshelfChildId'),
          containerBarcode: this.rform.containerBarcode,
          personName: this.rform.personName,
          locationName: this.rform.locationName
        }}).then(response => {
        this.tablelist = response.data
        this.tabledatas = this.tablelist.list
        this.sums = this.tablelist.sums
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      selectOnshelfDetailNum({ searchDTO,
        pojo: {
          onshelfId: sessionStorage.getItem('onshelfChildId'),
          containerBarcode: this.rform.containerBarcode,
          personName: this.rform.personName,
          locationName: this.rform.locationName
        }}).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
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
      color:#000000
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

