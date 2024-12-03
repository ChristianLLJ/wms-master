<template>
  <div>
    <div class="btngroups">
      <el-button type="success" icon="el-icon-back" @click="goback">返回上一页</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-dialog title="设置限制" class="showAll_dialog2" :visible.sync="dialogVisible" @close="resetForm('ruleForm')">
      <div>
        <el-form ref="ruleForm" :inline="true" size="mini" :model="sform" label-width="120px">
          <el-form-item label="库位限制">
            <el-select v-model="sform.locationLimit" multiple placeholder="请选择" @focus="funcLocation">
              <el-option v-for="item in locationOptions" :key="item.id" :label="item.code" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="空间限制">
            <el-select v-model="sform.spaceLimit" multiple placeholder="请选择" @focus="funcSpace">
              <el-option v-for="item in spaceOptions" :key="item.id" :label="item.code" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="forsure">确定</el-button>
      </div>
    </el-dialog>
    <el-card class="show_card1" :body-style="{padding:'10px'}">
      <div slot="header" class="clearfix">
        <span class="title">基本信息</span>
      </div>
      <el-form :inline="true" class="demo-form-inline" :model="form">
        <el-form-item label="上架策略代码">
          <el-input v-model="form.strategyCode" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="上架策略名称">
          <el-input v-model="form.strategyName" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="客户id">
          <el-input v-model="form.customId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-select v-model="form.customName" size="mini" placeholder="请选择" @focus="funClient" @change="changeClientOptions">
            <el-option v-for="item in clientOptions" :key="item.id" :label="item.customName" :value="item.customName" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" label="客户代码">
          <el-input v-model="form.customCode" disabled size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="仓库id">
          <el-input v-model="form.warehouseId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="仓库名称">
          <el-select v-model="form.warehouseName" size="mini" placeholder="请选择" @focus="func" @change="changeWarehouseOptions">
            <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" label="仓库代码">
          <el-input v-model="form.warehouseCode" disabled size="mini" style="width: 160px;" clearable />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="show_card1" :body-style="{padding:'0px'}">
      <div slot="header" class="clearfix" align="center">
        <span>上架策略</span>
        <el-button icon="el-icon-plus" type="primary" @click="add">新增</el-button>
      </div>
      <el-table
        ref="tabledatas"
        :data="tabledatas"
        size="mini"
        :height="tableHeight"
        :header-cell-style="{background:'#091f2c',color: '#fff'}"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
        @row-click="onRowClick"
      >
        <el-table-column label="序号" align="center" prop="id">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="上架规则Id" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.ruleDetailId" size="mini" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="上架规则名称" align="center">
          <template slot-scope="scope">
            <span>
              <el-select v-model="scope.row.ruleDetailName" size="mini" placeholder="请选择" @focus="funcRule" @change="changeOptions(scope.row)">
                <el-option v-for="item in ruleOptions" :key="item.id" :label="item.codeDetailName" :value="item.codeDetailName" />
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="上架规则代码" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.ruleDetailCode" disabled size="mini" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="优先级" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.priority" size="mini" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" type="primary" @click="delect(scope.$index)">删除</el-button>
              <el-button size="mini" type="primary" @click="setLimit(scope.row)">设置限制</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="block" style="background-color:rgb(46, 153, 132);">
        <el-pagination align="center" :current-page="currentPage2" :page-sizes="[10,20]" :page-size="pageSize2" layout="total, sizes, prev, pager, next, jumper" :total="tabledatas.length" @size-change="handleSizeChange2" @current-change="handleCurrentChange2" />
      </div> -->
      <!-- <el-button type="primary" style="float: right;margin: 2px" @click="submit">提交</el-button> -->
    </el-card>
    <div class="btnsContain">
      <div>
        <el-button size="small" icon="el-icon-save" type="success" @click="submit">保存</el-button>
        <!-- <el-button v-if="show" size="small" icon="el-icon-save" type="success" @click="update">保存</el-button> -->
      </div>
    </div>
  </div>
</template>
<script>
import { addOnshelfStrategy, selectDetailByCode } from '@/api/user'
import { searchallwarehouse, searchcustomer } from '@/utils/search'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      tabledatas: [],
      lastTime: 0,
      lastfunTime: 0,
      lastruleTime: 0,
      lastspaceTime: 0,
      lastlocationTime: 0,
      currentPage2: 1, // 当前页码
      pageSize2: 15, // 每页的数据条数
      dialogVisible: false,
      limitLocationIds: [],
      limitSpaceIds: [],
      list: [],
      list2: [],
      list1: [],
      list4: [],
      sform: {
        locationLimit: null,
        spaceLimit: null
      },
      id: 0,
      warehouseOptions: [],
      clientOptions: [],
      ruleOptions: [],
      locationOptions: [],
      spaceOptions: [],
      tableHeight: 50,
      form: {
        strategyCode: null,
        warehouseName: null,
        warehouseId: null,
        customName: null,
        strategyName: null,
        customId: null,
        customCode: null,
        warehouseCode: null
      }
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
    changeWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.form.warehouseName)
      this.form.warehouseId = item.id
      this.form.warehouseName = item.warehouseName
      this.form.warehouseCode = item.warehouseCode
    },
    changeClientOptions() {
      const item = this.clientOptions.find(item1 => item1.customName === this.form.customName)
      this.form.customId = item.id
      this.form.customName = item.customName
      this.form.customCode = item.customCode
    },
    changeOptions(row) {
      const item = this.ruleOptions.find(item1 => item1.codeDetailName === row.ruleDetailName)
      row.ruleDetailId = item.id
      row.ruleDetailCode = item.code
      row.ruleDetailName = item.codeDetailName
    },
    func() {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        searchallwarehouse().then(res => {
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    forsure() {
      this.list = this.sform.locationLimit
      this.list1 = this.sform.spaceLimit
      for (let i = 0; i < this.list.length; i++) {
        this.list2.push([this.id, this.list[i]])
      }
      for (let j = 0; j < this.list.length; j++) {
        this.list4.push([this.id, this.list1[j]])
      }
      this.limitLocationIds = this.list2
      this.limitSpaceIds = this.list4
      this.dialogVisible = false
    },
    funClient() {
      const now = new Date().valueOf()
      if (this.lastfunTime === 0) {
        searchcustomer().then(res => {
          this.clientOptions = res.data
        }
        )
        this.lastfunTime = now
      } else {
        if ((now - this.lastfunTime) > 5000) {
          this.lastfunTime = now
        }
      }
    },
    goback() {
      history.go(-1)
    },
    handleSizeChange2(val) {
      this.currentPage2 = 1
      this.pageSize2 = val
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val
    },
    onRowClick(row) {
      this.id = row.index + 1
    },
    setLimit(row) {
      this.onRowClick(row)
      this.dialogVisible = true
    },
    funcRule() {
      const now = new Date().valueOf()
      if (this.lastruleTime === 0) {
        selectDetailByCode({
          code: 'ONSHELF_STRATEGY'
        }).then(res => {
          this.ruleOptions = res.data
        }
        )
        this.lastruleTime = now
      } else {
        if ((now - this.lastruleTime) > 5000) {
          this.lastruleTime = now
        }
      }
    },
    funcLocation() {
      const now = new Date().valueOf()
      if (this.lastlocationTime === 0) {
        selectDetailByCode({
          code: 'LOCATION_LIMIT'
        }).then(res => {
          this.locationOptions = res.data
        }
        )
        this.lastlocationTime = now
      } else {
        if ((now - this.lastlocationTime) > 5000) {
          this.lastlocationTime = now
        }
      }
    },
    funcSpace() {
      const now = new Date().valueOf()
      if (this.lastspaceTime === 0) {
        selectDetailByCode({
          code: 'SPACE_LIMIT'
        }).then(res => {
          this.spaceOptions = res.data
        }
        )
        this.lastspaceTime = now
      } else {
        if ((now - this.lastspaceTime) > 5000) {
          this.lastspaceTime = now
        }
      }
    },
    // 单个删除
    delect(index) {
      this.tabledatas.splice(index, 1)
    },
    tableRowClassDetailName({ row, rowIndex }) {
      row.index = rowIndex
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    submit() {
      this.$confirm('此操作提交所填信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addOnshelfStrategy({ onshelfStrategyDetails: this.tabledatas, onshelfStrategy: {
          strategyCode: this.form.strategyCode,
          warehouseName: this.form.warehouseName,
          warehouseId: this.form.warehouseId,
          customName: this.form.customName,
          strategyName: this.form.strategyName,
          customId: this.form.customId,
          customCode: this.form.customCode,
          warehouseCode: this.form.warehouseCode
        }, limitLocationIds: this.limitLocationIds, limitSpaceIds: this.limitSpaceIds }).then(res => {
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
    },
    add() {
      const list = {
        ruleDetailCode: '',
        runDetailName: '',
        runDetailId: '',
        priority: ''
      }
      this.tabledatas.push(list)
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
    .showAll_dialog2 {
    ::v-deep.el-dialog {
      margin: 100px auto !important;
      overflow: hidden;
      background-color: #091f2cee;

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

