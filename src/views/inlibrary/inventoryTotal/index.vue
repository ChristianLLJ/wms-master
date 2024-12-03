<template>
  <div>
    <!-- <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="formContainer">
        <el-form :inline="true" size="small" :model="form" style="padding: 2px">
          <el-form-item label="仓库" :label-width="formLabelWidth">
            <el-select v-model="form.warehouseName" @focus="func">
              <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称" :label-width="formLabelWidth">
            <el-select v-model="form.commodityName" placeholder="请选择" @focus="funcCommodity">
              <el-option v-for="item in commodityOptions" :key="item.id" :label="item.goodsName" :value="item.goodsName" />
            </el-select>
          </el-form-item>
          <el-form-item label="商品sku名称" :label-width="formLabelWidth">
            <el-select v-model="form.skuName" placeholder="请选择" @focus="funcSku">
              <el-option v-for="item in skuOptions" :key="item.id" :label="item.skuName" :value="item.skuName" />
            </el-select>
          </el-form-item>
          <el-form-item label="库存数量" :label-width="formLabelWidth">
            <el-input-number v-if="false" v-model="minNum1" :disabled="true" />
            <el-input-number v-model="maxNum1" :step="10" />
          </el-form-item>
          <el-form-item label="冻结数量" :label-width="formLabelWidth">
            <el-input-number v-if="false" v-model="minNum2" :disabled="true" />

            <el-input-number v-model="maxNum2" :step="10" />
          </el-form-item>
          <el-form-item label="可用数量" :label-width="formLabelWidth">
            <el-input-number v-if="false" v-model="minNum3" :disabled="true" />
            <el-input-number v-model="maxNum3" :step="10" />
          </el-form-item>
          <el-form-item label="生产厂家" :label-width="formLabelWidth">
            <el-input v-model="form.productCompany" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="生产日期" :label-width="formLabelWidth">
            <el-date-picker
              v-model="value1"
              type="daterange"
              size="small"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="生产批次" :label-width="formLabelWidth">
            <el-select v-model="form.productBatch" placeholder="请选择" @focus="funcContainer">
              <el-option v-for="item in containerOptions" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-button type="primary" round icon="el-icon-search" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card> -->
    <div class="btns">
      <el-button size="small" type="danger" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <el-table
      ref="tableData"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      :header-cell-style="{background:'#000',color: '#fff'}"
      :height="tableHeight"
      border
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column v-if="false" label="id" prop="id" />
      <el-table-column label="仓库" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
      <!-- <el-table-column label="库区" align="center" :show-overflow-tooltip="true" prop="areaCode" />
          <el-table-column label="库位" align="center" :show-overflow-tooltip="true" prop="locationCode" /> -->
      <el-table-column label="商品" align="center" :show-overflow-tooltip="true" prop="commodityName" />
      <!-- <el-table-column label="跟踪号" align="center" :show-overflow-tooltip="true" prop="traceCode" /> -->
      <el-table-column label="商品sku" align="center" :show-overflow-tooltip="true" prop="skuName" />
      <el-table-column label="最小sku单位" align="center" :show-overflow-tooltip="true" prop="unit" :formatter="stateFormat" />
      <!-- <el-table-column label="包装代码" align="center" :show-overflow-tooltip="true" prop="packageCode" /> -->
      <el-table-column label="库存数量(个)" align="center" :show-overflow-tooltip="true" prop="inventoryCnt" />
      <!-- <el-table-column label="预配数量(个)" align="center" :show-overflow-tooltip="true" prop="preDistributionCnt" />
          <el-table-column label="分配数量(个)" align="center" :show-overflow-tooltip="true" prop="distributionCnt" /> -->
      <el-table-column label="冻结数量(个)" align="center" :show-overflow-tooltip="true" prop="freezeCnt" />
      <el-table-column label="可用数量(个)" align="center" :show-overflow-tooltip="true" prop="availableCnt" />
      <!-- <el-table-column label="体积(L)" align="center" :show-overflow-tooltip="true" prop="volume" />
      <el-table-column label="毛重(kg)" align="center" :show-overflow-tooltip="true" prop="weight" />
      <el-table-column label="生产厂家" align="center" :show-overflow-tooltip="true" prop="productCompany" />
      <el-table-column label="生产日期" width="180px" align="center" :show-overflow-tooltip="true" prop="productTime">
        <template slot-scope="scope">{{ scope.row.productTime| dateYMDHMSFormat }}</template>
      </el-table-column>
      <el-table-column label="生产批次" width="180px" align="center" :show-overflow-tooltip="true" prop="productBatch" /> -->
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
import Pagination from '@/components/Pagination'
import { searchInventoryTotalSelective, searchInventoryTotalNum, selectArea, selectLocation, selectLocationGroup } from '@/api/user'
import { searchcom, searchsku, searchcon, searchallwarehouse } from '@/utils/search'
import { kkdeboundce } from '@/utils/kkdebounce'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      dialogFormVisible: false,
      id: null,
      listLoading: false,
      formLabelWidth: '120px',
      total: 0,
      customtotal: 0,
      skutotal: 0,
      waretotal: 0,
      areatotal: 0,
      show: false,
      warehouseOptions: [],
      lastTime: 0,
      unitOptions: [],
      minNum1: 1,
      minNum2: 1,
      minNum3: 1,
      maxNum1: 1,
      maxNum2: 1,
      maxNum3: 1,
      areaOptions: [],
      lastunitTime: 0,
      locationOptions: [],
      skuOptions: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value1: '',
      value2: '',
      states: [],
      loclist: [],
      lastAreaTime: 0,
      locOptions: [],
      containerOptions: [],
      lastconTime: 0,
      lastLocTime: 0,
      laststateTime: 0,
      commodityOptions: [],
      lastcomTime: 0,
      rules: {
        warehouseName: [{ required: true, message: '请选择仓库', trigger: 'change' }],
        areaName: [{ required: true, message: '请选择库区', trigger: 'change' }],
        locationGroupName: [{ required: true, message: '请选择库位组', trigger: 'change' }],
        locationType: [{ required: true, message: '请选择库位类型', trigger: 'change' }],
        packageCode: [{ required: true, message: '请选择包装', trigger: 'change' }],
        commodityName: [{ required: true, message: '请选择商品', trigger: 'change' }],
        skuName: [{ required: true, message: '请选择商品sku', trigger: 'change' }],
        unit: [{ required: true, message: '请选择单位', trigger: 'change' }]
      },
      skuCode: null,
      tableHeight: 50,
      tableData: [],
      tableHeight2: 50,
      listQuery: {
        page: 1,
        limit: 50
      },
      activeName: 'fifth',
      form: {
        warehouseName: null,
        commodityName: null,
        skuName: null,
        productCompany: null,
        productBatch: null
      },
      areaTableData: [],
      wareTableData: [],
      skuTableData: [],
      customTableData: []
    }
  },
  created() {
    this.getList()
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tableData.$el.offsetTop - 82

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tableData.$el.offsetTop - 82
      }
    })
  },
  methods: {
    edit(row) {
      this.show = true
      this.dialogFormVisible = true
      this.form = Object.assign({}, row)
    },
    func() {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        searchallwarehouse(window.sessionStorage.workGroupId).then(res => {
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
    stateFormat(row) {
      if (row.unit === '1') {
        return '件'
      } else if (row.unit === '0') {
        return '袋'
      }
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
    funcArea() {
      const now = new Date().valueOf()
      if (this.lastAreaTime === 0) {
        selectArea({ pojo: {
        }}).then(res => {
          this.areaOptions = res.data
        }
        )
        this.lastAreaTime = now
      } else {
        if ((now - this.lastAreaTime) > 5000) {
          this.lastAreaTime = now
        }
      }
    },
    funcSku() {
      searchsku(this.form.commodityId).then(res => {
        this.skuOptions = res.data.map(item => {
          return { id: item.id, skuName: item.skuName, skuCode: item.skuCode }
        })
      }
      )
    },
    funcLoc() {
      const now = new Date().valueOf()
      if (this.lastLocTime === 0) {
        selectLocationGroup({ pojo: {
        }}).then(res => {
          this.locOptions = res.data
        }
        )
        this.lastLocTime = now
      } else {
        if ((now - this.lastLocTime) > 5000) {
          this.lastLocTime = now
        }
      }
    },
    funcLL(query) {
      selectLocation({
        pojo: {
        }
      })
        .then(res => {
          this.states = res.data
          this.loclist = this.states.map(item => {
            return { id: item.id, locationName: item.locationName }
          })
        })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.locationOptions = this.loclist.filter(item => {
              return item.locationName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.locationOptions = []
        }
      }, 100)
    },
    refresh() {
      this.reload()
    },
    search: kkdeboundce(function() {
      this.getList()
    }, 1000),
    getList() {
      this.listLoading = true
      searchInventoryTotalSelective({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        warehouseName: this.form.warehouseName,
        commodityName: this.form.commodityName,
        skuName: this.form.skuName,
        productCompany: this.form.productCompany,
        productBatch: this.form.productBatch
      }}).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      searchInventoryTotalNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        warehouseName: this.form.warehouseName,
        commodityName: this.form.commodityName,
        skuName: this.form.skuName,
        productCompany: this.form.productCompany,
        productBatch: this.form.productBatch
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

  <style scoped>
  .el-form /deep/.el-form-item__label{
      color:rgb(0, 0, 0)
  }
    .btns {
      margin: 5px;
    }
    .dialog-footer {
      margin: 0px auto;
    }
    .formContainer {
      padding-top: 10px;
    }
  </style>
           <style lang="scss" scoped>
// 修改对话框高度
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
