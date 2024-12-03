<template>
  <div>
    <el-row>
      <el-col :span="10">
        <div class="btngroups">
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">新增库区</el-button>
            <!-- <el-button size="mini" type="primary" icon="el-icon-plus">导入</el-button>
            <el-button size="mini" type="primary" icon="el-icon-download">导出</el-button> -->
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="search">
          <el-select v-model="warehouseName" size="mini" clearable placeholder="请选择所属仓库" @focus="func">
            <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
          </el-select>
          <el-select
            v-model="areaName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入库区名称"
            :remote-method="funcLL"
            clearable
            size="mini"
          >
            <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
          </el-select>
          <el-select v-model="areaType" clearable size="mini" placeholder="请选择库区类型">
            <el-option v-for="item in options" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
          </el-select>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="库区数据" :visible.sync="dialogFormVisible" class="showAll_dialog2">
      <el-form ref="form" :rules="rules" :model="form" size="mini">
        <el-form-item v-if="false" label="id" prop="id">
          <el-input v-model="form.id" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="仓库id" prop="warehouseId">
          <el-input v-model="form.warehouseId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属仓库" :label-width="formLabelWidth" prop="warehouseName">
              <el-select v-model="form.warehouseName" size="mini" @focus="func" @change="changeWarehouseOptions">
                <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库区名称" :label-width="formLabelWidth" prop="areaName">
              <el-input v-model="form.areaName" autocomplete="off" placeholder="请输入库区名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="库区类型" :label-width="formLabelWidth" prop="areaType">
              <el-select v-model="form.areaType" size="mini">
                <el-option v-for="item in options" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库区代码" :label-width="formLabelWidth" prop="areaCode">
              <el-input
                v-model="form.areaCode"
                autocomplete="off"
                placeholder="请输入库区代码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            autosize
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
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
        <el-table-column label="所属仓库" align="center" prop="warehouseName">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.warehouseName" size="mini" />
            </span>
            <span v-else>{{ scope.row.warehouseName }}</span>
          </template> -->
        </el-table-column>
        <el-table-column v-if="false" label="所属仓库编号" align="center" prop="warehouseId">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.warehouseId" size="mini" />
            </span>
            <span v-else>{{ scope.row.warehouseId }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="库区名称" align="center" prop="areaName">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.areaName" size="mini" />
            </span>
            <span v-else>{{ scope.row.areaName }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="库区类型" align="center" prop="areaType" :formatter="stateFormat" />
        <el-table-column label="库区代码" align="center" prop="areaCode">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.areaCode" size="mini" />
            </span>
            <span v-else>{{ scope.row.areaCode }}</span>
          </template> -->
        </el-table-column>
        <el-table-column v-if="false" label="是否可卖" align="center" prop="isSold">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.isSold" size="mini" />
            </span>
            <span v-else>{{ scope.row.isSold }}</span>
          </template> -->
        </el-table-column>
        <el-table-column v-if="false" label="是否启用" align="center" prop="isUsable">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.isUsable" size="mini" />
            </span>
            <span v-else>{{ scope.row.isUsable }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.remark" size="mini" />
            </span>
            <span v-else>{{ scope.row.remark }}</span>
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { kkdeboundce } from '@/utils/kkdebounce'
import { selectAreaNum, selectArea, delArea, addArea, updArea } from '@/api/user'
import { searchsystemid, searchallwarehouse } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      // 总数
      dialogFormVisible: false,
      formLabelWidth: '120px',
      show: false,
      areaOptions: [],
      loclist: [],
      states: [],
      form: {
        id: null,
        warehouseName: null,
        warehouseId: null,
        areaName: null,
        areaType: null,
        areaCode: null,
        remark: null
      },
      rules: {
        warehouseName: [{ required: true, message: '请选择仓库', trigger: 'change' }],
        areaName: [{ required: true, message: '请输入库区名称', trigger: 'change' }],
        areaCode: [{ required: true, message: '请输入库区代码', trigger: 'change' },
          { pattern: /^[a-zA-Z]{2}$/, trigger: 'change', message: '请填写两位字母作为库区代码，区分大小写' }],
        areaType: [{ required: true, message: '请选择库区类型', trigger: 'change' }]
      },
      areaCode: null,
      areaName: null,
      areaType: null,
      warehouseName: null,
      options: [],
      warehouseOptions: [],
      lastTime: 0,
      tableHeight: 50,
      listLoading: true,
      spanArr: [],
      laststateTime: 0,
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
    this.stateFormat()
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      // if (rowIndex % 2 === 1) {
      //   return 'd-row'
      // } else {
      //   return 'o-row'
      // }
      return 'b-row'
    },
    funcLL(query) {
      selectArea({
        pojo: {
        }
      })
        .then(res => {
          this.states = res.data
          this.loclist = this.states.map(item => {
            return { id: item.id, areaName: item.areaName }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.areaOptions = this.loclist.filter(item => {
              return item.areaName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.areaOptions = []
        }
      }, 100)
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
    changeWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.form.warehouseName)
      this.form.warehouseId = item.id
      this.form.warehouseName = item.warehouseName
    },
    func() {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        searchallwarehouse(window.sessionStorage.workGroupId).then(res => {
          this.warehouseOptions = res.data
        }
        )
        this.lastTime = now
      } else {
        if ((now - this.lastTime) > 5000) {
          this.lastTime = now
        }
      }
    },
    edit(row) {
      this.show = true
      this.dialogFormVisible = true
      this.form = Object.assign({}, row)
    },
    stateFormat(row) {
      if (this.tableData.length === 0) {
        searchsystemid('AREA_TYPE').then(res => {
          this.options = res.data
        })
      } else {
        const now = new Date().valueOf()
        if (this.laststateTime === 0) {
          searchsystemid('AREA_TYPE').then(res => {
            this.options = res.data
          })
          this.laststateTime = now
        } else {
          if ((now - this.laststateTime) > 5000) {
            this.laststateTime = now
          }
        }
        return changeAll(row.areaType, this.options)
      }
    },
    search: kkdeboundce(function() {
      this.getList()
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
          if (item.warehouseName === this.tableData[index - 1].warehouseName) {
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
    refresh: kkdeboundce(function() {
      this.reload()
    }, 1000),
    update() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认保存修改信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updArea({
              id: this.form.id,
              // companyId: this.uform.companyId,
              warehouseId: this.form.warehouseId,
              warehouseName: this.form.warehouseName,
              areaName: this.form.areaName,
              areaType: this.form.areaType,
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
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认保存信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addArea({
              warehouseId: this.form.warehouseId,
              warehouseName: this.form.warehouseName,
              areaName: this.form.areaName,
              areaType: this.form.areaType,
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
    // 单个删除
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delArea({ id: row.id }).then(res => {
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
    getList() {
      this.listLoading = true
      selectArea({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        areaCode: this.areaCode,
        areaName: this.areaName,
        areaType: this.areaType,
        warehouseName: this.warehouseName
      }}).then(response => {
        this.tableData = response.data
        this.flitterData()
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectAreaNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        areaCode: this.areaCode,
        areaName: this.areaName,
        areaType: this.areaType,
        warehouseName: this.warehouseName
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
.el-table .b-row{
  background: #262626;
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
