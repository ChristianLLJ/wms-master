<template>
  <div>
    <div class="btngroups">
      <el-button type="success" icon="el-icon-back" @click="goback">返回上一页</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-card class="show_card1" :body-style="{padding:'20px'}">
      <div slot="header" align="center">
        <span class="title">装箱任务-无计划单头</span>
      </div>
      <el-form ref="form" :inline="true" class="demo-form-inline" :rules="rules" :model="form">
        <el-form-item v-if="false" label="仓库id">
          <el-input v-model="form.warehouseId" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="仓库" prop="warehouseCode">
          <el-select v-model="form.warehouseCode" size="mini" placeholder="请选择" @focus="func" @change="changeWarehouseOptions">
            <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseCode" :value="item.warehouseName" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" label="仓库代码">
          <el-input v-model="form.warehouseName" size="mini" style="width: 160px;" clearable />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" maxlength="100" show-word-limit style="width: 500px" :rows="3" size="mini" clearable />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="show_card1" :body-style="{padding:'0px'}">
      <div slot="header" align="center">
        <span>装箱任务-无计划表细</span>
        <!-- <el-button v-if="!show" icon="el-icon-plus" type="primary" @click="add">新增</el-button> -->
      </div>
      <el-table
        ref="tabledatas"
        :data="formData.tabledatas"
        size="mini"
        :height="tableHeight"
        :header-cell-style="{background:'#262626',color: '#fff'}"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%, font-size: 10px"
      >
        <!-- <el-table-column type="selection" /> -->
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column v-if="false" label="id" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.id" size="mini" />
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="false" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.packingId" size="mini" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="计划单编码" align="center" prop="planCode">
          <!-- <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.packageBarcode" size="mini" />
            </span>
          </template> -->
        </el-table-column>
        <el-table-column label="跟踪号" align="center" prop="traceCode">
          <!-- <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.packageBarcode" size="mini" />
            </span>
          </template> -->
        </el-table-column>
        <el-table-column label="入库计划单跟踪码" align="center" prop="inboundTraceCode">
          <!-- <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.packageBarcode" size="mini" />
            </span>
          </template> -->
        </el-table-column>
        <el-table-column label="包装条码" align="center" prop="packageBarcode">
          <!-- <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.packageBarcode" size="mini" />
            </span>
          </template> -->
        </el-table-column>
        <el-table-column label="商品sku名称" align="center" width="190px">
          <template slot-scope="scope">

            <el-select
              v-model="scope.row.skuName"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="funcSku"
              size="mini"
              @change="changeSku(scope.row)"
            >
              <el-option v-for="item in skuOptions" :key="item.id" :label="item.skuName" :value="item.skuName" />
            </el-select>

          </template>
        </el-table-column>
        <el-table-column v-if="false" label="skuId" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.skuId" size="mini" />
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="sku代码" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.skuCode" size="mini" />
            </span>
          </template>
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
        <el-table-column v-if="false" label="包装id" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.packageId" size="mini" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="箱中商品数量(个)" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.commodityNum" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="生产厂家" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.productCompany" size="mini" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="生产日期" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>
              <el-date-picker
                v-model="scope.row.productTime"
                size="mini"
                type="date"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="生产批次" align="center">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.productBatch" size="mini" />
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
            <span>
              <el-select v-model="scope.row.customName" size="mini" @focus="funClient" @change="changeClientOptions(scope.row)">
                <el-option v-for="item in clientOptions" :key="item.id" :label="item.customName" :value="item.customName" />
              </el-select>
            </span>
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
            <span>
              <el-select v-model="scope.row.supplierName" size="mini" @focus="funClient" @change="changeOptions(scope.row)">
                <el-option v-for="item in clientOptions" :key="item.id" :label="item.customName" :value="item.customName" />
              </el-select>
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center" width="100px">
          <template>
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
import { selectInPackage, selectInPackageDetail, updPackTable } from '@/api/user'
import { searchwarehouse, searchcustomer, searchsku, searchcon } from '@/utils/search'
// addInPackage saveInPackage
export default {
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      lastTime: 0,
      lastfunTime: 0,
      tableHeight: 50,
      warehouseOptions: [],
      clientOptions: [],
      lastconTime: 0,
      containerOptions: [],
      states: [],
      skulist: [],
      skuOptions: [],
      currentPage2: 1, // 当前页码
      pageSize2: 15, // 每页的数据条数
      rules: {
        warehouseCode: [{ required: true, message: '请选择仓库', trigger: 'change' }]
      },
      formData: {
        rules: {
          skuName: {
            required: true,
            tirgger: ['change']
          }
        },
        tabledatas: []
      },
      form: {
        id: '',
        packingId: '',
        // sourceType: '',
        packingTime: '',
        warehouseId: '',
        // warehouseName: '',
        warehouseCode: '',
        remark: '',
        packingName: ''
      }
    }
  },
  created() {
    if (sessionStorage.packChildId && sessionStorage.packingId !== null) {
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
    // delect(index) {
    //   this.tabledatas.splice(index, 1)
    // },
    goback() {
      this.$router.go(-1)
    },
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    handleSizeChange2(val) {
      this.currentPage2 = 1
      this.pageSize2 = val
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val
    },
    getList() {
      selectInPackage({
        pojo: {
          packingId: sessionStorage.getItem('packingId')
        }, workGroupId: window.sessionStorage.workGroupId }).then(response => {
        this.form = Object.assign({}, response.data[0])
      })
      selectInPackageDetail({
        pojo: {
          packingId: sessionStorage.getItem('packChildId')
        }}).then(response => {
        this.formData.tabledatas = response.data.list
      })
      // sessionStorage.removeItem('orderId')
      // sessionStorage.removeItem('childId')
    },
    funcSku(query) {
      searchsku()
        .then(res => {
          this.states = res.data
          this.skulist = this.states.map(item => {
            return { id: item.id, skuName: item.skuName, skuCode: item.skuCode }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.skuOptions = this.skulist.filter(item => {
              return item.skuName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.skuOptions = []
        }
      }, 100)
    },
    changeSku(row) {
      const item = this.skuOptions.find(item1 => item1.skuName === row.skuName)
      row.skuId = item.id
      row.skuCode = item.skuCode
      row.skuName = item.skuName
    },
    changeWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseCode === this.form.warehouseCode)
      this.form.warehouseId = item.id
      // this.form.warehouseName = item.warehouseName
      this.form.warehouseCode = item.warehouseCode
    },
    changeConOptions(row) {
      const item = this.containerOptions.find(item1 => item1.code === row.packageCode)
      row.packageId = item.id
      // row.containerName = item.name
      row.packageCode = item.code
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
    // save() {
    //   this.$confirm('是否要暂存所填信息?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     saveInPackage({ details: this.tabledatas, head: {
    //       packingTime: this.form.packingTime,
    //       warehouseCode: this.form.warehouseCode,
    //       warehouseName: this.form.warehouseName,
    //       warehouseId: this.form.warehouseId,
    //       packingName: this.form.packingName,
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.formData.validate((valid) => {
            if (valid) {
              this.$confirm('确定保存更新信息吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                updPackTable({ details: this.formData.tabledatas, head: {
                  id: this.form.id,
                  packingId: this.form.packingId,
                  packingTime: this.form.packingTime,
                  warehouseCode: this.form.warehouseCode,
                  warehouseName: this.form.warehouseName,
                  warehouseId: this.form.warehouseId,
                  packingName: this.form.packingName,
                  remark: this.form.remark
                }}).then(res => {
                  if (res.code === 200) {
                    this.$message.success('更新成功')
                    this.reload()
                    this.$router.replace({ path: 'packing' })
                    sessionStorage.removeItem('packChildId')
                    sessionStorage.removeItem('packingId')
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
    // submit() {
    //   this.$refs.form.validate((valid) => {
    //     if (valid) {
    //       this.$confirm('此操作提交所填信息, 是否继续?', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       }).then(() => {
    //         addInPackage({ details: this.tabledatas, head: {
    //           packingTime: this.form.packingTime,
    //           warehouseCode: this.form.warehouseCode,
    //           warehouseName: this.form.warehouseName,
    //           warehouseId: this.form.warehouseId,
    //           packingName: this.form.packingName,
    //           remark: this.form.remark
    //         }}).then(res => {
    //           if (res.code === 200) {
    //             this.$message.success('提交成功')
    //             this.reload()
    //           }
    //         })
    //       }).catch(() => {
    //         this.$message({
    //           type: 'info',
    //           message: '已取消提交'
    //         })
    //       })
    //     }
    //   })
    // },
    add() {
      const list = {
        // packingCode: '',
        // traceCode: '',
        SKUCode: '',
        skuName: '',
        skuId: '',
        containerName: '',
        containerId: '',
        containerCode: '',
        commodityNum: '',
        productCompany: '',
        productTime: '',
        productBatch: '',
        customName: '',
        customId: '',
        customCode: '',
        // inboundTraceCode: '',
        supplierName: '',
        supplierId: '',
        supplierCode: ''
        // planCode: ''
      }
      this.formData.tabledatas.unshift(list)
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

