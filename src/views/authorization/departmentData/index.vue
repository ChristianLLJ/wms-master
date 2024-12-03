<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="btngroups">
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">新增部门</el-button>
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="search">
          <el-select v-model="companyName" size="mini" placeholder="请选择部门所属公司" clearable @focus="funccompany">
            <el-option v-for="item in companyOptions" :key="item.id" :label="item.companyName" :value="item.companyName" />
          </el-select>
          <el-input v-model="departmentName" size="mini" style="width: 160px;" placeholder="请输入部门名称" clearable />
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="部门信息" :visible.sync="dialogFormVisible" class="showAll_dialog2">
      <el-form ref="form" :rules="rules" :inline="true" class="demo-form-inline" :model="form">
        <el-form-item v-if="false" label="id" :label-width="formLabelWidth">
          <el-input v-model="form.id" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="所属公司" :label-width="formLabelWidth" prop="companyName">
          <el-select v-model="form.companyName" size="mini" @focus="funccompany">
            <el-option v-for="item in companyOptions" :key="item.id" :label="item.companyName" :value="item.companyName" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" :label-width="formLabelWidth" prop="departmentName">
          <el-input v-model="form.departmentName" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" size="mini" style="width: 300px;" placeholder="请输入" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!show" type="primary" @click="submit">保存</el-button>
        <el-button v-if="show" type="primary" @click="update">保存</el-button>
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
      :row-key="getRowKeys"
      border
      :span-method="objectSpanMethod"
      :row-class-name="tableRowClassName"
      :header-cell-style="{background:'#000',color: '#fff'}"
      tooltip-effect="dark"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      size="mini"
      style="width: 100%, font-size: 10px"
    >
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
      <el-table-column label="所属公司" align="center" :show-overflow-tooltip="true" prop="companyName" />
      <el-table-column label="部门名称" align="center" :show-overflow-tooltip="true" prop="departmentName" />
      <el-table-column label="备注" align="center" :show-overflow-tooltip="true" prop="remark" />
      <el-table-column v-if="false" label="创建时间" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.show">
            <el-date-picker
              v-model="scope.row.createTime"
              type="date"
              size="mini"
              :value-format="'yyyy-MM-dd'"
              style="width: 160px;"
              clearable
            />
          </span>
          <span v-else>{{ scope.row.createTime| dateYMDHMSFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column
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
import { kkdeboundce } from '@/utils/kkdebounce'
import Pagination from '@/components/Pagination'
import { selectDepartmentNum, selectDepartment, delDepartment, addDepartment, updDepartment } from '@/api/user'
import { searchcompany } from '@/utils/search'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      // 总数
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        id: null,
        companyName: null,
        departmentName: null,
        remark: null
      },
      departmentName: null,
      companyName: null,
      companyOptions: [],
      rules: {
        companyName: [{ required: true, message: '请选择公司', trigger: 'change' }],
        departmentName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      },
      //   expands: [],
      listLoading: true,
      total: 0,
      show: false,
      tableHeight: 50,
      lastTime: 0,
      spanArr: [],
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      tableData: [
      ]
    }
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
  created() {
    this.getList()
  },
  methods: {
    funccompany() {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        searchcompany().then(res => {
          this.companyOptions = res.data
        }
        )
        this.lastTime = now
      } else {
        if ((now - this.lastTime) > 5000) {
          this.lastTime = now
        }
      }
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    getList() {
      this.listLoading = true
      selectDepartment({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        departmentName: this.departmentName,
        companyName: this.companyName
      }}).then(response => {
        this.tableData = response.data
        this.flitterData()
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectDepartmentNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        departmentName: this.departmentName,
        companyName: this.companyName
      }}).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    search: kkdeboundce(function() {
      this.getList()
    }, 1000),
    refresh: kkdeboundce(function() {
      this.reload()
    }, 1000),
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
    update() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交修改信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updDepartment({
              id: this.form.id,
              companyName: this.form.companyName,
              departmentName: this.form.departmentName,
              remark: this.form.remark
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('修改成功')
                this.reload()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存所填信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addDepartment({
              companyName: this.form.companyName,
              departmentName: this.form.departmentName,
              remark: this.form.remark
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.reload()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      })
    },
    // 单个删除
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDepartment({ id: row.id }).then(res => {
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
    add() {
      this.show = false
      this.dialogFormVisible = true
      this.form = {
        id: null,
        companyName: null,
        departmentName: null,
        remark: null
      }
    },
    edit(row) {
      this.show = true
      this.dialogFormVisible = true
      selectDepartment({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        id: row.id
      }}).then(
        this.form = Object.assign({}, row)
      )
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
  </style>
  <style lang="scss" scoped>
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

