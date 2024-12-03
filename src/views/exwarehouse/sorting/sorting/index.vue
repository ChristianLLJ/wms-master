<template>
  <div>
    <el-dialog
      title="请选择推送目标"
      :visible.sync="sendDialogVisible"
      width="40%"
      center
    >
      <div style="margin-top: 20px">
        <el-checkbox v-model="checkWave" label="推送任务至分拨设备" border size="medium" />
        <el-checkbox v-model="checkWarehouse" label="推送至密集库" border size="medium" />
        <el-checkbox v-model="checkOpc" label="推送至穿梭车" border size="medium" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendAll()">确 定</el-button>
      </span>
    </el-dialog>
    <el-row>
      <el-col v-show="showLeft" :span="spanLeft">
        <el-row>
          <div id="btnAndSearch">
            <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
              <div class="search">
                <el-form :inline="true" :model="formSearch" label-width="100px">
                  <el-form-item label="分拣状态">
                    <el-select v-model="formSearch.orderState" placeholder="请选择任务分拣状态" size="small" clearable multiple>
                      <el-option v-for="item in optionsState" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" style="width: 160px;" />
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item label="分拣设备">
                    <el-select v-model="formSearch.device" placeholder="请选择分拣设备名称" size="small" clearable multiple>
                      <el-option v-for="item in optionsDevice" :key="item.id" :label="item.deviceName" :value="item.id" size="small" style="width: 160px;" />
                    </el-select>
                  </el-form-item> -->
                  <el-form-item label="分配时间">
                    <el-date-picker
                      v-model="formSearch.time0"
                      style="width: 260px;"
                      type="daterange"
                      size="small"
                      align="right"
                      unlink-panels
                      value-format="yyyy-MM-dd HH:mm:ss"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions"
                    />
                  </el-form-item>
                  <el-form-item label="拣货时间">
                    <el-date-picker
                      v-model="formSearch.time1"
                      style="width: 260px;"
                      type="daterange"
                      size="small"
                      align="right"
                      unlink-panels
                      value-format="yyyy-MM-dd HH:mm:ss"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button-group>
                      <el-button type="success" icon="el-icon-search" size="medium" @click="search()">查询</el-button>
                    </el-button-group>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
            <div class="btngroups">
              <el-tooltip class="item" effect="dark" content="重新获取当前页面数据" placement="bottom-start">
                <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="一键导出在下方列表中选中的分拣任务" placement="bottom-start">
                <el-button size="small" type="primary" icon="el-icon-export">一键导出</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看全部/未完成的分拣任务" placement="bottom-start">
                <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed ? "查看全部分拣任务" : "查看未完成的分拣任务" }}</el-button>
              </el-tooltip>
            </div>
          </div>
        </el-row>
        <el-card :body-style="{padding:'0px'}" shadow="always">
          <el-table
            ref="multipleTable"
            :header-cell-class-name="handleHeadAddClass"
            :height="tableHeight"
            :data="tableData"
            :row-key="getRowKeys"
            :row-class-name="tableRowClassName"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            size="mini"
            style="width: 100%, font-size: 10px"
            element-loading-text="正在加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :header-cell-style="{background:'#000',color: '#fff'}"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
          >
            <!-- <el-table-column type="selection" align="center" /> -->
            <el-table-column :label="labelTitle" align="center">
              <el-table-column
                type="selection"
                width="40px"
                show-overflow-tooltip
                reserve-selection
              />
              <el-table-column
                type="index"
                label="序号"
                width="50"
                align="center"
              />
              <el-table-column sortable="custom" label="分拣任务单号" align="center" :show-overflow-tooltip="true" prop="taskId" />
              <!-- <el-table-column label="分拣设备" align="center" :show-overflow-tooltip="true" prop="device" /> -->
              <el-table-column sortable="custom" label="分拣状态" align="center" :show-overflow-tooltip="true" prop="status">
                <template slot-scope="scope">
                  <span v-if="scope.row.status=== 1"><el-tag type="danger" size="mini">已创建</el-tag></span>
                  <span v-if="scope.row.status=== 2"><el-tag type="warning" size="mini">分拣中</el-tag></span>
                  <span v-if="scope.row.status=== 3"><el-tag type="success" size="mini">已分拣</el-tag></span>
                  <span v-if="scope.row.status=== 4"><el-tag type="danger" size="mini">已取消</el-tag></span>
                </template></el-table-column>
              <el-table-column sortable="custom" label="波次任务单号" align="center" :show-overflow-tooltip="true" prop="waveCode" />
              <!-- <el-table-column label="sku数" align="center" :show-overflow-tooltip="true" prop="device" />
              <el-table-column label="箱数" align="center" :show-overflow-tooltip="true" prop="device" />
              <el-table-column label="单件数" align="center" :show-overflow-tooltip="true" prop="device" /> -->
              <el-table-column sortable="custom" label="创建时间" align="center" :show-overflow-tooltip="true" prop="createTime">
                <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column sortable="custom" label="分配时间" align="center" :show-overflow-tooltip="true" prop="distributionTime">
                <template slot-scope="scope">{{ scope.row.distributionTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column sortable="custom" label="拣货时间" align="center" :show-overflow-tooltip="true" prop="pickingTime">
                <template slot-scope="scope">{{ scope.row.pickingTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column sortable="custom" label="批次属性" align="center" :show-overflow-tooltip="true" prop="batchType" />
              <!-- <el-table-column sortable="custom" label="审核状态" align="center" :show-overflow-tooltip="true" prop="verifyStatus">
                <template slot-scope="scope">
                  <span v-if="scope.row.verifyStatus=== 1"><el-tag type="danger" size="mini">待审核</el-tag></span>
                  <span v-if="scope.row.verifyStatus=== 2"><el-tag type="warning" size="mini">审核通过</el-tag></span>
                  <span v-if="scope.row.verifyStatus=== 11"><el-tag type="success" size="mini">审核不通过</el-tag></span>
                </template></el-table-column>
              <el-table-column sortable="custom" label="审核时间" align="center" :show-overflow-tooltip="true" prop="reviewerTime">
                <template slot-scope="scope">{{ scope.row.reviewerTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column sortable="custom" label="审核人" align="center" :show-overflow-tooltip="true" prop="reviewerName" /> -->
            </el-table-column>
            <el-table-column
              width="269px"
              prop="action"
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button-group>
                  <el-button size="mini" icon="el-icon-upload" type="success" @click="sendRow(scope.row)">推送任务</el-button>
                  <el-button size="mini" icon="el-icon-search" type="primary" @click="searchDetail(scope.row)">查看分拣任务详情</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :total="total"
            :current-page="currentPage"
            :page-sizes="[50, 100, 1000]"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          />
        </el-card>
      </el-col>
      <el-col v-show="showRight" :span="spanRight">
        <div id="btnRight">
          <div class="btngroupsRight">
            <el-button-group>
              <el-tooltip class="item" effect="dark" content="返回分拣任务页面" placement="bottom-start">
                <el-button type="warning" icon="el-icon-back" @click="goback">返回上一页</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="推送此分拣任务" placement="bottom-start">
                <el-button icon="el-icon-upload" type="success" @click="sendRight()">任务推送</el-button>
              </el-tooltip>
              <!-- <el-tooltip v-if="isDetail" class="item" effect="dark" content="点击审核分拣任务" placement="bottom-start">
                <el-button icon="el-icon-receive" type="primary" @click="reviewRight">审核</el-button>
              </el-tooltip> -->
            </el-button-group>
          </div>
          <el-card class="show_card1" :body-style="{padding:'0px'}">
            <div slot="header" align="center" style="padding: 15px">
              <span class="title">分拣任务单头信息</span>
            </div>
            <el-form ref="form" size="mini" :inline="true" class="demo-form-inline" :model="formTitle">
              <el-card :body-style="{padding:'0px'}">
                <e-desc>
                  <e-desc-item label="分拣任务单号">
                    <el-input v-model="formTitle.taskId" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="波次任务单号">
                    <el-input v-model="formTitle.waveCode" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="分拣状态">
                    <el-input v-model="formTitle.statusName" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="分配时间">
                    <el-date-picker
                      v-model="formTitle.distributionTime"
                      type="datetime"
                      size="small"
                      align="right"
                      unlink-panels
                      disabled
                      style="width: 100%;"
                    />
                  </e-desc-item>
                  <e-desc-item label="拣货时间">
                    <el-date-picker
                      v-model="formTitle.pickingTime"
                      type="datetime"
                      size="small"
                      align="right"
                      unlink-panels
                      disabled
                      style="width: 43.5%;"
                    />
                  </e-desc-item>
                </e-desc>
              </el-card>
            </el-form>
          </el-card>
        </div>
        <el-card style="background-color: #081b26c3;" :body-style="{padding:'0px'}">
          <div slot="header" style="padding: 15px" align="center">
            <span class="title">分拣商品信息</span>
          </div>
          <el-table
            :data="tabledatas"
            border
            size="mini"
            row-key="id"
            :row-class-name="tableRowClassDetailName"
            :header-cell-style="{background:'#000',color: '#fff'}"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            style="width: 100%, font-size: 10px"
            :height="tableHeightRight"
          >
            <!-- <el-table-column
                          type="selection"
                          show-overflow-tooltip
                          reserve-selection
                        /> -->
            <el-table-column type="index" label="序号" align="center" />
            <el-table-column width="150px" label="箱码" align="center" :show-overflow-tooltip="true" prop="inventoryBalanceCode" />
            <el-table-column label="sku代码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
            <el-table-column label="所属仓库" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
            <el-table-column width="120px" label="库区" align="center" :show-overflow-tooltip="true" prop="areaName" />
            <el-table-column label="库位组" align="center" :show-overflow-tooltip="true" prop="locationGroupName" />
            <el-table-column width="160px" label="库位" align="center" :show-overflow-tooltip="true" prop="locationName" />
            <el-table-column width="100px" label="整箱拣货设备" align="center" :show-overflow-tooltip="true" prop="fullboxDevice" />
            <el-table-column width="100px" label="拆零拣货设备" align="center" :show-overflow-tooltip="true" prop="pieceDevice" />
            <el-table-column label="单件体积/L" align="center" :show-overflow-tooltip="true" prop="volume" />
            <el-table-column label="单件重量/kg" align="center" :show-overflow-tooltip="true" prop="weight" />
            <el-table-column label="是否整箱" align="center" :show-overflow-tooltip="true" prop="fullTag">
              <template slot-scope="scope">
                <span v-if="scope.row.fullTag=== false"><el-tag type="warning" size="mini">否</el-tag></span>
                <span v-if="scope.row.fullTag=== true"><el-tag type="success" size="mini">是</el-tag></span>
              </template></el-table-column>
            <el-table-column label="是否拆箱" align="center" :show-overflow-tooltip="true" prop="pickupTag">
              <template slot-scope="scope">
                <span v-if="scope.row.pickupTag=== false"><el-tag type="warning" size="mini">否</el-tag></span>
                <span v-if="scope.row.pickupTag=== true"><el-tag type="success" size="mini">是</el-tag></span>
              </template></el-table-column>
            <el-table-column label="箱内数量" align="center" :show-overflow-tooltip="true" prop="inboxCnt" />
            <el-table-column label="拆零数量" align="center" :show-overflow-tooltip="true" prop="pieceCnt" />
            <el-table-column label="客户名称" align="center" :show-overflow-tooltip="true" prop="customerName" />
            <el-table-column label="收货人" align="center" :show-overflow-tooltip="true" prop="receiverName" />
          </el-table>
          <div class="pagContainer">
            <el-pagination
              :page-sizes="[50, 100, 1000]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
              :page.sync="listQueryDetail.page"
              :limit.sync="listQueryDetail.limit"
              @pagination="getListDetails"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import EDesc from '@/components/Edesc'
import EDescItem from '@/components/Edescitem'
import Pagination from '@/components/Pagination'
import { kkdeboundce } from '@/utils/kkdebounce'
import { sendWave, sendPickTaskToShuttleWcs, lkcktask, selectDevice, screenTablePickup, screenTablePickupNum, deletePickingTask, screenDetailPickup, screenDetailPickupNum } from '@/api/user'
import { searchsystemid } from '@/utils/search'
import elementResizeDetectorMaker from 'element-resize-detector'
var erd = elementResizeDetectorMaker()
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination, EDesc, EDescItem },
  data() {
    return {
      sendDialogVisible: false,
      checkOpc: false,
      checkWave: false,
      checkWarehouse: false,
      sortField: {},
      screen: null,
      searchStartTime: null,
      searchEndTime: null,
      searchStartTime1: null,
      searchEndTime1: null,
      isDetail: false,
      listQueryDetail: {
        page: 1,
        limit: 50
      },
      labelTitle: '分拣任务-未完成的记录',
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
      formSearch: {
        orderState: null,
        value1: null,
        value2: null
      },
      optionsState: [],
      optionsDevice: [],
      formTitle: {
      },
      viewed: true,
      isRightAllButton: true,
      showLeft: true,
      showRight: false,
      spanLeft: 24,
      spanRight: 12,
      show: false,
      showSec: false,
      multipleSelection: [],
      tableHeight: 650,
      tableHeightRight: 640,
      laststateTime: 0,
      advanced: false,
      taskId: null,
      listLoading: true,
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 5, // 每页显示的条数
      total: 0,
      dialogVisible: false,
      formLabelWidth: '120px',
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      form: {
        taskStatus: null,
        pickStatus: null,
        batchType: null,
        reviewerName: null
      },
      tableData: [],
      tabledatas: []
    }
  },
  watch: {
    viewed: function(viewed) {
      switch (viewed) {
        case true:
          this.labelTitle = '分拣任务-未完成的记录'
          break
        case false:
          this.labelTitle = '分拣任务-所有记录'
      }
    }
  },
  created() {
    this.getListScan()
    searchsystemid('PICKING_STATE').then(res => {
      this.optionsState = res.data
    })
    selectDevice({
      searchDTO: {
        page: 1,
        num: 100
      },
      'pojo': {
        'deviceType': 2
      }
    }).then(res => {
      this.optionsDevice = res.data
    })
    selectDevice({
      searchDTO: {
        page: 1,
        num: 100
      },
      'pojo': {
        'deviceType': 3
      }
    }).then(res => {
      this.optionsDevice = this.optionsDevice.concat(res.data)
      console.log(this.optionsDevice)
      console.log(res.data)
    })
    console.log(this.optionsDevice)
  },
  mounted: function() {
    erd.listenTo(document.getElementById('btnAndSearch'), (element) => {
      var height = element.offsetHeight
      this.tableHeight = window.innerHeight - height - 90
    })
    erd.listenTo(document.getElementById('btnRight'), (element) => {
      var height = element.offsetHeight
      this.tableHeightRight = window.innerHeight - height - 135
    })
    // this.$nextTick(function() {
    //   this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 78
    //   // this.tableHeightRight = this.tableHeight - 100
    //   // 监听窗口大小变化
    //   const self = this
    //   window.onresize = function() {
    //     self.tableHeight = window.innerHeight - self.$refs.multipleTable.$el.offsetTop - 78
    //   }
    // })
  },
  methods: {
    sendAll() {
      if (this.checkOpc || this.checkWarehouse || this.checkWave) {
        if (this.checkWave) {
          sendWave(
            {
              'id': this.pid
            }
          ).then(res => {
            if (res.code === 200) {
              this.$message.success('推送任务至分拨设备成功')
            } else {
              this.$message.error('推送任务至分拨设备成功')
            }
          })
        }
        if (this.checkOpc) {
          sendPickTaskToShuttleWcs(
            {
              'id': this.id
            }
          ).then(res => {
            if (res.code === 200) {
              this.$message.success('推送至OPC成功')
            } else {
              this.$message.error('推送至OPC失败')
            }
          })
        }
        if (this.checkWarehouse) {
          lkcktask(
            {
              'id': this.id
            }
          ).then(res => {
            if (res.code === 200) {
              this.$message.success('推送至密集库成功')
            } else {
              this.$message.error('推送至密集库失败')
            }
          })
        }
        this.reload()
      } else {
        this.$message.error('请先选择至少一个分拣目标！')
      }
    },
    sendRow(row) {
      this.id = row.id
      this.pid = row.pid
      this.sendDialogVisible = true
    },
    sendRight() {
      this.sendDialogVisible = true
    },
    handleHeadAddClass({ column }) {
      if (this.sortField[column.property]) {
        column.order = this.sortField[column.property]
      }
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
          this.screen = i + ' ' + direction + ',' + this.screen
        }
      }
      // this.screen = this.screenNull
      this.getList() // 调用后端查询接口
    },
    scanHistory: kkdeboundce(function() {
      this.viewed = !this.viewed
      this.getListScan()
    }, 300),
    searchDetail(row) {
      this.spanLeft = 24
      this.showRight = true
      this.spanRight = 24
      this.showLeft = false
      this.isRightAllButton = true
      this.id = row.id
      this.getListDetails()
      this.formTitle = row
      if (row.verifyStatus === 1) {
        this.isDetail = true
      } else {
        this.isDetail = false
      }
      if (this.formTitle.status === 1) {
        this.formTitle.statusName = '已创建'
      } else if (this.formTitle.status === 2) {
        this.formTitle.statusName = '分拣中'
      } else if (this.formTitle.status === 3) {
        this.formTitle.statusName = '已分拣'
      } else {
        this.formTitle.statusName = '已取消'
      }
      console.log(this.formTitle)
    },
    goback() {
      this.showRight = false
      this.showLeft = true
    },
    clear() {
      this.taskId = null
      this.form = {
        taskStatus: null,
        pickStatus: null,
        batchType: null,
        reviewerName: null
      }
      this.getList()
    },
    search() {
      this.listQuery.page = 1
      this.labelTitle = '分拣任务-查询结果'
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    refresh() {
      this.reload()
    },
    // handleDownload() {
    //   if (this.multipleSelection.length) {
    //     this.downloadLoading = true
    //     import('@/vendor/Export2Excel').then(excel => {
    //       const tHeader = [
    //         '任务编号',
    //         'sku编码',
    //         '客户名称',
    //         '类型',
    //         '体积',
    //         '重量',
    //         '单位',
    //         '整箱数量',
    //         '拆零数量',
    //         '批次属性'
    //       ]
    //       const filterVal = [
    //         'taskId',
    //         'skuCode',
    //         'customerName',
    //         'type',
    //         'volume',
    //         'weight',
    //         'unit',
    //         'cnt',
    //         'pieceCnt',
    //         'batchType'
    //       ]
    //       const list = this.multipleSelection
    //       const data = this.formatJson(filterVal, list)
    //       excel.export_json_to_excel({
    //         header: tHeader,
    //         data,
    //         filename: '分拣任务单'
    //       })
    //       this.$refs.multipleTable.clearSelection()
    //       this.downloadLoading = false
    //     })
    //   } else {
    //     this.$message({
    //       message: '请选择至少一条数据',
    //       type: 'warning'
    //     })
    //   }
    // },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => v[j]))
    // },
    // 单个删除
    delect(row) {
      this.$confirm('是否确认删除本条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePickingTask({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.reload()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getListDetails() {
      this.tableLoading = true
      screenDetailPickup({ searchDTO: {
        page: this.listQueryDetail.page,
        num: this.listQueryDetail.limit
      },
      pojo: {
        pid: this.id
      }}).then(response => {
        this.tabledatas = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      screenDetailPickupNum({ searchDTO: {
        page: this.listQueryDetail.page,
        num: this.listQueryDetail.limit
      },
      pojo: {
        pid: this.id
      }}).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    getList() {
      if (this.formSearch.time0) {
        this.searchStartTime = this.formSearch.time0[0]
        this.searchEndTime = this.formSearch.time0[1]
      } else {
        this.searchStartTime = null
        this.searchEndTime = null
      }
      if (this.formSearch.time1) {
        this.searchStartTime1 = this.formSearch.time1[0]
        this.searchEndTime1 = this.formSearch.time1[1]
      } else {
        this.searchStartTime1 = null
        this.searchEndTime1 = null
      }
      screenTablePickup({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
      },
      states: this.formSearch.orderState,
      screen: this.screen,
      startTime: this.searchStartTime,
      endTime: this.searchEndTime,
      startTime1: this.searchStartTime1,
      endTime1: this.searchEndTime1
      }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenTablePickupNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
      },
      states: this.formSearch.orderState,
      screen: this.screen,
      startTime: this.searchStartTime,
      endTime: this.searchEndTime,
      startTime1: this.searchStartTime1,
      endTime1: this.searchEndTime1
      }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getListScan() {
      if (this.viewed === false) {
        this.statesNow = [1, 2, 3, 4]
      } else {
        this.statesNow = [1, 2]
      }
      screenTablePickup({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
      },
      states: this.statesNow,
      screen: null
      }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenTablePickupNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
      },
      states: this.statesNow,
      screen: null
      }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      // 去重获取被选中的id值存入到数组中
      for (let i = 0; i < val.length; i++) {
        if (this.multipleSelection.indexOf(val[i].id) === -1) {
          this.multipleSelection.push({ 'id': val[i].id, 'reviewerId': Number(sessionStorage.getItem('getUserId')) })
        }
      }
    }
  }
}
</script>

<style>
.el-dialog__title {
    line-height: 24px;
    font-size: 20px;
    color: #000;
    font-weight: 600;
}
.el-input.is-disabled .el-input__inner {
    border-color: #f5f7fa;
    background-color: #ffffff;
    color: #606266;
}
.el-table .d-row{
  background: rgb(194, 45, 45);
}
.el-table .o-row{
  background: #bbca4a;
}
.el-table .dd-row{
  background: rgb(97, 165, 186);
}
.el-table .do-row{
  background: #6f6dda;
}
</style>
  <style scoped>
   .show_card1 {
      background-color:#081b26c3;
    }
       .search {
      margin: 1px;
      padding-top: 10px;
      background-color: rgb(255, 255, 255);
    }
    .el-card /deep/ .el-card__header {
    color:#fff;
  padding: 5px;
  }
   .el-form /deep/.el-form-item__label{
    color:rgb(0, 0, 0);
    font-weight: bold;
  }
  .btngroups {
    margin: 5px;
  }
  .btngroupsRight {
    background-color:#081b26c3;
  }
  </style>
<style lang="scss" scoped>
#main {
  margin-top: 10px;
}
.content {
  margin: 18px;
    .content_rece {
    width: 100%;
    height: 500px;
    position: relative;
    border: 2px solid #fff;
    background-color: #176d9e37;
    border-radius: 2%;
    box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
    0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);
    &:hover {
      .rece_icon {
        color: #fff;
      }

      .icon-in {
        background: #34bfa3;
      }
    }
.rece_icon {
  margin: 150px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
  float:left;
  font-size: 100px;
}
    .rece_title {
      float:right;
     margin: 50px 14px;
    color:#34bfa3;
    font-size:32px;
    }
    .rece_title1 {
    padding-left: 250px;
    margin: 50px 0px;
    color:#085848;
    font-size:32px;
    font-weight: bold;
    }
    .rece_num {
      margin-top: 20px;
    }
    .rece_num >span {
      display: inline-block;
      margin-left: 70px;
    color: #34bfa3;
    font-size: 40px
    }
    .table_rece {
      width: 100%;
    }

}
    .content_receSec {
    width: 100%;
    height: 500px;
    position: relative;
    border: 2px solid #fff;
    background-color: #176d9e37;
    border-radius: 2%;
    box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
    0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);
    &:hover {
      .rece_iconSec {
        color: #fff;
      }

      .icon-inSec {
        background: #34bfa3;
      }
    }
.rece_iconSec {
  margin: 150px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
  float:left;
  font-size: 100px;
}
    .rece_titleSec {
      float:right;
     margin: 50px 14px;
    color:#34bfa3;
    font-size:32px;
    }
    .rece_title1Sec {
    padding-left: 250px;
    margin: 50px 0px;
    color:#085848;
    font-size:32px;
    font-weight: bold;
    }
    .rece_numSec {
      margin-top: 20px;
    }
    .rece_numSec >span {
      display: inline-block;
      margin-left: 70px;
    color: #34bfa3;
    font-size: 40px
    }
    .table_receSec {
      width: 100%;
    }

}
}
</style>
