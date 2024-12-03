<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="btngroups">
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="dialogFormVisible = true">新增员工</el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-refresh"
              @click="refresh"
            >刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="search">
          <el-input
            v-model="staffName"
            size="mini"
            style="width: 160px"
            placeholder="请输入姓名"
            clearable
          />
          <el-input
            v-model="companyName"
            size="mini"
            style="width: 160px"
            placeholder="请输入公司"
            clearable
          />
          <el-input
            v-model="departmentName"
            size="mini"
            style="width: 160px"
            placeholder="请输入部门"
            clearable
          />
          <el-button-group>
            <el-button
              icon="el-icon-search"
              type="primary"
              size="mini"
              @click="search"
            >搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="新增用户" :visible.sync="dialogFormVisible" class="showAll_dialog2">
      <el-form :model="rform" size="mini" :inline="true">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="rform.username" autocomplete="off" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="rform.staffName" autocomplete="off" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="工号" :label-width="formLabelWidth">
          <el-input v-model="rform.staffId" autocomplete="off" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="公司" :label-width="formLabelWidth">
          <el-input v-model="rform.companyName" autocomplete="off" placeholder="请输入公司" />
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth">
          <el-input v-model="rform.departmentName" autocomplete="off" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="工作组" :label-width="formLabelWidth">
          <el-select v-model="rform.curWorkGroup" placeholder="请选择工作组" clearable @focus="func">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.groupName"
              :value="item.groupName"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <el-table
      ref="tableData"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      :height="tableHeight"
      border
      :row-style="{ height: '20px' }"
      :cell-style="{ padding: '0px' }"
      :header-cell-style="{background:'#000',color: '#fff'}"
      size="mini"
      :span-method="objectSpanMethod"
      :row-class-name="tableRowClassName"
      style="width: 100%, font-size: 10px"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column v-if="false" label="id" prop="id" />
      <el-table-column label="公司" align="center" :show-overflow-tooltip="true" prop="companyName" />
      <el-table-column label="部门" align="center" :show-overflow-tooltip="true" prop="departmentName" />
      <el-table-column prop="curWorkGroup" label="工作组" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="用户名" align="center" prop="username" />
      <el-table-column label="姓名" align="center" prop="staffName" />
      <el-table-column label="工号" align="center" prop="staffId" />
      <el-table-column
        width="200px"
        prop="action"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button-group>
            <!-- <el-button size="mini" type="warning">重置密码</el-button> -->
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
import { selectStaff, selectStaffNum, delStaff, addStaff, selectWorkGroup } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      status: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      tableHeight: 50,
      listLoading: true,
      lastTime: 0,
      staffName: null,
      companyName: null,
      departmentName: null,
      options: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      spanArr: [],
      rform: {
        username: null,
        staffName: null,
        staffId: null,
        companyName: null,
        departmentName: null,
        isUsable: null,
        entryTime: null,
        curWorkGroup: null
      },
      tableData: []
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
    search: kkdeboundce(function() {
      this.getList()
    }, 1000),
    refresh: kkdeboundce(function() {
      this.reload()
    }, 1000),
    func() {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        selectWorkGroup({
          pojo: {
          }}).then(res => {
          this.options = res.data
        }
        )
        this.lastTime = now
      } else {
        if ((now - this.lastTime) > 5000) {
          this.lastTime = now
        }
      }
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
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1)
        } else {
          if (item.companyName === this.tableData[index - 1].companyName) {
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
    // 选
    formatText(value) {
      return value
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    delect(row) {
      this.$confirm('是否确认删除该员工?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delStaff({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
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
    submit() {
      this.$confirm('是否确认新增员工?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addStaff({
          username: this.rform.username,
          staffName: this.rform.staffName,
          staffId: this.rform.staffId,
          companyName: this.rform.companyName,
          departmentName: this.rform.departmentName,
          curWorkGroup: this.rform.curWorkGroup
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('新增成功')
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
    getList() {
      this.listLoading = true
      selectStaff({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        staffName: this.staffName,
        companyName: this.companyName,
        departmentName: this.departmentName
      }}).then(response => {
        this.tableData = response.data
        this.flitterData()
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectStaffNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        staffName: this.staffName,
        companyName: this.companyName,
        departmentName: this.departmentName
      }}).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
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
  .datagrid-htable, .datagrid-btable, .datagrid-ftable {
    color: #ffffff;
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
</style>
<style lang="scss" scoped>
 .treeDialog {
            height: 250px;
            overflow: auto;
        }
// 修改对话框高度
  .showAll_dialog2 {
    ::v-deep.el-dialog {
      margin: 100px auto !important;
      overflow: hidden;
      background-color: #091f2c;

      .el-dialog__body {
        line-height: 30px;
        color: white;
        padding: 10px 15px;
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
