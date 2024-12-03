<template>
  <div>
    <div class="btngroups">
      <el-button type="success" icon="el-icon-back" @click="goback">返回上一页</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-dialog title="商品SKU" :visible.sync="formVisible" class="showAll_dialog2">
      <el-form ref="rform" :rules="rrules" :model="rform" :inline="true">
        <el-form-item label="sku名称" :label-width="formLabelWidth" prop="skuName">
          <el-input v-model="rform.skuName" size="mini" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="sku编码" :label-width="formLabelWidth" prop="skuCode">
          <el-input v-model="rform.skuCode" size="mini" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="sku条码" :label-width="formLabelWidth" prop="skuBarcode">
          <el-input v-model="rform.skuBarcode" style="width: 200px;" size="mini" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="尺寸" :label-width="formLabelWidth" prop="skuSize">
          <el-input v-model="rform.skuSize" size="mini" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="颜色" :label-width="formLabelWidth" prop="skuColor">
          <el-input v-model="rform.skuColor" size="mini" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="品牌" :label-width="formLabelWidth" prop="skuBrand">
          <el-input v-model="rform.skuBrand" size="mini" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="季节" :label-width="formLabelWidth" prop="skuSeason">
          <el-input v-model="rform.skuSeason" size="mini" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="国际码" :label-width="formLabelWidth" prop="countryBarcode">
          <el-input v-model="rform.countryBarcode" style="width: 200px;" size="mini" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="供货商条码" :label-width="formLabelWidth" prop="salerBarcode">
          <el-input v-model="rform.salerBarcode" style="width: 200px;" size="mini" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="扫描条码1" :label-width="formLabelWidth" prop="scanBarcode1">
          <el-input v-model="rform.scanBarcode1" style="width: 200px;" size="mini" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="扫描条码2" :label-width="formLabelWidth" prop="scanBarcode2">
          <el-input v-model="rform.scanBarcode2" style="width: 200px;" size="mini" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="扫描条码3" :label-width="formLabelWidth" prop="scanBarcode3">
          <el-input v-model="rform.scanBarcode3" style="width: 200px;" size="mini" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="重量(kg)" :label-width="formLabelWidth" prop="weight">
          <el-input v-model="rform.weight" size="mini" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="体积(L)" :label-width="formLabelWidth" prop="volumn">
          <el-input v-model="rform.volumn" size="mini" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="采购价(元)" :label-width="formLabelWidth" prop="money">
          <el-input
            v-model="rform.money"
            size="mini"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="forsure">确 定</el-button>
      </div>
    </el-dialog>
    <el-card class="show_card1" :body-style="{padding:'20px'}">
      <div slot="header" class="clearfix">
        <span class="title">商品信息</span>
      </div>
      <el-form ref="form" :rules="rules" :inline="true" class="demo-form-inline" :model="form">
        <el-form-item v-if="false" prop="id">
          <el-input v-model="form.id" size="mini" style="width: 160px;" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="form.goodsName" size="mini" style="width: 200px;" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="商品代码" prop="code">
          <el-input v-model="form.code" size="mini" style="width: 200px;" clearable />
        </el-form-item>
        <el-form-item label="商品条码" prop="barcode">
          <el-input v-model="form.barcode" size="mini" style="width: 200px;" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model="form.productCompany" size="mini" style="width: 200px;" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="商品条码(扩充)">
          <el-input v-model="form.barcode2" size="mini" style="width: 200px;" autocomplete="off" clearable />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card :body-style="{padding:'0px'}" class="show_card1">
      <div slot="header" class="clearfix">
        <span>商品sku填写</span>
        <el-button style="float: right;" type="primary" size="small" icon="el-icon-circle-plus-outline" @click="add">新增</el-button>
      </div>
      <el-table
        ref="tabledatas"
        :data="tabledatas"
        border
        :height="tableHeight"
        :row-class-name="tableRowClassDetailName"
        :header-cell-style="{background:'#091f2c',color: '#fff'}"
        size="mini"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <!-- <el-table-column type="selection" /> -->
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column label="sku名称" align="center" prop="skuName" :show-overflow-tooltip="true" />
        <el-table-column label="sku编码" align="center" prop="skuCode" :show-overflow-tooltip="true" />
        <el-table-column label="sku条码" align="center" prop="skuBarcode" :show-overflow-tooltip="true" />
        <el-table-column label="尺寸" align="center" prop="skuSize" :show-overflow-tooltip="true" />
        <el-table-column label="颜色" align="center" prop="skuColor" :show-overflow-tooltip="true" />
        <el-table-column label="品牌" align="center" prop="skuBrand" :show-overflow-tooltip="true" />
        <el-table-column label="季节" align="center" prop="skuSeason" :show-overflow-tooltip="true" />
        <el-table-column label="国际码" align="center" prop="countryBarcode" :show-overflow-tooltip="true" />
        <el-table-column label="供货商条码" align="center" prop="salerBarcode" :show-overflow-tooltip="true" />
        <el-table-column label="扫描条码1" align="center" prop="scanBarcode1" :show-overflow-tooltip="true" />
        <el-table-column label="扫描条码2" align="center" prop="scanBarcode2" :show-overflow-tooltip="true" />
        <el-table-column label="扫描条码3" align="center" prop="scanBarcode3" :show-overflow-tooltip="true" />
        <el-table-column label="重量(kg)" align="center" prop="weight" :show-overflow-tooltip="true" />
        <el-table-column label="体积(L)" align="center" prop="volumn" :show-overflow-tooltip="true" />
        <el-table-column label="采购价(元)" align="center" prop="money" :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" type="warning" @click="edit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="delect(scope.$index)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="btnsContain">
      <div>
        <el-button v-if="!show" icon="el-icon-folder-add" type="success" @click="submit">保存</el-button>
        <el-button v-if="show" icon="el-icon-folder-add" type="success" @click="update">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { addGoodsAndSku, screenGoodsSku, screenGoods, upgradeGoodsAndSku } from '@/api/user'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      tabledatas: [],
      formVisible: false,
      formLabelWidth: '100px',
      tableHeight: '50px',
      show: false,
      rules: {
        goodsName: {
          required: true,
          message: '请填写名称',
          tirgger: ['blur', 'change']
        },
        code: {
          required: true,
          message: '请填写',
          tirgger: ['blur', 'change']
        },
        barcode: {
          required: true,
          message: '请填写条码',
          tirgger: ['blur', 'change']
        }
      },
      rrules: {
        skuName: {
          required: true,
          message: '请填写sku名称',
          tirgger: ['blur', 'change']
        },
        skuCode: {
          required: true,
          message: '请填写sku编码',
          tirgger: ['blur', 'change']
        },
        skuBarcode: {
          required: true,
          message: '请填写sku条码',
          tirgger: ['blur', 'change']
        },
        weight: [
          {
            required: true,
            message: '请填写',
            tirgger: ['blur', 'change']
          },
          { pattern: /^[1-9][0-9]*([\.][0-9]{1,2})?$/, message: '请输入正数', trigger: 'change' }],
        volumn: [{
          required: true,
          message: '请填写',
          tirgger: ['blur', 'change']
        }, {
          pattern: /^[1-9][0-9]*([\.][0-9]{1,2})?$/, message: '请输入正数', trigger: 'change'
        }],
        money: [
          {
            required: true,
            message: '请填写',
            tirgger: ['blur', 'change']
          },
          { pattern: /^[1-9][0-9]*([\.][0-9]{1,2})?$/, message: '请输入正数', trigger: 'change' }]
      },
      currentPage2: 1, // 当前页码
      pageSize2: 15, // 每页的数据条数
      form: {
        id: '',
        goodsName: '',
        code: '',
        productCompany: '',
        barcode: '',
        barcode2: ''
      },
      rform: {
        skuCode: '',
        skuBarcode: '',
        skuName: '',
        skuDescribe: '',
        skuSize: '',
        skuColor: '',
        skuBrand: '',
        skuSeason: '',
        countryBarcode: '',
        salerBarcode: '',
        scanBarcode1: '',
        scanBarcode2: '',
        scanBarcode3: '',
        weight: '',
        volumn: '',
        money: ''
      }
    }
  },
  created() {
    if (sessionStorage.commodityChildId && sessionStorage.commodityId !== null) {
      this.show = true
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
    add() {
      this.title = '商品SKU'
      this.rform =
      {
        skuCode: '',
        skuBarcode: '',
        skuName: '',
        skuDescribe: '',
        skuSize: '',
        skuColor: '',
        skuBrand: '',
        skuSeason: '',
        countryBarcode: '',
        salerBarcode: '',
        scanBarcode1: '',
        scanBarcode2: '',
        scanBarcode3: '',
        weight: '',
        volumn: '',
        money: ''
      }
      this.submitType = 'add'
      this.formVisible = true
    },
    goback() {
      this.$router.go(-1)
    },
    // 编辑
    edit(_index, row) {
      this.submitType = 'update'
      this.rform = row
      this.formVisible = true
    },
    forsure() {
      if (this.submitType === 'add') {
        this.$refs.rform.validate((valid) => {
          if (valid) {
            this.tabledatas.push(this.rform)
            this.formVisible = false
          }
        })
      } else if (this.submitType === 'update') {
        this.formVisible = false
      } else {
        this.formVisible = true
      }
    },
    getList() {
      screenGoods({
        searchDTO: {
          page: 1,
          num: 100
        },
        pojo: {
          goodsName: sessionStorage.getItem('commodityId')
        }}).then(response => {
        this.form = Object.assign({}, response.data[0])
      })
      screenGoodsSku({
        searchDTO: {
          page: 1,
          num: 100
        },
        pojo: {
          goodsId: sessionStorage.getItem('commodityChildId')
        }}).then(response => {
        this.tabledatas = response.data
      })
    },
    delete(index, rows) {
      rows.splice(index, 1)
    },
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    update() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存修改信息吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            upgradeGoodsAndSku({ goodsSkuList: this.tabledatas, goods: {
              id: this.form.id,
              goodsName: this.form.goodsName,
              code: this.form.code,
              productCompany: this.form.productCompany,
              barcode: this.form.barcode,
              barcode2: this.form.barcode2
            }}).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.reload()
                sessionStorage.removeItem('commodityChildId')
                sessionStorage.removeItem('commodityId')
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
            addGoodsAndSku({ goodsSkuList: this.tabledatas, goods: {
              goodsName: this.form.goodsName,
              code: this.form.code,
              productCompany: this.form.productCompany,
              barcode: this.form.barcode,
              barcode2: this.form.barcode2
            }}).then(res => {
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
  }
}
</script>
  <style scoped>
  .el-card /deep/ .el-card__header {
    color: #fff;
  padding: 5px;
  }

     .el-form /deep/.el-form-item__label{
    color:#fff
  }
  </style>
    <style lang="scss" scoped>
       .btnsContain {
      div{
        width: 100px;
        margin: 0 auto;
      }
    }
// 修改对话框高度
.show_card1 {
      background-color:#081b26c3;
    }
  .showAll_dialog2 {
    ::v-deep.el-dialog {
      margin: 100px auto !important;
      overflow: hidden;
      background-color: #091f2c;

      .el-dialog__body {
        line-height: 30px;
        color: white;
        padding: 10px 15px;
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
