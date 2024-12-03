<template>
  <div class="mainApp">
    <div class="btngroups">
      <el-button-group>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addNewWaveRule"
        >设定规则</el-button>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-setting"
          @click="startAll"
        >全部启用</el-button>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-switch-button"
          @click="stopAll"
        >全部停止</el-button>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-refresh"
          @click="refresh"
        >刷新</el-button>
      </el-button-group>
    </div>
    <el-dialog
      title="规则设定"
      :visible.sync="dialogVisible"
      width="60%"
      class="showAll_dialog"
    >
      <el-card shadow="always">
        <el-form
          ref="sizeForm"
          :inline="true"
          :model="sizeForm"
          :rules="waveRules"
          label-width="120px"
          size="mini"
        >
          <el-form-item label="波次规则名称">
            <el-select
              v-model="sizeForm.waveRuleName"
              placeholder="请选择"
              @change="changeOptions"
            >
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="波次规则代码">
            <el-input
              v-model="sizeForm.waveRuleCode"
              placeholder="选择规则名称后自动填充"
              disabled
              style="width: 180px"
            />
          </el-form-item>
          <!-- <el-form-item v-show="false" label="优先级">
            <el-select v-model="sizeForm.priorityType" placeholder="请选择">
              <el-option label="普通优先级" value="1" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="描述">
            <el-input v-model="sizeForm.deacribeContent" style="width: 180px" />
          </el-form-item> -->
          <el-form-item>
            <el-radio-group
              v-model="sizeForm.activateType"
              @change="changeTime"
            >
              <el-radio :label="1">激活</el-radio>
              <el-radio :label="0">非激活</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item v-show="false" label="显示顺序">
            <el-input v-model="sizeForm.displayOrder" style="width: 180px" />
          </el-form-item> -->
          <el-form-item label="仓库名称" prop="warehouseName">
            <el-select
              v-model="sizeForm.warehouseName"
              placeholder="请选择"
              @change="changeWarehouseOptions"
            >
              <el-option
                v-for="(item, index) in warehouseOptions"
                :key="index"
                :label="item.warehouseName"
                :value="item.warehouseCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="仓库代码">
            <el-input
              v-model="sizeForm.warehouseCode"
              placeholder="选择仓库名称后自动填充"
              disabled
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="客户名称" prop="clientName">
            <el-select
              v-model="sizeForm.clientName"
              placeholder="请选择"
              @focus="funClient"
            >
              <el-option
                v-for="item in clientOptions"
                :key="item.id"
                :label="item.customName"
                :value="item.customName"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="客户代码">
            <el-input v-model="sizeForm.clientCode" style="width: 180px" />
          </el-form-item> -->
          <!-- <el-form-item v-show="false" label="承运人">
            <el-input v-model="sizeForm.carrierName" style="width: 180px" />
          </el-form-item> -->
          <!-- <el-form-item label="分配规则">
          <el-select v-model="sizeForm.distributionRules" placeholder="请选择">
            <el-option label="规则1" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-input v-model="sizeForm.orderType" style="width: 180px" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-input v-model="sizeForm.orderState" style="width: 180px" />
        </el-form-item>
        <el-form-item label="是否单品">
          <el-select v-model="sizeForm.isSingleItem" placeholder="请选择">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="整箱约束">
          <el-select v-model="sizeForm.isWholeBoxConstraint" placeholder="请选择">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item> -->
          <!-- <el-form-item label="订单窗口时间">
          <el-time-picker
            v-model="sizeForm.orderWindowTime"
            style="width:180px"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            placeholder="请选择"
          />
        </el-form-item> -->
          <el-form-item
            v-if="show"
            prop="orderNumUpperLimit"
            label="订单数量上限"
          >
            <el-input
              v-model="sizeForm.orderNumUpperLimit"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item
            v-if="show"
            prop="orderNumLowerLimit"
            label="订单数量下限"
          >
            <el-input
              v-model="sizeForm.orderNumLowerLimit"
              style="width: 180px"
            />
          </el-form-item>
          <!-- <el-form-item label="固定收货人数量">
          <el-input v-model="sizeForm.fixedConsigneeNum" style="width: 180px" />
        </el-form-item>
        <el-form-item label="固定产品数量">
          <el-input v-model="sizeForm.fixedProductNum" style="width: 180px" />
        </el-form-item>
        <el-form-item label="最小提总数">
          <el-input v-model="sizeForm.minimumSkuNum" style="width: 180px" />
        </el-form-item>
        <el-form-item label="体积限定">
          <el-input v-model="sizeForm.volumeLimit" style="width: 180px" />
        </el-form-item>
        <el-form-item label="重量限定">
          <el-input v-model="sizeForm.weightLimit" style="width: 180px" />
        </el-form-item>
        <el-form-item label="总件数设置">
          <el-input v-model="sizeForm.totalNum" style="width: 180px" />
        </el-form-item> -->
          <!-- <el-form-item v-if="show" label="最长等待时间">
            <el-input v-model="sizeForm.longestWaittingTime" style="width: 180px" />
          </el-form-item> -->
          <el-form-item>
            <el-checkbox v-model="sizeForm.isPicking">分拣任务</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="sizeForm.isModified">可修改</el-checkbox>
          </el-form-item>
          <!-- <el-form-item>
          <el-checkbox v-model="sizeForm.isBindingBox">绑定周转箱</el-checkbox>
        </el-form-item> -->
          <el-form-item v-if="show" prop="waveNum" label="波次数">
            <el-input v-model="sizeForm.waveNum" style="width: 180px" />
          </el-form-item>
          <!-- <el-form-item label="是否播种">
          <el-select v-model="sizeForm.isSowed" placeholder="请选择">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="上次波次时间">
          <el-date-picker
            v-model="sizeForm.lastWaveTime"
            type="datetime"
          />
        </el-form-item>
        <el-form-item label="订单排序">
          <el-input v-model="sizeForm.orderSorting" style="width: 180px" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="sizeForm.isCrossRegion">允许跨区</el-checkbox>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="sizeForm.createTime"
            type="datetime"
          />
        </el-form-item> -->
        </el-form>
      </el-card>
      <el-card>
        <el-form
          :model="formTime"
          label-width="150px"
          :inline="true"
          size="mini"
        >
          <el-form-item v-if="show" label="时间间隔（分钟）">
            <el-input v-model="formTime.frequencyMinute" autocomplete="off" />
          </el-form-item>
          <el-form-item v-if="show" label="起始时间">
            <el-time-picker
              v-model="formTime.startTime"
              formmat="HH:mm:ss"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: `00:00:00 - ${
                  formTime.endTime ? formTime.endTime : '23:59:59'
                }`,
              }"
              placeholder="开始时间"
            />
            <el-time-picker
              v-model="formTime.endTime"
              :picker-options="{
                selectableRange: `${
                  formTime.startTime ? formTime.startTime : '00:00:00'
                } - 23:59:59`,
              }"
              placeholder="结束时间"
              formmat="HH:mm:ss"
              value-format="HH:mm:ss"
            />
          </el-form-item>
          <el-form-item v-if="!show" label="固定时间运行">
            <div v-for="(item, index) in timeData" :key="index">
              <el-time-picker
                v-model="item.fixedTime"
                formmat="HH:mm:ss"
                value-format="HH:mm:ss"
                :picker-options="{
                  selectableRange: '08:00:00 - 20:00:00',
                }"
                placeholder="请选择时间"
              />
              <el-button @click="delete1(index)">-</el-button>
            </div>
            <el-button @click="clickAdd">+</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="submit">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="波次规则修改"
      :visible.sync="dialogVisibleChange"
      width="60%"
      class="showAll_dialog"
    >
      <el-card shadow="always">
        <el-form
          ref="sizeFormChange"
          :inline="true"
          :model="sizeFormChange"
          :rules="waveRules"
          label-width="120px"
          size="mini"
        >
          <el-form-item label="波次规则名称">
            <el-select
              v-model="sizeFormChange.waveRuleName"
              placeholder="请选择"
              @change="changeOptionsChange"
            >
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="波次规则代码">
            <el-input
              v-model="sizeFormChange.waveRuleCode"
              placeholder="选择规则名称后自动填充"
              disabled
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item>
            <el-radio-group
              v-model="sizeFormChange.activateType"
              @change="changeTimeChange"
            >
              <el-radio :label="1">激活</el-radio>
              <el-radio :label="0">非激活</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="仓库名称" prop="warehouseName">
            <el-select
              v-model="sizeFormChange.warehouseName"
              placeholder="请选择"
              @change="changeWarehouseOptionsChange"
            >
              <el-option
                v-for="(item, index) in warehouseOptions"
                :key="index"
                :label="item.warehouseName"
                :value="item.warehouseCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="仓库代码">
            <el-input
              v-model="sizeFormChange.warehouseCode"
              placeholder="选择仓库名称后自动填充"
              disabled
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="客户名称" prop="clientName">
            <el-select
              v-model="sizeFormChange.clientName"
              placeholder="请选择"
              @focus="funClient"
            >
              <el-option
                v-for="item in clientOptions"
                :key="item.id"
                :label="item.customName"
                :value="item.customName"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="show"
            prop="orderNumUpperLimit"
            label="订单数量上限"
          >
            <el-input
              v-model="sizeFormChange.orderNumUpperLimit"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item
            v-if="show"
            prop="orderNumLowerLimit"
            label="订单数量下限"
          >
            <el-input
              v-model="sizeFormChange.orderNumLowerLimit"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="sizeFormChange.isPicking"
            >分拣任务</el-checkbox>
          </el-form-item>
          <el-form-item v-if="show" prop="waveNum" label="波次数">
            <el-input v-model="sizeFormChange.waveNum" style="width: 180px" />
          </el-form-item>
        </el-form>
      </el-card>
      <el-card>
        <el-form
          :model="formTimeChange"
          label-width="150px"
          :inline="true"
          size="mini"
        >
          <el-form-item v-if="show" label="时间间隔（分钟）">
            <el-input
              v-model="formTimeChange.frequencyMinute"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item v-if="show" label="起始时间">
            <el-time-picker
              v-model="formTimeChange.startTime"
              formmat="HH:mm:ss"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: `00:00:00 - ${
                  formTimeChange.endTime ? formTimeChange.endTime : '23:59:59'
                }`,
              }"
              placeholder="开始时间"
            />
            <el-time-picker
              v-model="formTimeChange.endTime"
              :picker-options="{
                selectableRange: `${
                  formTimeChange.startTime
                    ? formTimeChange.startTime
                    : '00:00:00'
                } - 23:59:59`,
              }"
              placeholder="结束时间"
              formmat="HH:mm:ss"
              value-format="HH:mm:ss"
            />
          </el-form-item>
          <el-form-item v-if="!show" label="固定时间运行">
            <div v-for="(item, index) in timeData" :key="index">
              <el-time-picker
                v-model="item.fixedTime"
                formmat="HH:mm:ss"
                value-format="HH:mm:ss"
                :picker-options="{
                  selectableRange: '08:00:00 - 20:00:00',
                }"
                placeholder="请选择时间"
              />
              <el-button @click="delete1(index)">-</el-button>
            </div>
            <el-button @click="clickAdd">+</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          @click="dialogVisibleChange = false"
        >取消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="submitChange"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-card :body-style="{ padding: '0px' }" shadow="always">
      <el-table
        ref="tableData"
        :data="tableData"
        :height="tableHeight"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        :row-class-name="tableRowClassName"
        :header-cell-style="{background:'#000',color: '#fff'}"
        :row-style="{ height: '20px' }"
        :cell-style="{ padding: '0px' }"
        size="mini"
        style="width: 100%, font-size: 10px"
        @expand-change="expandChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="expand" align="center">
          <div class="detailsTable">
            <template>
              <el-table
                :data="tabledatas"
                :row-class-name="tableRowClassDetailName"
                :header-cell-style="{background:'#000',color: '#fff'}"
                border
                size="mini"
                :row-style="{ height: '20px' }"
                :cell-style="{ padding: '0px' }"
                style="width: 100%, font-size: 10px"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="index" label="序号" align="center" />

                <el-table-column
                  v-if="showDetail"
                  label="每天频率"
                  align="center"
                  :show-overflow-tooltip="true"
                  prop="frequencyMinute"
                />
                <el-table-column
                  v-if="showDetail"
                  label="开始时间"
                  align="center"
                  :show-overflow-tooltip="true"
                  prop="startTime"
                />
                <el-table-column
                  v-if="showDetail"
                  label="结束时间"
                  align="center"
                  :show-overflow-tooltip="true"
                  prop="endTime"
                />
                <el-table-column
                  v-if="!showDetail"
                  label="固定时间"
                  align="center"
                  :show-overflow-tooltip="true"
                  prop="fixedTime"
                />
              </el-table>
              <div class="pagContainer">
                <el-pagination
                  :current-page="currentPage"
                  :page-sizes="[5, 10, 20]"
                  :page-size="pagesize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalCount"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </template>
          </div>
        </el-table-column>
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column
          label="波次规则代码"
          align="center"
          prop="waveRuleCode"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="波次规则名称"
          align="center"
          prop="waveRuleName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="仓库代码"
          align="center"
          prop="warehouseCode"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="仓库名称"
          align="center"
          prop="warehouseName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="客户名称"
          align="center"
          prop="clientName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="订单数量上限"
          align="center"
          prop="orderNumUpperLimit"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="订单数量下限"
          align="center"
          prop="orderNumLowerLimit"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="是否为分拣任务"
          align="center"
          prop="isPicking"
          :show-overflow-tooltip="true"
          :formatter="formmat"
        />
        <el-table-column
          label="是否运行"
          align="center"
          prop="isRunning"
          :show-overflow-tooltip="true"
          :formatter="rformmat"
        />
        <el-table-column
          label="波次数"
          align="center"
          prop="waveNum"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          width="430px"
          prop="action"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-search"
                @click="chooseShowWave(scope.row)"
              >查看波次</el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit-outline"
                @click="chooseChange(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-setting"
                @click="chooseStart(scope.row)"
              >启用</el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-switch-button"
                @click="chooseStop(scope.row)"
              >停用</el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-delete"
                @click="chooseDelete(scope.row)"
              >删除</el-button>
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
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  updateWaveRuleAndTimer,
  deleteWaveRuleAndTimer,
  searchWorkGroupWarehouse,
  runAllWaveRule,
  screenCustom,
  stopAllWaveRule,
  stopWaveRule,
  addWaveRuleAndTimers,
  runWaveRule,
  screenWaveRule,
  screenWaveRuleSum,
  screenWaveRuleTimer,
  screenWaveRuleTimerSum
} from '@/api/user'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination },
  data() {
    return {
      showDetail: true,
      timeData: [],
      expands: [],
      formTime: {
        frequencyMinute: null,
        startTime: null,
        endTime: null
      },
      formTimeChange: {
        frequencyMinute: null,
        startTime: null,
        endTime: null
      },
      total: 0,
      multipleSelection: [],
      lastTime: 0,
      lastfunTime: 0,
      show: true,
      warehouseOptions: [],
      timeAll: [],
      clientOptions: [],
      tabledatas: [],
      tableHeight: 50,
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 5, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      tableData: [],
      dialogVisible: false,
      dialogVisibleChange: false,
      disableRecord: false,
      disableTime: false,
      options: [
        {
          index: 1,
          value: 'TimedTaskStrategy',
          label: '定时任务规则'
        },
        {
          index: 2,
          value: 'QuantitativeTaskStrategy',
          label: '定量任务规则'
        }
      ],
      waveRules: {
        warehouseName: [
          { required: true, message: '请选择仓库', trigger: 'blur' }
        ],
        clientName: [
          { required: true, message: '请选择客户', trigger: 'blur' }
        ],
        orderNumUpperLimit: [
          { required: true, message: '请输入订单数量上限', trigger: 'blur' }
        ],
        orderNumLowerLimit: [
          { required: true, message: '请输入订单数量下限', trigger: 'blur' }
        ],
        waveNum: [{ required: true, message: '请输入波次数', trigger: 'blur' }]
      },
      sizeForm: {
        waveRuleCode: null,
        waveRuleName: null,
        warehouseCode: null,
        warehouseName: null,
        activateType: 0,
        clientName: null,
        isPicking: false,
        isModified: false,
        orderNumUpperLimit: null,
        orderNumLowerLimit: null,
        waveNum: null
      },
      sizeFormChange: {
        waveRuleCode: null,
        waveRuleName: null,
        warehouseCode: null,
        warehouseName: null,
        activateType: 0,
        clientName: null,
        isPicking: false,
        isModified: false,
        orderNumUpperLimit: null,
        orderNumLowerLimit: null,
        waveNum: null
      }
    }
  },
  created() {
    this.getList()
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight =
        window.innerHeight - this.$refs.tableData.$el.offsetTop - 118

      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight =
          window.innerHeight - self.$refs.tableData.$el.offsetTop - 118
      }
    })
  },
  methods: {
    addNewWaveRule() {
      this.dialogVisible = true
      this.timeData = [{ fixedTime: '' }]
      this.formTime = {
        frequencyMinute: null,
        startTime: null,
        endTime: null
      }
      console.log(window.sessionStorage)
      searchWorkGroupWarehouse({
        id: window.sessionStorage.workGroupId,
        page: 1,
        num: 1
      }).then((res) => {
        this.warehouseOptions = res.data.results
      })
    },
    changeOptions() {
      console.log(this.sizeForm)
      const item = this.options.find(
        (item1) => item1.label === this.sizeForm.waveRuleName
      )
      this.sizeForm.waveRuleName = item.label
      this.sizeForm.waveRuleCode = item.value
      if (this.sizeForm.waveRuleName === '定时任务规则') {
        this.show = false
        this.timeData = [{ fixedTime: '' }]
      } else {
        this.show = true
      }
      console.log(this.sizeForm)
    },
    changeOptionsChange() {
      const item = this.options.find(
        (item1) => item1.label === this.sizeFormChange.waveRuleName
      )
      this.sizeFormChange.waveRuleName = item.label
      this.sizeFormChange.waveRuleCode = item.value
      if (this.sizeFormChange.waveRuleName === '定时任务规则') {
        this.show = false
        this.timeData = [{ fixedTime: '' }]
      } else {
        this.show = true
      }
    },
    expandChange(row, expandedRows) {
      this.expands = []
      if (expandedRows.length > 0) {
        row ? this.expands.push(row.id) : ''
        this.id = row.id
        this.getListDetails(this.pagesize, this.currentPage)
      }
      if (row.waveRuleCode === 'QuantitativeTaskStrategy') {
        this.showDetail = true
      } else {
        this.showDetail = false
      }
    },
    submit() {
      this.$refs.sizeForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定提交新建波次规则吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              if (this.sizeForm.waveRuleName === '定时任务规则') {
                this.timeAll = []
                for (let i = 0; i < this.timeData.length; i++) {
                  this.timeAll.push({ fixedTime: this.timeData[i].fixedTime })
                }
                addWaveRuleAndTimers({
                  head: {
                    waveRuleCode: this.sizeForm.waveRuleCode,
                    waveRuleName: this.sizeForm.waveRuleName,
                    warehouseCode: this.sizeForm.warehouseCode,
                    warehouseName: this.sizeForm.warehouseName,
                    activateType: this.sizeForm.activateType,
                    clientName: this.sizeForm.clientName,
                    isPicking: this.sizeForm.isPicking,
                    isModified: this.sizeForm.isModified,
                    orderNumUpperLimit: this.sizeForm.orderNumUpperLimit,
                    orderNumLowerLimit: this.sizeForm.orderNumLowerLimit,
                    waveNum: this.sizeForm.waveNum
                  },
                  details: this.timeAll
                }).then((res) => {
                  if (res.code === 200) {
                    this.$message.success('新建成功')
                    this.reload()
                  }
                })
              } else {
                addWaveRuleAndTimers({
                  head: {
                    waveRuleCode: this.sizeForm.waveRuleCode,
                    waveRuleName: this.sizeForm.waveRuleName,
                    warehouseCode: this.sizeForm.warehouseCode,
                    warehouseName: this.sizeForm.warehouseName,
                    activateType: this.sizeForm.activateType,
                    clientName: this.sizeForm.clientName,
                    isPicking: this.sizeForm.isPicking,
                    isModified: this.sizeForm.isModified,
                    orderNumUpperLimit: this.sizeForm.orderNumUpperLimit,
                    orderNumLowerLimit: this.sizeForm.orderNumLowerLimit,
                    waveNum: this.sizeForm.waveNum
                  },
                  details: [
                    {
                      frequencyMinute: this.formTime.frequencyMinute,
                      startTime: this.formTime.startTime,
                      endTime: this.formTime.endTime
                    }
                  ]
                }).then((res) => {
                  if (res.code === 200) {
                    this.$message.success('新建成功')
                    this.reload()
                  }
                })
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        }
      })
    },
    submitChange() {
      this.$refs.sizeFormChange.validate((valid) => {
        if (valid) {
          this.$confirm('确定修改波次规则吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              if (this.sizeFormChange.waveRuleName === '定时任务规则') {
                this.timeAll = []
                for (var i = 0; i < this.timeData.length; i++) {
                  this.timeAll.push({ fixedTime: this.timeData[i].fixedTime })
                }
                updateWaveRuleAndTimer({
                  head: {
                    id: this.sizeFormChange.id,
                    isModified: this.sizeFormChange.isModified,
                    waveRuleCode: this.sizeFormChange.waveRuleCode,
                    waveRuleName: this.sizeFormChange.waveRuleName,
                    warehouseCode: this.sizeFormChange.warehouseCode,
                    warehouseName: this.sizeFormChange.warehouseName,
                    activateType: this.sizeFormChange.activateType,
                    clientName: this.sizeFormChange.clientName,
                    clientId: this.sizeFormChange.clientId,
                    isPicking: this.sizeFormChange.isPicking,
                    orderNumUpperLimit: this.sizeFormChange.orderNumUpperLimit,
                    orderNumLowerLimit: this.sizeFormChange.orderNumLowerLimit,
                    waveNum: this.sizeFormChange.waveNum
                  },
                  details: this.timeAll
                }).then((res) => {
                  if (res.code === 200) {
                    this.$message.success('修改成功')
                    this.reload()
                  }
                })
              } else {
                updateWaveRuleAndTimer({
                  head: {
                    id: this.sizeFormChange.id,
                    isModified: this.sizeFormChange.isModified,
                    waveRuleCode: this.sizeFormChange.waveRuleCode,
                    waveRuleName: this.sizeFormChange.waveRuleName,
                    warehouseCode: this.sizeFormChange.warehouseCode,
                    warehouseName: this.sizeFormChange.warehouseName,
                    activateType: this.sizeFormChange.activateType,
                    clientName: this.sizeFormChange.clientName,
                    clientId: this.sizeFormChange.clientId,
                    isPicking: this.sizeFormChange.isPicking,
                    orderNumUpperLimit: this.sizeFormChange.orderNumUpperLimit,
                    orderNumLowerLimit: this.sizeFormChange.orderNumLowerLimit,
                    waveNum: this.sizeFormChange.waveNum
                  },
                  details: [
                    {
                      frequencyMinute: this.formTimeChange.frequencyMinute,
                      startTime: this.formTimeChange.startTime,
                      endTime: this.formTimeChange.endTime
                    }
                  ]
                }).then((res) => {
                  if (res.code === 200) {
                    this.$message.success('修改成功')
                    this.reload()
                  }
                })
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        }
      })
    },
    formmat(row) {
      if (row.isPicking === false) {
        return '否'
      } else {
        return '是'
      }
    },
    rformmat(row) {
      if (row.isRunning === false) {
        return '否'
      } else {
        return '是'
      }
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        page: n2,
        num: n1
      }
      this.tableLoading = true
      screenWaveRuleTimer({
        searchDTO,
        pojo: {
          waveRuleId: this.id
        }
      }).then((response) => {
        this.tabledatas = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      screenWaveRuleTimerSum({
        searchDTO,
        pojo: {
          waveRuleId: this.id
        }
      }).then((response) => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    getList() {
      this.listLoading = true
      screenWaveRule({
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {}
      }).then((response) => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenWaveRuleSum({
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {}
      }).then((response) => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    clickAdd() {
      this.timeData.push({ fixedTime: '' })
    },
    delete1(index) {
      this.timeData.splice(index, 1)
    },
    startAll() {
      this.$confirm('确认运行所有波次规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          runAllWaveRule({
            id: window.sessionStorage.workGroupId
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success('已运行')
              this.reload()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    stopAll() {
      this.$confirm('确认停止所有正在运行的波次规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          stopAllWaveRule({
            id: window.sessionStorage.workGroupId
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success('已停止')
              this.reload()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    chooseChange(row) {
      searchWorkGroupWarehouse({
        id: window.sessionStorage.workGroupId,
        page: 1,
        num: 10000
      }).then((res) => {
        this.warehouseOptions = res.data.results
      })
      var searchDTO = {
        page: 1,
        num: 10000
      }
      this.dialogVisibleChange = true
      console.log(row)
      this.sizeFormChange.waveRuleName = row.waveRuleName
      this.sizeFormChange.waveRuleCode = row.waveRuleCode
      this.sizeFormChange.id = row.id
      this.sizeFormChange.activateType = row.activateType
      this.sizeFormChange.isModified = row.isModified
      this.sizeFormChange.warehouseName = row.warehouseName
      this.sizeFormChange.warehouseCode = row.warehouseCode
      this.sizeFormChange.clientName = row.clientName
      this.sizeFormChange.clientId = row.clientId
      this.sizeFormChange.orderNumLowerLimit = row.orderNumLowerLimit
      this.sizeFormChange.orderNumUpperLimit = row.orderNumUpperLimit
      this.sizeFormChange.isPicking = row.isPicking
      this.sizeFormChange.waveNum = row.waveNum
      if (this.sizeFormChange.waveRuleName === '定时任务规则') {
        this.show = false
        this.timeData = []
        screenWaveRuleTimer({
          searchDTO,
          pojo: {
            waveRuleId: row.id
          }
        }).then((response) => {
          console.log(response.data)
          for (let i = 0; i < response.data.length; i++) {
            console.log(response.data[i])
            this.timeData.push({ fixedTime: response.data[i].fixedTime })
          }
          setTimeout(() => {
            this.tableLoading = false
          }, 0.5 * 1000)
        })
      } else {
        this.show = true
        screenWaveRuleTimer({
          searchDTO,
          pojo: {
            waveRuleId: row.id
          }
        }).then((response) => {
          console.log(response.data)
          this.formTimeChange.frequencyMinute =
            response.data[0].frequencyMinute
          this.formTimeChange.startTime = response.data[0].startTime
          this.formTimeChange.endTime = response.data[0].endTime
          setTimeout(() => {
            this.tableLoading = false
          }, 0.5 * 1000)
        })
      }
    },
    chooseStart(row) {
      this.$confirm('确认运行该波次规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          runWaveRule({
            id: row.id
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success('已运行')
              this.reload()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    chooseStop(row) {
      this.$confirm('确认停止该波次规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          stopWaveRule({
            id: row.id
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success('已停止')
              this.reload()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },

    chooseDelete(row) {
      this.$confirm('是否确认删除此波次规则?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteWaveRuleAndTimer({ id: row.id }).then((res) => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.reload()
            } else {
              this.$message.error('删除失败')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    },
    changeWarehouseOptions() {
      const item = this.warehouseOptions.find(
        (item1) => item1.warehouseCode === this.sizeForm.warehouseName
      )
      this.sizeForm.warehouseCode = item.warehouseCode
      this.sizeForm.warehouseName = item.warehouseName
    },
    changeWarehouseOptionsChange() {
      const item = this.warehouseOptions.find(
        (item1) => item1.warehouseCode === this.sizeFormChange.warehouseName
      )
      this.sizeFormChange.warehouseCode = item.warehouseCode
      this.sizeFormChange.warehouseName = item.warehouseName
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
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
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    funClient() {
      const now = new Date().valueOf()
      if (this.lastfunTime === 0) {
        screenCustom({
          searchDTO: {
            page: 1,
            num: 100
          },
          pojo: {}
        }).then((res) => {
          this.clientOptions = res.data
        })
        this.lastfunTime = now
      } else {
        if (now - this.lastfunTime > 5000) {
          this.lastfunTime = now
        }
      }
    },
    changeTime() {
      if (this.sizeForm.activateType !== 2) {
        this.disableTime = false
      } else {
        this.disableTime = true
      }
    },
    changeTimeChange() {
      if (this.sizeFormChange.activateType !== 2) {
        this.disableTime = false
      } else {
        this.disableTime = true
      }
    },
    refresh() {
      this.reload()
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      // 去重获取被选中的id值存入到数组中
      for (let i = 0; i < val.length; i++) {
        if (this.multipleSelection.indexOf(val[i].id) === -1) {
          this.multipleSelection.push({ id: val[i].id })
        }
      }
      console.log(this.multipleSelection)
    }
  }
}
</script>
<style>
.el-message-box {
  background-color: #091f2cee !important;
}

.el-message-box__title {
  color: #ffffff;
}

.el-message-box__content {
  color: #ffffff;
}

.el-table .d-row {
  background: rgb(194, 45, 45);
}
.el-table .o-row {
  background: #bbca4a;
}
.el-table .dd-row {
  background: rgb(97, 165, 186);
}
.el-table .do-row {
  background: #6f6dda;
}
.mainApp {
  background-color: #eee;
}
</style>
<style scoped>
.btngroups {
  margin: 1px;
}
.pagContainer {
  background-color: rgb(75, 200, 175);
}
</style>
  <style lang="scss" scoped>
// 修改对话框高度
.showAll_dialog {
  ::v-deep.el-dialog {
    margin: 10px auto !important;
    background-color: #091f2cee;

    .el-dialog__title {
      color: white;
      caret-color: transparent;
    }
    .el-icon-close {
      color: white;
      &:hover {
        color: rgb(9, 205, 219);
      }
    }
  }
}
</style>

