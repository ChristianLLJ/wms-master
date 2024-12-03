<template>
  <div>
    <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
      <div class="search">
        <el-form :inline="true" label-width="120px" :model="form">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="value1"
              value-format="yyyy-MM-dd HH:mm:ss"
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
          <el-form-item label="上架建议单状态">
            <el-select v-model="form.onshelfState" placeholder="请选择状态" size="small" @focus="funcState">
              <el-option v-for="item in stateOptions" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
            </el-select>
          </el-form-item>
          <el-form-item label="仓库">
            <el-select v-model="form.warehouseName" size="small" placeholder="请选择仓库" @focus="funcw">
              <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
            </el-select>
          </el-form-item>
          <el-form-item label="上架库区">
            <el-select v-model="form.onshelfAreaName" size="small" placeholder="请选择" @focus="funcAreaw">
              <el-option v-for="item in wareaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="审核人">
            <el-input v-model="form.checkerName" size="small" style="width: 160px;" placeholder="请输入" clearable />
          </el-form-item> -->
          <el-form-item>
            <el-button type="success" round icon="el-icon-search" size="small" @click="search()">搜索</el-button>
            <!-- <el-tooltip class="item" effect="dark" content="将满足筛选条件的单据导出" placement="bottom">
              <el-button type="primary" round icon="el-icon-export" size="small" @click="outExcel">筛选导出</el-button>
            </el-tooltip> -->
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="btngroups">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="add">新建</el-button>
      <el-button size="small" icon="el-icon-export" type="primary" @click="outSelfExcel">批量导出</el-button>
      <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed? "查看所有上架建议记录" : "返回" }}</el-button>
    </div>

    <el-dialog v-drag title="生成上架建议" :visible.sync="dialogProposalVisible" width="80%" class="show_card_p">
      <div class="cardContain">
        <div class="formContain">
          <el-form ref="planForm" :inline="true" :model="planForm" :rules="rules" size="mini" class="demo-form-inline">
            <el-form-item label="上架建议单号">
              <el-input v-model="planForm.onshelfCode" disabled style="width: 200px" />
            </el-form-item>
            <el-form-item v-if="false" label="仓库id">
              <el-input v-model="planForm.warehouseId" style="width: 180px" />
            </el-form-item>
            <el-form-item prop="warehouseName" label="仓库">
              <el-select v-model="planForm.warehouseName" placeholder="请选择仓库" @focus="funcw" @change="changePlanWarehouseOptions">
                <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.warehouseName" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="false">
              <el-input v-model="planForm.warehouseCode" placeholder="选择仓库后自动填充" disabled style="width: 180px" />
            </el-form-item>
            <el-form-item v-if="false" label="库区id">
              <el-input v-model="planForm.onshelfAreaId" style="width: 180px" />
            </el-form-item>
            <el-form-item prop="onshelfAreaName" label="库区">
              <el-select v-model="planForm.onshelfAreaName" placeholder="请选择库区" @focus="funcArea" @change="changeAreaOptions">
                <el-option v-for="item in areaOptions" :key="item.id" :label="item.areaName" :value="item.areaName" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="false">
              <el-input v-model="planForm.onshelfAreaCode" placeholder="选择库区后自动填充" disabled style="width: 180px" />
            </el-form-item>
            <el-form-item v-if="false" label="上架策略id">
              <el-input v-model="planForm.onshelfStrategyId" style="width: 180px" />
            </el-form-item>
            <el-form-item prop="onshelfStrategyName" label="上架策略">
              <el-select v-model="planForm.onshelfStrategyName" placeholder="请选择上架策略" @focus="funcStrategy" @change="changeStrategyOptions">
                <el-option v-for="item in strategyOptions" :key="item.id" :label="item.strategyName" :value="item.strategyName" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="false">
              <el-input v-model="planForm.onshelfStrategyCode" placeholder="选择上架策略后自动填充" disabled style="width: 180px" />
            </el-form-item>
          </el-form>
        </div>
        <div class="detailsTable2">
          <proposalUse :table="proposalTable" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitProposal">提交生成上架建议单</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请选择以下已完成装箱或已完成码盘的采购订单进行上架" :visible.sync="dialogwVisible" width="75%" class="showAll_dialog2">
      <div style="display: flex">
        <div style="width: 200px">
          <el-input v-model="containerBarcode" placeholder="请输入箱条码" size="mini" />
        </div>
        <sku-choose :skuform="skuForm" />
        <div>
          <el-button size="small" type="primary" icon="el-icon-search" @click="searchs">查询</el-button>
        </div>
      </div>
      <div class="detailsTable">
        <normaltable
          :label-table="labelTable"
          :stackshow="stackshow"
          :containershow="containershow"
          :plantable="plantable"
          :data-list-selections="dataListSelections"
          @clickSelect="clickSelect"
        />
      </div>
      <div class="pagContainer">
        <el-pagination
          :current-page="currentPage3"
          :page-sizes="[50, 100]"
          :page-size="pagesize3"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount3"
          @size-change="handleSizeChange3"
          @current-change="handleCurrentChange3"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addChoose">添加进行上架建议单填写</el-button>
      </div>
    </el-dialog>
    <el-dialog title="生成上架单" :visible.sync="dialogVisible" width="90%" class="showAll_dialog">
      <div class="cardContain">
        <el-card v-if="false" class="show_card1">
          <div slot="header" class="clearfix">
            <span class="title">上架建议信息</span>
          </div>
          <el-form :inline="true" class="demo-form-inline" :model="uform" label-width="120px">
            <el-form-item>
              <el-input v-model="uform.onshelfCode" disabled size="mini" style="width: 160px;" clearable />
            </el-form-item>
            <el-form-item>
              <el-input v-model="uform.onshelfStrategyName" disabled size="mini" style="width: 160px;" clearable />
            </el-form-item>
            <el-form-item>
              <el-input v-model="uform.onshelfState" disabled size="mini" style="width: 160px;" clearable />
            </el-form-item>
            <el-form-item>
              <el-input v-model="uform.warehouseName" disabled size="mini" style="width: 160px;" clearable />
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="uform.createTime"
                disabled
                size="mini"
                type="date"
              />
            </el-form-item>
            <el-form-item>
              <el-input v-model="uform.printAccount" disabled size="mini" style="width: 160px;" clearable />
            </el-form-item>
            <el-form-item>
              <el-input v-model="uform.isUsable" disabled size="mini" style="width: 160px;" clearable />
            </el-form-item>
            <el-form-item>
              <el-input v-model="uform.warehouseName" disabled size="mini" style="width: 160px;" clearable />
            </el-form-item>
            <el-form-item>
              <el-input v-model="uform.onshelfAreaName" disabled size="mini" style="width: 160px;" clearable />
            </el-form-item>
            <el-form-item>
              <el-input v-model="uform.checkerName" disabled size="mini" style="width: 160px;" clearable />
            </el-form-item>
            <el-form-item>
              <el-input v-model="uform.remark" disabled size="mini" style="width: 160px;" clearable />
            </el-form-item>
          </el-form>
        </el-card>
        <el-card :body-style="{padding:'0px'}" class="show_card2">
          <div slot="header" class="clearfix">
            <span class="title">上架信息</span>
          </div>
          <el-table
            :data="table"
            height="350px"
            size="mini"
            :header-cell-style="{background:'#000',color: '#fff'}"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            style="width: 100%, font-size: 10px"
          >
            <el-table-column v-if="false" label="id" prop="id" />
            <el-table-column type="index" label="序号" />
            <el-table-column width="500px" label="建议上架库位(可修改)" :show-overflow-tooltip="true" prop="adviceLocationName">
              <template slot-scope="scope">
                <span>
                  <el-select
                    v-model="scope.row.adviceLocationName"
                    filterable
                    remote
                    style="width: 500px"
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="funcLL"
                    size="mini"
                    @change="changelocationOptions(scope.row)"
                  >
                    <el-option v-for="item in locationOptions" :key="item.id" :label="item.locationName" :value="item.locationName" />
                  </el-select>
                </span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="上架号" :show-overflow-tooltip="true" prop="onshelfId" /> -->
            <!-- <el-table-column label="组盘跟踪号" :show-overflow-tooltip="true" prop="traceCode" />
            <el-table-column label="装箱跟踪号" :show-overflow-tooltip="true" prop="traceCode2" /> -->
            <!-- <el-table-column label="建议单单号" :show-overflow-tooltip="true" prop="onshelfCode" /> -->
            <el-table-column v-if="false" label="包装代码id" :show-overflow-tooltip="true" prop="containerId" />
            <el-table-column label="包装条码" :show-overflow-tooltip="true" prop="containerBarcode" />
            <el-table-column v-if="false" label="系统建议库位id" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>
                  <el-input v-model="scope.row.adviceLocationId" size="mini" />
                </span>
              </template>
            </el-table-column>
            <el-table-column v-if="false" label="上架状态" :show-overflow-tooltip="true" prop="onshelfState" />
            <el-table-column v-if="false" label="备注" :show-overflow-tooltip="true" prop="remark" />
            <el-table-column v-if="false" label="预计上架时间" :show-overflow-tooltip="true" prop="onshelfTime">
              <template slot-scope="scope">{{ scope.row.onshelfTime| dateYMDHMSFormat }}</template>
            </el-table-column>
            <el-table-column label="入库批次" :show-overflow-tooltip="true" prop="inboundBatch" />
            <!-- <el-table-column label="上架来源种类" :show-overflow-tooltip="true" prop="onshelfType" :formatter="onshelfFormat" /> -->
          </el-table>
        </el-card>
        <div class="block" style="margin-top:5px;">
          <el-pagination :current-page="currentPage2" :page-sizes="[15,20]" :page-size="pageSize2" layout="total, sizes, prev, pager, next, jumper" :total="table.length" @size-change="handleSizeChange2" @current-change="handleCurrentChange2" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submit">提交生成上架任务单</el-button>
      </div>
    </el-dialog>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :height="tableHeight"
      :data="tableData"
      :row-key="getRowKeys"
      border
      size="mini"
      :expand-row-keys="expands"
      tooltip-effect="dark"
      :row-style="{height:'20px'}"
      :header-cell-style="{background:'#000',color: '#fff'}"
      :cell-style="{padding:'0px'}"
      style="width: 100%, font-size: 10px"
      :header-cell-class-name="handleHeadAddClass"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column :label="labelTitle" align="center">
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column v-if="false" label="id" prop="id" />
        <el-table-column label="上架建议单号" :show-overflow-tooltip="true" prop="onshelfCode" />
        <el-table-column label="上架策略" sortable="custom" :show-overflow-tooltip="true" prop="onshelfStrategyName" />
        <el-table-column label="创建时间" sortable="custom" :show-overflow-tooltip="true" prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
        </el-table-column>
        <el-table-column label="上架建议单状态" sortable="custom" width="160px" :show-overflow-tooltip="true" prop="onshelfState" :formatter="stateFormat" />
        <el-table-column label="仓库名称" sortable="custom" :show-overflow-tooltip="true" prop="warehouseName" />
        <!-- <el-table-column label="打印次数" :show-overflow-tooltip="true" prop="printAccount" /> -->
        <!-- <el-table-column label="是否启用"  :show-overflow-tooltip="true" prop="isUsable" :formatter="useFormat" /> -->
        <el-table-column label="上架库区" sortable="custom" :show-overflow-tooltip="true" prop="onshelfAreaName" />
        <!-- <el-table-column label="审核人"  :show-overflow-tooltip="true" prop="checkerName" /> -->
        <el-table-column label="备注" :show-overflow-tooltip="true" prop="remark" />
      </el-table-column>

      <el-table-column label="操作" width="300px" align="center">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" icon="el-icon-view" type="primary" @click="rowdbClick(scope.row)">详细记录</el-button>
            <el-button v-if="scope.row.onshelfState === 1" size="mini" icon="el-icon-newTask" type="primary" @click="createForm(scope.row)">生成上架任务</el-button>
          </div>
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
import Pagination from '@/components/Pagination'
import { throttle } from '@/utils/throttle.js'
import normaltable from '@/components/normaltable/index.vue'
import { kkdeboundce } from '@/utils/kkdebounce'
import { searchsystemid, searchsku } from '@/utils/search'
import { changeAll } from '@/utils/statechange'
import SkuChoose from '@/components/SkuChoose/index.vue'
import { selectOnshelfAdvice, screenExcelOutONP, selectExcelOutONP, screenOnshelf, getOnshelfAdviceHeadCode, getOnshelfHeadCode, generateIPLToONP, screenOnshelfNum, selectOnshelfStrategy, selectArea, selectOnshelfAdviceNum, selectWarehouse, selectLocation, ONPtoONF, selectOnshelfAdviceDetailNum, selectOnshelfAdviceDetail } from '@/api/user'
import proposalUse from '@/views/inwarehouse/listingproposal/components/proposalUse'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination, proposalUse, normaltable, SkuChoose },
  data() {
    return {
      multipleSelection: [],
      expands: [],
      onshelfCode: null,
      currentPage3: 1, // 第几页
      totalCount3: 0, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize3: 50, // 每页显示的条数
      dialogwVisible: false,
      listproposalState: false,
      orderId: null,
      skuName: null,
      sortField: {},
      screen: '',
      dialogProposalVisible: false,
      advanced: false,
      tableLoading: true,
      labelTable: '未完成上架的采购订单',
      labelTitle: '上架建议-未完成记录',
      stackshow: true,
      containershow: true,
      listLoading: true,
      strategyOptions: [],
      rules: {
        warehouseName: [{ required: true, message: '请选择仓库', trigger: 'change' }],
        onshelfAreaName: [{ required: true, message: '请选择库区', trigger: 'change' }],
        onshelfStrategyName: [{ required: true, message: '请选择策略', trigger: 'change' }],
        warehouseCode: [{ required: true, message: '请选择仓库代码', trigger: 'change' }],
        checkType: [{ required: true, message: '请选择质检类型', trigger: 'change' }],
        randomNum: [{ required: true, message: '请填写想要质检的商品sku数量', trigger: 'change' }]
      },
      viewed: true,
      id: null,
      total: 0,
      lastloccTime: 0,
      proposalTable: [],
      plantable: [],
      dataListSelections: [],
      planForm: {
        onshelfCode: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        onshelfAreaId: null,
        onshelfAreaName: null,
        onshelfAreaCode: null,
        onshelfStrategyId: null,
        onshelfStrategyName: null,
        onshelfStrategyCode: null
      },
      laststateTime: 0,
      stateOptions: [],
      lastStaTime: 0,
      soptions: [],
      lastTime: 0,
      tableHeight: 50,
      currentPage2: 1, // 当前页码
      pageSize2: 15, // 每页的数据条数
      dialogTableVisible: false,
      locationOptions: [],
      warehouseOptions: [],
      table: [],
      list: [],
      states: [],
      dialogVisible: false,
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 50, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      skuOptions: [],
      listQuery: {
        page: 1,
        limit: 50
      },
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
      wareaOptions: [],
      containerBarcode: '',
      uform: {
        onshelfStrategyName: null,
        createTime: null,
        onshelfCode: null,
        onshelfState: null,
        warehouseName: null,
        printAccount: null,
        isUsable: null,
        onshelfAreaName: null,
        checkerName: null,
        remark: null
      },
      stateMin: null,
      stateMax: null,
      skuForm: {
        commodityId: null,
        skuName: null
      },
      form: {
        onshelfState: null,
        warehouseName: null,
        onshelfAreaName: null,
        checkerName: null
      },
      rform: {
        traceCode: null,
        traceCode2: null,
        containerBarcode: null
      },
      tableData: [],
      lastStrTime: 0,
      areaOptions: [],
      loclist: [],
      tabledatas: []
    }
  },
  watch: {
    listproposalState: function(newObj) {
      switch (newObj) {
        case 'true':
          this.viewed = false
          break
        case 'false':
          this.viewed = true
      }
    },
    viewed: function(newViewed) {
      switch (newViewed) {
        case true:
          this.labelTitle = '上架任务-未完成记录'
          break
        case false:
          this.labelTitle = '上架任务-所有记录'
      }
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 82
      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.multipleTable.$el.offsetTop - 82
      }
    })
  },
  created() {
    this.listproposalState = sessionStorage.getItem('listproposalState')
    if (this.listproposalState === 'true') {
      this.stateMin = null
      this.stateMax = null
      this.getList()
    } else {
      this.stateMin = 1
      this.stateMax = 2
      this.getList()
    }
  },
  methods: {
    rowdbClick(row) {
      sessionStorage.setItem('onshelfChildId', row.id)
      sessionStorage.setItem('onshelfId', row.onshelfCode)
      this.$router.push('/proposaltotal')
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
    outSelfExcel() {
      if (this.multipleSelection.length) {
        this.$confirm('是否确认导出所选单据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectExcelOutONP(this.multipleSelection).then((res) => {
            let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.setAttribute('download', `上架任务单`)
            document.body.appendChild(a)
            a.click()
            url = window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
          })
        })
      } else {
        this.$message({
          message: '请选择至少一条数据',
          type: 'warning'
        })
      }
    },
    outExcel() {
      const data =
        { searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
          onshelfState: this.form.onshelfState,
          onshelfAreaName: this.form.onshelfAreaName,
          warehouseName: this.form.warehouseName,
          checkerName: this.form.checkerName
        }, workGroupId: window.sessionStorage.workGroupId, stateMin: this.stateMin, stateMax: this.stateMax, screen: this.screen, startTime: this.value1[0],
        endTime: this.value1[1] }
      screenExcelOutONP(data).then((res) => {
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `上架任务单`)
        document.body.appendChild(a)
        a.click()
        url = window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
    },
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid('ONSHELF_ADVICE_STATE').then(res => {
          this.soptions = res.data
        })
        this.laststateTime = now
      } else {
        if ((now - this.laststateTime) > 5000) {
          this.laststateTime = now
        }
      }
      return changeAll(row.onshelfState, this.soptions)
    },
    clickSelect(val) {
      this.dataListSelections = val
    },
    addChoose() {
      if (this.dataListSelections.length === 0) {
        this.$message.warning('请选择数据后再进行下一步操作')
      } else {
        this.dialogwVisible = false
        this.dialogProposalVisible = true
        this.getOnshelfAdviceHeadCode()
        this.proposalTable = this.dataListSelections
      }
    },
    getOnshelfAdviceHeadCode() {
      getOnshelfAdviceHeadCode({ code: 'ONP' }).then(res => {
        if (res.code === 200) {
          this.planForm.onshelfCode = res.data
        }
      })
    },
    getOnshelfHeadCode() {
      // const pur = 'PUR'
      getOnshelfHeadCode({ code: 'ONF' }).then(res => {
        if (res.code === 200) {
          this.onshelfId = res.data
        }
      })
    },
    submitProposal() {
      this.$refs.planForm.validate((valid) => {
        if (valid) {
          this.$confirm('此操作将提交所填信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            for (let i = 0; i < this.proposalTable.length; i++) {
              if (this.proposalTable[i].aremark) {
                this.list.push({ remark: this.proposalTable[i].aremark })
              } else {
                this.list.push({ remark: null })
              }
            }
            for (const item of this.proposalTable) {
              this.$delete(item, 'aremark')
            }
            generateIPLToONP({ inboundPlanDetailHeadAndDetail: { head: {}, details: this.proposalTable }, onshelfAdviceDetailHeadAndDetail: { details: this.list, head: {
              warehouseId: this.planForm.warehouseId,
              warehouseCode: this.planForm.warehouseCode,
              warehouseName: this.planForm.warehouseName,
              onshelfAreaId: this.planForm.onshelfAreaId,
              onshelfAreaName: this.planForm.onshelfAreaName,
              onshelfAreaCode: this.planForm.onshelfAreaCode,
              onshelfStrategyId: this.planForm.onshelfStrategyId,
              onshelfStrategyName: this.planForm.onshelfStrategyName,
              onshelfStrategyCode: this.planForm.onshelfStrategyCode
            }}}).then(res => {
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
    handleSizeChange3(val) {
      this.pagesize3 = val
      this.getListDetail(val, 1)
      this.currentPage3 = 1
    },
    // 显示第几页
    handleCurrentChange3(val) {
      this.currentPage3 = val
      this.getListDetail(this.pagesize3, val)
    },
    add() {
      this.plantable = []
      this.$notify({
        title: '成功',
        message: '正在查询可生成上架建议单的表单数据，请稍等片刻！',
        type: 'success',
        duration: 1000
      })
      setTimeout(() => {
        this.dialogwVisible = true
      }, 1000)
      this.getListDetail(this.pagesize, this.currentPage)
    },
    funcStrategy() {
      const now = new Date().valueOf()
      if (this.lastStrTime === 0) {
        selectOnshelfStrategy({ pojo: {
        }, workGroupId: window.sessionStorage.workGroupId }).then(res => {
          this.strategyOptions = res.data
        }
        )
        this.lastStrTime = now
      } else {
        if ((now - this.lastStrTime) > 5000) {
          this.lastStrTime = now
        }
      }
    },
    searchs() {
      this.getListDetail(this.pagesize, this.currentPage)
    },
    changeStrategyOptions() {
      const item = this.strategyOptions.find(item1 => item1.strategyName === this.planForm.onshelfStrategyName)
      this.planForm.onshelfStrategyName = item.strategyName
      this.planForm.onshelfStrategyCode = item.strategyCode
      this.planForm.onshelfStrategyId = item.id
    },
    changeAreaOptions() {
      const item = this.areaOptions.find(item1 => item1.areaName === this.planForm.onshelfAreaName)
      this.planForm.onshelfAreaName = item.areaName
      this.planForm.onshelfAreaCode = item.areaCode
      this.planForm.onshelfAreaId = item.id
    },
    changePlanWarehouseOptions() {
      const item = this.warehouseOptions.find(item1 => item1.warehouseName === this.planForm.warehouseName)
      this.planForm.warehouseCode = item.warehouseCode
      this.planForm.warehouseName = item.warehouseName
      this.planForm.warehouseId = item.id
    },
    getListDetail(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      screenOnshelf({ searchDTO,
        pojo: { isPackaged: 1, isReceived: 1, isOnshelf: false, containerBarcode: this.containerBarcode, skuName: this.skuForm.skuName, commodityId: this.skuForm.commodityId
        }}).then(res => {
        this.plantable = res.data
      })
      screenOnshelfNum({ searchDTO,
        pojo: { isPackaged: 1, isReceived: 1, isOnshelf: false, containerBarcode: this.containerBarcode, skuName: this.skuForm.skuName, commodityId: this.skuForm.commodityId
        }}).then(res => {
        this.totalCount3 = res.data
      })
    },
    scanHistory: throttle(function() {
      this.viewed = !this.viewed
      if (this.viewed === false) {
        sessionStorage.setItem('listproposalState', true)
        this.stateMin = null
        this.stateMax = null
      } else {
        sessionStorage.setItem('listproposalState', false)
        this.stateMin = 1
        this.stateMax = 2
      }
      this.getList()
    }, 500, true),
    renderHeader(h, { column }) { // 悬浮提示的文字内容
      const info = '系统自动分配库位，可根据实况自行修改！'
      return h(
        'div', [h('span', column.label), // placement指定悬浮显示方向
          h('el-tooltip', { props: { placement: 'top', effect: 'light' }}, [
            // style 调文字颜色样式
            h('div', { slot: 'content', style: { whiteSpace: 'normal', color: 'blue' }}, info),
            // el-icon-warning是element图标, style 调图标颜色
            h('i', { class: 'el-icon-warning', style: 'color: #409EFF; margin-left: 5px;' })
          ])])
    },
    formatText(id) {
      return id
    },
    funcState() {
      const now = new Date().valueOf()
      if (this.lastStaTime === 0) {
        searchsystemid('ONSHELF_ADVICE_STATE').then(res => {
          this.stateOptions = res.data
        })
        this.lastStaTime = now
      } else {
        if ((now - this.lastStaTime) > 5000) {
          this.lastStaTime = now
        }
      }
    },
    funcSkuName(query) {
      searchsku().then(res => {
        this.states = res.data
        this.comlist = this.states.map(item => {
          return { id: item.id, skuName: item.skuName, skuCode: item.skuCode }
        })
      })
      setTimeout(() => {
        if (query !== '') {
          setTimeout(() => {
            this.skuOptions = this.comlist.filter(item => {
              return item.skuName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.skuOptions = []
        }
      }, 100)
    },
    funcArea() {
      if (!this.planForm.warehouseName) {
        this.$message.error('请先选择仓库！')
      } else {
        selectArea({ pojo: {
          warehouseId: this.planForm.warehouseId
        }}).then(res => {
          this.areaOptions = res.data
        }
        )
      }
    },
    funcAreaw() {
      selectArea({ pojo: {
      }}).then(res => {
        this.wareaOptions = res.data
      })
    },
    funcw() {
      const now = new Date().valueOf()
      if (this.lastTime === 0) {
        selectWarehouse({
          pojo: {
          }}).then(res => {
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
    useFormat(row) {
      if (row.isUsable === 0) {
        return '否'
      } else if (row.isUsable === 1) {
        return '是'
      }
    },
    onshelfFormat(row) {
      if (row.onshelfType === 1) {
        return '补码后上架'
      } else if (row.onshelfState === 2) {
        return '补码后组盘上架'
      } else if (row.onshelfState === 3) {
        return '装箱上架'
      } else if (row.onshelfType === 4) {
        return '装箱后组盘上架'
      }
    },
    createForm(row) {
      this.table = []
      this.dialogVisible = true
      selectOnshelfAdvice({
        pojo: {
          onshelfCode: row.onshelfCode
        }, workGroupId: window.sessionStorage.workGroupId }).then(
        this.uform = Object.assign({}, row))
      selectOnshelfAdviceDetail({ searchDTO: {
        page: this.currentPage,
        num: this.pagesize
      },
      pojo: {
        onshelfId: row.id
      }}).then(response => {
        this.table = response.data
      })
    },
    handleSizeChange2(val) {
      this.currentPage2 = 1
      this.pageSize2 = val
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val
    },
    submit() {
      this.$confirm('确定生成上架单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ONPtoONF({ head: this.uform, details: this.table }).then(res => {
          if (res.code === 200) {
            this.$message.success('已生成')
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
    search: kkdeboundce(function() {
      this.getList()
    }, 500),
    changelocationOptions(row) {
      const item = this.locationOptions.find(item1 => item1.locationName === row.adviceLocationName)
      row.adviceLocationName = item.locationName
      row.adviceLocationId = item.id
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
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      selectOnshelfAdviceDetail({ searchDTO,
        pojo: {
          onshelfId: this.id,
          containerBarcode: this.rform.containerBarcode,
          traceCode2: this.rform.traceCode2,
          traceCode: this.rform.traceCode
        }}).then(response => {
        this.tabledatas = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      selectOnshelfAdviceDetailNum({ searchDTO,
        pojo: {
          onshelfId: this.id,
          containerBarcode: this.rform.containerBarcode,
          traceCode2: this.rform.traceCode2,
          traceCode: this.rform.traceCode
        }}).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getListDetails(val, 1)
      this.currentPage = 1
    },
    // 显示第几页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getListDetails(this.pagesize, val)
    },
    refresh: kkdeboundce(function() {
      this.reload()
    }, 500),
    getList() {
      this.listLoading = true
      selectOnshelfAdvice({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        onshelfState: this.form.onshelfState,
        onshelfAreaName: this.form.onshelfAreaName,
        warehouseName: this.form.warehouseName,
        checkerName: this.form.checkerName
      }, workGroupId: window.sessionStorage.workGroupId, stateMin: this.stateMin, stateMax: this.stateMax, screen: this.screen, startTime: this.value1[0],
      endTime: this.value1[1] }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      selectOnshelfAdviceNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        onshelfState: this.form.onshelfState,
        onshelfAreaName: this.form.onshelfAreaName,
        warehouseName: this.form.warehouseName,
        checkerName: this.form.checkerName
      }, workGroupId: window.sessionStorage.workGroupId, stateMin: this.stateMin, stateMax: this.stateMax, screen: this.screen, startTime: this.value1[0],
      endTime: this.value1[1] }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    // 选
    handleSelectionChange(val) {
      this.multipleSelection = []
      // 去重获取被选中的id值存入到数组中
      for (let i = 0; i < val.length; i++) {
        if (this.multipleSelection.indexOf(val[i].id) === -1) {
          this.multipleSelection.push({ id: val[i].id })
        }
      }
    }
  }
}
</script>
<style>
.el-table .do-row{
  background: #6f6dda;
}
</style>
  <style scoped>
    .el-card /deep/ .el-card__header {
  padding: 5px;
  color:#fff;
  text-align: center;
  }
  .el-form /deep/.el-form-item__label{
      color:rgb(0, 0, 0);
      font-weight: bold;
    }
  .search {
      margin: 1px;
      padding-top: 10px;
    }
  .btngroups {
    margin: 5px;
  }
    .pagContainer{
    background-color: rgb(75, 200, 175);
  }
  </style>
<style lang="scss" scoped>
// 修改对话框高度
.show_card {
      background-color:#262626;
    }
    .show_card_p {
    .cardContain {
      height:100%;
      .formContain {
        ::v-deep.el-form-item__label {
      color:#fff
    }
      }
      .detailsTable2 {
        overflow-y: auto;
      }
  }
   ::v-deep.el-dialog {
      background-color: #262626d0;
      margin: 10px auto !important;
      border: #fff 1px solid;
      height: 90%;
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
  .showAll_dialog {
    .cardContain {
      height:100%;
     .show_card1 {
      height:20%;
      background-color:#262626;
    }
    .show_card2 {
      .el-form .el-form-item__label{
      color:rgb(255, 255, 255);
    }
      height:80%;
      background-color:#262626;
    }
  }
    ::v-deep.el-dialog {
      margin: 10px auto !important;
      height: 90%;
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
    ::v-deep.el-form-item__label {
      color:#fff
    }
.detailsTable {
  height: 95%;
  border: 1px solid #fff;
  overflow-y: auto;
}
.pagContainer{
      background-color: transparent;
    }
::v-deep.el-dialog {
margin: 10px auto !important;
height: 90%;
overflow: hidden;
background-color: #262626;
border: #fff 1px solid;
 box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);

.el-dialog__body {
  line-height: 30px;
  color: white;
  overflow: auto;
  padding: 10px 15px;
  height: 80%
}
.el-dialog__title {
  color: white;
  caret-color: transparent;
}
.el-dialog__footer {
  margin-top: 10px
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
