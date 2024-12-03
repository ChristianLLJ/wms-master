<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="btngroups">
          <el-button-group>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
            <!-- <el-button size="mini" type="primary" icon="el-icon-download">导出</el-button> -->
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="search">
          <el-select v-model="warehouseName" size="mini" clearable placeholder="请选择所属仓库" @focus="func">
            <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
          </el-select>
          <el-select v-model="carType" size="mini" clearable placeholder="请选择车辆类型">
            <el-option v-for="item in options" :key="item.id" :label="item.codeDetailName" :value="item.typeNumber" />
          </el-select>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search()">搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="车辆信息" :visible.sync="dialogFormVisible" class="showAll_dialog2">
      <el-form ref="form" :rules="rules" :model="form" size="mini" :inline="true" label-width="120px">
        <el-form-item v-if="false" prop="id">
          <el-input v-model="form.id" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item v-if="false" prop="warehouseId">
          <el-input v-model="form.warehouseId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="所属仓库" prop="warehouseName">
          <el-select v-model="form.warehouseName" size="mini" @focus="func" @change="changeWarehouseOptions">
            <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
          </el-select>
        </el-form-item>
        <el-form-item label="车辆品牌" prop="carBrand">
          <el-input v-model="form.carBrand" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="form.carNumber" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="车辆类型" prop="carType">
          <el-select v-model="form.carType" size="mini">
            <el-option v-for="item in options" :key="item.id" :label="item.codeDetailName" :value="item.typeNumber" />
          </el-select>
        </el-form-item>
        <el-form-item label="质量容量(kg)" prop="weightCapacity">
          <el-input v-model="form.weightCapacity" oninput="“value=value.replace(/[^0-9.]/g,'')”" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="体积容量(L)" prop="volumnCapacity">
          <el-input v-model="form.volumnCapacity" oninput="“value=value.replace(/[^0-9.]/g,'')”" size="mini" style="width: 160px;" placeholder="请输入" clearable />
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
      :header-cell-style="{background:'#000',color: '#fff'}"
      :span-method="objectSpanMethod"
      :row-class-name="tableRowClassName"
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
      <el-table-column label="所属仓库名称" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
      <el-table-column label="车辆品牌" align="center" :show-overflow-tooltip="true" prop="carBrand" />
      <el-table-column label="车牌号" align="center" :show-overflow-tooltip="true" prop="carNumber" />
      <el-table-column label="路线" align="center" width="300px" :show-overflow-tooltip="true" prop="routeLine" />
      <el-table-column label="车辆型号" align="center" :show-overflow-tooltip="true" prop="carType" :formatter="stateFormat" />
      <el-table-column label="质量容量(kg)" align="center" :show-overflow-tooltip="true" prop="weightCapacity" />
      <el-table-column label="体积容量(L)" align="center" :show-overflow-tooltip="true" prop="volumnCapacity" />
      <el-table-column v-if="false" label="创建日期" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.show">
            <el-date-picker
              v-model="scope.row.createTime"
              type="date"
              size="mini"
            />
          </span>
          <span v-else>{{ scope.row.createTime| dateYMDHMSFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="是否启用" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.show">
            <el-input v-model="scope.row.isUsable" size="mini" />
          </span>
          <span v-else>{{ scope.row.isUsable }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
          prop="isUsable"
          label="是否启用"
          align="center"
        /> -->
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
import { kkdeboundce } from '@/utils/kkdebounce'
import { selectCar, selectCarNum, delCar, addCar, updCar } from '@/api/user'
import { searchsystemid, searchallwarehouse } from '@/utils/search'
import { changeAll } from '@/utils/statechange'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      // 总数
      warehouseName: null,
      carType: null,
      dialogFormVisible: false,
      formLabelWidth: '160px',
      warehouseOptions: [],
      options: [],
      show: false,
      lastTime: 0,
      laststateTime: 0,
      advanced: false,
      listLoading: true,
      total: 0,
      tableHeight: 50,
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      rules: {
        warehouseName: [{ required: true, message: '请选择仓库', trigger: 'change' }],
        weightCapacity: [{ required: true, message: '请填写质量容量', trigger: 'blur' }],
        volumnCapacity: [{ required: true, message: '请填写体积容量', trigger: 'blur' }]
      },
      spanArr: [],
      form: {
        id: null,
        warehouseId: null,
        warehouseName: null,
        carBrand: null,
        carNumber: null,
        carType: null,
        weightCapacity: null,
        volumnCapacity: null
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
    stateFormat(row) {
      if (this.tableData.length === 0) {
        searchsystemid('CAR_TYPE').then(res => {
          this.options = res.data
        })
      } else {
        const now = new Date().valueOf()
        if (this.laststateTime === 0) {
          searchsystemid('CAR_TYPE').then(res => {
            this.options = res.data
          })
          this.laststateTime = now
        } else {
          if ((now - this.laststateTime) > 5000) {
            this.laststateTime = now
          }
        }
        return changeAll(row.carType, this.options)
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
    tableRowClassName({ row, rowIndex }) {
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
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存填写信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addCar({
              warehouseName: this.form.warehouseName,
              warehouseId: this.form.warehouseId,
              carBrand: this.form.carBrand,
              carNumber: this.form.carNumber,
              carType: this.form.carType,
              weightCapacity: this.form.weightCapacity,
              volumnCapacity: this.form.volumnCapacity
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
      this.$confirm('确定删除该条信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCar({ id: row.id }).then(res => {
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
          this.$confirm('确定保存修改信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updCar({
              id: this.form.id,
              warehouseName: this.form.warehouseName,
              warehouseId: this.form.warehouseId,
              carBrand: this.form.carBrand,
              carNumber: this.form.carNumber,
              carType: this.form.carType,
              weightCapacity: this.form.weightCapacity,
              volumnCapacity: this.form.volumnCapacity
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
    edit(row) {
      this.show = true
      this.dialogFormVisible = true
      // selectCar({ searchDTO: {
      //   page: this.listQuery.page,
      //   num: this.listQuery.limit
      // },
      // pojo: {
      //   id: row.id
      // }}).then(
      this.form = Object.assign({}, row)
      // )
    },
    getList() {
      this.listLoading = true
      selectCar({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        carType: this.carType,
        warehouseName: this.warehouseName
      }}).then(response => {
        this.tableData = response.data
        this.flitterData()
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectCarNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        carType: this.carType,
        warehouseName: this.warehouseName
      }}).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    }
    // 选
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
