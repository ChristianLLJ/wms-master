<template>
  <div>
    <div style="margin: 1px">
      <el-button icon="el-icon-back" type="primary" @click="goback">返回上一页</el-button>
      <el-button type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card :body-style="{padding:'0px'}" class="show_card">
      <e-desc title="质检任务-单头信息">
        <e-desc-item label="质检任务单号:">
          {{ form.checkCode }}
        </e-desc-item>
        <e-desc-item label="仓库:">
          {{ form.warehouseName }}
        </e-desc-item>
        <e-desc-item label="抽检商品种数:">
          {{ form.randomNum }}
        </e-desc-item>
        <e-desc-item label="总合格数量:">
          {{ form.totalPassNum }}
        </e-desc-item>
        <e-desc-item label="不合格数量:">
          {{ form.totalUnpassNum }}
        </e-desc-item>
        <e-desc-item label="审核人:">
          {{ form.checkPersonName }}
        </e-desc-item>
        <e-desc-item label="审核时间:">
          {{ form.checkTime| dateYMDHMSFormat }}
        </e-desc-item>
      </e-desc>
    </el-card>
    <el-card :body-style="{padding:'0px'}" class="show_card2">
      <GoodsChoose :goodsform="goodsform" />
      <el-form :inline="true" :model="rform" label-width="120px">
        <el-form-item label="客户">
          <el-input v-model="rform.customName" size="small" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="rform.supplierName" size="small" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model="rform.supplierName" size="small" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
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
        :height="tableHeight"
        border
        :header-cell-style="{background:'#091f2c',color: '#fff'}"
        size="mini"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <el-table-column label="质检任务-表细信息">
          <el-table-column type="index" label="序号" />
          <el-table-column label="来源入库计划单编号" :show-overflow-tooltip="true" prop="planCode" width="130px" />
          <el-table-column label="跟踪号" width="120px" :show-overflow-tooltip="true" prop="inboundTraceCode" />
          <el-table-column v-if="false" label="id" prop="id" />
          <el-table-column v-if="false" label="质检单id" prop="checkId" />
          <el-table-column v-if="false" label="计划单id" prop="planId" />
          <el-table-column label="质检单编号" :show-overflow-tooltip="true" prop="checkCode" />
          <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="commodityName" />
          <el-table-column label="商品sku" :show-overflow-tooltip="true" prop="skuName" />
          <el-table-column label="最小sku单位" :show-overflow-tooltip="true" prop="unit" />
          <el-table-column label="包装名称" :show-overflow-tooltip="true" prop="containerName" />
          <!-- <el-table-column label="是否通过质检" :show-overflow-tooltip="true" :formatter="useFormat" prop="isPass" /> -->
          <el-table-column label="供应商" :show-overflow-tooltip="true" prop="supplierName" />
          <el-table-column label="客户名称" :show-overflow-tooltip="true" prop="customName" />
          <el-table-column label="预检数量(个)" :show-overflow-tooltip="true" prop="predictNum" />
          <el-table-column label="应检数量(个)" :show-overflow-tooltip="true" prop="predictCheckNum" />
          <el-table-column label="已检数量(个)" :show-overflow-tooltip="true" prop="checkedNum" />
          <el-table-column label="抽检数量(个)" :show-overflow-tooltip="true" prop="randomCheckNum" />
          <el-table-column label="合格数量(个)" :show-overflow-tooltip="true" prop="passNum" />
          <el-table-column label="不合格数量(个)" :show-overflow-tooltip="true" prop="unpassNum" />
          <el-table-column label="生产厂家" :show-overflow-tooltip="true" prop="productFactory" />
          <el-table-column label="生产日期" :show-overflow-tooltip="true" prop="productTime">
            <template slot-scope="scope">{{ scope.row.productTime| dateYMDHMSFormat }}</template>
          </el-table-column>
          <el-table-column label="生产批次" :show-overflow-tooltip="true" prop="productBatch" />
          <el-table-column
            prop="action"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button size="mini" icon="el-icon-delete" type="danger" round @click="deleteDetails(scope.row)">删除</el-button>
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
import { selectQualityCheck, delQualityDetail, selectQualityCheckDetailNum, selectQualityCheckDetail } from '@/api/user'
// import { searchsystemid } from '@/utils/search'
// import { changeAll } from '@/utils/statechange'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: {
    EDesc, EDescItem, GoodsChoose
  },
  data() {
    return {
      multipleSelection: [],
      expands: [],
      checkState: null,
      advanced: false,
      tableLoading: true,
      unAuditDialog: false,
      auditForm: {
        reason: null
      },
      rules: {},
      listLoading: true,
      lastTime: 0,
      laststateTime: 0,
      viewed: true,
      sums: {},
      tablelist: {},
      spanArr: [],
      comOptions: [],
      comStates: [],
      comLoclist: [],
      conOptions: [],
      conStates: [],
      conLoclist: [],
      stateOptions: [],
      lastStaTime: 0,
      expandState: 0,
      soptions: [],
      options: [],
      id: null,
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
      total: 0,
      tableHeight: 50,
      dialogTableVisible: false,
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 10, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.form.endTime || this.form.endTime1) {
            return time.getTime() > new Date(this.form.endTime || this.form.endTime1).getTime()
          }
        }
      },
      // 项目终止日期限制
      pickerOptionsEnd: {
        disabledDate: time => {
          return time.getTime() < new Date(this.form.startTime || this.form.startTime1).getTime() - 1 * 24 * 60 * 60 * 1000
        }
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      rform: {
        customName: null,
        supplierName: null,
        productCompany: null
      },
      goodsform: {
        commodityId: null,
        skuName: null,
        containerName: null,
        unit: null
      },
      form: {
        checkCode: null,
        warehouseName: null,
        randomNum: null,
        totalPassNum: null,
        totalUnpassNum: null,
        checkPersonName: null,
        checkTime: null
      },
      tableData: [],
      tabledatas: []
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tabledatas.$el.offsetTop - 77

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tabledatas.$el.offsetTop - 77
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
    changeadvanced() {
      this.expandState = 0
      this.advanced = !this.advanced
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
    useFormat(row) {
      if (row.isPass === 0) {
        return '否'
      } else if (row.isPass === 1) {
        return '是'
      }
    },
    goback() {
      this.$router.go(-1)
    },
    sourceFormat(row) {
      if (row.sourceType === 1) {
        return '采购计划来源'
      } else if (row.sourceType === 0) {
        return '盲收来源'
      }
    },
    deleteDetails(row) {
      this.$confirm('确定删除该条表细吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delQualityDetail({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getListDetails(this.pagesize, this.currentPage)
          }
        })
      })
    },

    // edit(row) {
    //   this.$router.push('qualitylist')
    //   sessionStorage.setItem('qualityChildId', row.id)
    //   sessionStorage.setItem('checkCode', row.checkCode)
    // },
    // clear() {
    //   this.checkState = null
    //   this.form = {
    //     checkCode: null,
    //     startTime: null,
    //     endTime: null,
    //     startTime1: null,
    //     endTime1: null,
    //     isPass: null
    //   }
    // },
    // search() {
    //   this.getList()
    // },
    searchDeatils() {
      this.getListDetails(this.pagesize, this.currentPage)
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      selectQualityCheckDetail({ searchDTO,
        pojo: {
          checkId: sessionStorage.getItem('qualityChildId'),
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
      selectQualityCheckDetailNum({ searchDTO,
        pojo: {
          checkId: sessionStorage.getItem('qualityChildId'),
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
      selectQualityCheck({
        pojo: {
          checkCode: sessionStorage.getItem('checkCode')
        }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
        this.form = Object.assign({}, response.data[0])
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      this.getListDetails(this.pagesize, this.currentPage)
    },
    // 选
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
    background-color: rgb(75, 200, 175);
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
  .showAll_dialog2 {
    ::v-deep.el-dialog {
      background-color: #091f2cee;

      .el-dialog__body {
        line-height: 30px;
        color: white;
        padding: 10px 15px;
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
