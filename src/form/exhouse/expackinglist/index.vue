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
        <el-form-item label="装箱编号">
          <el-input v-model="form.exPickingId" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="form.customerName" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="收货人编号">
          <el-input v-model="form.receiverId" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="来源单据">
          <el-input v-model="form.billSource" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="波次号">
          <el-input v-model="form.waveNumber" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="装箱类型">
          <el-select v-model="form.exPickingType" size="mini">
            <el-option
              v-for="item in eoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="作业类型">
          <el-select v-model="form.workType" size="mini">
            <el-option
              v-for="item in woptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库代码">
          <el-input v-model="form.warehouseCode" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="货主代码">
          <el-input v-model="form.cargoOwnerCode" style="width: 160px;" size="mini" clearable />
        </el-form-item>
        <el-form-item label="顾客代码">
          <el-input v-model="form.customerCode" style="width: 160px;" size="mini" clearable />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card :body-style="{padding:'0px'}" shadow="always">
      <div slot="header" class="clearfix">
        <span>表细填写</span>
      </div>
      <el-table
        :data="tabledatas"
        :row-class-name="tableRowClassDetailName"
        border
        size="mini"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <!-- <el-table-column type="selection" /> -->
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column label="装箱单号" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.exPickingDetailId" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.exPickingDetailId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="sku编码" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.skuCode" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.skuCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="sku条码" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.skuBarCode" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.skuBarCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="sku数量" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.skuCnt" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.skuCnt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="sku单价" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.skuPrice" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.skuPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="尺寸" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.goodsSize" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.goodsSize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="颜色" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.goodsColor" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.goodsColor }}</span>
          </template>
        </el-table-column>
        <el-table-column label="供应商名称" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.supplierName" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.supplierName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生产厂家" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.productCompany" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.productCompany }}</span>
          </template>
        </el-table-column><el-table-column label="生产日期" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-date-picker
                v-model="scope.row.productTime"
                :value-format="'yyyy-MM-dd'"
                size="mini"
                type="date"
                placeholder="选择日期"
              />
            </span>
            <span v-else>{{ scope.row.productTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生产批次" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.productBatch" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.productBatch }}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟踪号" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.traceCode" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.traceCode }}</span>
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
import { addExPickingAndDetail } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      tabledatas: [
      ],
      eoptions: [
        {
          value: 0,
          label: 0
        },
        {
          value: 1,
          label: 1
        }
      ],
      woptions: [
        {
          value: 0,
          label: 0
        },
        {
          value: 1,
          label: 1
        }
      ],
      form: {
        exPickingId: '',
        customerName: '',
        receiverId: '',
        billSource: '',
        waveNumber: '',
        exPickingType: '',
        workType: '',
        warehouseCode: '',
        cargoOwnerCode: '',
        customerCode: ''
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
        addExPickingAndDetail({ exPickingDetailList: this.tabledatas, exPicking: {
          exPickingId: this.form.exPickingId,
          customerName: this.form.customerName,
          receiverId: this.form.receiverId,
          billSource: this.form.billSource,
          waveNumber: this.form.waveNumber,
          exPickingType: this.form.exPickingType,
          workType: this.form.workType,
          warehouseCode: this.form.warehouseCode,
          cargoOwnerCode: this.form.cargoOwnerCode,
          customerCode: this.form.customerCode
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
        exPickingDetailId: '',
        skuCode: '',
        skuCnt: '',
        goodsSize: '',
        goodsColor: '',
        skuBarCode: '',
        skuPrice: '',
        supplierName: '',
        productCompany: '',
        productTime: '',
        productBatch: '',
        traceCode: ''
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
