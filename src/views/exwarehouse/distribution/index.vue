<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="btngroups">
          <el-button-group>
            <el-button size="mini" type="primary" icon="el-icon-download" @click="outExcel">导出</el-button>
            <el-button size="mini" type="primary" icon="el-icon-shopping-cart-full" @click="generateLoad">生成装车单</el-button>
            <el-button size="mini" type="primary" icon="el-icon-upload">导入</el-button>
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
            <el-popover placement="bottom" width="400" trigger="click">
              <el-checkbox-group v-model="colOptions">
                <el-checkbox v-for="item in colSelect" :key="item" :label="item" />
              </el-checkbox-group>
              <el-button slot="reference" size="mini" type="primary">自定义显示</el-button>
            </el-popover>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="search">
          <el-input v-model="distributionId" size="mini" style="width: 160px;" placeholder="请输入配送单号" clearable />
          <el-button-group>
            <el-button v-show="!advanced" type="success" icon="el-icon-search" size="mini" @click="search()">搜索</el-button>
            <el-button v-show="!advanced" type="warning" icon="el-icon-circle-close" size="mini" @click="clear()">清空</el-button>
            <el-button size="mini" type="warning" @click="changeadvanced">{{ advanced ? "收起" : "高级搜索" }}</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="配送相关发运订单信息" :visible.sync="dialogDesVisible" width="80%" class="showAll_dialog">
      <despatchUse :table-data="despatchTable.slice((currentPage2-1)*pageSize2,currentPage2*pageSize2)" />
      <div style="margin-top: 10px">
        <el-pagination align="center" :current-page="currentPage2" :page-sizes="[10,20]" :page-size="pageSize2" layout="total, sizes, prev, pager, next, jumper" :total="despatchTable.length" @size-change="handleSizeChange2" @current-change="handleCurrentChange2" />
      </div>
    </el-dialog>
    <el-dialog title="生成装车单" :visible.sync="dialogVisible" width="60%" class="showAll_dialog">
      <el-form :inline="true" size="mini" class="demo-form-inline" :model="uform" label-width="120px">
        <el-form-item label="车号">
          <el-input v-model="uform.carNumber" style="width: 160px" />
        </el-form-item>
        <el-form-item label="车型">
          <el-input v-model="uform.carType" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="司机">
          <el-input v-model="uform.driver" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="装车人员">
          <el-input v-model="uform.loadPeople" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="仓库">
          <el-input v-model="uform.warehouse" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="体积限制">
          <el-input v-model="uform.volumeLimit" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="重量限制">
          <el-input v-model="uform.weightLimit" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="波次号">
          <el-input v-model="uform.waveId" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="uform.startTime"
            size="mini"
            type="date"
            placeholder="请选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="uform.endTime"
            size="mini"
            type="date"
            placeholder="请选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="用户自定义1">
          <el-input v-model="uform.userDefined1" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="用户自定义2">
          <el-input v-model="uform.userDefined2" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="用户自定义3">
          <el-input v-model="uform.userDefined3" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="用户自定义4">
          <el-input v-model="uform.userDefined4" style="width: 160px;" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <el-card v-show="advanced" :body-style="{padding:'0px'}" shadow="always">
      <el-form :inline="true" class="demo-form-inline" :model="form">
        <el-form-item label="配送标签号">
          <el-input v-model="form.distributionTargetCnt" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="运输方式">
          <el-input v-model="form.shippingType" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="站点">
          <el-input v-model="form.station" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="付款方式">
          <el-input v-model="form.payType" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="交货方式">
          <el-input v-model="form.deliveryType" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="warning" icon="el-icon-circle-close" size="mini" @click="clear()">清空</el-button>
          <el-button type="success" icon="el-icon-search" size="mini" @click="search()">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="配送单-表细查询" :visible.sync="dialogTableVisible">
      <el-form :inline="true" class="demo-form-inline" :model="rform">
        <el-form-item label="跟踪号" :label-width="formLabelWidth">
          <el-input v-model="rform.traceCode" size="mini" style="width: 160px;" placeholder="请输入目标跟踪号" clearable />
        </el-form-item>
        <!-- <el-form-item label="配送单号" :label-width="formLabelWidth">
          <el-input v-model="rform.distributionId" size="mini" style="width: 160px;" placeholder="请输入客户姓名" clearable />
        </el-form-item> -->
        <el-form-item label="sku编码" :label-width="formLabelWidth">
          <el-input v-model="rform.skuCode" size="mini" style="width: 160px;" placeholder="请输入产品号" clearable />
        </el-form-item>
        <el-form-item label="供应商名称" :label-width="formLabelWidth">
          <el-input v-model="rform.supplierName" size="mini" style="width: 160px;" placeholder="请输入收货人" clearable />
        </el-form-item>
        <el-form-item label="生产批次" :label-width="formLabelWidth">
          <el-input v-model="rform.productBatch" size="mini" style="width: 160px;" placeholder="请输入出库单号" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchDeatils()">查询</el-button>
        <el-button type="warning" icon="el-icon-circle-close" size="mini" @click="clearDetails()">清空</el-button>
      </div>
    </el-dialog>
    <el-card :body-style="{padding:'0px'}" shadow="always">
      <el-table
        ref="tableData"
        :data="tableData"
        :height="tableHeight"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        :row-class-name="tableRowClassName"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        size="mini"
        style="width: 100%, font-size: 10px"
        @expand-change="expandChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="expand" align="center">
          <div>
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
                <el-table-column v-if="false" label="id" :show-overflow-tooltip="true" prop="id" />
                <el-table-column type="index" label="序号" :show-overflow-tooltip="true" align="center" />
                <el-table-column v-if="false" label="配送单号" align="center" :show-overflow-tooltip="true" prop="distributionId" />
                <el-table-column label="sku编码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
                <el-table-column label="sku数量" align="center" :show-overflow-tooltip="true" prop="skuCnt" />
                <el-table-column label="sku单价" align="center" :show-overflow-tooltip="true" prop="skuPrice" />
                <el-table-column label="装箱类型" align="center" :show-overflow-tooltip="true" prop="exPackingType" />
                <el-table-column label="作业类型" align="center" :show-overflow-tooltip="true" prop="workType" />
                <el-table-column label="波次号" align="center" :show-overflow-tooltip="true" prop="waveNumber" />
                <el-table-column label="尺寸" align="center" :show-overflow-tooltip="true" prop="goodsSize" />
                <el-table-column label="数量" align="center" :show-overflow-tooltip="true" prop="goodsColor" />
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
                  :page-sizes="[2, 5]"
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
        <el-table-column label="配送单号" align="center" :show-overflow-tooltip="true" prop="distributionId" />
        <el-table-column label="收货人" align="center" :show-overflow-tooltip="true" prop="receiver" />
        <el-table-column label="路线" align="center" :show-overflow-tooltip="true" prop="road" />
        <el-table-column label="配送标签号" align="center" :show-overflow-tooltip="true" prop="distributionTagetCnt" />
        <el-table-column label="毛重" align="center" :show-overflow-tooltip="true" prop="weight" />
        <el-table-column label="长" align="center" :show-overflow-tooltip="true" prop="length" />
        <el-table-column label="宽" align="center" :show-overflow-tooltip="true" prop="wide" />
        <el-table-column label="高" align="center" :show-overflow-tooltip="true" prop="hight" />
        <el-table-column label="数量" align="center" :show-overflow-tooltip="true" prop="cnt" />
        <el-table-column label="体积" align="center" :show-overflow-tooltip="true" prop="volume" />
        <el-table-column label="运输方式" align="center" :show-overflow-tooltip="true" prop="shippingType" />
        <el-table-column label="站点" align="center" :show-overflow-tooltip="true" prop="station" />
        <el-table-column label="付款方式" align="center" :show-overflow-tooltip="true" prop="payType" />
        <el-table-column label="交货方式" align="center" :show-overflow-tooltip="true" prop="deliveryType" />
        <el-table-column label="卸货地" align="center" :show-overflow-tooltip="true" prop="loadPlace" />
        <el-table-column label="交货地" align="center" :show-overflow-tooltip="true" prop="deliveryPlace" />
        <el-table-column v-if="colData[0].istrue" label="用户自定义1" align="center" :show-overflow-tooltip="true" prop="defined1" />
        <el-table-column v-if="colData[1].istrue" label="用户自定义2" align="center" :show-overflow-tooltip="true" prop="defined2" />
        <el-table-column v-if="colData[2].istrue" label="用户自定义3" align="center" :show-overflow-tooltip="true" prop="defined3" />
        <el-table-column
          fixed="right"
          width="250px"
          prop="action"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" type="primary" @click="scanDespatch(scope.row)">查看发运订单</el-button>
              <el-button size="mini" type="primary">打印条码</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { screenDistribution, screenDistributionSum, searchDespatchByDis, screenDistributionDetailSum, generateLoadAndDetail, screenDistributionDetail, exportDistributionAndDetailExcel } from '@/api/user'
import despatchUse from '@/views/exwarehouse/distribution/components/despatchUse'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination, despatchUse },
  data() {
    return {
      multipleSelection: [],
      colData: [{ title: '用户自定义1', istrue: false },
        { title: '用户自定义2', istrue: false },
        { title: '用户自定义3', istrue: false }],
      colOptions: [],
      colSelect: [],
      distributionId: null,
      despatchTable: [],
      expands: [],
      listLoading: true,
      id: null,
      total: 0,
      tableHeight: 50,
      dialogTableVisible: false,
      dialogDesVisible: false,
      dialogVisible: false,
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 5, // 每页显示的条数
      currentPage2: 1, // 当前页码
      pageSize2: 20, // 每页的数据条数
      advanced: false,
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      form: {
        distributionTagetCnt: null,
        shippingType: null,
        station: null,
        payType: null,
        deliveryType: null
      },
      rform: {
        traceCode: null,
        skuCode: null,
        supplierName: null,
        productBatch: null
      },
      uform: {
        // id: null,
        // loadId: null,
        carNumber: null,
        carType: null,
        driver: null,
        loadPeople: null,
        warehouse: null,
        volumeLimit: null,
        weightLimit: null,
        waveId: null,
        startTime: null,
        endTime: null,
        userDefined1: null,
        userDefined2: null,
        userDefined3: null,
        userDefined4: null
      },
      tableData: [],
      tabledatas: []
    }
  },
  watch: {
    colOptions(valArr) {
      var arr = this.colSelect.filter(i => valArr.indexOf(i) < 0) // 未选中
      this.colData.filter(i => {
        if (arr.indexOf(i.title) !== -1) {
          i.istrue = false
          this.$nextTick(() => {
            this.$refs.tableData.doLayout()
          })
        } else {
          i.istrue = true
          this.$nextTick(() => {
            this.$refs.tableData.doLayout()
          })
        }
      })
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tableData.$el.offsetTop - 78

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tableData.$el.offsetTop - 78
      }
    })
  },
  created() {
    this.getList()
    var _this = this
    for (let i = 0; i < _this.colData.length; i++) {
      _this.colSelect.push(_this.colData[i].title)
      if (_this.colData[i].title === '用户自定义1' ||
      _this.colData[i].title === '用户自定义2' ||
      _this.colData[i].title === '用户自定义3') { // 初始化不想展示的列可以放在这个条件里
        continue
      }
      _this.colOptions.push(_this.colData[i].title)
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleChange(val) {
      console.log(val)
    },
    expandChange(row, expandedRows) {
      this.expands = []
      if (expandedRows.length > 0) {
        row ? this.expands.push(row.id) : ''
        this.id = row.id
        this.getListDetails(this.pagesize, this.currentPage)
      }
    },
    scanDespatch(row) {
      this.dialogDesVisible = true
      searchDespatchByDis({ id: row.id }).then(res => {
        this.despatchTable = res.data
      })
    },
    outExcel() {
      const data = {
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        }
      }
      exportDistributionAndDetailExcel(data).then((res) => {
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `出库配送单.xls`)
        document.body.appendChild(a)
        a.click()
        url = window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
    },
    changeadvanced() {
      this.advanced = !this.advanced
    },
    generateLoad() {
      if (this.multipleSelection.length) {
        this.$confirm('是否确认继续生成装车任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dialogVisible = true
        })
      } else {
        this.$message({
          message: '请选择至少一条数据',
          type: 'warning'
        })
      }
    },
    submit() {
      this.$confirm('此操作将新建装车任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        generateLoadAndDetail({
          head: this.uform, details: this.multipleSelection
        }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'sucess',
              message: '新建成功'
            })
          }
          this.reload()
          this.$refs.multipleTable.clearSelection()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    refresh() {
      this.reload()
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
    clear() {
      this.distributionId = null
      this.form = {
        distributionTagetCnt: null,
        shippingType: null,
        station: null,
        payType: null,
        deliveryType: null
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
        traceCode: null,
        skuCode: null,
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
      screenDistributionDetail({ searchDTO,
        pojo: {
          distributionId: this.id,
          traceCode: this.rform.traceCode,
          skuCode: this.rform.skuCode,
          supplierName: this.rform.supplierName,
          productBatch: this.rform.productBatch
        }}).then(response => {
        this.tabledatas = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      screenDistributionDetailSum({ searchDTO,
        pojo: {
          distributionId: this.id,
          traceCode: this.rform.traceCode,
          skuCode: this.rform.skuCode,
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
    handleSizeChange2(val) {
      this.currentPage2 = 1
      this.pageSize2 = val
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val
    },
    getList() {
      this.listLoading = true
      screenDistribution({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        distributionId: this.distributionId,
        distributionTagetCnt: this.form.distributionTagetCnt,
        shippingType: this.form.shippingType,
        station: this.form.station,
        payType: this.form.payType,
        deliveryType: this.form.deliveryType
      }}).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenDistributionSum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        distributionId: this.distributionId,
        distributionTagetCnt: this.form.distributionTagetCnt,
        shippingType: this.form.shippingType,
        station: this.form.station,
        payType: this.form.payType,
        deliveryType: this.form.deliveryType
      }}).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      // 去重获取被选中的id值存入到数组中
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
  .search {
    margin: 1px;
    float: right
  }
  .btngroups {
    margin: 1px;
  }
    .pagContainer{
    background-color: rgb(75, 200, 175);
  }
  </style>
    <style lang="scss" scoped>
// 修改对话框高度
  .showAll_dialog {
    ::v-deep.el-dialog {
      margin: 10px auto !important;
      background-color: #091f2cee;
      height: 90%l;

      .el-dialog__body {
        line-height: 30px;
        color: white;
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
</style>

