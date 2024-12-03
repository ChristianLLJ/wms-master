<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="btngroups">
          <el-button-group>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
            <!-- <el-button size="mini" type="primary" icon="el-icon-delete" @click="delectAll">批量删除</el-button> -->
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="search">
          <el-select v-model="warehouseName" size="mini" clearable placeholder="请选择所属仓库" @focus="func">
            <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
          </el-select>
          <el-select v-model="areaName" size="mini" clearable placeholder="请选择库区" @focus="funcArea">
            <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
          </el-select>
          <el-select
            v-model="deviceName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入设备名称"
            :remote-method="funcLL"
            size="mini"
          >
            <el-option v-for="item in deviceOptions" :key="item.id" :label="item.deviceName" :value="item.deviceName" />
          </el-select>
          <el-select v-model="deviceType" size="mini" clearable placeholder="请选择设备类型">
            <el-option v-for="item in options" :key="item.id" :label="item.codeDetailName" :value="item.typeNumber" />
          </el-select>
          <el-button-group>
            <el-button type="warning" icon="el-icon-circle-close" size="mini" @click="clear()">清空</el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search()">搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="设备信息" :visible.sync="dialogFormVisible" class="showAll_dialog2">
      <el-form ref="form" :rules="rules" :model="form" size="mini" label-width="120px">
        <el-form-item v-if="false" prop="id">
          <el-input v-model="form.id" size="mini" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="仓库id" prop="warehouseId">
          <el-input v-model="form.warehouseId" size="mini" clearable />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属仓库" prop="warehouseName">
              <el-select v-model="form.warehouseName" size="mini" @focus="func" @change="changeWarehouseOptions">
                <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="areaName" label="所属库区">
              <el-select v-model="form.areaName" placeholder="请选择库区" @focus="funcArea" @change="changeAreaOptions">
                <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="false" label="库区代码" prop="areaCode">
          <el-input v-model="form.areaCode" size="mini" clearable />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="form.deviceName" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备代码" prop="deviceCode">
              <el-input v-model="form.deviceCode" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="设备类型" prop="deviceType">
              <el-select v-model="form.deviceType" size="mini">
                <el-option v-for="item in options" :key="item.id" :label="item.codeDetailName" :value="item.typeNumber" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产效率(箱/h)" prop="velocity">
              <el-input v-model="form.velocity" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" placeholder="请输入" clearable />
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
      <el-table-column label="所属仓库" align="center" prop="warehouseName" />
      <el-table-column label="所属库区" align="center" prop="areaName" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="设备类型" align="center" prop="deviceType" :formatter="stateFormat" />
      <el-table-column label="设备代码" align="center" prop="deviceCode" />
      <el-table-column label="生产效率" align="center" prop="velocity" />
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
      <el-table-column v-if="false" label="是否启用" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.show">
            <el-input v-model="scope.row.isUsable" size="mini" /></span>
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
import { selectDevice, selectDeviceNum, delDevice, addDevice, selectArea, updDevice } from '@/api/user'
import { searchsystemid, searchallwarehouse } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      // 总数
      areaName: null,
      warehouseName: null,
      deviceType: null,
      deviceName: null,
      deviceOptions: [],
      loclist: [],
      states: [],
      dialogFormVisible: false,
      formLabelWidth: '160px',
      show: false,
      advanced: false,
      listLoading: true,
      total: 0,
      options: [],
      areaOptions: [],
      warehouseOptions: [],
      lastTime: 0,
      lastAreaTime: 0,
      laststateTime: 0,
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
        areaName: [{ required: true, message: '请选择库区', trigger: 'change' }],
        deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        deviceCode: [{ required: true, message: '请输入设备代码', trigger: 'blur' }],
        deviceType: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        velocity: [{ required: true, message: '请填写生产效率', trigger: 'blur' }]
      },
      spanArr: [],
      spanArr1: [],
      form: {
        id: null,
        warehouseName: null,
        areaCode: null,
        warehouseId: null,
        areaName: null,
        deviceName: null,
        deviceCode: null,
        velocity: null,
        deviceType: null
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
    tableRowClassName({ row, rowIndex }) {
      // if (rowIndex % 2 === 1) {
      //   return 'd-row'
      // } else {
      //   return 'o-row'
      // }
      return 'b-row'
    },
    funcLL(query) {
      selectDevice({
        pojo: {
        }
      })
        .then(res => {
          this.states = res.data
          this.loclist = this.states.map(item => {
            return { id: item.id, deviceName: item.deviceName }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.deviceOptions = this.loclist.filter(item => {
              return item.deviceName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.deviceOptions = []
        }
      }, 100)
    },
    funcArea() {
      if (!this.form.warehouseName) {
        this.$message.error('请先选择仓库！')
      } else {
        selectArea({ pojo: {
          warehouseId: this.form.warehouseId
        }}).then(res => {
          this.areaOptions = res.data
        }
        )
      }
    },
    changeAreaOptions() {
      const item = this.areaOptions.find(item1 => item1.areaName === this.form.areaName)
      this.form.areaName = item.areaName
      this.form.areaCode = item.areaCode
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
    stateFormat(row) {
      if (this.tableData.length === 0) {
        searchsystemid('DEVICE_TYPE').then(res => {
          this.options = res.data
        })
      } else {
        const now = new Date().valueOf()
        if (this.laststateTime === 0) {
          searchsystemid('DEVICE_TYPE').then(res => {
            this.options = res.data
          })
          this.laststateTime = now
        } else {
          if ((now - this.laststateTime) > 5000) {
            this.laststateTime = now
          }
        }
        return changeAll(row.deviceType, this.options)
      }
    },
    clear: kkdeboundce(function() {
      this.areaName = null
      this.warehouseName = null
      this.deviceType = null
      this.deviceName = null
    }),
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
      if (columnIndex === 2) {
        if (this.spanArr1[rowIndex]) {
          return {
            rowspan: this.spanArr1[rowIndex],
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
      let contactDot1 = 0
      const spanArr = []
      const spanArr1 = []
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1)
          spanArr1.push(1)
        } else {
          if (item.warehouseName === this.tableData[index - 1].warehouseName) {
            spanArr[contactDot] += 1
            spanArr.push(0)
          } else {
            contactDot = index
            spanArr.push(1)
          }
          if (item.areaName === this.tableData[index - 1].areaName) {
            spanArr1[contactDot1] += 1
            spanArr1.push(0)
          } else {
            contactDot1 = index
            spanArr1.push(1)
          }
        }
      })
      this.spanArr = spanArr
      this.spanArr1 = spanArr1
    },
    // 单个删除
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDevice({ id: row.id }).then(res => {
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存填写信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addDevice({
              warehouseName: this.form.warehouseName,
              warehouseId: this.form.warehouseId,
              areaName: this.form.areaName,
              areaCode: this.form.areaCode,
              deviceCode: this.form.deviceCode,
              deviceName: this.form.deviceName,
              velocity: this.form.velocity,
              deviceType: this.form.deviceType
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
            updDevice({
              id: this.form.id,
              warehouseName: this.form.warehouseName,
              warehouseId: this.form.warehouseId,
              areaName: this.form.areaName,
              deviceCode: this.form.deviceCode,
              areaCode: this.form.areaCode,
              deviceName: this.form.deviceName,
              deviceType: this.form.deviceType,
              velocity: this.form.velocity
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
      // selectDevice({ searchDTO: {
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
      selectDevice({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        areaName: this.areaName,
        deviceName: this.deviceName,
        warehouseName: this.warehouseName,
        deviceType: this.deviceType
      }}).then(response => {
        this.tableData = response.data
        this.flitterData()
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectDeviceNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        areaName: this.areaName,
        deviceName: this.deviceName,
        warehouseName: this.warehouseName,
        deviceType: this.deviceType
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

