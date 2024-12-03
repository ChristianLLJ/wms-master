<template>
  <div>
    <div class="btngroups">
      <el-button type="success" icon="el-icon-back" @click="goback">返回上一页</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card class="show_card1" :body-style="{padding:'20px'}">
      <div slot="header" class="clearfix">
        <span class="title">质检任务单头</span>
      </div>
      <el-form ref="form" :inline="true" class="demo-form-inline" :rules="rules" :model="form">
        <el-form-item v-if="false">
          <el-input v-model="form.id" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item v-if="false">
          <el-input v-model="form.checkCode" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="仓库id">
          <el-input v-model="form.warehouseId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="仓库" prop="warehouseName">
          <el-select v-model="form.warehouseName" size="mini" placeholder="请选择" @focus="func" @change="changeWarehouseOptions">
            <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" label="仓库代码">
          <el-input v-model="form.warehouseCode" disabled size="mini" placeholder="选择仓库后自动填充" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="随机质检的sku种类数量" prop="randomNum">
          <el-input v-model="form.randomNum" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="show_card1" :body-style="{padding:'0px'}" shadow="always">
      <div slot="header" class="clearfix">
        <span>商品信息</span>
        <!-- <el-button size="mini" style="float: right; padding: 5px 0" icon="el-icon-circle-plus-outline" type="text" @click="add">新增</el-button> -->
      </div>
      <el-form ref="formData" :model="formData" :rules="formData.rules">

        <el-table
          ref="tabledatas"
          :data="formData.tabledatas.slice((currentPage2-1)*pageSize2,currentPage2*pageSize2)"
          :height="tableHeight"
          tooltip-effect="dark"
          size="mini"
          :header-cell-style="{background:'#091f2c',color: '#fff'}"
          :row-class-name="tableRowClassDetailName"
          :row-style="{height:'20px'}"
          :cell-style="{padding:'0px'}"
          style="width: 100%, font-size: 10px"
        >
          <el-table-column type="index" label="序号" align="center" />
          <el-table-column label="商品名称" align="center" width="120px">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.commodityName'" :rules="formData.rules.commodityName">
                <el-select v-model="scope.row.commodityName" size="mini" placeholder="请选择" @focus="funcCommodity" @change="changeComOptions(scope.row)">
                  <el-option v-for="item in commodityOptions" :key="item.id" :label="item.goodsName" :value="item.goodsName" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="商品id" align="center">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.commodityId" size="mini" />
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="商品代码" align="center">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.commodityCode" size="mini" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="商品sku" align="center" width="150px">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.skuCode'" :rules="formData.rules.skuCode">
                <el-select v-model="scope.row.skuName" size="mini" placeholder="请选择" @focus="funcSku(scope.row)" @change="changeSku(scope.row)">
                  <el-option v-for="item in skuOptions" :key="item.id" :label="item.skuName" :value="item.skuName" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="单位" align="center">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.unit" size="mini" />
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="skuId" align="center">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.skuId" size="mini" />
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="sku名称" align="center">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.skuCode" size="mini" />
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="包装名称" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.containerName'" :rules="formData.rules.containerName">
                <el-select v-model="scope.row.containerName" size="mini" placeholder="请选择" @focus="funcContainer" @change="changeConOptions(scope.row)">
                  <el-option v-for="item in containerOptions" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
              </el-form-item>
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
          <el-table-column v-if="false" label="客户Id" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.customId" size="mini" style="width: 160px;" clearable />
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="客户代码" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.customCode" size="mini" style="width: 160px;" clearable />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="客户名称" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.customName'" :rules="formData.rules.customName">
                <el-select v-model="scope.row.customName" size="mini" @focus="funClient" @change="changeClientOptions(scope.row)">
                  <el-option v-for="item in clientOptions" :key="item.id" :label="item.customName" :value="item.customName" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="供应商Id" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.supplierId" size="mini" style="width: 160px;" clearable />
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="供应商代码" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.supplierCode" size="mini" style="width: 160px;" clearable />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="供应商名称" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-form-item :prop="'tabledatas.' + scope.$index + '.supplierName'" :rules="formData.rules.supplierName">
                <el-select v-model="scope.row.supplierName" size="mini" @focus="funClient" @change="changeOptions(scope.row)">
                  <el-option v-for="item in clientOptions" :key="item.id" :label="item.customName" :value="item.customName" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="质检商品数量(个)" align="center">
            <!-- <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.randomCheckNum" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" />
              </span>
            </template> -->
          </el-table-column>
          <el-table-column label="预检商品总数量(个)" align="center">
            <!-- <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.predictNum" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" />
              </span>
            </template> -->
          </el-table-column>
          <el-table-column label="生产厂家" align="center" prop="productFactory" />
          <el-table-column label="生产日期" align="center" :show-overflow-tooltip="true" prop="productTime" />
          <el-table-column label="生产批次" align="center" prop="productBatch" />
          <!-- <el-table-column label="应检数量(个)" align="center">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.predictCheckNum" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" />
              </span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="操作" align="center" width="100px">
            <template slot-scope="scope">
              <el-button size="mini" @click="delect(scope.$index)">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-form>
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
import { addQualityCheck, saveQualityCheck, updQualityTable, selectQualityCheck, selectQualityCheckDetail } from '@/api/user'
import { searchcustomer, searchwarehouse, searchcom, searchcon, searchsku } from '@/utils/search'
// import { getNowTime } from '@/utils/getTime'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      lastTime: 0,
      lastfunTime: 0,
      tableHeight: 50,
      warehouseOptions: [],
      clientOptions: [],
      lastcomTime: 0,
      lastconTime: 0,
      List: [],
      tableData: [],
      show: false,
      containerOptions: [],
      skuOptions: [],
      commodityOptions: [],
      currentPage2: 1, // 当前页码
      pageSize2: 15, // 每页的数据条数
      rules: {
        warehouseName: [{ required: true, message: '请选择仓库名称', trigger: 'change' }],
        randomNum: [{ required: true, message: '请填写随机质检数', trigger: 'change' }]
      },
      formData: {
        rules: {
          commodityName: {
            required: true,
            tirgger: ['change']
          },
          skuCode: {
            required: true,
            tirgger: ['change']
          },
          containerName: {
            required: true,
            tirgger: ['change']
          },
          customName: {
            required: true,
            tirgger: ['change']
          },
          supplierName: {
            required: true,
            tirgger: ['change']
          }
        },
        tabledatas: []
      },
      form: {
        checkCode: '',
        id: '',
        // createTime: '',
        checkerName: '',
        warehouseName: '',
        warehouseCode: '',
        warehouseId: ''
      }
    }
  },
  created() {
    if (sessionStorage.qualityChildId && sessionStorage.checkCode !== null) {
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
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    goback() {
      this.$router.go(-1)
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
    changeConOptions(row) {
      const item = this.containerOptions.find(item1 => item1.name === row.containerName)
      row.containerId = item.id
      row.containerName = item.name
      row.containerCode = item.code
    },
    funcSku(row) {
      if (row.commodityId === '') {
        this.$message({
          message: '请先填写商品信息！',
          type: 'warning'
        })
      } else {
        searchsku(row.commodityId).then(res => {
          this.skuOptions = res.data.map(item => {
            return { id: item.id, skuName: item.skuName, skuCode: item.skuCode }
          })
        }
        )
      }
    },
    changeSku(row) {
      const item = this.skuOptions.find(item1 => item1.skuName === row.skuName)
      row.skuId = item.id
      row.skuCode = item.skuCode
      row.skuName = item.skuName
    },
    chooseData() {
      this.tableData = []
      selectQualityCheckDetail({
        pojo: {
          checkId: sessionStorage.getItem('qualityChildId')
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
      selectQualityCheck({
        pojo: {
          checkCode: sessionStorage.getItem('checkCode')
        }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
        this.form = Object.assign({}, response.data[0])
      })
      selectQualityCheckDetail({
        pojo: {
          checkId: sessionStorage.getItem('qualityChildId')
        }}).then(response => {
        this.formData.tabledatas = response.data.list
      })
    },
    changeWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.form.warehouseName)
      this.form.warehouseId = item.id
      this.form.warehouseName = item.warehouseName
      this.form.warehouseCode = item.warehouseCode
    },
    changeComOptions(row) {
      const item = this.commodityOptions.find(item1 => item1.goodsName === row.commodityName)
      row.commodityId = item.id
      row.commodityName = item.goodsName
      row.commodityCode = item.code
    },
    changeClientOptions(row) {
      const item = this.clientOptions.find(item1 => item1.customName === row.customName)
      row.customId = item.id
      row.customName = item.customName
      row.customCode = item.customCode
    },
    changeOptions(row) {
      const item = this.clientOptions.find(item1 => item1.customName === row.supplierName)
      row.supplierId = item.id
      row.supplierName = item.customName
      row.supplierCode = item.customCode
    },
    funcCommodity() {
      const now = new Date().valueOf()
      if (this.lastcomTime === 0) {
        searchcom().then(res => {
          this.commodityOptions = res.data
        }
        )
        this.lastcomTime = now
      } else {
        if ((now - this.lastcomTime) > 5000) {
          this.lastcomTime = now
        }
      }
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
    // 单个删除
    // delect(index) {
    //   this.tableData.splice(index, 1)
    // },
    save() {
      this.$confirm('是否要暂存所填信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saveQualityCheck({ details: this.formData.tabledatas, head: {
          // checkType: this.form.checkType,
          checkerName: this.form.checkerName,
          // sourceType: this.form.sourceType,
          // createTime: this.form.createTime,
          warehouseId: this.form.warehouseId,
          warehouseCode: this.form.warehouseCode,
          warehouseName: this.form.warehouseName
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
    handleSizeChange2(val) {
      this.currentPage2 = 1
      this.pageSize2 = val
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val
    },
    update() {
      this.chooseData()
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.formData.validate((valid) => {
            if (valid) {
              this.$confirm('是否确定更新所填信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                updQualityTable({ details: this.List, head: {
                  id: this.form.id,
                  checkCode: this.form.checkCode,
                  // checkType: this.form.checkType,
                  checkerName: this.form.checkerName,
                  // sourceType: this.form.sourceType,
                  // createTime: this.form.createTime,
                  warehouseId: this.form.warehouseId,
                  warehouseCode: this.form.warehouseCode,
                  warehouseName: this.form.warehouseName
                }}).then(res => {
                  if (res.code === 200) {
                    this.$message.success('更新成功')
                    this.reload()
                    this.$router.replace({ path: 'quality' })
                    sessionStorage.removeItem('qualityChildId')
                    sessionStorage.removeItem('checkCode')
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
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.formData.validate((valid) => {
            if (valid) {
              this.$confirm('此操作提交所填信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                addQualityCheck({ details: this.formData.tableData, head: {
                  // checkType: this.form.checkType,
                  checkerName: this.form.checkerName,
                  // sourceType: this.form.sourceType,
                  // createTime: this.form.createTime,
                  warehouseId: this.form.warehouseId,
                  warehouseCode: this.form.warehouseCode,
                  warehouseName: this.form.warehouseName
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
        }
      })
    },
    add() {
      const list = {
        commodityId: '',
        commodityCode: '',
        commodityName: '',
        SKUCode: '',
        containerId: '',
        containerCode: '',
        containerName: '',
        customName: '',
        customId: '',
        customCode: '',
        supplierId: '',
        supplierName: '',
        supplierCode: '',
        unit: '',
        productFactory: '',
        productTime: '',
        productBatch: '',
        predictNum: '',
        predictCheckNum: '',
        randomCheckNum: ''
      }
      this.formData.tabledatas.unshift(list)
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

