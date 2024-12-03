<template>
  <div>
    <div class="btngroups">
      <el-button type="success" icon="el-icon-back" @click="goback">返回上一页</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card :body-style="{padding:'10px'}">
      <div slot="header" align="center">
        <span>库存冻结表-表头填写</span>
      </div>
      <el-form :inline="true" size="small" :model="form">
        <el-form-item label="冻结编号">
          <el-input v-model="form.freezeCode" :disabled="true" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="冻结原因">
          <el-input v-model="form.freezeReason" size="small" placeholder="请填写" style="width: 200px;" />
          <!--
          <el-select v-model="form.freezeReason" size="small" placeholder="请选择" @focus="funcReason">
            <el-option v-for="item in reasonOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
          </el-select> -->
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="查找需要冻结的商品" :visible.sync="dialogTableVisible" width="80%" class="showAll_dialog2">
      <query-data
        :rform="rform"
        :data-list-selections="dataListSelections"
        @tableData="tableData"
        @clickSelect="clickSelect"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="searchData">确认选择表格数据进行冻结</el-button>
      </div>
    </el-dialog>
    <el-card :body-style="{padding:'0px'}" shadow="always">
      <div slot="header" align="center">
        <span style="padding-right: 10px">库存冻结表-表细填写</span>
        <el-button icon="el-icon-plus" size="small" type="primary" @click="add">新增</el-button>
      </div>
      <el-table
        ref="tabledatas"
        :data="tabledatas"
        size="mini"
        :height="tableHeight"
        :row-style="{height:'20px'}"
        :header-cell-style="{background:'#000',color: '#fff'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column label="客户名称" align="center" prop="customName" />
        <el-table-column label="商品" align="center" prop="commodityName" />
        <el-table-column label="sku编码" align="center" prop="skuCode" />
        <el-table-column label="sku名称" align="center" prop="skuName" />
        <el-table-column label="库位代码" align="center" prop="locationCode" />
        <el-table-column label="包装" align="center" prop="containerName" />
        <el-table-column label="生产厂家" align="center" prop="productCompany" />
        <el-table-column label="冻结数量(个)" align="center" :show-overflow-tooltip="true" prop="commodityNum" />
        <el-table-column align="center" label="生产日期" :show-overflow-tooltip="true" prop="productTime">
          <template slot-scope="scope">{{ scope.row.productTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="生产批次" align="center" prop="productBatch" />
        <!-- <el-table-column label="跟踪号" align="center" prop="traceCode" /> -->
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" @click="delect(scope.$index)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="btnsContain">
      <div>
        <el-button size="small" icon="el-icon-save" type="success" @click="submit">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { submitFreezeAndDetail, stockFreezeGetHeadCode } from '@/api/user'
import QueryData from './components/QueryData.vue'
// import { searchsystemid } from '@/utils/search'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { QueryData },

  data() {
    return {
      tabledatas: [],
      tableFreeze: [],
      tableHeight: '50px',
      dialogTableVisible: false,
      reasonOptions: [],
      dataListSelections: [],
      rform: {
        warehouseName: null,
        freezeType: null,
        areaName: null,
        locationName: null,
        customName: null,
        traceCode: null,
        commodityName: null,
        productCompany: null,
        skuName: null,
        productBatch: null
      },
      form: {
        freezeReason: '',
        freezeCode: ''
      }
    }
  },
  created() {
    this.getHeadCode()
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tabledatas.$el.offsetTop - 77

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tabledatas.$el.offsetTop - 77
      }
    })
  },
  methods: {
    refresh() {
      this.reload()
    },
    // funcReason() {
    //   searchsystemid(50).then(res => {
    //     this.reasonOptions = res.data
    //   }
    //   )
    // },
    clickSelect(val) {
      this.tableFreeze = []
      this.dataListSelections = val
    },
    goback() {
      this.$router.go(-1)
    },
    submit() {
      this.$confirm('此操作提交所填信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        submitFreezeAndDetail({ freezeDetailList: this.tabledatas, stockFreeze: {
          freezeReason: this.form.freezeReason,
          // freezeTime: this.form.freezeTime,
          freezePersonId: Number(sessionStorage.getItem('getUserId')),
          freezePersonName: sessionStorage.getItem('getUserName'),
          freezeCode: this.form.freezeCode
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
    getHeadCode() {
      stockFreezeGetHeadCode({ code: 'FRE' }).then(res => {
        if (res.code === 200) {
          this.form.freezeCode = res.data
        }
      })
    },
    deleteId() {
      for (var i = 0; i < this.tabledatas.length; i++) {
        delete this.tabledatas[i].id
        this.tabledatas[i].commodityNum = this.tabledatas[i].availableCnt
      }
    },
    // 单个删除
    delect(index) {
      this.tabledatas.splice(index, 1)
    },
    tableData(val) {
      this.tableFreeze = val
    },
    searchData() {
      this.dialogTableVisible = false
      this.dialogTableResultVisible = true
      if (this.dataListSelections.length === 0) {
        this.tabledatas = this.tableFreeze
        this.deleteId()
      } else {
        this.tabledatas = this.dataListSelections
        this.deleteId()
      }
    },
    add() {
      this.dialogTableVisible = true
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
  padding: 5px;
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
                 margin: 10px auto !important;
                 overflow: auto;
                //  height: 95%;
                 border: #fff 1px solid;
                  box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
               0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);
                 background-color: #091f2c;

                 .el-dialog__body {
                   line-height: 30px;
                   color: white;
                   padding: 10px 15px;
                  //  height: 85%
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

