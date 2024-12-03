<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="btngroups">
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">新增公司</el-button>
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="search">
          <el-input v-model="companyName" size="mini" style="width: 160px;" placeholder="请输入公司名称" clearable />
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="公司信息" :visible.sync="dialogFormVisible" class="showAll_dialog2">
      <el-form ref="form" :rules="rules" :inline="true" class="demo-form-inline" :model="form">
        <el-form-item v-if="false" label="id" :label-width="formLabelWidth" prop="id">
          <el-input v-model="form.id" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="公司名称" :label-width="formLabelWidth" prop="companyName">
          <el-input v-model="form.companyName" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
          <el-input v-model="form.companyAddress" size="mini" style="width: 300px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" size="mini" style="width: 200px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="邮编" :label-width="formLabelWidth" prop="post">
          <el-input v-model="form.post" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="官网" :label-width="formLabelWidth" prop="website">
          <el-input v-model="form.website" size="mini" style="width: 200px;" placeholder="请输入" clearable />
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
      border
      :row-key="getRowKeys"
      :row-class-name="tableRowClassName"
      :header-cell-style="{background:'#000',color: '#fff'}"
      tooltip-effect="dark"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      size="mini"
      style="width: 100%, font-size: 10px"
    >
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
      <el-table-column label="公司名称" align="center" :show-overflow-tooltip="true" prop="companyName" />
      <el-table-column label="地址" align="center" :show-overflow-tooltip="true" prop="companyAddress" />
      <el-table-column label="邮编" align="center" :show-overflow-tooltip="true" prop="post" />
      <el-table-column label="电话" align="center" :show-overflow-tooltip="true" prop="phone" />
      <el-table-column label="邮箱" align="center" :show-overflow-tooltip="true" prop="email" />
      <el-table-column label="官网" align="center" :show-overflow-tooltip="true" prop="website" />
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
import { selectCompanyNum, selectCompany, delCompany, addCompany, updCompany } from '@/api/user'

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
        companyAddress: null,
        post: null,
        phone: null,
        email: null,
        website: null
      },
      rules: {
        phone: [{ pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: ['blur', 'change'] }],
        post: [{ pattern: /^[1-9][0-9]{5}$/, message: '请输入正确的邮编格式', trigger: ['blur', 'change'] }],
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        email: [{ pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/, message: '请输入正确的邮箱格式', trigger: 'change' }]
      },
      show: false,
      companyName: null,
      listLoading: true,
      total: 0,
      tableHeight: 50,
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
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    getList() {
      this.listLoading = true
      selectCompany({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        companyName: this.companyName
      }}).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectCompanyNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        companyName: this.companyName
      }}).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    edit(row) {
      this.show = true
      this.dialogFormVisible = true
      selectCompany({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        id: row.id
      }}).then(
        this.form = Object.assign({}, row)
      )
    },
    search: kkdeboundce(function() {
      this.getList()
    }, 1000),
    refresh: kkdeboundce(function() {
      this.reload()
    }, 1000),
    update() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交修改信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updCompany({
              id: this.form.id,
              companyName: this.form.companyName,
              companyAddress: this.form.companyAddress,
              post: this.form.post,
              phone: this.form.phone,
              email: this.form.email,
              website: this.form.website
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
            addCompany({
              companyName: this.form.companyName,
              companyAddress: this.form.companyAddress,
              post: this.form.post,
              phone: this.form.phone,
              email: this.form.email,
              website: this.form.website
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
      this.$confirm('确认删除该公司信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCompany({ id: row.id }).then(res => {
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
        companyAddress: null,
        post: null,
        phone: null,
        email: null,
        website: null
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
