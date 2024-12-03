<template>
  <div>
    <!-- <weakSearch /> -->
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-row>
          <el-col :span="15">
            <LocationChoose :locationform="locationform" />

          </el-col>
          <el-col :span="9">
            <SkuChoose :skuform="skuform" />

          </el-col>
        </el-row>
        <el-form size="small" :model="rform" :inline="true">
          <el-form-item label="包装" :label-width="formLabelWidth">
            <el-select v-model="rform.packageName" placeholder="请选择" @focus="funcContainer">
              <el-option v-for="item in containerOptions" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="最小sku单位" :label-width="formLabelWidth">
            <el-select v-model="rform.unit" placeholder="请选择">
              <el-option v-for="item in unitOptions" :key="item.id" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
          <el-form-item label="生产批次" :label-width="formLabelWidth">
            <el-input v-model="rform.productBatch" placeholder="请输入生产批次" clearable />
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
          <el-form-item label="生产厂家" :label-width="formLabelWidth">
            <el-input v-model="rform.productCompany" placeholder="请输入生产厂家" clearable />
          </el-form-item>
          <el-form-item label="箱号" :label-width="formLabelWidth">
            <el-input v-model="rform.balanceCode" placeholder="请输入箱号" clearable />
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
          <el-form-item>
            <el-button type="primary" round icon="el-icon-search" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 暂时不要了 -->
    <el-dialog v-drag title="分组查询" :visible.sync="dialogVisible" width="85%" class="showAll_dialog" @close="close">
      <warehouse :code="groupCode" :column="column" :where="where" :having="having" />
    </el-dialog>
    <el-dialog title="分组查询条件设置" class="showAll_dialog" width="60%" :visible.sync="dialogVisiblexx">
      <el-card>
        <div slot="header" class="clearfix">
          <span>分组查询字段选择</span>
        </div>
        <el-checkbox-group v-model="groupSelecteds">
          <el-checkbox v-for="item in group" :key="item.id" :label="item.title" />
        </el-checkbox-group>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <span>数量限制</span>
        </div>
        <!-- <el-card v-show="source">
          <location :locationform="realForm" :warehouse="warehouseUse" :area="areaUse" :location="locationUse" />
          <trash :trashform="trashForm" :commodity-type="commodityShow" :customer="customerShow" />
          <sku :skuform="realSku" :sku-show="skuShow" :com-show="comShow" />
        </el-card> -->
        <el-card>
          <div style="display: flex">
            <div>
              <div style="margin: 5px">  <el-radio-group v-model="radio1">
                <el-radio :label="1">大于</el-radio>
                <el-radio :label="2">小于</el-radio>
              </el-radio-group>  库存数量：<el-input-number v-model="inventoryCnt" :step="1" :min="0" /></div>
              <div style="margin: 5px"> <el-radio-group v-model="radio2">
                <el-radio :label="1">大于</el-radio>
                <el-radio :label="2">小于</el-radio>
              </el-radio-group>  冻结数量：<el-input-number v-model="freezeCnt" :step="1" :min="0" /></div>
              <div style="margin: 5px"> <el-radio-group v-model="radio3">
                <el-radio :label="1">大于</el-radio>
                <el-radio :label="2">小于</el-radio>
              </el-radio-group>  可用数量：<el-input-number v-model="availableCnt" :step="1" :min="0" /> </div>
            </div>
            <div>
              <div style="margin: 5px 5px 5px 10px"> <el-radio-group v-model="radio4">
                <el-radio :label="1">大于</el-radio>
                <el-radio :label="2">小于</el-radio>
              </el-radio-group>  体积：<el-input-number v-model="volume" :step="1" :min="0" /> </div>
              <div style="margin: 5px 5px 5px 10px"> <el-radio-group v-model="radio5">
                <el-radio :label="1">大于</el-radio>
                <el-radio :label="2">小于</el-radio>
              </el-radio-group>  毛重：<el-input-number v-model="weight" :step="1" :min="0" /> </div>
            </div>
          </div>
        </el-card>
      </el-card>
      <!-- <el-card>
        <div slot="header" class="clearfix">
          <span>分组后筛选条件</span>
        </div>
        <div style="display: flex">
          <div>
            <div style="margin: 5px">  <el-radio-group v-model="radio6">
              <el-radio :label="1">大于</el-radio>
              <el-radio :label="2">小于</el-radio>
            </el-radio-group>  库存数量：<el-input-number v-model="inventoryCnt1" :step="1" :min="0" /></div>
            <div style="margin: 5px"> <el-radio-group v-model="radio7">
              <el-radio :label="1">大于</el-radio>
              <el-radio :label="2">小于</el-radio>
            </el-radio-group>  冻结数量：<el-input-number v-model="freezeCnt1" :step="1" :min="0" /></div>
            <div style="margin: 5px"> <el-radio-group v-model="radio8">
              <el-radio :label="1">大于</el-radio>
              <el-radio :label="2">小于</el-radio>
            </el-radio-group>  可用数量：<el-input-number v-model="availableCnt1" :step="1" :min="0" /> </div>
          </div>
          <div>
            <div style="margin: 5px 5px 5px 10px"> <el-radio-group v-model="radio9">
              <el-radio :label="1">大于</el-radio>
              <el-radio :label="2">小于</el-radio>
            </el-radio-group>  体积：<el-input-number v-model="volume1" :step="1" :min="0" /> </div>
            <div style="margin: 5px 5px 5px 10px"> <el-radio-group v-model="radio10">
              <el-radio :label="1">大于</el-radio>
              <el-radio :label="2">小于</el-radio>
            </el-radio-group>  毛重：<el-input-number v-model="weight1" :step="1" :min="0" /> </div>
          </div>
        </div>
      </el-card> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblexx = false">取 消</el-button>
        <el-button slot="reference" type="primary" icon="el-icon-search" @click="searchGroup">查询</el-button>
      </div>
    </el-dialog>
    <el-dialog v-drag title="按库区查询" :visible.sync="dialogVisible2" width="85%" class="showAll_dialog">
      <areaQuary />
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </div> -->
    </el-dialog>
    <el-dialog v-drag title="按商品sku查询" :visible.sync="dialogVisible3" width="85%" class="showAll_dialog">
      <skuQuary />
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </div> -->
    </el-dialog>
    <el-dialog v-drag title="按客户查询" :visible.sync="dialogVisible4" width="85%" class="showAll_dialog">
      <customQuary />
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </div> -->
    </el-dialog>
    <el-dialog v-drag title="按商品查询" :visible.sync="dialogVisible5" width="85%" class="showAll_dialog">
      <commodityQuary />
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </div> -->
    </el-dialog>
    <el-dialog v-drag title="按库位查询" :visible.sync="dialogVisible6" width="85%" class="showAll_dialog">
      <locationQuary />
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </div> -->
    </el-dialog>
    <el-dialog v-drag title="按生产厂家查询" :visible.sync="dialogVisible7" width="85%" class="showAll_dialog">
      <productQuary />
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </div> -->
    </el-dialog>
    <el-dialog v-drag title="按生产批次查询" :visible.sync="dialogVisible8" width="85%" class="showAll_dialog">
      <batchQuary />
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </div> -->
    </el-dialog>
    <div class="btngroups">
      <!-- <el-button size="small" type="primary" icon="el-icon-download">导出</el-button> -->
      <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <div style="float:right;">
        <el-popover width="100" trigger="click" title="字段管理">
          <el-checkbox-group v-model="columnSelecteds">
            <el-checkbox v-for="item in columnHeaders" :key="item.title" :label="item.title" />
          </el-checkbox-group>
          <el-button slot="reference" size="small" type="success" icon="el-icon-setting" style="margin-left: 10px;">字段管理</el-button>
        </el-popover>
      </div>
      <div style="float:right;">
        <el-button slot="reference" size="small" type="primary" icon="el-icon-s-grid" style="margin-left: 10px;" @click="dialogVisiblexx = true">分组查询</el-button>
      </div>
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
      :header-cell-class-name="handleHeadAddClass"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      size="mini"
      style="width: 100%, font-size: 10px"
      @sort-change="handleSortChange"
    >
      <!-- <el-table-column type="selection" align="center" /> -->
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column v-if="false" label="id" prop="id" />
      <el-table-column label="箱号" align="center" width="180px" :show-overflow-tooltip="true" prop="balanceCode" />
      <el-table-column v-if="columnHeaders[0].isShow" sortable="custom" label="仓库" align="center" :show-overflow-tooltip="true" width="180px" prop="warehouseName" />
      <el-table-column v-if="columnHeaders[1].isShow" sortable="custom" label="库区" align="center" :show-overflow-tooltip="true" width="180px" prop="areaName" />
      <!-- <el-table-column label="库位组" align="center" :show-overflow-tooltip="true" prop="locationGroupCode" /> -->
      <el-table-column v-if="columnHeaders[2].isShow" align="center" sortable="custom" label="库位" width="180px" prop="locationName">
        <template slot-scope="scope">
          <div>
            <el-popover
              placement="bottom"
              title="库位所在位置"
              width="200"
              trigger="click"
              :content="content"
            >
              <el-button slot="reference" size="mini" type="success" @click="dbClick(scope.row)">{{ scope.row.locationName }}</el-button>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="columnHeaders[3].isShow" sortable="custom" label="客户" align="center" width="180px" :show-overflow-tooltip="true" prop="customName" />

      <el-table-column v-if="columnHeaders[4].isShow" sortable="custom" label="商品类型" align="center" :show-overflow-tooltip="true" prop="cargoType" />
      <!-- <el-table-column label="表单状态" align="center" :show-overflow-tooltip="true" prop="type" :formatter="stateFormat" /> -->
      <el-table-column v-if="columnHeaders[5].isShow" sortable="custom" label="商品" align="center" :show-overflow-tooltip="true" prop="commodityName" />
      <el-table-column v-if="columnHeaders[6].isShow" sortable="custom" label="商品sku" align="center" :show-overflow-tooltip="true" prop="skuName" />
      <el-table-column v-if="columnHeaders[7].isShow" sortable="custom" label="商品sku编码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
      <el-table-column v-if="columnHeaders[8].isShow" sortable="custom" label="最小sku单位" align="center" :show-overflow-tooltip="true" prop="unit" />
      <el-table-column v-if="columnHeaders[9].isShow" sortable="custom" label="包装名称" align="center" :show-overflow-tooltip="true" prop="containerName" />
      <el-table-column v-if="columnHeaders[10].isShow" sortable="custom" label="库存数量" align="center" :show-overflow-tooltip="true" prop="inventoryCnt" />
      <!-- <el-table-column label="预配数量(个)" align="center" :show-overflow-tooltip="true" prop="preDistributionCnt" />
      <el-table-column label="分配数量(个)" align="center" :show-overflow-tooltip="true" prop="distributionCnt" /> -->
      <el-table-column v-if="columnHeaders[11].isShow" sortable="custom" label="冻结数量" align="center" :show-overflow-tooltip="true" prop="freezeCnt" />
      <el-table-column v-if="columnHeaders[12].isShow" sortable="custom" label="可用数量" align="center" :show-overflow-tooltip="true" prop="availableCnt" />
      <el-table-column v-if="columnHeaders[13].isShow" sortable="custom" label="体积(L)" align="center" :show-overflow-tooltip="true" prop="volume" />
      <el-table-column v-if="columnHeaders[14].isShow" sortable="custom" label="毛重(kg)" align="center" :show-overflow-tooltip="true" prop="weight" />
      <!-- <el-table-column label="跟踪号" align="center" :show-overflow-tooltip="true" prop="traceCode" /> -->
      <!-- <el-table-column label="产品组代码" align="center" :show-overflow-tooltip="true" prop="productGroupCode" /> -->
      <!-- <el-table-column label="生产厂家" align="center" :show-overflow-tooltip="true" prop="productCompany" />
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
import warehouse from './components/warehouse.vue'
import areaQuary from './components/areaQuary.vue'
import skuQuary from './components/skuQuary.vue'
import customQuary from './components/customQuary.vue'
import commodityQuary from './components/commodityQuary.vue'
import locationQuary from './components/locationQuary.vue'
import productQuary from './components/productQuary.vue'
import batchQuary from './components/batchQuary.vue'
// import weakSearch from './components/weakSearch.vue'
// import location from './location.vue'
// import sku from './sku.vue'
// import trash from './trash.vue'
import LocationChoose from '@/components/LocationChoose/index.vue'
import SkuChoose from '@/components/SkuChoose/index.vue'
// import components from './components/index.vue'
import { searchInventoryBalanceSelective, selectLocationGroup, selectLocation, selectArea, searchInventoryBalanceNum } from '@/api/user'
import { searchcom, searchcon, searchallwarehouse } from '@/utils/search'
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination, LocationChoose, SkuChoose, warehouse, locationQuary, commodityQuary, batchQuary, productQuary, areaQuary, skuQuary, customQuary },
  data() {
    return {
      traceCode: null,
      listLoading: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      groupCode: '',
      radio1: 1,
      radio2: 1,
      radio3: 1,
      radio4: 1,
      radio5: 1,
      radio6: 1,
      radio7: 1,
      radio8: 1,
      radio9: 1,
      radio10: 1,
      column: [],
      having: '',
      dialogVisible6: false,
      comShow: false,
      skuShow: false,
      warehouseUse: false,
      content: null,
      areaUse: false,
      commodityShow: false,
      customerShow: false,
      locationUse: false,
      dialogVisiblexx: false,
      dialogVisible7: false,
      dialogVisible8: false,
      warehouseOptions: [],
      realForm: {
        warehouseName: '',
        areaName: '',
        locationName: ''
      },
      realSku: {
        commodityName: '',
        skuName: ''
      },
      trashForm: {
        customName: '',
        cargoType: ''
      },
      where: '',
      totalWhere: '',
      numChoose: '',
      lastTime: 0,
      inventoryCnt: 0,
      freezeCnt: 0,
      availableCnt: 0,
      volume: 0,
      weight: 0,
      inventoryCnt1: 0,
      freezeCnt1: 0,
      availableCnt1: 0,
      volume1: 0,
      weight1: 0,
      unitOptions: [{
        value: 1,
        label: '件'
      }],
      areaOptions: [],
      dialogVisible: false,
      columnHeaders: [
        { index: 0, title: '仓库', isShow: true },
        { index: 1, title: '库区', isShow: true },
        { index: 2, title: '库位', isShow: true },
        { index: 3, title: '客户', isShow: true },
        { index: 4, title: '商品类型', isShow: false },
        { index: 5, title: '商品', isShow: true },
        { index: 6, title: '商品sku', isShow: true },
        { index: 7, title: '商品sku编码', isShow: true },
        { index: 8, title: '最小sku单位', isShow: true },
        { index: 9, title: '包装名称', isShow: true },
        { index: 10, title: '库存数量(个)', isShow: true },
        { index: 11, title: '冻结数量(个)', isShow: true },
        { index: 12, title: '可用数量(个)', isShow: true },
        { index: 13, title: '体积(L)', isShow: true },
        { index: 14, title: '毛重(kg)', isShow: true }
      ],
      group: [
        { index: 0, title: '仓库', code: 'warehouseName' },
        { index: 1, title: '库区', code: 'areaName' },
        { index: 2, title: '库位', code: 'locationName' },
        { index: 3, title: '客户', code: 'customName' },
        { index: 4, title: '商品类型', code: 'cargoType' },
        { index: 5, title: '商品', code: 'commodityName' },
        { index: 6, title: '商品sku', code: 'skuName' }
      ],
      groupSelecteds: [],
      // 已选择的项
      columnSelecteds: ['仓库',
        '库区',
        '库位',
        '客户',
        '商品类型',
        '商品',
        '商品sku',
        '商品sku编码',
        '最小sku单位',
        '包装名称',
        '库存数量(个)',
        '冻结数量(个)',
        '可用数量(个)',
        '体积(L)',
        '毛重(kg)'],
      lastunitTime: 0,
      locationOptions: [],
      skuOptions: [],
      states: [],
      loclist: [],
      lastAreaTime: 0,
      locOptions: [],
      containerOptions: [],
      minNum1: 1,
      minNum2: 1,
      minNum3: 1,
      maxNum1: 1,
      where1: '',
      where2: '',
      where3: '',
      maxNum2: 1,
      maxNum3: 1,
      lastconTime: 0,
      lastLocTime: 0,
      locationform: {
        warehouseName: null,
        areaName: null,
        locationName: null
      },
      skuform: {
        commodityName: null,
        skuName: null
      },
      laststateTime: 0,
      commodityOptions: [],
      lastcomTime: 0,
      options: [],
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
      show: false,
      formLabelWidth: '120px',
      screen: '',
      source: false,
      sortField: {},
      id: null,
      total: 0,
      tableHeight: 50,
      listQuery: {
        page: 1,
        limit: 50
      },
      rform: {
        warehouseName: null,
        balanceCode: null,
        areaName: null,
        locationName: null,
        packageName: null,
        commodityName: null,
        skuName: null,
        unit: null,
        productCompany: null,
        productBatch: null
      },
      tableData: []
    }
  },
  watch: {
    /**
         * @title 监听列显示隐藏
         */
    columnSelecteds(newArrayVal) {
      // 计算为被选中的列标题数组
      var nonSelecteds = this.columnHeaders
        .filter(item => newArrayVal.indexOf(item.title) === -1)
        .map(item => item.title)
      // 根据计算结果进行表格重绘
      this.columnHeaders.filter(item => {
        const isNonSelected = nonSelecteds.indexOf(item.title) !== -1
        if (isNonSelected) {
          // 隐藏未选中的列
          item.isShow = false
          this.$nextTick(() => {
            this.$refs.dataTable.doLayout()
          })
        } else {
          // 显示已选中的列
          item.isShow = true
          this.$nextTick(() => {
            this.$refs.dataTable.doLayout()
          })
        }
      })
    },
    groupSelecteds: function(newVal) {
      console.log(newVal)
      if (newVal.length === 0) {
        this.source = false
      } else {
        this.source = true
        if (newVal.includes('仓库')) {
          this.warehouseUse = true
        } else {
          this.warehouseUse = false
        }
        if (newVal.includes('库区')) {
          this.areaUse = true
        } else {
          this.areaUse = false
        }
        if (newVal.includes('库位')) {
          this.locationUse = true
        } else {
          this.locationUse = false
        }
        if (newVal.includes('客户')) {
          this.customerShow = true
        } else {
          this.customerShow = false
        }
        if (newVal.includes('商品类型')) {
          this.commodityShow = true
        } else {
          this.commodityShow = false
        }
        if (newVal.includes('商品')) {
          this.comShow = true
        } else {
          this.comShow = false
        }
        if (newVal.includes('商品sku')) {
          this.comShow = true
          this.skuShow = true
        } else {
          this.skuShow = false
        }
      }
    }
  },
  updated() {
    this.$nextTick(() => {
      this.$refs['tableData'].doLayout()
      // table是在表格中ref=tablelist
      // doLayout	对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    })
  },
  created() {
    this.getList()
  },

  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.tableData.$el.offsetTop - 83

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.tableData.$el.offsetTop - 83
      }
    })
  },
  methods: {
    refresh() {
      this.reload()
    },
    dbClick(row) {
      selectLocation({
        pojo: {
          locationName: row.locationName
        }
      }).then(res => {
        this.content = `排号：${res.data[0].rows}，
                        行号：${res.data[0].columns}，
                        层号：${res.data[0].layer}`
      })
    },
    handleSortChange({ order, prop }) {
      // 触发的排序和缓存的排序相同时，取消该字段的排序
      this.screen = ''
      // this.screenNull = ''
      if (!order || this.sortField[prop] === order) {
        this.sortField[prop] = null
      } else {
        this.sortField[prop] = order
      }
      let direction = ''
      for (const i in this.sortField) {
        if (this.sortField[i] === 'ascending') {
          direction = 'asc'
        } else if (this.sortField[i] === 'descending') {
          direction = 'desc'
        } else {
          direction = 'null'
        }
        if (direction === 'null') {
          continue
        } else if (this.screen === '') {
          this.screen += i + ' ' + direction
        } else {
          this.screen += ',' + i + ' ' + direction
        }
      }
      // this.screen = this.screenNull
      this.getList() // 调用后端查询接口
    },
    handleHeadAddClass({ column }) {
      if (this.sortField[column.property]) {
        column.order = this.sortField[column.property]
      }
    },
    whereChoose() {
      // if (this.where === '') {
      if (this.availableCnt === 0 && this.freezeCnt === 0 && this.inventoryCnt === 0) {
        this.where = ''
      } else {
        this.availableCnt > 0 ? (this.radio3 === 1 ? this.where3 = 'availableCnt' + '>' + this.availableCnt : this.where3 = 'availableCnt' + '<' + this.availableCnt) : this.where3 = ''
        this.freezeCnt > 0 ? (this.radio2 === 1 ? this.where2 = 'freezeCnt' + '>' + this.freezeCnt : this.where2 = 'freezeCnt' + '<' + this.availableCnt) : this.where2 = ''
        this.inventoryCnt > 0 ? (this.radio1 === 1 ? this.where1 = 'inventoryCnt' + '>' + this.inventoryCnt : this.where1 = 'inventoryCnt' + '<' + this.availableCnt) : this.where1 = ''
        this.where1 === '' ? this.where = this.where + '' : this.where = this.where + this.where1 + ' ' + 'and' + ' '
        this.where2 === '' ? this.where = this.where + '' : this.where = this.where + this.where2
        this.where3 === '' ? this.where = this.where + '' : this.where = this.where + ' ' + 'and' + ' ' + this.where3
      }
    },
    nChoose() {
      if (this.volume === 0 && this.weight === 0) {
        this.numChoose = ''
      } else if (this.volume > 0 && this.weight === 0) {
        this.numChoose = 'volume' + (this.radio4 === 1 ? '>' : '<') + this.volume
      } else if (this.volume === 0 && this.weight > 0) {
        this.numChoose = 'weight' + (this.radio5 === 1 ? '>' : '<') + this.weight
      } else {
        this.numChoose = 'volume' + (this.radio4 === 1 ? '>' : '<') + this.volume + ' ' + 'and' + ' ' + 'weight' + (this.radio5 === 1 ? '>' : '<') + this.weight
      }
    },
    searchGroup() {
      this.whereChoose()
      this.nChoose()
      if (this.numChoose) {
        this.where = this.where + this.numChoose
      }
      // this.where = this.where + '' + this.where === '' ? 'and' : '' + '' + 'warehouseName=' + (this.realForm.warehouseName ? this.realForm.warehouseName : '') +
      // ' ' + 'and' + ' ' + 'areaName=' + (this.realForm.areaName ? this.realForm.areaName : '') +
      // ' ' + 'and' + ' ' + 'locationName=' + (this.realForm.locationName ? this.realForm.locationName : '') +
      // ' ' + 'and' + ' ' + 'commodityName=' + (this.realSku.commodityName ? this.realSku.commodityName : '') +
      // ' ' + 'and' + ' ' + 'skuName=' + (this.realSku.skuName ? this.realSku.skuName : '') +
      // ' ' + 'and' + ' ' + 'customName=' + (this.trashForm.customName ? this.trashForm.customName : '') +
      // ' ' + 'and' + ' ' + 'cargoType=' + (this.trashForm.cargoType ? this.trashForm.cargoType : '')
      this.column = this.groupSelecteds
      this.groupCode = ''
      console.log(this.groupSelecteds)
      if (!this.groupSelecteds) {
        return
      } else {
        const data = []
        for (var i = 0; i < this.groupSelecteds.length; i++) {
          for (var j = 0; j < this.group.length; j++) {
            if (this.groupSelecteds[i] === this.group[j].title) {
              data.push(this.group[j])
            }
          }
        }
        console.log(data)
        for (var z = 0; z < data.length; z++) {
          if (z === 0) {
            this.groupCode += data[z].code
          } else {
            this.groupCode = this.groupCode + ',' + data[z].code
          }
        }
        this.dialogVisible = true
        // this.refresh()
      }
    },
    close() {
      this.refresh()
    },
    warehouseQuary() {
      this.dialogVisible = true
    },
    areaQuary() {
      this.dialogVisible2 = true
    },
    skuQuary() {
      this.dialogVisible3 = true
    },
    customQuary() {
      this.dialogVisible4 = true
    },
    commodityQuary() {
      this.dialogVisible5 = true
    },
    locationQuary() {
      this.dialogVisible6 = true
    },
    productQuary() {
      this.dialogVisible7 = true
    },
    batchQuary() {
      this.dialogVisible8 = true
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
    stateFormat(row) {
      if (row.unit === '1') {
        return '件'
      } else if (row.unit === '0') {
        return '袋'
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
    search() {
      this.getList()
    },
    getList() {
      this.listLoading = true
      searchInventoryBalanceSelective({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        warehouseName: this.locationform.warehouseName,
        areaName: this.locationform.areaName,
        type: 1,
        commodityName: this.skuform.commodityName,
        locationName: this.locationform.locationName,
        skuName: this.skuform.skuName,
        packageName: this.rform.packageName,
        unit: this.rform.unit,
        productCompany: this.rform.productCompany,
        productBatch: this.rform.productBatch,
        balanceCode: this.rform.balanceCode
      },
      screen: this.screen
      }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      searchInventoryBalanceNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        warehouseName: this.locationform.warehouseName,
        areaName: this.locationform.areaName,
        type: 1,
        commodityName: this.skuform.commodityName,
        locationName: this.locationform.locationName,
        skuName: this.skuform.skuName,
        packageName: this.rform.packageName,
        unit: this.rform.unit,
        productCompany: this.rform.productCompany,
        productBatch: this.rform.productBatch,
        balanceCode: this.rform.balanceCode

      },
      screen: this.screen
      }).then(response => {
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
    .search {
      margin: 1px;
      padding-top: 10px;
    }
  .btngroups {
    margin: 5px;
  }

         .el-form /deep/.el-form-item__label{
    color:rgb(0, 0, 0)
  }
  </style>
            <style lang="scss" scoped>
// 修改对话框高度
.showAll_dialog {
      ::v-deep.el-dialog {
        margin: 100px auto !important;
        overflow: hidden;
        background-color: #262626;
        border: #fff 1px solid;
         box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
      0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);

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
