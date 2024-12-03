<template>
  <div>
    <div class="btngroups">
      <el-button-group>
        <el-button size="mini" icon="el-icon-circle-plus-outline" type="primary" @click="add">新建</el-button>
        <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        <el-button size="mini" type="primary" icon="el-icon-folder-checked">保存</el-button>
      </el-button-group>
    </div>
    <el-card :body-style="{padding:'10px'}">
      <div slot="header" class="clearfix">
        <span class="title">表头填写</span>
      </div>
      <el-form :inline="true" class="demo-form-inline" :model="form">
        <el-form-item label="仓库">
          <el-input v-model="form.warehouse" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="车号">
          <el-input v-model="form.carNumber" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="司机">
          <el-input v-model="form.driver" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="波次号">
          <el-input v-model="form.waveId" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="车型">
          <el-select v-model="form.carType" size="mini">
            <el-option
              v-for="item in coptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="装车人员">
          <el-input v-model="form.loadPeople" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="体积限制">
          <el-input v-model="form.volumeLimit" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="重量限制">
          <el-input v-model="form.weightLimit" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="用户自定义1">
          <el-input v-model="form.userDefined1" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="用户自定义2">
          <el-input v-model="form.userDefined2" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="用户自定义3">
          <el-input v-model="form.userDefined3" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="用户自定义4">
          <el-input v-model="form.userDefined4" style="width: 160px;" size="mini" clearable />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card :body-style="{padding:'0px'}" shadow="always">
      <div slot="header" class="clearfix">
        <span>表细填写</span>
      </div>
      <el-table
        :data="tabledatas"
        border
        :row-class-name="tableRowClassDetailName"
        size="mini"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <!-- <el-table-column type="selection" /> -->
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column label="目标跟踪号" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.traceCode" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.traceCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="路线" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.route" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.route }}</span>
          </template>
        </el-table-column>
        <el-table-column label="站点" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.station" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.station }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户姓名" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.customName" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.customName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品号" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.productId" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.productId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货人" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.receiverName" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.receiverName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单创建时间" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-date-picker
                v-model="scope.row.createTime"
                :value-format="'yyyy-MM-dd'"
                size="mini"
                type="date"
                placeholder="选择日期"
              />
            </span>
            <span v-else>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出库单号" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.outCode" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.outCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.row,scope.$index)">{{ scope.row.show?'保存':"编辑" }}</el-button>
            <el-button size="mini" @click="delect(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="float: right; padding: 5px 0" type="text" @click="submit">提交</el-button>
    </el-card>
  </div>
</template>
<script>
import { addLoadingAndDetail } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      tabledatas: [],
      coptions: [
        {
          value: 0,
          label: 0
        }
      ],
      form: {
        carNumber: '',
        carType: '',
        driver: '',
        loadPeople: '',
        warehouse: '',
        waveId: '',
        volumeLimit: '',
        weightLimit: '',
        userDefined1: '',
        userDefined2: '',
        userDefined3: '',
        userDefined4: ''
      }
    }
  },
  created() {
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    edit(row, index) {
      row.show = !row.show
      this.$set(this.tabledatas, index, row)
      // 修改后保存
    },
    refresh() {
      this.reload()
    },
    // 单个删除
    delect(index) {
      this.tabledatas.splice(index, 1)
    },
    submit() {
      this.$confirm('此操作提交所填信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addLoadingAndDetail({ loadingDetailList: this.tabledatas, loading: {
          warehouse: this.form.warehouse,
          carNumber: this.form.carNumber,
          driver: this.form.driver,
          waveId: this.form.waveId,
          carType: this.form.carType,
          loadPeople: this.form.loadPeople,
          volumeLimit: this.form.volumeLimit,
          weightLimit: this.form.weightLimit,
          userDefined1: this.form.userDefined1,
          userDefined2: this.form.userDefined2,
          userDefined3: this.form.userDefined3,
          userDefined4: this.form.userDefined4
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
        traceCode: null,
        route: null,
        station: null,
        customName: null,
        productId: null,
        receiverId: null,
        recerverName: null,
        createTime: null,
        outCode: null
      }
      this.tabledatas.unshift(list)
    }
  }
}
</script>
<style>
  .el-table .dd-row{
  background: rgb(97, 165, 186);
}
.el-table .do-row{
  background: #6f6dda;
}
</style>
  <style scoped>
  .el-card /deep/ .el-card__header {
  padding: 5px;
  }
  </style>
