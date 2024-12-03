<template>
  <div>
    <el-row>
      <el-col :span="10">
        <div class="btngroups">
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">新增仓库</el-button>
            <!-- <el-button size="mini" type="primary" icon="el-icon-plus">导入</el-button>
            <el-button size="mini" type="primary" icon="el-icon-download">导出</el-button> -->
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="search">
          <el-select
            v-model="warehouseName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入仓库名称"
            :remote-method="funcLL"
            clearable
            size="mini"
          >
            <el-option v-for="item in wareOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
          </el-select>
          <!-- <el-input v-model="warehouseCode" size="mini" style="width: 160px;" placeholder="请输入仓库代码" clearable /> -->
          <!-- <el-input v-model="warehouseType" size="mini" style="width: 160px;" placeholder="请输入仓库类型" clearable /> -->
          <el-select v-model="warehouseType" size="mini" clearable placeholder="请选择类型">
            <el-option v-for="item in options" :key="item.id" :label="item.codeDetailName" :value="item.id" />
          </el-select>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-dialog title="仓库数据" :visible.sync="dialogFormVisible" class="showAll_dialog2">
        <el-form ref="form" :rules="rules" :model="form" size="mini">
          <!-- <el-form-item label="所属公司编号" :label-width="formLabelWidth">
            <el-input v-model="form.companyId" autocomplete="off" placeholder="请输入用户名" />
          </el-form-item> -->
          <el-form-item prop="id">
            <el-input v-if="false" v-model="form.id" autocomplete="off" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库名称" :label-width="formLabelWidth" prop="warehouseName">
                <el-input v-model="form.warehouseName" autocomplete="off" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="仓库代码" :label-width="formLabelWidth" prop="warehouseCode">
                <el-input v-model="form.warehouseCode" autocomplete="off" placeholder="请输入代码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库类型" :label-width="formLabelWidth" prop="warehouseType">
                <el-select v-model="form.warehouseType" placeholder="请选择类型">
                  <el-option v-for="item in options" :key="item.id" :label="item.codeDetailName" :value="item.typeNumber" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="仓库联系人" :label-width="formLabelWidth" prop="charger">
                <el-input v-model="form.charger" autocomplete="off" placeholder="请填写联系人" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
                <el-input v-model="form.phone" autocomplete="off" placeholder="请填写联系方式" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮政编码" :label-width="formLabelWidth" prop="post">
                <el-input v-model="form.post" autocomplete="off" placeholder="请输入邮政编码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="仓库地址" :label-width="formLabelWidth" prop="address">
            <el-input v-model="form.address" autocomplete="off" placeholder="请填写仓库地址" />
          </el-form-item>
          <!-- <el-form-item label="地址代码" :label-width="formLabelWidth">
            <el-input v-model="form.locationCode" autocomplete="off" placeholder="请输入部门" />
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button type="primary" @click="save">暂存</el-button> -->
          <el-button v-if="!show" type="primary" @click="submit">保存</el-button>
          <el-button v-if="show" type="primary" @click="update">保存</el-button>
        </div>
      </el-dialog>
      <el-card :body-style="{padding:'0px'}" shadow="always">
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
          :header-cell-style="{background:'#000',color: '#fff'}"
          :row-class-name="tableRowClassName"
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
          <!-- <el-table-column label="所属公司" align="center" :show-overflow-tooltip="true" prop="companyName">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.companyName" size="mini" />
            </span>
            <span v-else>{{ scope.row.companyName }}</span>
          </template>
        </el-table-column> -->
          <el-table-column label="仓库名称" align="center" :show-overflow-tooltip="true" prop="warehouseName">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.warehouseName" size="mini" />
            </span>
            <span v-else>{{ scope.row.warehouseName }}</span>
          </template> -->
          </el-table-column>
          <el-table-column label="仓库代码" align="center" :show-overflow-tooltip="true" prop="warehouseCode">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.warehouseCode" size="mini" />
            </span>
            <span v-else>{{ scope.row.warehouseCode }}</span>
          </template> -->
          </el-table-column>
          <el-table-column label="仓库类型" align="center" :show-overflow-tooltip="true" prop="warehouseType" :formatter="stateFormat">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.warehouseType" size="mini" />
            </span>
            <span v-else>{{ scope.row.warehouseType }}</span>
          </template> -->
          </el-table-column>
          <el-table-column label="联系人" align="center" :show-overflow-tooltip="true" prop="charger">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.charger" size="mini" />
            </span>
            <span v-else>{{ scope.row.charger }}</span>
          </template> -->
          </el-table-column>
          <el-table-column label="手机号" align="center" :show-overflow-tooltip="true" prop="phone">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.phone" size="mini" />
            </span>
            <span v-else>{{ scope.row.phone }}</span>
          </template> -->
          </el-table-column>
          <el-table-column label="地址" align="center" :show-overflow-tooltip="true" prop="address">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.address" size="mini" />
            </span>
            <span v-else>{{ scope.row.address }}</span>
          </template> -->
          </el-table-column>
          <el-table-column v-if="false" label="地址代码" align="center" :show-overflow-tooltip="true" prop="locationCode">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.locationCode" size="mini" />
            </span>
            <span v-else>{{ scope.row.locationCode }}</span>
          </template> -->
          </el-table-column>
          <el-table-column label="邮政编码" align="center" :show-overflow-tooltip="true" prop="post">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.post" size="mini" />
            </span>
            <span v-else>{{ scope.row.post }}</span>
          </template> -->
          </el-table-column>
          <el-table-column v-if="false" label="是否启用" align="center" :show-overflow-tooltip="true" prop="isUsable">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.isUsable" size="mini" />
            </span>
            <span v-else>{{ scope.row.isUsable }}</span>
          </template> -->
          </el-table-column>
          <el-table-column
            width="200px"
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
      </el-card>
    </el-row></div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { kkdeboundce } from '@/utils/kkdebounce'
import { addWarehouse, selectWarehouseNum, selectWarehouse, delWarehouse, updWarehouse } from '@/api/user'
import { searchsystemid } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
export default {
  components: { Pagination },
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      // 总数
      warehouseCode: null,
      warehouseName: null,
      warehouseType: null,
      options: [],
      show: false,
      rules: {
        warehouseName: [{ required: true, message: '请填写仓库名称', trigger: 'blur' }],
        warehouseCode: [{ required: true, message: '请填写仓库代码', trigger: 'blur' },
          { pattern: /^[a-zA-Z]{2}$/, trigger: 'change', message: '请填写两位字母作为仓库代码，区分大小写' }],
        warehouseType: [{ required: true, message: '请选择仓库类型', trigger: 'change' }],
        phone: [{ pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }],
        post: [{ pattern: /^[0-9]{6}$/, message: '请输入正确的邮编格式', trigger: 'change' }]
      },
      dialogFormVisible: false,
      dialogVisible: false,
      formLabelWidth: '120px',
      form: {
        id: null,
        companyId: null,
        warehouseCode: null,
        warehouseName: null,
        warehouseType: null,
        charger: null,
        phone: null,
        address: null,
        locationCode: null,
        post: null
      },
      tableHeight: 50,
      listLoading: true,
      laststateTime: 0,
      wareOptions: [],
      loclist: [],
      states: [],
      total: 0,
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      tableData: []
    }
  },
  created() {
    this.getList()
    this.stateFormat()
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
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    funcLL(query) {
      selectWarehouse({
        pojo: {
        }
      })
        .then(res => {
          this.states = res.data
          this.loclist = this.states.map(item => {
            return { id: item.id, warehouseName: item.warehouseName }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.wareOptions = this.loclist.filter(item => {
              return item.warehouseName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.wareOptions = []
        }
      }, 100)
    },
    search: kkdeboundce(function() {
      this.getList()
    }, 1000),
    stateFormat(row) {
      if (this.tableData.length === 0) {
        searchsystemid('WAREHOUSE_TYPE').then(res => {
          this.options = res.data
        })
      } else {
        const now = new Date().valueOf()
        if (this.laststateTime === 0) {
          searchsystemid('WAREHOUSE_TYPE').then(res => {
            this.options = res.data
          })
          this.laststateTime = now
        } else {
          if ((now - this.laststateTime) > 5000) {
            this.laststateTime = now
          }
        }
        return changeAll(row.warehouseType, this.options)
      }
    },
    add() {
      this.show = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.form = {
        }
        this.$refs.form.resetFields()
      })
    },
    edit(row) {
      this.show = true
      this.dialogFormVisible = true
      this.form = Object.assign({}, row)
    },
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delWarehouse({ id: row.id }).then(res => {
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
    refresh: kkdeboundce(function() {
      this.reload()
    }, 1000),
    getList() {
      this.listLoading = true
      selectWarehouse({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        warehouseName: this.warehouseName,
        warehouseCode: this.warehouseCode,
        warehouseType: this.warehouseType
      }}).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectWarehouseNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        warehouseName: this.warehouseName,
        warehouseCode: this.warehouseCode,
        warehouseType: this.warehouseType
      }}).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    update() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认保存信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updWarehouse({
              id: this.form.id,
              // companyId: this.uform.companyId,
              warehouseCode: this.form.warehouseCode,
              warehouseName: this.form.warehouseName,
              warehouseType: this.form.warehouseType,
              charger: this.form.charger,
              phone: this.form.phone,
              address: this.form.address,
              locationCode: this.form.locationCode,
              post: this.form.post
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
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认保存信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addWarehouse({
              // companyId: this.uform.companyId,
              warehouseCode: this.form.warehouseCode,
              warehouseName: this.form.warehouseName,
              warehouseType: this.form.warehouseType,
              charger: this.form.charger,
              phone: this.form.phone,
              address: this.form.address,
              locationCode: this.form.locationCode,
              post: this.form.post
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
      border: #fff 1px solid;
       box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
    0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);
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
