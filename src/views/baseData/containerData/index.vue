<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="btngroups">
          <el-button-group>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新建</el-button>
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="search">
          <el-select
            v-model="name"
            filterable
            remote
            reserve-keyword
            placeholder="请输入包装名称"
            :remote-method="funcLL"
            clearable
            size="mini"
          >
            <el-option v-for="item in containOptions" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
          <el-select v-model="type" size="mini" placeholder="请选择包装类型">
            <el-option v-for="item in toptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
          </el-select>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-dialog v-drag title="包装信息" :visible.sync="dialogFormVisible" class="showAll_dialog2">
      <el-form ref="form" :rules="rules" :inline="true" :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="包装名称" :label-width="formLabelWidth" prop="name">
              <el-input v-model="form.name" size="mini" placeholder="请填写" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包装类型" :label-width="formLabelWidth" prop="type">
              <el-select v-model="form.type" size="mini" placeholder="请选择包装类型">
                <el-option v-for="item in toptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="包装代码" :label-width="formLabelWidth" prop="code">
              <el-input v-model="form.code" size="mini" placeholder="请输入" clearable />
            </el-form-item> -->
          </el-col>
        </el-row>
        <el-form-item v-if="false">
          <el-input v-model="form.id" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最小计量数量" :label-width="formLabelWidth">
              <el-input v-model="form.minNum" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小计量单位" :label-width="formLabelWidth">
              <el-select v-model="form.minUnit" size="mini" placeholder="请选择">
                <el-option v-for="item in unitoptions" :key="item.value" :label="item.label" :value="item.label" />
              </el-select>
              <!-- <el-input v-model="form.minUnit" size="mini" placeholder="请输入" clearable /> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="包装高度(m)" :label-width="formLabelWidth" prop="highth">
              <el-input v-model="form.highth" onkeyup="value=value.replace(/[^0-9.]/g,'')" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包装宽度(m)" :label-width="formLabelWidth" prop="width">
              <el-input v-model="form.width" onkeyup="value=value.replace(/[^0-9.]/g,'')" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="包装长度(m)" :label-width="formLabelWidth" prop="length">
              <el-input v-model="form.length" onkeyup="value=value.replace(/[^0-9.]/g,'')" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包装容量" :label-width="formLabelWidth">
              <el-input v-model="form.innerNum" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="包装体积(L)" :label-width="formLabelWidth" prop="volumn">
              <el-input v-model="form.volumn" onkeyup="value=value.replace(/[^0-9.]/g,'')" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包装重量(kg)" :label-width="formLabelWidth" prop="weight">
              <el-input v-model="form.weight" oninput="value=value.replace(/[^0-9.]/g,'')" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
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
      <el-table-column label="包装名称" align="center" :show-overflow-tooltip="true" prop="name" />
      <el-table-column label="包装代码" align="center" :show-overflow-tooltip="true" prop="code" />
      <el-table-column label="包装类型" align="center" :show-overflow-tooltip="true" prop="type" :formatter="typeFormat" />
      <el-table-column label="最小计量数量" align="center" :show-overflow-tooltip="true" prop="minNum" />
      <el-table-column label="最小计量单位" align="center" :show-overflow-tooltip="true" prop="minUnit" />
      <el-table-column label="包装容量" align="center" :show-overflow-tooltip="true" prop="innerNum" />
      <el-table-column label="包装长度(m)" align="center" :show-overflow-tooltip="true" prop="length" />
      <el-table-column label="包装宽度(m)" align="center" :show-overflow-tooltip="true" prop="width" />
      <el-table-column label="包装高度(m)" align="center" :show-overflow-tooltip="true" prop="highth" />
      <el-table-column label="包装体积(L)" align="center" :show-overflow-tooltip="true" prop="volumn" />
      <el-table-column label="包装重量(kg)" align="center" :show-overflow-tooltip="true" prop="weight" />
      <el-table-column v-if="false" label="创建人" align="center" :show-overflow-tooltip="true" prop="addPersonName" />
      <el-table-column v-if="false" label="审核人" align="center" :show-overflow-tooltip="true" prop="checkPersonName" />
      <el-table-column
        v-if="false"
        prop="isUsable"
        label="是否使用"
        align="center"
        :formatter="useFormat"
      />
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
  </div>
</template>

<script>
import { kkdeboundce } from '@/utils/kkdebounce'
import { addContainer, updateContainer, screenContainer, screenContainerSum, deleteContainer } from '@/api/user'
import Pagination from '@/components/Pagination'
import { searchsystemid } from '@/utils/search'
import { changeAll } from '@/utils/statechange'

export default {
  components: { Pagination },
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      // 总数
      dialogFormVisible: false,
      formLabelWidth: '120px',
      type: null,
      show: false,
      containOptions: null,
      loclist: [],
      states: [],
      tableHeight: 50,
      name: null,
      rules: {
        name: [{ required: true, message: '请填写包装名称', trigger: 'change' }],
        code: [{ required: true, message: '请填写包装代码', trigger: 'change' }],
        type: [{ required: true, message: '请选择包装类型', trigger: 'change' }],
        // volumn: [{ required: true, message: '请填写包装体积', trigger: 'change' }],
        // weight: [{ required: true, message: '请填写包装重量', trigger: 'change' }],
        width: [{ required: true, message: '请填写包装宽度', trigger: 'change' }],
        highth: [{ required: true, message: '请填写包装高度', trigger: 'change' }],
        length: [{ required: true, message: '请填写包装长度', trigger: 'change' }]
      },
      form: {
        id: null,
        name: null,
        code: null,
        minNum: null,
        minUnit: null,
        type: null,
        innerNum: null,
        volumn: null,
        weight: null,
        length: null,
        width: null,
        highth: null
      },
      listLoading: true,
      toptions: [],
      unitoptions: [{
        value: 1,
        label: '件'
      },
      {
        value: 2,
        label: '个'
      }],
      lasttypeTime: 0,
      total: 0,
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      tableData: [
      ]
    }
  },
  created() {
    this.getList()
    this.typeFormat()
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
    useFormat(row) {
      if (row.isUsable === 0) {
        return '否'
      } else if (row.isUsable === 1) {
        return '是'
      }
    },
    typeFormat(row) {
      if (this.toptions.length === 0) {
        searchsystemid('CONTAINER_TYPE').then(res => {
          this.toptions = res.data
        })
      } else {
        const now = new Date().valueOf()
        if (this.lasttypeTime === 0) {
          searchsystemid('CONTAINER_TYPE').then(res => {
            this.toptions = res.data
          })
          this.lasttypeTime = now
        } else {
          if ((now - this.lasttypeTime) > 5000) {
            this.lasttypeTime = now
          }
        }
        return changeAll(row.type, this.toptions)
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
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
    funcLL(query) {
      screenContainer({
        searchDTO: {
          num: 100000,
          page: 1
        },
        pojo: {
        }
      })
        .then(res => {
          this.states = res.data
          this.loclist = this.states.map(item => {
            return { id: item.id, name: item.name }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.containOptions = this.loclist.filter(item => {
              return item.name.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.containOptions = []
        }
      }, 100)
    },
    edit(row) {
      this.show = true
      this.dialogFormVisible = true
      this.form = Object.assign({}, row)
    },
    update() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('此操作提交所填信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updateContainer({
              id: this.form.id,
              name: this.form.name,
              code: this.form.code,
              minNum: this.form.minNum,
              type: this.form.type,
              minUnit: this.form.minUnit,
              innerNum: this.form.innerNum,
              volumn: this.form.volumn,
              weight: this.form.weight,
              length: this.form.length,
              width: this.form.width,
              highth: this.form.highth
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
          this.$confirm('此操作提交所填信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addContainer({
              name: this.form.name,
              code: this.form.code,
              minNum: this.form.minNum,
              type: this.form.type,
              minUnit: this.form.minUnit,
              innerNum: this.form.innerNum,
              volumn: this.form.volumn,
              weight: this.form.weight,
              length: this.form.length,
              width: this.form.width,
              highth: this.form.highth
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('提交成功')
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
    search: kkdeboundce(function() {
      this.getList()
    }, 1000),
    refresh: kkdeboundce(function() {
      this.reload()
    }, 1000),
    // 单个删除
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteContainer({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getList()
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
      screenContainer({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        name: this.name
      }}).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenContainerSum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        name: this.name
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
  .btngroups {
    margin: 1px;
  }
  </style>
<style lang="scss" scoped>
// 修改对话框高度
.show_card {
      background-color:#262626;
    }
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
