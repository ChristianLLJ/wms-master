<template>
  <div>
    <el-row>
      <div class="btngroups">
        <el-button-group>
          <el-tooltip class="item" effect="dark" content="重新获取当前页面数据" placement="bottom-start">
            <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="一键导出在下方列表中选中的分拣结果" placement="bottom-start">
            <el-button type="primary" icon="el-icon-export">一键导出</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="批量打印下方列表中选中的条码" placement="bottom-start">
            <el-button type="primary" icon="el-icon-export">打印条码</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="批量打印下方列表中选中的箱码" placement="bottom-start">
            <el-button type="primary" icon="el-icon-export">打印箱码</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="批量打印下方列表中选中的装箱清单" placement="bottom-start">
            <el-button type="primary" icon="el-icon-export">打印装箱清单</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看全部/今日的分拣结果" placement="bottom-start">
            <el-button type="primary" icon="el-icon-view" @click="scanHistory">{{ viewed ? "查看全部分拣结果" : "查看今日分拣结果" }}</el-button>
          </el-tooltip>
          <!-- <el-button size="mini" icon="el-icon-circle-plus-outline" type="primary" @click="add">新建</el-button> -->
          <!-- <el-button size="mini" type="primary" icon="el-icon-delete" @click="delectAll">批量删除</el-button> -->
        </el-button-group>
      </div>
      <div class="search">
        <el-form :inline="true" :model="form" label-width="120px">
          <el-form-item label="分拣设备">
            <el-select v-model="orderState" placeholder="请选择分拣设备名称" size="small" clearable>
              <el-option v-for="item in options" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item>
          <el-form-item label="客户">
            <el-select v-model="orderState" placeholder="请选择客户名称" size="small" clearable>
              <el-option size="small" style="width: 160px;" clearable />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="success" icon="el-icon-search" size="medium" @click="search()">查询</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>
    </el-row>
    <el-dialog title="出库装箱单-表细查询" :visible.sync="dialogTableVisible">
      <el-form :inline="true" class="demo-form-inline" :model="rform">
        <el-form-item label="sku数量" :label-width="formLabelWidth">
          <el-input v-model="rform.skuCnt" size="mini" style="width: 160px;" placeholder="请输入sku数量" clearable />
        </el-form-item>
        <el-form-item label="sku编码" :label-width="formLabelWidth">
          <el-input v-model="rform.skuCode" size="mini" style="width: 160px;" placeholder="请输入sku编码" clearable />
        </el-form-item>
        <el-form-item label="sku单价" :label-width="formLabelWidth">
          <el-input v-model="rform.skuPrice" size="mini" style="width: 160px;" placeholder="请输入sku单价" clearable />
        </el-form-item>
        <el-form-item label="跟踪号" :label-width="formLabelWidth">
          <el-input v-model="rform.traceCode" size="mini" style="width: 160px;" placeholder="请输入跟踪号" clearable />
        </el-form-item>
        <el-form-item label="供应商名称" :label-width="formLabelWidth">
          <el-input v-model="rform.supplierName" size="mini" style="width: 160px;" placeholder="请输入供应商名称" clearable />
        </el-form-item>
        <el-form-item label="生产批次" :label-width="formLabelWidth">
          <el-input v-model="rform.productBatch" size="mini" style="width: 160px;" placeholder="请输入生产批次" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchDeatils()">查询</el-button>
        <el-button type="warning" icon="el-icon-circle-close" size="mini" @click="clearDetails()">清空</el-button>
      </div>
    </el-dialog>
    <el-card :body-style="{padding:'0px'}" shadow="always">
      <el-table
        ref="multipleTable"
        :height="tableHeight"
        :data="tableData"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        :row-class-name="tableRowClassName"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        size="mini"
        style="width: 100%, font-size: 10px"
        element-loading-text="正在加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :header-cell-style="{background:'#000',color: '#fff'}"
        tooltip-effect="dark"
        @expand-change="expandChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="分拣结果（默认显示今日的分拣结果）" align="center">
          <el-table-column type="expand" align="center">
            <div class="detailsTable">
              <template>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="dialogTableVisible = true">点击查询</el-button>
                <el-table
                  :data="tabledatas"
                  :row-class-name="tableRowClassDetailName"
                  border
                  size="mini"
                  :row-style="{height:'20px'}"
                  :cell-style="{padding:'0px'}"
                  style="width: 100%, font-size: 10px"
                >
                  <el-table-column type="selection" />
                  <el-table-column v-if="false" label="id" prop="id" />
                  <el-table-column type="index" label="序号" align="center" />
                  <el-table-column label="装箱单号" align="center" :show-overflow-tooltip="true" prop="exPickingId" />
                  <el-table-column label="sku编码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
                  <el-table-column label="sku数量" align="center" :show-overflow-tooltip="true" prop="skuCnt" />
                  <el-table-column label="sku单价" align="center" :show-overflow-tooltip="true" prop="skuPrice" />
                  <el-table-column label="尺寸" align="center" :show-overflow-tooltip="true" prop="goodsSize" />
                  <el-table-column label="颜色" align="center" :show-overflow-tooltip="true" prop="goodsColor" />
                  <el-table-column label="供应商名称" align="center" :show-overflow-tooltip="true" prop="supplierName" />
                  <el-table-column label="生产厂家" align="center" :show-overflow-tooltip="true" prop="productCompany" />
                  <el-table-column label="生产时间" align="center" :show-overflow-tooltip="true" prop="productTime">
                    <template slot-scope="scope">{{ scope.row.productTime| dateYMDHMSFormat }}</template>
                  </el-table-column>
                  <el-table-column label="生产批次" align="center" :show-overflow-tooltip="true" prop="productBatch" />
                  <el-table-column label="跟踪号" align="center" :show-overflow-tooltip="true" prop="traceCode" />
                </el-table>
                <div class="pagContainer">
                  <el-pagination
                    :current-page="currentPage"
                    :page-sizes="[10, 50]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                  />
                </div>
              </template>
            </div>
          </el-table-column>
          <el-table-column type="selection" align="center" />
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          />
          <el-table-column v-if="false" label="id" prop="id" />
          <el-table-column label="装箱单编号" align="center" :show-overflow-tooltip="true" prop="exPickingId" />
          <el-table-column label="分拣设备" align="center" :show-overflow-tooltip="true" prop="exPickingType" />
          <el-table-column label="装箱类型" align="center" :show-overflow-tooltip="true" prop="exPickingType" />
          <el-table-column label="客户名称" align="center" :show-overflow-tooltip="true" prop="customerName" />
          <el-table-column label="收货人编号" align="center" :show-overflow-tooltip="true" prop="receiverId" />
          <el-table-column label="来源单据" align="center" :show-overflow-tooltip="true" prop="billSource" />
          <el-table-column label="仓库代码" align="center" :show-overflow-tooltip="true" prop="warehouseCode" />
          <el-table-column label="货主代码" align="center" :show-overflow-tooltip="true" prop="cargoOwnerCode" />
          <el-table-column label="作业类型" align="center" :show-overflow-tooltip="true" prop="workType" />
          <el-table-column label="波次号" align="center" :show-overflow-tooltip="true" prop="waveNumber" />
        </el-table-column>
        <el-table-column
          prop="action"
          label="操作"
          width="300px"
          align="center"
        >
          <template>
            <el-button-group>
              <el-button size="mini" type="success">打印条码</el-button>
              <el-button size="mini" type="primary">打印箱码</el-button>
              <el-button size="mini" type="warning">打印装箱清单</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        :page-sizes="[50, 100, 1000]"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { screenExPicking, screenExPickingSum, screenExPickingDetailSum, screenExPickingDetail } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      viewed: true,
      multipleSelection: [],
      expands: [],
      exPickingId: null,
      listLoading: true,
      id: null,
      total: 0,
      tableHeight: 50,
      dialogTableVisible: false,
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 5, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      rform: {
        skuCnt: null,
        skuCode: null,
        skuPrice: null,
        traceCode: null,
        supplierName: null,
        productBatch: null
      },
      form: {
        exPickingType: null,
        receiverId: null,
        customerName: null,
        billSource: null,
        warehouseCode: null,
        cargoOwnerCode: null,
        workType: null,
        waveNumber: null
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
      this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 78

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.multipleTable.$el.offsetTop - 78
      }
    })
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleChange(val) {
      console.log(val)
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    refresh() {
      this.reload()
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
      this.exPickingId = null
      this.form = {
        exPickingType: null,
        receiverId: null,
        customerName: null,
        billSource: null,
        warehouseCode: null,
        cargoOwnerCode: null,
        workType: null,
        waveNumber: null
      }
      this.getList()
    },
    search() {
      this.getList()
    },
    searchDeatils() {
      this.getListDetails(this.pagesize, this.currentPage)
      this.clearDetails()
      this.dialogTableVisible = false
    },
    clearDetails() {
      this.rform = {
        skuCnt: null,
        skuCode: null,
        skuPrice: null,
        traceCode: null,
        supplierName: null,
        productBatch: null
      }
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      screenExPickingDetail({ searchDTO,
        pojo: {
          exPickingId: this.id,
          skuCnt: this.rform.skuCnt,
          skuCode: this.rform.skuCode,
          skuPrice: this.rform.skuPrice,
          traceCode: this.rform.traceCode,
          supplierName: this.rform.supplierName,
          productBatch: this.rform.productBatch
        }}).then(response => {
        this.tabledatas = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      screenExPickingDetailSum({ searchDTO,
        pojo: {
          exPickingId: this.id,
          skuCnt: this.rform.skuCnt,
          skuCode: this.rform.skuCode,
          skuPrice: this.rform.skuPrice,
          traceCode: this.rform.traceCode,
          supplierName: this.rform.supplierName,
          productBatch: this.rform.productBatch
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
    getList() {
      this.listLoading = true
      screenExPicking({
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
          exPickingId: this.exPickingId,
          exPickingType: this.form.exPickingType,
          receiverId: this.form.receiverId,
          customerName: this.form.customerName,
          warehouseCode: this.form.warehouseCode,
          waveNumber: this.form.waveNumber,
          cargoOwnerCode: this.form.cargoOwnerCode,
          billSource: this.form.billSource
        }
      }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenExPickingSum({
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
          exPickingId: this.exPickingId,
          exPickingType: this.form.exPickingType,
          receiverId: this.form.receiverId,
          customerName: this.form.customerName,
          warehouseCode: this.form.warehouseCode,
          waveNumber: this.form.waveNumber,
          cargoOwnerCode: this.form.cargoOwnerCode,
          billSource: this.form.billSource
        }
      }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    // add() {
    //   this.$router.push('expackinglist')
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style>
.el-table .d-row{
  background: rgb(194, 45, 45);
}
.el-table .o-row{
  background: #bbca4a;
}
.el-table .dd-row{
  background: rgb(97, 165, 186);
}
.el-table .do-row{
  background: #6f6dda;
}
</style>
  <style scoped>
    .el-card /deep/ .el-card__header {
    color:#fff;
  padding: 5px;
  }
   .el-form /deep/.el-form-item__label{
    color:rgb(0, 0, 0);
    font-weight: bold;
  }
    .search {
      margin: 1px;
      background-color: rgb(191, 189, 189);
    }
  .btngroups {
    margin: 1px;
  }
    .pagContainer{
    background-color: rgb(75, 200, 175);
  }
  </style>

