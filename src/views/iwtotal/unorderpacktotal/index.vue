<template>
  <div>
    <div style="margin: 1px">
      <el-button icon="el-icon-back" type="primary" @click="goback">返回上一页</el-button>
      <el-button type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card :body-style="{padding:'0px'}" class="show_card">
      <e-desc title="装箱任务-无计划单头信息">
        <e-desc-item label="装箱任务单号:">
          {{ form.packingId }}
        </e-desc-item>
        <e-desc-item label="仓库:">
          {{ form.warehouseName }}
        </e-desc-item>
        <e-desc-item label="装箱人:">
          {{ form.packingName }}
        </e-desc-item>
        <e-desc-item label="审核人:">
          {{ form.checkPersonName }}
        </e-desc-item>
        <e-desc-item label="审核时间:">
          {{ form.checkTime| dateYMDHMSFormat }}
        </e-desc-item>
        <e-desc-item label="备注:">
          {{ form.remark }}
        </e-desc-item>
      </e-desc>
    </el-card>
    <el-card :body-style="{padding:'0px'}" class="show_card2">
      <GoodsChoose :goodsform="goodsform" />
      <el-form :inline="true" :model="rform">
        <el-form-item label="客户" label-width="120px">
          <el-input v-model="rform.customName" size="small" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="包装条码" label-width="120px">
          <el-input v-model="rform.packageBarcode" size="small" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <!-- <el-form-item label="供应商" label-width="120px">
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
        element-loading-text="正在加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="tabledatas"
        show-summary
        :summary-method="getSummaries"
        border
        :height="tableHeight"
        :header-cell-style="{background:'#091f2c',color: '#fff'}"
        size="mini"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <el-table-column label="装箱任务-无计划明细" center align="center">
          <el-table-column v-if="false" label="id" prop="id" />
          <el-table-column type="index" label="序号" />
          <el-table-column label="计划单代码" prop="planCode" width="77px" :show-overflow-tooltip="true" />
          <el-table-column label="入库计划单跟踪码" width="160px" prop="inboundTraceCode" :show-overflow-tooltip="true" />
          <el-table-column label="装箱单号" prop="packingCode" :show-overflow-tooltip="true" />
          <el-table-column label="商品sku名称" prop="skuName" :show-overflow-tooltip="true" />
          <el-table-column label="包装代码" prop="packageCode" :show-overflow-tooltip="true" />
          <el-table-column label="包装条码" prop="packageBarcode" width="160px" :show-overflow-tooltip="true" />
          <el-table-column label="客户名称" prop="customName" :show-overflow-tooltip="true" />
          <el-table-column label="供应商名称" prop="supplierName" :show-overflow-tooltip="true" />
          <el-table-column label="箱中商品数量(个)" prop="commodityNum" :show-overflow-tooltip="true" />
          <!-- <el-table-column label="生产厂家" prop="productCompany" :show-overflow-tooltip="true" />
            <el-table-column label="生产日期" prop="productTime" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ scope.row.productTime| dateYMDHMSFormat }}</template>
            </el-table-column>
            <el-table-column label="生产批次" prop="productBatch" :show-overflow-tooltip="true" /> -->
          <!-- <el-table-column label="是否已装箱" prop="isPacked" :show-overflow-tooltip="true" /> -->
          <el-table-column label="跟踪号" width="77px" prop="traceCode" :show-overflow-tooltip="true" />
          <el-table-column
            prop="action"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" icon="el-icon-delete" type="primary" @click="deleteDetails(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
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
import GoodsChoose from '@/components/GoodsChoose'

import { selectInPackage, delPackDetail, selectInPackageDetailNum, selectInPackageDetail } from '@/api/user'
import { searchsystemid } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
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
      advanced: false,
      packingState: null,
      viewed: true,
      tableLoading: true,
      comOptions: [],
      spanArr: [],
      comStates: [],
      comLoclist: [],
      sums: {},
      tablelist: {},
      listLoading: true,
      expandState: 0,
      lastTime: 0,
      id: null,
      total: 0,
      list: [],
      options: [],
      tableHeight: 50,
      dialogTableVisible: false,
      stateOptions: [],
      lastStaTime: 0,
      formLabelWidth: '77px',
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
      goodsform: {
        commodityId: null,
        skuName: null,
        containerName: null,
        unit: null
      },
      startTime: null,
      endTime: null,
      form: {
        warehouseName: null,
        packingId: null,
        checkTime: null,
        packingName: null,
        checkPersonName: null,
        remark: null
      },
      rform: {
        packageBarcode: null,
        customName: null,
        supplierName: null
      },
      tabledatas: [],
      tableData: []
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tabledatas.$el.offsetTop - 74

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tabledatas.$el.offsetTop - 74
      }
    })
  },
  created() {
    this.getList()
  },
  updated() {
    this.$nextTick(() => {
      this.$refs['tabledatas'].doLayout()
      // table是在表格中ref=tabledatas
      // doLayout	对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    })
  },
  methods: {
    goback() {
      this.$router.go(-1)
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
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
          if (item.planCode === this.tabledatas[index - 1].planCode) {
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

    // continueWrite(row) {
    //   this.$router.push('packinglist')
    //   sessionStorage.setItem('packChildId', row.id)
    //   sessionStorage.setItem('packingId', row.packingId)
    // },
    deleteDetails(row) {
      this.$confirm('确定删除该条表细吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPackDetail({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getListDetails(this.pagesize, this.currentPage)
          }
        })
      })
    },
    funcState() {
      const now = new Date().valueOf()
      if (this.lastStaTime === 0) {
        searchsystemid('INPACKAGE_STATE').then(res => {
          this.stateOptions = res.data
        })
        this.lastStaTime = now
      } else {
        if ((now - this.lastStaTime) > 5000) {
          this.lastStaTime = now
        }
      }
    },
    packFormat(row) {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        searchsystemid('INPACKAGE_STATE').then(res => {
          this.options = res.data
        })
        this.lastTime = now
      } else {
        if ((now - this.lastTime) > 5000) {
          this.lastTime = now
        }
      }
      return changeAll(row.packingState, this.options)
    },
    sourceFormat(row) {
      if (row.sourceType === 1) {
        return '采购计划来源'
      } else if (row.sourceType === 0) {
        return '盲收来源'
      }
    },
    searchDeatils() {
      this.getListDetails(this.pagesize, this.currentPage)
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      selectInPackageDetail({ searchDTO,
        pojo: {
          packingId: sessionStorage.getItem('packChildId'),
          packageBarcode: this.rform.packageBarcode,
          customName: this.rform.customName,
          supplierName: this.rform.supplierName,
          commodityId: this.goodsform.commodityId,
          skuName: this.goodsform.skuName,
          containerName: this.goodsform.containerName,
          unit: this.goodsform.unit
        }}).then(response => {
        this.tablelist = response.data
        this.tabledatas = this.tablelist.list
        this.sums = this.tablelist.sums
        this.flitterData()
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      selectInPackageDetailNum({ searchDTO,
        pojo: {
          packingId: sessionStorage.getItem('packChildId'),
          packageBarcode: this.rform.packageBarcode,
          customName: this.rform.customName,
          supplierName: this.rform.supplierName,
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
      selectInPackage({
        pojo: {
          packingId: sessionStorage.getItem('packingId')
        }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
        this.form = Object.assign({}, response.data[0])
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      this.getListDetails(this.pagesize, this.currentPage)
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
    <style scoped>

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

