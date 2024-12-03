<template>
  <div>
    <el-row>
      <el-col :span="6">
        <div class="btngroups">
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">新增工作组</el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-refresh"
              @click="refresh"
            >刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="search">
          <el-input
            v-model="groupName"
            size="mini"
            style="width: 160px"
            placeholder="请输入工作组名称"
            clearable
          />
          <el-button-group>
            <el-button
              icon="el-icon-search"
              type="primary"
              size="mini"
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
        <el-form-item label="工作组名称" :label-width="formLabelWidth" prop="groupName">
          <el-input v-model="form.groupName" autocomplete="off" placeholder="请输入工作组名称" />
        </el-form-item>
        <!-- <el-form-item label="工作组代码" :label-width="formLabelWidth">
          <el-input v-model="form.groupCode" autocomplete="off" placeholder="请输入工作组代码" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!show" type="primary" @click="submit">保存</el-button>
        <el-button v-if="show" type="primary" @click="update">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="分配仓库"
      :visible.sync="dialogWarehouseVisible"
      width="50%"
      class="showAll_dialog2"
    >
      <ComboGrid
        v-model="warehousesId"
        value-field="id"
        style="{width: 300px}"
        text-field="warehouseName"
        :multiple="true"
        :data="warehouseTable"
        :panel-style="{width:'600px'}"
        :text-formatter="wformatText"
      >
        <DataGrid slot="grid" :border="false">
          <GridColumn v-if="false" field="id" title="序号" />
          <GridColumn field="warehouseName" title="仓库" />
          <GridColumn field="address" title="地址" />
          <GridColumn field="charger" title="联系人" align="right" />
        </DataGrid>
      </ComboGrid>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmWare()">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配员工"
      :visible.sync="dialogStaVisible"
      width="50%"
      class="showAll_dialog2"
    >
      <ComboGrid
        v-model="staffIds"
        value-field="id"
        style="{width: 300px}"
        text-field="staffName"
        :multiple="true"
        :data="staffTable"
        :panel-style="{width:'600px'}"
        :text-formatter="formatText"
      >
        <DataGrid slot="grid" :border="false">
          <GridColumn v-if="false" field="id" title="序号" />
          <GridColumn field="staffName" title="员工姓名" />
          <GridColumn field="companyName" title="所属公司" />
          <GridColumn field="departmentName" title="所属部门" align="right" />
        </DataGrid>
      </ComboGrid>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmStaff()">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配功能"
      :visible.sync="allocDialogVisible"
      width="50%"
      class="showAll_dialog2"
    >
      <div class="treeDialog">
        <ComboTree
          v-model="functionsId"
          style="width:300px"
          :data="data"
          :multiple="true"
          :text-formatter="fucformatText"
        >
          <Tree slot="tree" />
        </ComboTree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleAllocDialogConfirm">保存</el-button>
      </span>
    </el-dialog>
    <el-table
      ref="tableData"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :header-cell-style="{background:'#000',color: '#fff'}"
      :data="tableData"
      border
      :height="tableHeight"
      :row-style="{ height: '20px' }"
      :cell-style="{ padding: '0px' }"
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
      <el-table-column label="工作组名称" align="center" prop="groupName">
        <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.groupName" size="mini" />
            </span>
            <span v-else>{{ scope.row.groupName }}</span>
          </template> -->
      </el-table-column>
      <el-table-column v-if="false" label="工作组代码" align="center" prop="groupCode">
        <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.groupCode" size="mini" />
            </span>
            <span v-else>{{ scope.row.groupCode }}</span>
          </template> -->
      </el-table-column>
      <el-table-column v-if="false" label="创建日期" align="center" :show-overflow-tooltip="true" prop="createTime">
        <template slot-scope="scope">
          <span v-if="scope.row.show">
            <el-date-picker
              v-model="scope.row.createTime"
              style="width:150px"
              type="date"
              size="mini"
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
            <el-button
              size="mini"
              type="primary"
              @click="addSta(scope.row)"
            >添加员工
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="addWare(scope.row)"
            >分配仓库
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleSelectRole(scope.row)"
            >分配功能
            </el-button>
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="delect(scope.row)">注销</el-button>
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
import { selectWorkGroup, selectWorkGroupNum, delWorkgroup, addWorkGroup, addFunctionToWorkGroup, updWorkGroup, selectStaff, selectFunction, addWarehouseToWorkGroup, addStaffToWorkGroup, selectWarehouse } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      allocDialogVisible: false, // 关闭弹框
      dialogFormVisible: false,
      dialogStaVisible: false,
      dialogWarehouseVisible: false,
      show: false,
      formLabelWidth: '120px',
      functionsId: [],
      listLoading: true,
      groupName: null,
      total: 0,
      staffIds: [],
      warehousesId: [],
      warehouseTable: [],
      staffTable: [],
      list: [],
      rules: {
        groupName: [{ required: true, message: '请输入工作组名称', trigger: 'blur' }]
      },
      form: {
        id: null,
        groupName: null
        // groupCode: null
      },
      tableHeight: 50,
      sendId: null,
      listQuery: {
        page: 1,
        limit: 20
      },
      data: [],
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
    addSta(row) {
      this.sendId = row.id
      this.dialogStaVisible = true
      selectStaff({ searchDTO: {
        page: 1,
        num: 1000
      },
      pojo: {
      }}).then(response => {
        this.staffTable = response.data
      })
    },
    addWare(row) {
      this.sendId = row.id
      this.dialogWarehouseVisible = true
      selectWarehouse({ searchDTO: {
        page: 1,
        num: 1000
      },
      pojo: {
      }}).then(response => {
        this.warehouseTable = response.data
      })
    },
    confirmStaff() {
      this.$confirm('确认保存信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addStaffToWorkGroup({
          workGroupId: this.sendId,
          staffIds: this.staffIds
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
    },
    confirmWare() {
      this.$confirm('确认保存信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addWarehouseToWorkGroup({
          workGroupId: this.sendId,
          warehousesId: this.warehousesId
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
    },
    handleSelectRole(row) {
      this.allocDialogVisible = true
      this.sendId = row.id
      selectFunction({ searchDTO: {
        page: 1,
        num: 1000
      },
      pojo: {
      }}).then(response => {
        this.list = response.data
        this.data = this.list.map(item => {
          return { id: item.id, text: item.parentFunctionName }
        })
      })
    },
    formatText(value) {
      return value
    },
    wformatText(value) {
      return value
    },
    fucformatText(value) {
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
            updWorkGroup({
              id: this.form.id,
              groupName: this.form.groupName
              // groupCode: this.form.groupCode
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
            addWorkGroup({
              groupName: this.form.groupName
              // groupCode: this.form.groupCode
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
    handleAllocDialogConfirm() {
      this.$confirm('确认保存信息码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addFunctionToWorkGroup({
          workGroupId: this.sendId,
          functionsId: this.functionsId
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
    },
    delect(row) {
      this.$confirm('是否确认注销该工作组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delWorkgroup({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('注销成功')
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
    edit(row) {
      this.show = true
      this.dialogFormVisible = true
      this.form = Object.assign({}, row)
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    add() {
      this.show = false
      this.dialogFormVisible = true
      this.form = {
        id: null,
        groupName: null,
        groupCode: null
      }
    },
    getList() {
      this.listLoading = true
      selectWorkGroup({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        groupName: this.groupName
      }}).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectWorkGroupNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        groupName: this.groupName
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
  float: right;
}
.f-field {
    width: 20em;
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
