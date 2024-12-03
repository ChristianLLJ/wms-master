<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="btngroups">
          <el-button-group>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="search">
          <el-select v-model="warehouseName" size="mini" clearable placeholder="请选择仓库" @focus="func">
            <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
          </el-select>
          <el-select v-model="areaName" size="mini" clearable placeholder="请选择库区" @focus="funcArea2">
            <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
          </el-select>
          <el-select v-model="shelfType" size="mini" clearable placeholder="请选择货架类型">
            <el-option v-for="item in options" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
          </el-select>
          <el-input v-model="name" style="width: 160px;" size="mini" placeholder="请输入货架名称" clearable />
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search()">搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="货架信息" :visible.sync="dialogFormVisible" class="showAll_dialog2">
      <el-form ref="form" :rules="rules" :model="form" size="mini" label-width="120px">
        <el-form-item v-if="false" label="仓库id" prop="warehouseId">
          <el-input v-model="form.warehouseId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item v-if="false" prop="warehouseCode">
          <el-input v-model="form.warehouseCode" size="mini" style="width: 160px;" clearable />
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

        <el-form-item v-if="false" prop="id">
          <el-input v-model="form.id" size="mini" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="库区id" prop="areaId">
          <el-input v-model="form.areaId" size="mini" clearable />
        </el-form-item>
        <el-form-item v-if="false" prop="areaCode">
          <el-input v-model="form.areaCode" size="mini" clearable />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="货架名称" prop="name">
              <el-input v-model="form.name" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货架代码" prop="code">
              <el-input v-model="form.code" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货架类型" prop="shelfType">
              <el-select v-model="form.shelfType" size="mini">
                <el-option v-for="item in options" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="货架排数" prop="rowNumber">
              <el-input v-model="form.rowNumber" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货架层数" prop="layer">
              <el-input v-model="form.layer" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货架列数" prop="columnNumber">
              <el-input v-model="form.columnNumber" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <el-checkbox v-model="checked">是否生成库位</el-checkbox>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="库位名称" prop="locationName" :required="checked === true?true:false">
              <el-input v-model="form.locationName" autocomplete="off" placeholder="请输入库位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库位类型" prop="locationType" :required="checked === true?true:false">
              <el-select v-model="form.locationType" size="mini" placeholder="请选择库位类型" @focus="funcLoc">
                <el-option v-for="item in loptions" :key="item.id" :label="item.codeDetailName" :value="item.typeNumber" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="单个库位长度(cm)" :label-width="formLabelWidth" prop="length" :required="checked === true?true:false">
              <el-input v-model="form.length" oninput="“value=value.replace(/[^0-9.]/g,'')”" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单个库位宽度(cm)" :label-width="formLabelWidth" prop="wideth" :required="checked === true?true:false">
              <el-input v-model="form.wideth" oninput="“value=value.replace(/[^0-9.]/g,'')”" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单个库位高度(cm)" :label-width="formLabelWidth" prop="high" :required="checked === true?true:false">
              <el-input v-model="form.high" oninput="“value=value.replace(/[^0-9.]/g,'')”" size="mini" />
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
      <!-- :span-method="objectSpanMethod" -->

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
      <el-table-column label="货架名称" align="center" :show-overflow-tooltip="true" prop="name" />
      <el-table-column label="货架代码" align="center" :show-overflow-tooltip="true" prop="code" />
      <el-table-column label="货架类型" align="center" :show-overflow-tooltip="true" prop="shelfType" :formatter="stateFormat" />
      <el-table-column label="所属仓库" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
      <el-table-column label="所属库区" align="center" :show-overflow-tooltip="true" prop="areaName" />
      <el-table-column label="货架排数" align="center" :show-overflow-tooltip="true" prop="rowNumber" />
      <el-table-column label="货架层数" align="center" :show-overflow-tooltip="true" prop="layer" />
      <el-table-column label="货架列数" align="center" :show-overflow-tooltip="true" prop="columnNumber" />
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
import { screenTable, screenTableNum, updshelf, importLocation, del, add, selectArea } from '@/api/user'
import { searchallwarehouse, searchsystemid } from '@/utils/search'
import { changeAll } from '@/utils/statechange'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      // 总数
      areaName: null,
      name: null,
      warehouseName: null,
      shelfType: null,
      dialogFormVisible: false,
      formLabelWidth: '160px',
      warehouseOptions: [],
      options: [],
      loptions: [],
      checked: true,
      show: false,
      lastTime: 0,
      laststateTime: 0,
      lastlstateTime: 0,
      advanced: false,
      listLoading: true,
      total: 0,
      areaOptions: [],
      spanArr: [],
      lastAreaTime: 0,
      tableHeight: 50,
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      rules: {
        areaName: [{ required: true, message: '请选择库区', trigger: 'change' }],
        locationType: [{ message: '请选择库位类型', trigger: 'change', type: 'number' }],
        locationName: [{ message: '请输入库位名称', trigger: 'change' }],
        shelfType: [{ required: true, message: '请选择货架类型', trigger: 'change' }],
        warehouseName: [{ required: true, message: '请选择仓库', trigger: 'change' }],
        rowNumber: [{ required: true, message: '请填写货架排数', trigger: 'blur' }],
        layer: [{ required: true, message: '请填写货架层数', trigger: 'blur' }],
        columnNumber: [{ required: true, message: '请填写货架列数', trigger: 'blur' }],
        code: [{ required: true, message: '请填写货架代码', trigger: 'blur' }, { pattern: /^[a-zA-Z]{3}$/, trigger: 'change', message: '请填写三位字母作为库区代码，区分大小写' }],
        name: [{ required: true, message: '请填写货架名称', trigger: 'blur' }],
        length: [{ message: '请填写单个库位长度', trigger: 'blur' }],
        wideth: [{ message: '请填写单个库位宽度', trigger: 'blur' }],
        high: [{ message: '请填写单个库位高度', trigger: 'blur' }]
      },
      form: {
        id: null,
        areaName: null,
        warehouseName: null,
        warehouseCode: null,
        shelfType: null,
        warehouseId: null,
        areaId: null,
        areaCode: null,
        name: null,
        code: null,
        rowNumber: null,
        layer: null,
        columnNumber: null,
        locationType: null,
        locationName: null,
        length: null,
        wideth: null,
        high: null
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
    stateFormat(row) {
      if (this.tableData.length === 0) {
        searchsystemid('ONSHELF_TYPE').then(res => {
          this.options = res.data
        })
      } else {
        const now = new Date().valueOf()
        if (this.laststateTime === 0) {
          searchsystemid('ONSHELF_TYPE').then(res => {
            this.options = res.data
          })
          this.laststateTime = now
        } else {
          if ((now - this.laststateTime) > 5000) {
            this.laststateTime = now
          }
        }
        return changeAll(row.shelfType, this.options)
      }
    },
    funcLoc() {
      const now = new Date().valueOf()
      if (this.lastlstateTime === 0) {
        searchsystemid('LOCATION_TYPE').then(res => {
          this.loptions = res.data
        })
        this.lastlstateTime = now
      } else {
        if ((now - this.lastlstateTime) > 5000) {
          this.lastlstateTime = now
        }
      }
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
    changeWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.form.warehouseName)
      this.form.warehouseId = item.id
      this.form.warehouseName = item.warehouseName
      this.form.warehouseCode = item.warehouseCode
    },
    search: kkdeboundce(function() {
      this.getList()
    }, 1000),
    refresh: kkdeboundce(function() {
      this.reload()
    }, 1000),
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
    funcArea2() {
      if (!this.warehouseName) {
        this.$message.error('请先选择仓库！')
      } else {
        selectArea({ pojo: {
          warehouseId: this.warehouseId
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
      this.form.areaId = item.id
    },
    submit() {
      if (this.checked === false) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm('确定保存填写信息吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              add({
                areaName: this.form.areaName,
                areaId: this.form.areaId,
                areaCode: this.form.areaCode,
                code: this.form.code,
                name: this.form.name,
                rowNumber: this.form.rowNumber,
                shelfType: this.form.shelfType,
                layer: this.form.layer,
                columnNumber: this.form.columnNumber,
                warehouseName: this.form.warehouseName,
                warehouseCode: this.form.warehouseCode,
                warehouseId: this.form.warehouseId
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
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm('确定保存信息吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async() => {
              const res = await add({
                areaName: this.form.areaName,
                areaId: this.form.areaId,
                areaCode: this.form.areaCode,
                code: this.form.code,
                name: this.form.name,
                rowNumber: this.form.rowNumber,
                shelfType: this.form.shelfType,
                layer: this.form.layer,
                columnNumber: this.form.columnNumber,
                warehouseName: this.form.warehouseName,
                warehouseCode: this.form.warehouseCode,
                warehouseId: this.form.warehouseId
              })
              console.log(res)
              importLocation({
                warehouseName: this.form.warehouseName,
                warehouseCode: this.form.warehouseCode,
                warehouseId: this.form.warehouseId,
                areaCode: this.form.areaCode,
                areaName: this.form.areaName,
                areaId: this.form.areaId,
                containerId: res.data,
                code: this.form.code,
                containerCode: this.form.code,
                locationName: this.form.locationName,
                locationType: this.form.locationType,
                rows: this.form.rowNumber,
                columns: this.form.columnNumber,
                layer: this.form.layer,
                length: this.form.length,
                wideth: this.form.wideth,
                high: this.form.high
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
    },
    // 单个删除
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ id: row.id }).then(res => {
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
      this.checked = true
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
            updshelf({
              id: this.form.id,
              areaName: this.form.areaName,
              areaId: this.form.areaId,
              areaCode: this.form.areaCode,
              code: this.form.code,
              shelfType: this.form.shelfType,
              name: this.form.name,
              rowNumber: this.form.rowNumber,
              layer: this.form.layer,
              columnNumber: this.form.columnNumber,
              warehouseName: this.form.warehouseName,
              warehouseId: this.form.warehouseId,
              warehouseCode: this.form.warehouseCode
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
    edit(row) {
      this.show = true
      this.dialogFormVisible = true
      this.checked = false
      // screenTable({ searchDTO: {
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
      screenTable({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        areaName: this.areaName,
        shelfType: this.shelfType,
        name: this.name,
        warehouseName: this.warehouseName
      }, workGroupId: sessionStorage.workGroupId }).then(response => {
        this.tableData = response.data
        // this.flitterData()
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenTableNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        areaName: this.areaName,
        name: this.name,
        shelfType: this.shelfType,
        warehouseName: this.warehouseName
      }, workGroupId: sessionStorage.workGroupId }).then(response => {
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
