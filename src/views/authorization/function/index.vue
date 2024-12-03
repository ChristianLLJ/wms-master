<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div class="btngroups">
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">添加功能</el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-refresh"
              @click="refresh"
            >刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="search">
          <el-input
            v-model="functionName"
            size="mini"
            style="width: 160px"
            placeholder="请输入功能名称"
            clearable
          />
          <el-input
            v-model="parentFunctionName"
            size="mini"
            style="width: 160px"
            placeholder="请输入父功能名称"
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
    <el-dialog title="工作组" :visible.sync="dialogFormVisible" class="showAll_dialog2">
      <el-form ref="form" :rules="rules" :model="form" size="mini" :inline="true">
        <el-form-item v-if="false" prop="id">
          <el-input v-model="form.id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="父功能名称" :label-width="formLabelWidth" prop="parentFunctionName">
          <el-input v-model="form.parentFunctionName" autocomplete="off" placeholder="请输入父功能名称" />
        </el-form-item>
        <el-form-item label="功能名称" :label-width="formLabelWidth" prop="functionName">
          <el-input v-model="form.functionName" autocomplete="off" placeholder="请输入功能名称" />
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
      border
      :height="tableHeight"
      :row-style="{ height: '20px' }"
      :cell-style="{ padding: '0px' }"
      :header-cell-style="{background:'#000',color: '#fff'}"
      size="mini"
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
      <el-table-column label="父功能名称" align="center" prop="parentFunctionName">
        <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.parentFunctionName" size="mini" />
            </span>
            <span v-else>{{ scope.row.parentFunctionName }}</span>
          </template> -->
      </el-table-column>
      <el-table-column label="功能名称" align="center" prop="functionName">
        <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.functionName" size="mini" />
            </span>
            <span v-else>{{ scope.row.functionName }}</span>
          </template> -->
      </el-table-column>
      <el-table-column v-if="false" label="功能代码" align="center" prop="functionCode">
        <template slot-scope="scope">
          <span v-if="scope.row.show">
            <el-input v-model="scope.row.functionCode" size="mini" />
          </span>
          <span v-else>{{ scope.row.functionCode }}</span>
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
import { selectFunction, selectFunctionNum, addFunction, delFunction, updFunction } from '@/api/user'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      listLoading: true,
      dialogFormVisible: false,
      show: false,
      formLabelWidth: '120px',
      rules: {
        functionName: [{ required: true, message: '请输入功能名称', trigger: ['blur', 'change'] }],
        parentFunctionName: [{ required: true, message: '请输入父功能名称', trigger: ['blur', 'change'] }]
      },
      form: {
        id: null,
        functionName: null,
        parentFunctionName: null
      },
      functionName: null,
      parentFunctionName: null,
      total: 0,
      tableHeight: 50,
      listQuery: {
        page: 1,
        limit: 20
      },
      tableData: [
      ]
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
    add() {
      this.show = false
      this.dialogFormVisible = true
      this.form = {
        id: null,
        functionName: null,
        parentFunctionName: null
      }
    },
    edit(row) {
      this.show = true
      this.dialogFormVisible = true
      this.form = Object.assign({}, row)
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存所填信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addFunction({
              functionName: this.form.functionName,
              parentFunctionName: this.form.parentFunctionName
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
    formatText(value) {
      return value
    },
    update() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交修改信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updFunction({
              id: this.form.id,
              functionName: this.form.functionName,
              parentFunctionName: this.form.parentFunctionName
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
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    search: kkdeboundce(function() {
      this.getList()
    }, 1000),
    refresh: kkdeboundce(function() {
      this.reload()
    }, 1000),
    delect(row) {
      this.$confirm('是否确认删除该功能?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFunction({ id: row.id }).then(res => {
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
    getList() {
      this.listLoading = true
      selectFunction({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        functionName: this.functionName,
        parentFunctionName: this.parentFunctionName
      }}).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectFunctionNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        functionName: this.functionName,
        parentFunctionName: this.parentFunctionName
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
