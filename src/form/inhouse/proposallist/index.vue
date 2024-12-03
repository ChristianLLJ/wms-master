<template>
  <div>
    <div class="btngroups">
      <el-button type="success" icon="el-icon-back" @click="goback">返回上一页</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card class="show_card1" :body-style="{padding:'20px'}">
      <div slot="header" class="clearfix">
        <span class="title">上架任务单头</span>
      </div>
      <el-form ref="form" :rules="rules" :inline="true" class="demo-form-inline" :model="form">
        <!-- <el-form-item label="来源类型">
          <el-select v-model="form.sourceType" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item v-if="false">
          <el-input v-model="form.id" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item v-if="false">
          <el-input v-model="form.onshelfCode" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="仓库id">
          <el-input v-model="form.warehouseId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-select v-model="form.warehouseName" size="mini" placeholder="请选择" @focus="func" @change="changeWarehouseOptions">
            <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" label="仓库代码">
          <el-input v-model="form.warehouseCode" disabled placeholder="选择仓库后自动填充" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="上架库区id">
          <el-input v-model="form.onshelfAreaId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="上架库区">
          <el-select v-model="form.onshelfAreaName" size="mini" placeholder="请选择" @focus="funcArea" @change="changeAreaOptions">
            <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" label="库区代码">
          <el-input v-model="form.onshelfAreaCode" disabled placeholder="选择库区后自动填充" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="上架人">
          <el-input v-model="form.onshelfPersonName" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" size="mini" style="width: 160px;" clearable />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="show_card1" :body-style="{padding:'0px'}">
      <div slot="header" class="clearfix">
        <span>上架信息</span>
        <!-- <el-button size="mini" style="float: right; padding: 5px 0" icon="el-icon-circle-plus-outline" type="text" @click="add">新增</el-button> -->
      </div>
      <el-table
        ref="tabledatas"
        :data="tabledatas"
        size="mini"
        :height="tableHeight"
        tooltip-effect="dark"
        :header-cell-style="{background:'#091f2c',color: '#fff'}"
        :row-class-name="tableRowClassDetailName"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <!-- <el-table-column type="selection" align="center" /> -->
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column label="组盘跟踪号" align="center" prop="traceCode" :show-overflow-tooltip="true">
          <!-- <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.factLocationId" size="mini" />
            </span>
          </template> -->
        </el-table-column>
        <!-- <el-table-column label="装箱跟踪号" align="center" prop="traceCode2" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.factLocationId" size="mini" />
            </span>
          </template>
        </el-table-column> -->
        <el-table-column label="建议单单号" align="center" prop="onshelfCode" :show-overflow-tooltip="true">
          <!-- <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.factLocationId" size="mini" />
            </span>
          </template> -->
        </el-table-column>
        <el-table-column v-if="false" label="系统建议库位id" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.factLocationId" size="mini" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="上架库位" align="center">
          <template slot-scope="scope">
            <span>
              <el-select
                v-model="scope.row.factLocationName"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="funcLoc"
                clearable
                size="mini"
                @change="changelocationOptions(scope.row)"
              >
                <el-option v-for="item in locationOptions" :key="item.id" :label="item.locationName" :value="item.locationName" />
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="上架时间" align="center">
          <template slot-scope="scope">
            <span>
              <el-date-picker
                v-model="scope.row.onshelfTime"
                size="mini"
                type="date"
                placeholder="选择日期"
              />
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="入库批次" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.inboundBatch" size="mini" />
            </span>
          </template>
        </el-table-column> -->
        <el-table-column label="包装名称" align="center">
          <template slot-scope="scope">
            <span>
              <el-select v-model="scope.row.containerName" size="mini" placeholder="请选择" @focus="funcContainer" @change="changeConOptions(scope.row)">
                <el-option v-for="item in containerOptions" :key="item.id" :label="item.name" :value="item.name" />
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="包装id" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.containerId" size="mini" />
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="包装代码" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.containerCode" size="mini" />
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" @click="delect(scope.$index)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>
    <div class="btnsContain">
      <div>
        <el-button v-if="!show" size="small" icon="el-icon-save" type="success" @click="submit">保存</el-button>
        <el-button v-if="show" size="small" icon="el-icon-save" type="success" @click="update">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { addOnshelf, selectOnshelf, selectOnshelfDetail, updProTable, selectLocation } from '@/api/user'
import { searchwarehouse, searchcon, searcharea } from '@/utils/search'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      lastTime: 0,
      tableHeight: 50,
      warehouseOptions: [],
      states: [],
      loclist: [],
      locationOptions: [],
      lastareaTime: 0,
      areaOptions: [],
      lastconTime: 0,
      List: [],
      tableData: [],
      containerOptions: [],
      currentPage2: 1, // 当前页码
      pageSize2: 15, // 每页的数据条数
      rules: {
        warehouseName: [{ required: true, message: '请选择仓库名称', trigger: 'change' }]
      },
      tabledatas: [
      ],
      form: {
        // sourceType: '',
        id: '',
        onshelfCode: '',
        warehouseId: '',
        warehouseCode: '',
        warehouseName: '',
        onshelfAreaName: '',
        onshelfAreaId: '',
        onshelfAreaCode: '',
        onshelfPersonName: '',
        remark: ''
      }
    }
  },
  created() {
    if (sessionStorage.proChildId && sessionStorage.onshelfCode !== null) {
      this.getList()
      this.show = true
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tabledatas.$el.offsetTop - 83

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tabledatas.$el.offsetTop - 83
      }
    })
  },
  methods: {
    refresh() {
      this.reload()
    },
    changelocationOptions(row) {
      const item = this.locationOptions.find(item1 => item1.locationName === row.factLocationName)
      row.factLocationName = item.locationName
      row.factLocationId = item.id
    },
    funcLoc(query) {
      selectLocation({
        pojo: {
        }
      })
        .then(res => {
          this.states = res.data
          this.loclist = this.states.map(item => {
            return { id: item.id, locationName: item.locationName }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.locationOptions = this.loclist.filter(item => {
              return item.locationName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.locationOptions = []
        }
      }, 100)
    },
    chooseData() {
      this.tableData = []
      selectOnshelfDetail({
        pojo: {
          onshelfId: sessionStorage.getItem('proChildId')
        }}).then(res => {
        this.tableData = res.data.list
        for (let i = 0; i < this.formData.tabledatas.length; i++) {
          if (JSON.stringify(this.tableData[i]) !== JSON.stringify(this.formData.tabledatas[i])) {
            this.List.push(this.formData.tabledatas[i])
          }
        }
      })
    },
    getList() {
      selectOnshelf({
        pojo: {
          onshelfCode: sessionStorage.getItem('onshelfCode')
        }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
        this.form = Object.assign({}, response.data[0])
      })
      selectOnshelfDetail({
        pojo: {
          onshelfId: sessionStorage.getItem('proChildId')
        }}).then(response => {
        this.tabledatas = response.data.list
      })
    },
    goback() {
      this.$router.go(-1)
    },
    changeWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.form.warehouseName)
      this.form.warehouseId = item.id
      this.form.warehouseName = item.warehouseName
      this.form.warehouseCode = item.warehouseCode
    },
    changeAreaOptions() {
      const item = this.areaOptions.find(item1 => item1.areaName === this.form.onshelfAreaName)
      this.form.onshelfAreaId = item.id
      this.form.onshelfAreaName = item.areaName
      this.form.onshelfAreaCode = item.areaCode
    },
    changeConOptions(row) {
      const item = this.containerOptions.find(item1 => item1.name === row.containerName)
      row.containerId = item.id
      row.containerName = item.name
      row.containerCode = item.code
    },
    funcContainer() {
      const now = new Date().valueOf()
      if (this.lastconTime === 0) {
        searchcon().then(res => {
          this.containerOptions = res.data
        }
        )
        this.lastconTime = now
      } else {
        if ((now - this.lastconTime) > 5000) {
          this.lastconTime = now
        }
      }
    },
    func() {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        searchwarehouse(window.sessionStorage.workGroupId).then(res => {
          this.warehouseOptions = res.data.results
        }
        )
        this.lastTime = now
      } else {
        if ((now - this.lastTime) > 5000) {
          this.lastTime = now
        }
      }
    },
    funcArea() {
      const now = new Date().valueOf()
      if (this.lastareaTime === 0) {
        searcharea().then(res => {
          this.areaOptions = res.data
        }
        )
        this.lastareaTime = now
      } else {
        if ((now - this.lastareaTime) > 5000) {
          this.lastareaTime = now
        }
      }
    },
    handleSizeChange2(val) {
      this.currentPage2 = 1
      this.pageSize2 = val
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val
    },
    // 单个删除
    delect(index) {
      this.tabledatas.splice(index, 1)
    },
    // save() {
    //   this.$confirm('是否要暂存所填信息?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     saveOnshelf({ details: this.tabledatas, head: {
    //       onshelfAreaName: this.form.onshelfAreaName,
    //       onshelfAreaId: this.form.onshelfAreaId,
    //       onshelfAreaCode: this.form.onshelfAreaCode,
    //       warehouseName: this.form.warehouseName,
    //       warehouseId: this.form.warehouseId,
    //       warehouseCode: this.form.warehouseCode,
    //       onshelfPersonName: this.form.onshelfPersonName,
    //       remark: this.form.remark
    //     }}).then(res => {
    //       if (res.code === 200) {
    //         this.$message.success('暂存成功')
    //         this.reload()
    //       }
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消'
    //     })
    //   })
    // },
    update() {
      this.chooseData()
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('是否确定更新所填信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updProTable({ details: this.List, head: {
              id: this.form.id,
              onshelfCode: this.form.onshelfCode,
              onshelfAreaName: this.form.onshelfAreaName,
              onshelfAreaId: this.form.onshelfAreaId,
              onshelfAreaCode: this.form.onshelfAreaCode,
              warehouseName: this.form.warehouseName,
              warehouseId: this.form.warehouseId,
              warehouseCode: this.form.warehouseCode,
              onshelfPersonName: this.form.onshelfPersonName,
              remark: this.form.remark
            }}).then(res => {
              if (res.code === 200) {
                this.$message.success('更新成功')
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
            addOnshelf({ details: this.tabledatas, head: {
              // sourceType: this.form.sourceType,
              onshelfAreaName: this.form.onshelfAreaName,
              onshelfAreaId: this.form.onshelfAreaId,
              onshelfAreaCode: this.form.onshelfAreaCode,
              warehouseName: this.form.warehouseName,
              warehouseId: this.form.warehouseId,
              warehouseCode: this.form.warehouseCode,
              onshelfPersonName: this.form.onshelfPersonName,
              remark: this.form.remark
            }}).then(res => {
              if (res.code === 200) {
                this.$message.success('提交成功')
                this.reload()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            })
          })
        }
      })
    },
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    add() {
      const list = {
        factLocationId: '',
        factLocationName: '',
        containerCode: '',
        containerId: '',
        containerName: '',
        onshelfTime: ''
      }
      this.tabledatas.unshift(list)
    }
  }
}
</script>
<style>
.datagrid-htable, .datagrid-btable, .datagrid-ftable {
    color: #ffffff;
}
</style>
  <style scoped>
  .el-card /deep/ .el-card__header {
  padding: 10px;
  }
  </style>
    <style lang="scss" scoped>
// 修改对话框高度
.btnsContain {
      div{
        width: 100px;
        margin: 0 auto;
      }
    }
</style>
