<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="btngroups">
          <el-button-group>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新建</el-button>
            <!-- <el-button size="mini" type="primary" icon="el-icon-download">导出</el-button> -->
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="search">
          <el-select
            v-model="customName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入客户名称"
            :remote-method="funcLL"
            clearable
            size="mini"
          >
            <el-option v-for="item in customOptions" :key="item.id" :label="item.customName" :value="item.customName" />
          </el-select>
          <el-select v-model="name" size="mini" placeholder="请选择客户类型" clearable @focus="focCus">
            <el-option v-for="item in options" :key="item.id" :label="item.codeDetailName" :value="item.codeDetailName" />
          </el-select>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search()">搜索</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="客户信息" :visible.sync="dialogFormVisible" class="showAll_dialog2">
      <el-form ref="form" :rules="rules" class="demo-form-inline" :model="form">
        <el-form-item v-if="false" label="id" :label-width="formLabelWidth" prop="id">
          <el-input v-model="form.id" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称" :label-width="formLabelWidth" prop="customName">
              <el-input v-model="form.customName" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户代码" :label-width="formLabelWidth" prop="customCode">
              <el-input v-model="form.customCode" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户类型" :label-width="formLabelWidth" prop="name">
              <el-select v-model="form.name" size="mini" placeholder="请选择" @focus="focCus" @change="changeCus">
                <el-option v-for="item in options" :key="item.id" :label="item.codeDetailName" :value="item.codeDetailName" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="承运人" :label-width="formLabelWidth" prop="carrier">
              <el-input v-model="form.carrier" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮编" :label-width="formLabelWidth" prop="zipCode">
              <el-input v-model="form.zipCode" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
              <el-input v-model="form.phone" size="mini" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="false" label="客户类型编码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="form.code" size="mini" placeholder="请输入" clearable />
        </el-form-item>
        <el-row>
          <el-form-item label="隶属单位" :label-width="formLabelWidth" prop="unit">
            <el-input v-model="form.unit" size="mini" placeholder="请输入" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="省" :label-width="formLabelWidth" prop="province">
              <el-select v-model="form.province" filterable clearable size="small" placeholder="请选择省份" @change="selectProvinceFun($event)">
                <el-option v-for="(item, index) in city" :key="index" :value="item" :label="item.label" />
              </el-select>            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市" :label-width="formLabelWidth" prop="city">
              <el-select v-model="form.city" filterable clearable size="small" placeholder="请选择城市" @change="selectCityFun($event)">
                <el-option v-for="(item, index) in cityList" :key="index" :value="item" :label="item.label" />
              </el-select>            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="县/区" :label-width="formLabelWidth" prop="site">
              <el-select v-model="form.site" filterable clearable size="small" placeholder="请选择区县">
                <el-option v-for="(item, index) in siteList" :key="index" :value="item.label" :label="item.label" />
              </el-select>            </el-form-item>

          </el-col></el-row>
        <el-row>
          <el-form-item label="具体地址" :label-width="formLabelWidth" prop="address">
            <el-input v-model="form.address" size="mini" placeholder="请输入" clearable />
          </el-form-item>
        </el-row>
        <!-- <el-row>
          <el-form-item label="站点" :label-width="formLabelWidth" prop="site">
            <el-input v-model="form.site" size="mini" placeholder="请输入" clearable />
          </el-form-item>
        </el-row> -->
        <!-- <el-form-item label="结算方" :label-width="formLabelWidth" prop="settler">
          <el-input v-model="form.settler" size="mini" style="width: 160px;" placeholder="请输入" clearable />
        </el-form-item> -->
        <el-row>
          <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              autosize
              size="mini"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!show" @click="reWrite">重 填</el-button>
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
      :row-class-name="tableRowClassName"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      size="mini"
      style="width: 100%, font-size: 10px"
    >
      <!-- <el-table-column type="selection" align="center" /> -->
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
      <el-table-column label="客户名称" align="center" prop="customName" :show-overflow-tooltip="true" />
      <el-table-column label="客户代码" align="center" :show-overflow-tooltip="true" prop="customCode" />
      <el-table-column v-if="false" label="客户类型编码" align="center" :show-overflow-tooltip="true" prop="code" />
      <el-table-column label="客户类型" align="center" :show-overflow-tooltip="true" prop="name" />
      <el-table-column label="隶属单位" align="center" :show-overflow-tooltip="true" prop="unit" />
      <el-table-column label="手机号" align="center" :show-overflow-tooltip="true" prop="phone" />
      <el-table-column label="省" align="center" :show-overflow-tooltip="true" prop="province" />
      <el-table-column label="市" align="center" :show-overflow-tooltip="true" prop="city" />
      <el-table-column label="县/区" align="center" :show-overflow-tooltip="true" prop="site" />
      <el-table-column label="地址" align="center" :show-overflow-tooltip="true" prop="address" />
      <!-- <el-table-column label="站点" align="center" :show-overflow-tooltip="true" prop="site" /> -->
      <el-table-column label="邮编" align="center" :show-overflow-tooltip="true" prop="zipCode" />
      <el-table-column v-if="false" label="失效时间" align="center" :show-overflow-tooltip="true" prop="">
        <template slot-scope="scope">
          <span>{{ scope.row.expirationDate| dateYMDHMSFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" :show-overflow-tooltip="true" prop="remark" />
      <el-table-column v-if="false" label="结算方" align="center" :show-overflow-tooltip="true" prop="settler" />
      <el-table-column label="承运人" align="center" :show-overflow-tooltip="true" prop="carrier" />
      <el-table-column
        v-if="false"
        prop="isUsed"
        label="是否使用"
        align="center"
        :formatter="useFormat"
      />
      <el-table-column
        prop="action"
        label="操作"
        align="center"
        width="200px"
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
import city from '@/assets/city.json'
import Pagination from '@/components/Pagination'
import { kkdeboundce } from '@/utils/kkdebounce'
import { addCustom, deleteCustom, screenCustom, screenCustomSum, updateCustom } from '@/api/user'
import { searchsystemid } from '@/utils/search'
export default {
  components: { Pagination },
  inject: ['reload'], // 注入页面刷新依赖
  data() {
    return {
      // 总数
      dialogFormVisible: false,
      formLabelWidth: '120px',
      customName: null,
      name: null,
      customOptions: [],
      city: city,
      loclist: [],
      states: [],
      cityList: [],
      siteList: [],
      show: false,
      tableHeight: 50,
      laststateTime: 0,
      options: [],
      advanced: false,
      listLoading: true,
      total: 0,
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      rules: {
        phone: [{ pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }],
        zipCode: [{ pattern: /^[1-9][0-9]{5}$/, message: '请输入正确的邮编格式', trigger: 'change' }],
        customName: [{ required: true, message: '请输入客户名称', trigger: 'change' }],
        customCode: [{ required: true, message: '请输入客户代码', trigger: 'change' }],
        // province: [{ required: true, message: '请选择', trigger: 'change' }],
        // city: [{ required: true, message: '请选择', trigger: 'change' }],
        // site: [{ required: true, message: '请选择', trigger: 'change' }],
        name: [{ required: true, message: '请选择客户类型', trigger: 'change' }]
      },
      form: {
        id: '',
        customName: '',
        customCode: '',
        code: '',
        name: '',
        unit: '',
        province: '',
        city: '',
        site: '',
        phone: '',
        address: '',
        zipCode: '',
        settler: '',
        carrier: '',
        remark: '',
        expirationDate: ''
      },
      tableData: [
      ]
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
      if (row.isUsed === 0) {
        return '否'
      } else if (row.isUsed === 1) {
        return '是'
      }
    },
    funcLL(query) {
      screenCustom({
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
            return { id: item.id, customName: item.customName }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.customOptions = this.loclist.filter(item => {
              return item.customName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.customOptions = []
        }
      }, 100)
    },
    focCus() {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid('CUSTOM_TYPE').then(res => {
          this.options = res.data
        })
        this.laststateTime = now
      } else {
        if ((now - this.laststateTime) > 5000) {
          this.laststateTime = now
        }
      }
    },
    changeCus() {
      const item = this.options.find(item1 => item1.codeDetailName === this.form.name)
      this.form.name = item.codeDetailName
      this.form.code = item.typeNumber
    },
    reWrite() {
      this.form = {
        id: '',
        customName: '',
        customCode: '',
        code: '',
        name: '',
        province: '',
        city: '',
        unit: '',
        phone: '',
        address: '',
        site: '',
        zipCode: '',
        settler: '',
        carrier: '',
        remark: '',
        expirationDate: ''
      }
    },
    add() {
      this.show = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.form = {
        }
        this.$refs.form.resetFields()
      })
    },
    selectProvinceFun(event) {
      console.log(event)
      if (event) {
        this.form.province = event.label
        this.cityList = event.children
      } else {
        this.cityList = []
      }
      this.siteList = []
      this.form.city = null
      this.form.site = null
    },
    selectCityFun(event) {
      if (event) {
        this.form.city = event.label
        this.siteList = event.children
      } else {
        this.siteList = []
        this.form.site = null
      }
    },
    // selectSiteFun(event) {
    //   console.log(event)
    //   if (event) {
    //     this.form.site = event.label
    //     console.log(this.form.site)
    //   }
    // },
    search: kkdeboundce(function() {
      this.getList()
    }, 1000),
    refresh: kkdeboundce(function() {
      this.reload()
    }, 1000),
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    // 单个删除
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCustom({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
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
    getList() {
      this.listLoading = true
      screenCustom({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        customName: this.customName,
        name: this.name
      }}).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenCustomSum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        customName: this.customName,
        name: this.name
      }}).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
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
            updateCustom({
              id: this.form.id,
              expirationDate: this.form.expirationDate,
              customName: this.form.customName,
              customCode: this.form.customCode,
              name: this.form.name,
              code: this.form.code,
              unit: this.form.unit,
              phone: this.form.phone,
              province: this.form.province,
              city: this.form.city,
              address: this.form.address,
              site: this.form.site,
              zipCode: this.form.zipCode,
              settler: this.form.settler,
              carrier: this.form.carrier,
              remark: this.form.remark
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
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('此操作提交所填信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addCustom({
              expirationDate: this.form.expirationDate,
              customName: this.form.customName,
              customCode: this.form.customCode,
              name: this.form.name,
              code: this.form.code,
              unit: this.form.unit,
              phone: this.form.phone,
              province: this.form.province,
              city: this.form.city,
              address: this.form.address,
              site: this.form.site,
              zipCode: this.form.zipCode,
              settler: this.form.settler,
              carrier: this.form.carrier,
              remark: this.form.remark
            }).then(res => {
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
    }
  }
}
</script>
<style>
   .el-table .d-row{
  background: rgb(194, 45, 45);
}
.el-table .o-row{
  background: #bbca4a;
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
