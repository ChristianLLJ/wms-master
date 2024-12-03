<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="btngroups">
          <el-button-group>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新建</el-button>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="onupload">上传商品条码</el-button>
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="search">
          <el-input v-model="containerName" style="width: 200px" size="mini" placeholder="请填写" clearable />
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-dialog v-drag title="商品货码" :visible.sync="dialogFormVisible" class="showAll_dialog2">
      <el-form ref="form" :rules="rules" :inline="true" :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="包装名称" :label-width="formLabelWidth" prop="containerName">
              <ComboGrid
                v-model="form.containerName"
                value-field="name"
                text-field="name"
                :data="containerOptions"
                :panel-style="{width:'500px'}"
                :text-formatter="formatConText"
                @focus="focusCon"
                @valueChange="exampleCon"
              >
                <DataGrid slot="grid" :border="false">
                  <GridColumn v-if="false" field="id" title="序号" />
                  <GridColumn field="name" title="包装名称" />
                  <GridColumn field="code" title="包装代码" />
                  <GridColumn field="innerNum" title="包装容量" />
                  <GridColumn field="length" title="长(m)" />
                  <GridColumn field="width" title="宽(m)" />
                  <GridColumn field="highth" title="高(m)" />
                </DataGrid>
              </ComboGrid>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="sku批次" :label-width="formLabelWidth">
              <el-input v-model="form.skuBatch" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>

        </el-row>
        <el-form-item v-if="false" label="包装代码" :label-width="formLabelWidth">
          <el-input v-model="form.containerCode" size="mini" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="包装id" :label-width="formLabelWidth">
          <el-input v-model="form.containerId" size="mini" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="sku代码" :label-width="formLabelWidth">
          <el-input v-model="form.skuCode" size="mini" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="skuid" :label-width="formLabelWidth">
          <el-input v-model="form.skuId" size="mini" placeholder="请输入" clearable />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="sku名称" :label-width="formLabelWidth" prop="skuName">
              <ComboGrid
                v-model="form.skuName"
                value-field="skuName"
                text-field="skuName"
                :multiple="true"
                :data="skuOptions"
                :panel-style="{width:'500px'}"
                :text-formatter="formatSkuText"
                @focus="focusSku()"
                @valueChange="exampleSku"
              >
                <DataGrid slot="grid" :border="false">
                  <GridColumn field="id" title="序号" />
                  <GridColumn field="skuName" title="sku名称" />
                  <GridColumn field="skuCode" title="sku代码" />
                  <GridColumn field="skuColor" title="sku颜色" />
                  <GridColumn field="skuSize" title="尺寸" />
                  <GridColumn field="skuSeason" title="季节" />
                </DataGrid>
              </ComboGrid>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准装箱量" :label-width="formLabelWidth">
              <el-input v-model="form.ctn" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="商品货号" :label-width="formLabelWidth" prop="artno">
              <el-input v-model="form.artno" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col> -->
        </el-row>
        <!-- <el-row>

        </el-row> -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="!show" type="primary" @click="submit">保存</el-button>
        <el-button v-if="show" type="primary" @click="update">保存</el-button>
      </div>
    </el-dialog>
    <el-table
      ref="tableData"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      :height="tableHeight"
      :row-key="getRowKeys"
      border
      :header-cell-style="{background:'#000',color: '#fff'}"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      size="mini"
      style="width: 100%, font-size: 10px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        show-overflow-tooltip
        reserve-selection
      />
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column
        v-if="false"
        prop="id"
        align="center"
      />
      <el-table-column label="包装名称" align="center" :show-overflow-tooltip="true" prop="containerName" />
      <el-table-column label="包装代码" align="center" :show-overflow-tooltip="true" prop="containerCode" />
      <el-table-column label="sku批次" align="center" :show-overflow-tooltip="true" prop="skuBatch" />
      <el-table-column label="sku名称" align="center" :show-overflow-tooltip="true" prop="skuName" />
      <el-table-column label="sku代码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
      <el-table-column label="标准装箱量" align="center" :show-overflow-tooltip="true" prop="ctn" />
      <el-table-column v-if="false" label="商品货号" align="center" :show-overflow-tooltip="true" prop="artno" />
      <el-table-column
        width="200px"
        prop="action"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="delect(scope.row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { kkdeboundce } from '@/utils/kkdebounce'
import { updSkuContainer, addSkuContainer, baokaiWcsSend, selectSkuContainerNum, screenContainer, selectSkuContainer, deleteSkuContainer } from '@/api/user'
import Pagination from '@/components/Pagination'
import { searchsku, searchcon } from '@/utils/search'
// import { changeAll } from '@/utils/statechange'
import { throttle } from '@/utils/throttle'
export default {
  components: { Pagination },
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      // 总数
      dialogFormVisible: false,
      formLabelWidth: '120px',
      type: null,
      show: false,
      containOptions: null,
      loclist: [],
      skuOptions: [],
      containerOptions: [],
      states: [],
      multipleSelection: [],
      tableHeight: 50,
      containerName: null,
      rules: {
        containerName: [{ required: true, message: '请填写包装名称', trigger: 'change' }],
        ctn: [{ required: true, message: '请填写', trigger: 'change' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        artno: [{ required: true, message: '请填写', trigger: 'change' }],
        skuBatch: [{ required: true, message: '请填写', trigger: 'change' }],
        skuName: [{ required: true, message: '请填写', trigger: 'change' }]
      },
      form: {
        id: null,
        skuCode: null,
        skuId: null,
        skuName: null,
        containerName: null,
        containerCode: null,
        containerId: null,
        ctn: null,
        artno: null,
        skuBatch: null
      },
      listLoading: true,
      lastconTime: 0,
      toptions: [],
      lasttypeTime: 0,
      total: 0,
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tableData.$el.offsetTop - 77

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tableData.$el.offsetTop - 77
      }
    })
  },
  methods: {
    useFormat(row) {
      if (row.isUsable === 0) {
        return '否'
      } else if (row.isUsable === 1) {
        return '是'
      }
    },
    formatSkuText(skuName) {
      return skuName
    },
    formatConText(name) {
      return name
    },
    exampleCon() {
      const item = this.containerOptions.find(item1 => item1.name === this.form.containerName)
      this.form.containerId = item.id
      this.form.containerName = item.name
      this.form.containerCode = item.code
    },
    onupload() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择数据！')
      } else {
        baokaiWcsSend(this.multipleSelection).then(res => {
          if (res.code === 200) {
            this.$message.success('上传成功！')
            this.refresh()
          }
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      for (let i = 0; i < val.length; i++) {
        if (this.multipleSelection.indexOf(val[i].id) === -1) {
          this.multipleSelection.push({ id: val[i].id })
        }
      }
    },
    focusCon() {
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
    add() {
      this.show = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.form = {}
        this.$refs.form.resetFields()
      })
    },
    focusSku: throttle(function() {
      searchsku().then(res => {
        this.skuOptions = res.data
      }
      )
    }, 5000, true),
    funcLL(query) {
      screenContainer({
        searchDTO: {
          num: 100000,
          page: 1
        },
        pojo: {
        }
      })
        .then(res => {
          this.states = res.data
          this.loclist = this.states.map(item => {
            return { id: item.id, name: item.name }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.containOptions = this.loclist.filter(item => {
              return item.name.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.containOptions = []
        }
      }, 100)
    },
    edit(row) {
      this.show = true
      this.dialogFormVisible = true
      this.form = Object.assign({}, row)
    },
    update() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('此操作提交所填信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updSkuContainer({
              id: this.form.id,
              containerName: this.form.containerName,
              containerCode: this.form.containerCode,
              containerId: this.form.containerId,
              skuName: this.form.skuName,
              skuCode: this.form.skuCode,
              skuId: this.form.skuId,
              ctn: this.form.ctn,
              artno: this.form.artno,
              skuBatch: this.form.skuBatch
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('修改成功')
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
    exampleSku() {
      const item = this.skuOptions.find(item1 => item1.skuName === this.form.skuName)
      this.form.skuId = item.id
      this.form.skuCode = item.skuCode
      this.form.skuName = item.skuName
    },
    dataChange() {
      const arr = []
      const obj = {
        containerName: this.form.containerName,
        containerCode: this.form.containerCode,
        containerId: this.form.containerId,
        ctn: this.form.ctn,
        skuBatch: this.form.skuBatch
      }
      const set = this.form.skuName
      for (const item of set) {
        const res = this.skuOptions.find(item1 => item1.skuName === item)
        obj.skuId = res.id
        obj.skuCode = res.skuCode
        obj.skuName = res.skuName
        arr.push(Object.assign({}, obj))
      }
      return arr
    },
    submit() {
      const arr = this.dataChange()
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('此操作提交所填信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addSkuContainer(arr).then(res => {
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
    search: kkdeboundce(function() {
      this.getList()
    }, 1000),
    refresh: kkdeboundce(function() {
      this.reload()
    }, 1000),
    // 单个删除
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSkuContainer({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    getList() {
      this.listLoading = true
      selectSkuContainer({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        containerName: this.containerName
      }}).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectSkuContainerNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        containerName: this.containerName
      }}).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
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
    .search {
      margin: 1px;
      float: right
    }
       .el-form /deep/.el-form-item__label{
      color:#fff
    }
    .btngroups {
      margin: 1px;
    }
    </style>
  <style lang="scss" scoped>
  // 修改对话框高度
  .show_card {
        background-color:#262626;
      }
    .showAll_dialog2 {
      ::v-deep.el-dialog {
        margin: 100px auto !important;
        overflow: hidden;
        border: #fff 1px solid;
         box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
      0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);
        background-color: #091f2c;

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

