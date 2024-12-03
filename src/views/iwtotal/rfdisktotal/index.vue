<template>
  <div>
    <div style="margin: 1px">
      <el-button icon="el-icon-back" type="primary" @click="goback">返回上一页</el-button>
      <el-button type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card :body-style="{padding:'0px'}" class="show_card">
      <e-desc title="码盘任务-无计划单头信息">
        <e-desc-item label="码盘任务单号:">
          {{ form.combineCode }}
        </e-desc-item>
        <e-desc-item label="仓库代码:">
          {{ form.warehouseCode }}
        </e-desc-item>
        <e-desc-item label="码盘人:">
          {{ form.personName }}
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
      <!-- <GoodsChoose :goodsform="goodsform" /> -->
      <el-form :inline="true" :model="rform">
        <!-- <el-form-item label="包装代码" label-width="120px">
          <el-input v-model="rform.packageCode" size="small" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item> -->
        <el-form-item label="包装条码" label-width="120px">
          <el-input v-model="rform.packageBarcode" size="small" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="码盘跟踪号" label-width="120px">
          <el-input v-model="rform.combineTraceCode" size="small" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="计划单代码" label-width="120px">
          <el-input v-model="rform.planCode" size="small" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" round size="small" @click="searchDeatils()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="detailsTable">
      <el-table
        ref="tabledatas"
        :data="tabledatas"
        tooltip-effect="dark"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        size="mini"
        :height="tableHeight"
        :header-cell-style="{background:'#091f2c',color: '#fff'}"
        show-summary
        :summary-method="getSummaries2"
        border
        style="width: 100%, font-size: 10px"
        element-loading-text="正在加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column label="码盘任务-无计划码盘明细" center align="center">
          <el-table-column v-if="false" label="id" prop="id" />
          <el-table-column type="index" label="序号" />
          <el-table-column label="码盘编号" prop="stackCode" />
          <el-table-column label="包装代码" prop="packageCode" />
          <el-table-column label="包装条码" prop="packageBarcode" />
          <el-table-column label="码箱数量" prop="packageNum" />
          <el-table-column label="是否混sku码装盘" prop="isFix" :formatter="useFormat" />
          <!-- <el-table-column label="是否完成码盘" prop="stackState" :formatter="useFormat" /> -->
          <el-table-column label="码盘跟踪号" prop="combineTraceCode" />
          <el-table-column label="计划单代码" prop="planCode" />
        </el-table-column>
        <el-table-column
          prop="action"
          align="center"
          label="操作"
          width="300px"
        >
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-view" type="primary" @click="rowDbclick(scope.row)">查看码盘装箱信息</el-button>
            <el-button size="mini" icon="el-icon-delete" round type="danger" @click="deleteDetails(scope.row)">删除</el-button>
          </template>
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

import { delDiskDetail, selectCombineStack, selectCombineStackDetail, selectCombineStackDetailNum } from '@/api/user'
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
      startTime: null,
      endTime: null,
      form: {
        combineCode: null,
        warehouseCode: null,
        personName: null,
        checkTime: null,
        checkPersonName: null
      },
      goodsform: {
        commodityId: null,
        skuName: null,
        containerName: null,
        unit: null
      },
      rform: {
        packageCode: null,
        packageBarcode: null,
        combineTraceCode: null,
        planCode: null
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
    })
  },
  methods: {
    goback() {
      this.$router.go(-1)
    },
    getSummaries2(param) {
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
      if (row.isFinished === 0 || row.isFix === 0 || row.stackState === 0 || row.isStacked === 0) {
        return '否'
      } else if (row.isFinished === 1 || row.isFix === 1 || row.stackState === 1 || row.isStacked === 1) {
        return '是'
      }
    },
    deleteDetails(row) {
      this.$confirm('确定删除该条表细吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDiskDetail({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.reload()
          }
        })
      })
    },
    rowDbclick(row) {
      sessionStorage.setItem('combinepackChildId', row.id)
      sessionStorage.setItem('combinepackId', row.id)
      this.$router.push('/rfdiskpacktotal')
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
      selectCombineStackDetail({ searchDTO,
        pojo: {
          stackId: sessionStorage.getItem('combineChildId'),
          packageCode: this.rform.packageCode,
          packageBarcode: this.rform.packageBarcode,
          combineTraceCode: this.rform.combineTraceCode,
          planCode: this.rform.planCode
        }}).then(response => {
        this.tablelist = response.data
        this.tabledatas = this.tablelist.list
        this.sums = this.tablelist.sums
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      selectCombineStackDetailNum({ searchDTO,
        pojo: {
          stackId: sessionStorage.getItem('combineChildId'),
          packageCode: this.rform.packageCode,
          combineTraceCode: this.rform.combineTraceCode,
          packageBarcode: this.rform.packageBarcode,
          planCode: this.rform.planCode
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
      selectCombineStack({
        pojo: {
          combineCode: sessionStorage.getItem('combineId')
        }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
        this.form = Object.assign({}, response.data[0])
      })
      this.getListDetails(this.pagesize, this.currentPage)
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

