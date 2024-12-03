<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="btngroups">
          <el-button-group>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="search">
          <el-input v-model="codeName" size="mini" style="width: 160px;" placeholder="请输入名称" clearable />
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-table
      ref="tableData"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      :height="tableHeight"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      border
      size="mini"
      :row-class-name="tableRowClassName"
      :header-cell-style="{background:'#000',color: '#fff'}"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
      @expand-change="expandChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="expand" align="center">
        <template>
          <div v-if="totalCount >= 10" style="background-color :#000;">
            <el-form :inline="true" class="demo-form-inline" :model="rform">
              <el-form-item label="名称">
                <el-input v-model="rform.codeDetailName" size="mini" style="width: 160px;" placeholder="请输入名称" clearable />
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" icon="el-icon-search" size="mini" @click="searchDeatils()">查询</el-button>
                  <el-button type="warning" icon="el-icon-circle-close" size="mini" @click="clearDetails()">清空</el-button>
                </el-button-group>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            :data="tabledatas"
            :row-class-name="tableRowClassDetailName"
            :header-cell-style="{background:'#000',color: '#fff'}"
            border
            size="mini"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            style="width: 100%, font-size: 5px"
          >
            <!-- <el-table-column type="selection" /> -->
            <el-table-column v-if="false" label="id" prop="id" />
            <el-table-column type="index" label="序号" align="center" />
            <el-table-column v-if="false" label="系统代码id" align="center" :show-overflow-tooltip="true" prop="systemId" />
            <el-table-column label="名称" align="center" :show-overflow-tooltip="true" prop="codeDetailName" />
            <el-table-column label="编码" align="center" :show-overflow-tooltip="true" prop="code" />
            <el-table-column v-if="false" label="条码" align="center" :show-overflow-tooltip="true" prop="barcode" />
            <el-table-column label="描述" align="center" :show-overflow-tooltip="true" prop="description" />
            <el-table-column label="英文描述" align="center" :show-overflow-tooltip="true" prop="Edescription" />
          </el-table>
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
        </template>
      </el-table-column>
      <!-- <el-table-column type="selection" align="center" /> -->
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column
        v-if="false"
        prop="id"
        align="center"
      />
      <el-table-column label="名称" align="center" prop="codeName" :show-overflow-tooltip="true" />
      <el-table-column label="编码" align="center" prop="code" :show-overflow-tooltip="true" />
      <el-table-column label="是否可修改" align="center" prop="ismodify" :formatter="roomFormat" :show-overflow-tooltip="true" />
      <el-table-column label="描述" align="center" prop="description" :show-overflow-tooltip="true" />
      <el-table-column label="英文描述" align="center" prop="edescription" :show-overflow-tooltip="true" />
      <el-table-column
        width="180px"
        prop="action"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="delect(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { kkdeboundce } from '@/utils/kkdebounce'
import { deleteSysCodeAndDetail, screenSysCode, screenSysCodeSum, screenSysCodeDetail, screenSysCodeDetailSum } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      // 总数
      multipleSelection: [],
      expands: [],
      gridData: [],
      code: null,
      codeName: null,
      listLoading: true,
      id: null,
      total: 0,
      tableHeight: 50,
      dialogTableVisible: false,
      dialogVisible: false,
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 10, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      uform: {
        code: null,
        codeName: null,
        ismodify: null,
        description: null,
        edescription: null
      },
      rform: {
        code: null,
        codeDetailName: null
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
      this.tableHeight = window.innerHeight - this.$refs.tableData.$el.offsetTop - 77

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tableData.$el.offsetTop - 77
      }
    })
  },
  methods: {
    roomFormat(row) {
      if (row.ismodify === '0') {
        return '否'
      } else if (row.ismodify === '1') {
        return '是'
      }
    },
    edit(row) {
      this.$router.push('/systemlist')
      sessionStorage.setItem('systemChildId', row.id)
      sessionStorage.setItem('systemId', row.code)
    },
    expandChange(row, expandedRows) {
      this.expands = []
      if (expandedRows.length > 0) {
        row ? this.expands.push(row.id) : ''
        this.id = row.id
        this.getListDetails(this.pagesize, this.currentPage)
      }
    },
    changeadvanced() {
      this.advanced = !this.advanced
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
    searchDeatils() {
      this.getListDetails(this.pagesize, this.currentPage)
      this.clearDetails()
      this.dialogTableVisible = false
    },
    clearDetails() {
      this.rform = {
        code: null,
        codeDetailName: null
      }
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      screenSysCodeDetail({ searchDTO,
        pojo: {
          systemId: this.id,
          code: this.rform.code,
          codeDetailName: this.rform.codeDetailName
        }}).then(response => {
        this.tabledatas = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      screenSysCodeDetailSum({ searchDTO,
        pojo: {
          systemId: this.id,
          code: this.rform.code,
          codeDetailName: this.rform.codeDetailName
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
    // 单个删除
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSysCodeAndDetail({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.reload()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    search: kkdeboundce(function() {
      this.getList()
    }, 1000),
    refresh: kkdeboundce(function() {
      this.reload()
    }, 1000),
    getList() {
      this.listLoading = true
      screenSysCode({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        codeName: this.codeName
      }}).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenSysCodeSum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        codeName: this.codeName
      }}).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    add() {
      this.$router.push('/systemlist')
      sessionStorage.removeItem('systemChildId')
      sessionStorage.removeItem('systemId')
    },
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
  .search {
    margin: 1px;
    float: right
  }
     .el-form /deep/.el-form-item__label{
    color:#fff
  }
  .btngroups {
    margin: 1px;
  }
    .pagContainer{
    background-color: rgb(75, 200, 175);
  }
  </style>
