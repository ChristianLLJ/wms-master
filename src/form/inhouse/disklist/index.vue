<template>
  <div>
    <div class="btngroups">
      <el-button type="success" icon="el-icon-back" @click="goback">返回上一页</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card class="show_card1" :body-style="{padding:'20px'}">
      <div slot="header" align="center">
        <span class="title">码盘任务-无计划单头</span>
      </div>
      <el-form ref="form" :rules="rules" :inline="true" class="demo-form-inline" :model="form">
        <el-form-item v-if="false">
          <el-input v-model="form.id" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="仓库id">
          <el-input v-model="form.warehouseId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="仓库" prop="warehouseCode">
          <el-select v-model="form.warehouseCode" size="mini" placeholder="请选择" @focus="func" @change="changeWarehouseOptions">
            <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseCode" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="show_card1" :body-style="{padding:'0px'}">
      <div slot="header" align="center">
        <span>码盘任务-无计划表细</span>
        <!-- <el-button v-if="!show" icon="el-icon-plus" type="primary" @click="add">新增</el-button> -->
      </div>
      <el-table
        ref="tabledatas"
        :data="tabledatas"
        size="mini"
        :height="tableHeight"
        :header-cell-style="{background:'#262626',color: '#fff'}"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <!-- <el-table-column type="selection" /> -->
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column label="计划单代码" align="center" prop="planCode">
          <!-- <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.planCode" size="mini" />
            </span>
          </template> -->
        </el-table-column>
        <el-table-column label="码盘跟踪号" align="center" prop="combineTraceCode">
          <!-- <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.planCode" size="mini" />
            </span>
          </template> -->
        </el-table-column>
        <el-table-column label="包装名称" align="center">
          <template slot-scope="scope">
            <span>
              <el-select v-model="scope.row.packageCode" size="mini" placeholder="请选择" @focus="funcContainer" @change="changeConOptions(scope.row)">
                <el-option v-for="item in containerOptions" :key="item.id" :label="item.name" :value="item.code" />
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="包装条码" align="center" prop="packageBarcode">
          <!-- <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.planCode" size="mini" />
            </span>
          </template> -->
        </el-table-column>
        <el-table-column v-if="false" label="包装id" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.packageId" size="mini" />
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column v-if="false" label="包装代码" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.packageCode" size="mini" />
            </span>
          </template>
        </el-table-column> -->
        <el-table-column label="是否混码装箱" align="center">
          <template slot-scope="scope">
            <span>
              <el-select v-model="scope.row.isFix" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in foptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="码箱数量" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.packageNum" size="mini" />
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" @click="delect(scope.$index)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="btnsContain">
        <div>
          <el-button icon="el-icon-folder-add" type="success" @click="update">保存</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { addCombineStack, saveCombineStack, selectCombineStack, selectCombineStackDetail, updStackTable } from '@/api/user'
import { searchwarehouse, searchcon } from '@/utils/search'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      lastTime: 0,
      tableHeight: 50,
      warehouseOptions: [],
      lastconTime: 0,
      containerOptions: [],
      tableData: [],
      List: [],
      tabledatas: [],
      currentPage2: 1, // 当前页码
      pageSize2: 15, // 每页的数据条数
      rules: {
        warehouseCode: [{ required: true, message: '请选择仓库', trigger: 'change' }]
      },
      form: {
        id: '',
        combineCode: '',
        warehouseId: '',
        // warehouseName: '',
        warehouseCode: '',
        // sourceType: '',
        personName: ''
      },
      foptions: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  },
  created() {
    if (sessionStorage.diskChildId && sessionStorage.combineCode !== null) {
      this.getList()
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
    // 单个删除
    delect(index) {
      this.tabledatas.splice(index, 1)
    },
    handleSizeChange2(val) {
      this.currentPage2 = 1
      this.pageSize2 = val
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val
    },
    chooseData() {
      this.tableData = []
      selectCombineStackDetail({
        pojo: {
          checkId: sessionStorage.getItem('diskChildId')
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
      selectCombineStack({
        pojo: {
          combineCode: sessionStorage.getItem('combineCode')
        }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
        this.form = Object.assign({}, response.data[0])
      })
      selectCombineStackDetail({
        pojo: {
          stackId: sessionStorage.getItem('diskChildId')
        }}).then(response => {
        this.tabledatas = response.data.list
      })
      // sessionStorage.removeItem('orderId')
      // sessionStorage.removeItem('childId')
    },
    save() {
      this.$confirm('是否要暂存所填信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saveCombineStack({ details: this.tabledatas, head: {
          warehouseCode: this.form.warehouseCode,
          // warehouseName: this.form.warehouseName,
          warehouseId: this.form.warehouseId,
          personName: this.form.personName
        }}).then(res => {
          if (res.code === 200) {
            this.$message.success('暂存成功')
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
    goback() {
      this.$router.go(-1)
    },
    update() {
      this.chooseData()
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('是否确定更新所填信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updStackTable({ details: this.List, head: {
              id: this.form.id,
              combineCode: this.form.combineCode,
              warehouseCode: this.form.warehouseCode,
              // warehouseName: this.form.warehouseName,
              warehouseId: this.form.warehouseId,
              personName: this.form.personName
            }}).then(res => {
              if (res.code === 200) {
                this.$message.success('更新成功')
                this.reload()
                this.$router.replace({ path: 'groupdisk' })
                sessionStorage.removeItem('diskChildId')
                sessionStorage.removeItem('combineCode')
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
    changeWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseCode === this.form.warehouseCode)
      this.form.warehouseId = item.id
      this.form.warehouseCode = item.warehouseCode
      // this.form.warehouseName = item.warehouseName
    },
    changeConOptions(row) {
      const item = this.containerOptions.find(item1 => item1.code === row.packageCode)
      row.packageId = item.id
      // row.packageName = item.name
      row.packageCode = item.code
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
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('此操作提交所填信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addCombineStack({ details: this.tabledatas, head: {
              warehouseCode: this.form.warehouseCode,
              // warehouseName: this.form.warehouseName,
              warehouseId: this.form.warehouseId,
              personName: this.form.personName
              // sourceType: this.form.sourceType
            }}).then(res => {
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
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    add() {
      const list = {
        // stackCode: '',
        // combineTraceCode: '',
        packageCode: '',
        packageId: '',
        packageName: '',
        // stackState: '',
        // rowNum: '',
        packageNum: '',
        isFix: '',
        planCode: ''
      }
      this.tabledatas.unshift(list)
    }
  }
}
</script>
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
