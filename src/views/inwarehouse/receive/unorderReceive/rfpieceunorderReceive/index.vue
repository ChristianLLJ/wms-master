<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" label-width="120px">
          <el-form-item label="仓库">
            <el-input v-model="warehouseName" size="small" style="width: 300px;" placeholder="请输入仓库" clearable />
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
            <el-button type="success" round icon="el-icon-search" size="small" @click="search()">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="btngroups">
      <el-button size="small" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="tableData"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :row-key="getRowKeys"
      border
      size="mini"
      :expand-row-keys="expands"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      :header-cell-style="{background:'#000',color: '#fff'}"
      :height="tableHeight"
      style="width: 100%, font-size: 10px"
      @expand-change="expandChange"
    >
      <el-table-column label="无计划收货-RF收件记录" align="center">
        <el-table-column v-if="false" label="id" prop="id" />
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column label="无计划收货-RF收件单号" :show-overflow-tooltip="true" prop="planId" />
        <el-table-column v-if="false" prop="inboundState" label="入库计划单收货状态" :formatter="stateFormat" />
        <el-table-column label="仓库名称" :show-overflow-tooltip="true" prop="warehouseName" />
        <el-table-column v-if="false" label="来源类型" :show-overflow-tooltip="true" prop="sourceType" :formatter="sourceFormat" />
        <el-table-column label="收货时间" :show-overflow-tooltip="true" prop="receiveTime">
          <template slot-scope="scope">{{ scope.row.receiveTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="商品sku收货数量(个)" :show-overflow-tooltip="true" prop="receivedSkuNum" />
        <el-table-column label="商品收货数量(个)" :show-overflow-tooltip="true" prop="receivedNum" />
        <el-table-column
          width="180px"
          prop="action"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" icon="el-icon-view" type="primary" @click="rowDbclick(scope.row)">详细记录</el-button>
            </el-button-group>
          </template>
        </el-table-column>
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
import { searchsystemid, searchcon } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
import { selectInboundPlan, screenContainer, selectArea, screenGoods, searchWorkGroupWarehouse, selectInboundPlanNum, receiveTable, selectInboundPlanDetailNum, selectInboundPlanDetail } from '@/api/user'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  // diskUse,
  data() {
    return {
      multipleSelection: [],
      expands: [],
      table: [],
      list: [],
      toptions: [],
      warehouseName: null,
      comOptions: [],
      comStates: [],
      comLoclist: [],
      conOptions: [],
      conStates: [],
      conLoclist: [],
      totalNum: 0,
      packageOptions: [],
      stateOptions: [],
      lastStaTime: 0,
      disabled: true,
      containerOptions: [],
      checkOptions: [],
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
      strategyOptions: [],
      sumss: {},
      tablelist: {},
      warehouseId: null,
      warehouseCode: null,
      remark: null,
      advanced: false,
      diskTable: [],
      // diskTable2: [],
      proposalTable: [],
      show: false,
      planId: null,
      packTotal: 0,
      tableLoading: true,
      listLoading: true,
      id: null,
      lastqtypeTime: 0,
      total: 20,
      tableHeight: 50,
      expandState: 0,
      dialogTableVisible: false,
      dialogPackVisible: false,
      dialogDiskVisible: false,
      dialogProposalVisible: false,
      dialogVisible: false,
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 10, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      rform: {
        commodityName: null,
        customName: null,
        supplierName: null,
        containerBarcode: null
      },
      form: {
        inboundType: null,
        inboundState: null,
        inboundBatch: null,
        isPackaged: null,
        isStacked: null,
        warehouseName: null,
        // supplierName: null,
        // isUsable: null,
        isAllChecke: null,
        isReceived: null
      },
      tableData: [],
      tabledatas: []
    }
  },
  created() {
    this.getList()
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 82

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.multipleTable.$el.offsetTop - 82
      }
    })
  },
  methods: {
    formatText(id) {
      return id
    },
    typeFormat(row) {
      const now = new Date().valueOf()
      if (this.lasttypeTime === 0) {
        searchsystemid('INBOUND_ADVICE_TYPE').then(res => {
          this.toptions = res.data
        })
        this.lasttypeTime = now
      } else {
        if ((now - this.lasttypeTime) > 5000) {
          this.lasttypeTime = now
        }
      }
      return changeAll(row.inboundType, this.toptions)
    },
    rowDbclick(row) {
      sessionStorage.setItem('planChildId', row.id)
      sessionStorage.setItem('planId', row.planId)
      this.$router.push('/unorderrfpiece')
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else {
          for (var key in this.sumss) {
            if (key === column.property) {
              sums[index] = this.sumss[key]
            }
          }
        }
      })
      return sums
    },
    funcState() {
      const now = new Date().valueOf()
      if (this.lastStaTime === 0) {
        searchsystemid('INBOUND_ADVICE_STATE').then(res => {
          this.stateOptions = res.data
        })
        this.lastStaTime = now
      } else {
        if ((now - this.lastStaTime) > 5000) {
          this.lastStaTime = now
        }
      }
    },
    example(row) {
      if (row.diskTable2.length !== 0) {
        row.packageNum = row.diskTable2.length
      }
      this.list.push({ rowNum: row.rowNum })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    flitterData: function() {
      let contactDot = 0
      const spanArr = []
      this.tabledatas.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1)
        } else {
          if (item.purchaseCode === this.tabledatas[index - 1].purchaseCode && this.tabledatas[index - 1].purchaseCode !== '') {
            spanArr[contactDot] += 1
            spanArr.push(0)
          } else {
            contactDot = index
            spanArr.push(1)
          }
        }
      })
      this.spanArr = spanArr
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
    changeConOptions(row) {
      const item = this.containerOptions.find(item1 => item1.code === row.packageCode)
      row.packageId = item.id
      row.packageCode = item.code
    },
    // deleteDetails(row) {
    //   this.$confirm('确定删除该条表细吗？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     delPlanDetail({ id: row.id }).then(res => {
    //       if (res.code === 200) {
    //         this.$message.success('删除成功')
    //         this.getListDetails(this.pagesize, this.currentPage)
    //       }
    //     })
    //   })
    // },
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
        searchWorkGroupWarehouse({
          id: window.sessionStorage.workGroupId,
          page: 1,
          num: 1
        }).then(res => {
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
    funPackage() {
      const now = new Date().valueOf()
      if (this.lastPackTime === 0) {
        screenContainer({ searchDTO: {
          page: 1,
          num: 100
        }, pojo: {}
        }).then(res => {
          this.packageOptions = res.data
        }
        )
        this.lastPackTime = now
      } else {
        if ((now - this.lastPackTime) > 5000) {
          this.lastPackTime = now
        }
      }
    },
    funcArea() {
      const now = new Date().valueOf()
      if (this.lastAreaTime === 0) {
        selectArea({ pojo: {
        }}).then(res => {
          this.areaOptions = res.data
        }
        )
        this.lastAreaTime = now
      } else {
        if ((now - this.lastAreaTime) > 5000) {
          this.lastAreaTime = now
        }
      }
    },
    changeWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.warehouseName || item1.warehouseCode === this.warehouseCode)
      this.warehouseCode = item.warehouseCode
      this.warehouseName = item.warehouseName
      this.warehouseId = item.id
    },
    changeAreaOptions() {
      const item = this.areaOptions.find(item1 => item1.areaName === this.planForm.onshelfAreaName)
      this.planForm.onshelfAreaName = item.areaName
      this.planForm.onshelfAreaCode = item.areaCode
      this.planForm.onshelfAreaId = item.id
    },
    changePackOptions(row) {
      const item = this.packageOptions.find(item1 => item1.code === row.packageCode)
      row.packageCode = item.code
      row.packageId = item.id
    },

    changeSku(row) {
      const item = this.skuOptions.find(item1 => item1.skuCode === row.skuCode)
      row.skuId = item.id
      row.skuCode = item.skuCode
      row.skuName = item.skuName
    },
    useFormat(row) {
      if (row.isUsable === 0) {
        return '否'
      } else if (row.isUsable === 1) {
        return '是'
      }
    },
    sourceFormat(row) {
      if (row.sourceType === 1) {
        return '采购计划来源'
      } else if (row.sourceType === 2) {
        return '生成来源'
      } else if (row.sourceType === 3) {
        return '盲收来源'
      }
    },
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid('INBOUND_ADVICE_STATE').then(res => {
          this.options = res.data
        })
        this.laststateTime = now
      } else {
        if ((now - this.laststateTime) > 5000) {
          this.laststateTime = now
        }
      }
      return changeAll(row.inboundState, this.options)
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    tableDiskName({ row, rowIndex }) {
      row.rowNum = rowIndex + 1
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    changeadvanced() {
      this.advanced = !this.advanced
    },
    expandChange(row, expandedRows) {
      this.expands = []
      if (expandedRows.length > 0) {
        row ? this.expands.push(row.id) : ''
        this.id = row.id
        this.getListDetails(this.pagesize, this.currentPage)
      }
    },
    clear() {
      this.planId = null
      this.form = {
        inboundType: null,
        inboundState: null,
        inboundBatch: null,
        isPackaged: null,
        isStacked: null,
        warehouseName: null,
        // supplierName: null,
        // isUsable: null,
        isAllChecke: null,
        isReceived: null
      }
    },
    getAll(row) {
      this.$confirm('确定整表收货吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        receiveTable({
          id: row.id
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('已收货')
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
    search() {
      this.getList()
    },
    searchDeatils() {
      this.getListDetails(this.pagesize, this.currentPage)
      this.clearclearDetails()
      this.dialogTableVisible = false
    },
    clearDetails() {
      this.rform = {
        commodityName: null,
        customName: null,
        supplierName: null,
        containerBarcode: null
      }
    },
    outExcelJudge() {
      this.advanced = true
      this.expandState = 1
    },

    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      selectInboundPlanDetail({ searchDTO,
        pojo: {
          planId: this.id,
          commodityName: this.rform.commodityName,
          customName: this.rform.customName,
          supplierName: this.rform.supplierName,
          containerBarcode: this.rform.containerBarcode
        }}).then(response => {
        this.tablelist = response.data
        this.tabledatas = this.tablelist.list
        this.sumss = this.tablelist.sums
        this.flitterData()
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      selectInboundPlanDetailNum({ searchDTO,
        pojo: {
          planId: this.id,
          commodityName: this.rform.commodityName,
          customName: this.rform.customName,
          supplierName: this.rform.supplierName,
          containerBarcode: this.rform.containerBarcode
        }}).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
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
    refresh() {
      this.reload()
    },
    getList() {
      this.listLoading = true
      selectInboundPlan({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        planId: this.planId,
        warehouseName: this.warehouseName,
        sourceType: 3,
        inboundState: 6
      }, workGroupId: window.sessionStorage.workGroupId, startTime1: this.value2[0], endTime1: this.value2[1] }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectInboundPlanNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        planId: this.planId,
        sourceType: 3,
        inboundState: 6
      }, workGroupId: window.sessionStorage.workGroupId, startTime1: this.value2[0], endTime1: this.value2[1] }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    }
  }
}
</script>
        <style scoped>

.search {
        margin: 1px;
        padding-top: 10px;
      }
      .el-form /deep/.el-form-item__label{
      color:rgb(0, 0, 0);
      font-weight: bold;
    }
        .btngroups {
          margin: 5px;
        }
          .pagContainer{
          background-color: rgb(75, 200, 175);
        }
        </style>
          <style lang="scss" scoped>
      // 修改对话框高度
      .show_card {
            background-color:#262626;
          }
           .detailsTable {
         ::v-deep .el-table tbody tr:hover>td {
        background-color:#162a48!important
      }
        }
      </style>

