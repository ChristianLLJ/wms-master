<template>
  <div>
    <el-row>
      <el-col :span="6">
        <div class="btngroups">
          <el-button-group>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="search">
          <el-select v-model="areaName" placeholder="请选择库区" clearable size="mini" @focus="funcArea">
            <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
          </el-select>
          <el-select
            v-model="groupName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入库位组名称"
            :remote-method="funcLL"
            clearable
            size="mini"
          >
            <el-option v-for="item in groupOptions" :key="item.id" :label="item.groupName" :value="item.groupName" />
          </el-select>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="库位组数据" :visible.sync="dialogFormVisible" class="showAll_dialog2">
      <el-form ref="form" :rules="rules" :model="form" size="mini">
        <el-form-item v-if="false" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-row>
          <el-form-item prop="areaName" :label-width="formLabelWidth" label="所属库区">
            <el-select v-model="form.areaName" placeholder="请选择库区" @focus="funcArea" @change="changeAreaOptions">
              <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="库位组名称" :label-width="formLabelWidth" prop="groupName">
              <el-input v-model="form.groupName" autocomplete="off" placeholder="请输入库位组名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库位组代码" :label-width="formLabelWidth" prop="groupCode">
              <el-input v-model="form.groupCode" autocomplete="off" placeholder="请输入库位组名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="false" label="库区代码">
          <el-input v-model="form.areaCode" size="mini" clearable />
        </el-form-item>
        <el-row>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
              v-model="form.remark"
              type="textarea"
              autosize
              autocomplete="off"
            />
          </el-form-item>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="save">暂存</el-button> -->
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
      :span-method="objectSpanMethod"
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
      <el-table-column label="所属库区" align="center" prop="areaName">
        <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.areaName" size="mini" />
            </span>
            <span v-else>{{ scope.row.areaName }}</span>
          </template> -->
      </el-table-column>
      <el-table-column label="库位组名称" align="center" prop="groupName">
        <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.groupName" size="mini" />
            </span>
            <span v-else>{{ scope.row.groupName }}</span>
          </template> -->
      </el-table-column>
      <el-table-column label="库位组代码" align="center" prop="groupCode">
        <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.groupName" size="mini" />
            </span>
            <span v-else>{{ scope.row.groupName }}</span>
          </template> -->
      </el-table-column>
      <el-table-column v-if="false" label="修改人" align="center" :show-overflow-tooltip="true" prop="changerName">
        <template slot-scope="scope">
          <span v-if="scope.row.show">
            <el-input v-model="scope.row.changerName" size="mini" />
          </span>
          <span v-else>{{ scope.row.changerName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="修改日期" align="center" :show-overflow-tooltip="true" prop="changeTime">
        <template slot-scope="scope">
          <span v-if="scope.row.show">
            <el-date-picker
              v-model="scope.row.changeTime"
              type="date"
              size="mini"
            />
          </span>
          <span v-else>{{ scope.row.changeTime| dateYMDHMSFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
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
import Pagination from '@/components/Pagination'
import { selectLocationGroup, selectLocationGroupNum, delLocationGroup, addLocationGroup, selectArea, updLocation } from '@/api/user'
import { kkdeboundce } from '@/utils/kkdebounce'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      // 总数
      dialogFormVisible: false,
      formLabelWidth: '120px',
      show: false,
      areaName: null,
      groupOptions: [],
      loclist: [],
      states: [],
      lastAreaTime: 0,
      areaOptions: [],
      form: {
        id: null,
        areaName: null,
        areaCode: null,
        groupName: null,
        groupCode: null,
        remark: null
      },
      rules: {
        areaName: [{ required: true, message: '请选择库区', trigger: 'change' }],
        groupName: [{ required: true, message: '请输入库位组名称', trigger: 'blur' }],
        groupCode: [{ required: true, message: '请输入库位组代码', trigger: 'blur' }]
      },
      spanArr: [],
      groupName: null,
      tableHeight: 50,
      listLoading: true,
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
    funcLL(query) {
      selectLocationGroup({
        pojo: {
        }
      })
        .then(res => {
          this.states = res.data
          this.loclist = this.states.map(item => {
            return { id: item.id, groupName: item.groupName }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.groupOptions = this.loclist.filter(item => {
              return item.groupName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.groupOptions = []
        }
      }, 100)
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存填写信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addLocationGroup({
              // companyId: this.uform.companyId,
              groupName: this.form.groupName,
              groupCode: this.form.groupCode,
              areaName: this.form.areaName,
              areaCode: this.form.areaCode,
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
              message: '已取消保存'
            })
          })
        }
      })
    },
    funcArea() {
      const now = new Date().valueOf()
      if (this.lastAreaTime === 0) {
        selectArea({ pojo: {
        }}).then(res => {
          this.areaOptions = res.data
        }
        )
        this.lastAreaTime = now
      } else {
        if ((now - this.lastAreaTime) > 5000) {
          this.lastAreaTime = now
        }
      }
    },
    changeAreaOptions() {
      const item = this.areaOptions.find(item1 => item1.areaName === this.form.areaName)
      this.form.areaName = item.areaName
      this.form.areaCode = item.areaCode
    },
    edit(row) {
      this.show = true
      this.dialogFormVisible = true
      this.form = Object.assign({}, row)
    },
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
          if (item.areaName === this.tableData[index - 1].areaName) {
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
    tableRowClassName({ row, rowIndex }) {
      // if (rowIndex % 2 === 1) {
      //   return 'd-row'
      // } else {
      //   return 'o-row'
      // }
      return 'b-row'
    },
    search: kkdeboundce(function() {
      this.getList()
    }, 1000),
    // 单个删除
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delLocationGroup({ id: row.id }).then(res => {
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
      this.$nextTick(() => {
        this.form = {
        }
        this.$refs.form.resetFields()
      })
    },
    update() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存填写信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updLocation({
              id: this.form.id,
              // companyId: this.uform.companyId,
              groupName: this.form.groupName,
              groupCode: this.form.groupCode,
              areaName: this.form.areaName,
              areaCode: this.form.areaCode,
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
    getList() {
      this.listLoading = true
      selectLocationGroup({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        areaName: this.areaName,
        groupName: this.groupName
      }}).then(response => {
        this.tableData = response.data
        this.flitterData()
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectLocationGroupNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        areaName: this.areaName,
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
