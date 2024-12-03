<template>
  <div>
    <div class="btngroups">
      <el-button-group>
        <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        <el-button size="mini" type="primary" icon="el-icon-folder-checked">保存</el-button>
      </el-button-group>
    </div>
    <el-card :body-style="{padding:'10px'}">
      <div slot="header" class="clearfix">
        <span class="title">表头填写</span>
      </div>
      <el-form :inline="true" class="demo-form-inline" :model="form">
        <el-form-item label="收货人">
          <el-input v-model="form.receiverName" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="收货人电话">
          <el-input v-model="form.receiverNum" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="收货人地址">
          <el-input v-model="form.receiverAddress" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="发货人">
          <el-input v-model="form.shipperName" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="发货人电话">
          <el-input v-model="form.shipperNum" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="发货人地址">
          <el-input v-model="form.shipperAddress" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="快递跟踪单号">
          <el-input v-model="form.expressTraceId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="快递类型">
          <el-input v-model="form.expressType" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="快递公司">
          <el-input v-model="form.expressCompamy" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="毛重">
          <el-input v-model="form.weight" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="长">
          <el-input v-model="form.length" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="宽">
          <el-input v-model="form.wide" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="高">
          <el-input v-model="form.high" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="form.cnt" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="体积">
          <el-input v-model="form.volumn" size="mini" style="width: 160px;" clearable />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card :body-style="{padding:'0px'}" shadow="always">
      <div slot="header" class="clearfix">
        <span>表细填写</span>
        <el-button size="mini" style="float: right; padding: 5px 0" icon="el-icon-circle-plus-outline" type="text" @click="add">新增</el-button>
      </div>
      <el-table
        :data="tabledatas"
        size="mini"
        :row-class-name="tableRowClassDetailName"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <!-- <el-table-column type="selection" /> -->
        <el-table-column type="index" label="序号" align="center" />
        <!-- <el-table-column label="采购订单编号" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.detailId" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.detailId }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="sku编码" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.skuCode" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.skuCode }}</span>
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
        <el-table-column label="sku条码" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.skuBarCode" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.skuBarCode }}</span>
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
        <el-table-column label="供应商编号" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.supplierNumber" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.supplierNumber }}</span>
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
        </el-table-column>
        <el-table-column label="生产日期" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-date-picker
                v-model="scope.row.productTime"
                :value-format="'yyyy-MM-dd'"
                type="date"
                size="mini"
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
        <!-- <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show">
              <el-input v-model="scope.row.remarks" size="mini" placeholder="请输入内容" />
            </span>
            <span v-else>{{ scope.row.remarks }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="action"
          label="操作"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" @click="edit(scope.row,scope.$index)">{{ scope.row.show?'保存':"编辑" }}</el-button>
              <el-button size="mini" @click="delect(scope.$index)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="float: right; padding: 5px 0" type="text" @click="submit">提交</el-button>
    </el-card></div>
</template>
<script>
import { addExpressDeliveryAndDetail } from '@/api/user'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      tabledatas: [
      ],
      form: {
        receiverName: '',
        receiverNum: '',
        receiverAddress: '',
        shipperName: '',
        shipperNum: '',
        shipperAddress: '',
        expressTraceId: '',
        expressType: '',
        expressCompamy: '',
        weight: '',
        length: '',
        wide: '',
        high: '',
        cnt: '',
        volumn: ''
      },
      soptions: [],
      toptions: []
    }
  },
  created() {
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    delect(index) {
      this.tabledatas.splice(index, 1)
    },
    refresh() {
      this.reload()
    },
    edit(row, index) {
      row.show = !row.show
      this.$set(this.tabledatas, index, row)
    },
    tableRowClassDetailName({ rowIndex }) {
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
        addExpressDeliveryAndDetail({ expressDeliveryDetailList: this.tabledatas, expressDelivery: {
          receiverName: this.form.receiverName,
          receiverNum: this.form.receiverNum,
          receiverAddress: this.form.receiverAddress,
          shipperName: this.form.shipperName,
          shipperNum: this.form.shipperNum,
          shipperAddress: this.form.shipperAddress,
          expressTraceId: this.form.expressTraceId,
          expressType: this.form.expressType,
          expressCompamy: this.form.expressCompamy,
          weight: this.form.weight,
          length: this.form.length,
          wide: this.form.wide,
          high: this.form.high,
          cnt: this.form.cnt,
          volumn: this.form.volumn
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
    add() {
      const list = {
        skuCode: '',
        skuCnt: '',
        goodsSize: '',
        goodsColor: '',
        skuBarCode: '',
        skuPrice: '',
        supplierNumber: '',
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
