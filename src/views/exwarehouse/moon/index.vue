<template>
  <div>
    <el-row>
      <el-col v-show="showLeft" :span="spanLeft">
        <el-row>
          <div id="btnAndSearch">
            <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
              <div class="search">
                <el-form :inline="true" :model="formSearch" label-width="120px">
                  <el-form-item label="合单时间">
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
                <el-button size="small" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="按格式导出选中的合单结果" placement="bottom-start">
                <el-button size="small" type="primary" icon="el-icon-export">导出</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看全部/今日的合单结果" placement="bottom-start">
                <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed ? "查看全部合单结果" : "查看今日的合单结果" }}</el-button>
              </el-tooltip>
              <!-- <el-button  icon="el-icon-download" @click="outExcel">导出</el-button>
            <el-button  icon="el-icon-download" @click="outSelfExcel">自定义导出</el-button> -->
            </div>
          </div>
        </el-row>
        <el-card :body-style="{padding:'0px'}" shadow="always">
          <el-table
            ref="multipleTable"
            :height="tableHeight"
            :data="tableData"
            :row-key="getRowKeys"
            :row-class-name="tableRowClassName"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            size="mini"
            style="width: 100%, font-size: 10px"
            :header-cell-style="{background:'#000',color: '#fff'}"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
          >
            <el-table-column :label="labelTitle" align="center">
              <el-table-column type="selection" align="center" />
              <el-table-column
                type="index"
                label="序号"
                width="50"
                align="center"
              />
              <el-table-column label="装箱单编号" align="center" :show-overflow-tooltip="true" prop="exPickingId" />
              <el-table-column label="创建时间" align="center" :show-overflow-tooltip="true" prop="createTime">
                <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column label="是否合单" align="center" :show-overflow-tooltip="true" prop="isMerged">
                <template slot-scope="scope">
                  <span v-if="scope.row.isMerged=== false"><el-tag type="warning" size="mini">未合单</el-tag></span>
                  <span v-if="scope.row.isMerged=== true"><el-tag type="success" size="mini">已合单</el-tag></span>
                </template></el-table-column>
              <!-- <el-table-column label="作业类型" align="center" :show-overflow-tooltip="true" prop="workType">
                <template slot-scope="scope">
                  <span v-if="scope.row.workType=== 0">未装箱</span>
                  <span v-if="scope.row.workType=== 1">人工自选装箱</span>
                  <span v-if="scope.row.workType=== 2">人工按装箱单装箱</span>
                  <span v-if="scope.row.workType=== 3">自动设备装箱单装箱</span>
                </template></el-table-column>
              <el-table-column label="装箱类型" align="center" :show-overflow-tooltip="true" prop="exPickingType">
                <template slot-scope="scope">
                  <span v-if="scope.row.workType=== 1">自动化设备</span>
                  <span v-if="scope.row.workType=== 2">人工作业</span>
                </template></el-table-column> -->
              <el-table-column label="客户名称" align="center" :show-overflow-tooltip="true" prop="customerName" />
              <!-- <el-table-column label="来源单据" align="center" :show-overflow-tooltip="true" prop="billSource" /> -->
              <el-table-column label="仓库代码" align="center" :show-overflow-tooltip="true" prop="warehouseCode" />
              <el-table-column label="货主代码" align="center" :show-overflow-tooltip="true" prop="cargoOwnerCode" />
              <!-- <el-table-column label="波次号" align="center" :show-overflow-tooltip="true" prop="waveNumber" /> -->
              <el-table-column label="包装代码" align="center" :show-overflow-tooltip="true" prop="containerCode" />
              <el-table-column label="放置位置/站台号" align="center" :show-overflow-tooltip="true" prop="boxPosition" />
              <!-- <el-table-column label="预约号" align="center" :show-overflow-tooltip="true" prop="preId" />
            <el-table-column label="车号" align="center" :show-overflow-tooltip="true" prop="carNumber" />
            <el-table-column label="司机" align="center" :show-overflow-tooltip="true" prop="driver" />
            <el-table-column label="月台编号" align="center" :show-overflow-tooltip="true" prop="platformNumber" />
            <el-table-column label="顺序号" align="center" :show-overflow-tooltip="true" prop="number" />
            <el-table-column label="创建时间" align="center" :show-overflow-tooltip="true" prop="takeTime">
              <template slot-scope="scope">{{ scope.row.takeTime| dateYMDHMSFormat }}</template>
            </el-table-column> -->
            </el-table-column>
            <el-table-column
              prop="action"
              label="操作"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <el-button-group>
                  <el-button size="mini" icon="el-icon-search" type="primary" @click="searchDetail(scope.row)">查看合单详情</el-button>
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
      </el-col>
      <el-col v-show="showRight" :span="spanRight">
        <div id="btnRight">
          <div class="btngroupsRight">
            <el-button-group>
              <el-tooltip class="item" effect="dark" content="返回合单结果列表" placement="bottom-start">
                <el-button type="warning" @click="goback">返回上一页</el-button>
              </el-tooltip>
            </el-button-group>
          </div>
          <el-card class="show_card1" :body-style="{padding:'0px'}">
            <div slot="header" align="center" style="padding: 15px">
              <span class="title">合单结果 单头信息</span>
            </div>
            <el-form ref="form" :inline="true" :model="formTitle">
              <el-card :body-style="{padding:'0px'}">
                <e-desc>
                  <e-desc-item label="装箱单编号">
                    <el-input v-model="formTitle.exPickingId" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="订单状态">
                    <el-input v-model="formTitle.statusName" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="创建时间">
                    <el-date-picker
                      v-model="formTitle.createTime"
                      type="datetime"
                      size="small"
                      align="right"
                      unlink-panels
                      disabled
                      style="width: 100%;"
                      :picker-options="pickerOptions"
                    />
                  </e-desc-item>
                  <e-desc-item label="客户名称">
                    <el-input v-model="formTitle.customerName" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="仓库代码">
                    <el-input v-model="formTitle.warehouseCode" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="货主代码">
                    <el-input v-model="formTitle.cargoOwnerCode" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="包装代码">
                    <el-input v-model="formTitle.containerCode" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="放置位置/站台号">
                    <el-input v-model="formTitle.boxPosition" style="width: 43.5%;" size="small" readonly />
                  </e-desc-item>
                </e-desc>
              </el-card>
            </el-form>
          </el-card>
        </div>
        <el-card style="background-color: #081b26c3;" :body-style="{padding:'0px'}">
          <div slot="header" style="padding: 15px" align="center">
            <span class="title">合单结果 商品信息</span>
          </div>
          <el-form ref="tabledatas">
            <el-table
              ref="tablelist"
              :data="tabledatas"
              :row-class-name="tableRowClassDetailName"
              border
              size="mini"
              :summary-method="getSummaries"
              show-summary
              :row-style="{height:'20px'}"
              :cell-style="{padding:'0px'}"
              style="width: 100%, font-size: 10px"
              :height="tableHeightRight"
              :header-cell-style="{background:'#000',color: '#fff'}"
              tooltip-effect="dark"
            >
              <el-table-column v-if="false" label="id" prop="id" />
              <el-table-column type="index" label="序号" align="center" />
              <el-table-column label="sku名称" align="center" :show-overflow-tooltip="true" prop="skuName" />
              <el-table-column label="sku代码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
              <el-table-column label="尺寸" align="center" :show-overflow-tooltip="true" prop="goodsSize" />
              <el-table-column label="颜色" align="center" :show-overflow-tooltip="true" prop="goodsColor" />
              <el-table-column label="数量" align="center" prop="skuCnt" />
            <!-- <el-table-column label="sku单价" align="center" :show-overflow-tooltip="true" prop="skuPrice" /> -->
            </el-table>
            <div class="pagContainer">
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[50, 100, 1000]"
                :total="totalCount"
                :page.sync="listQueryDetail.page"
                :limit.sync="listQueryDetail.limit"
                @pagination="getListDetails"
              />
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import EDesc from '@/components/Edesc'
import EDescItem from '@/components/Edescitem'
import { kkdeboundce } from '@/utils/kkdebounce'
import { screenExPickingDetailSum, screenExPickingDetail, screenTableExpicking, screenTableExpickingNum } from '@/api/user'
import elementResizeDetectorMaker from 'element-resize-detector'
var erd = elementResizeDetectorMaker()
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination, EDesc, EDescItem },
  data() {
    return {
      listQueryDetail: {
        page: 1,
        limit: 50
      },
      isEdit: false,
      totalCount: 1,
      formTitle: {},
      currentDate1: null,
      currentDate: null,
      labelTitle: '合单结果-今日的记录',
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
        time0: []
      },
      searchEndTime: null,
      searchStartTime: null,
      screen: null,
      isRightAllButton: true,
      showLeft: true,
      showRight: false,
      spanLeft: 24,
      spanRight: 12,
      viewed: true,
      multipleSelection: [],
      waveId: null,
      advanced: false,
      show: false,
      listLoading: true,
      total: 0,
      tableHeight: 50,
      tableHeightRight: 500,
      tabledatas: [],
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      form: {
        preId: null,
        carNumber: null,
        driver: null,
        platformNumber: null,
        number: null,
        takeTime: null
      },
      tableData: []
    }
  },
  watch: {
    viewed: function(viewed) {
      switch (viewed) {
        case true:
          this.labelTitle = '合单结果-今日的记录'
          break
        case false:
          this.labelTitle = '合单结果-所有记录'
      }
    }
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
  },
  created() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    this.currentDate = `${year}-${month}-${day} 00:00:00`
    this.currentDate1 = `${year}-${month}-${day + 1} 00:00:00`
    this.getListScan()
  },
  methods: {
    getListDetails() {
      screenExPickingDetail({ searchDTO: {
        page: this.listQueryDetail.page,
        num: this.listQueryDetail.limit
      },
      pojo: {
        exPickingId: this.id
      }}).then(response => {
        this.tabledatas = response.data
      })
      screenExPickingDetailSum({
        pojo: {
          exPickingId: this.id
        }}).then(response => {
        this.totalCount = response.data
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        // 第一个显示为合计
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map((item) => item[column.property])
        // 对表格数据进行循环
        values.map((item) => {
          // 判断返回的是否为number数据类型
          if (typeof item === 'number' && item !== Infinity && !isNaN(item)) {
            // 判断是否为时间戳
            if (item > 1600000000000) {
              // 若为时间戳则置为--
              sums[index] = '--'
              return
            } else {
              // 对number数据进行累加
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  // 解决js计算小数出现小数点后多位数字的问题
                  return Math.floor((prev + curr) * 100) / 100
                } else {
                  return prev
                }
              }, 0)
            }
          } else {
            // 不为number类型则置为--
            sums[index] = '--'
            return
          }
        })
      })
      return sums
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
    searchDetail(row) {
      this.spanLeft = 24
      this.showRight = true
      this.spanRight = 24
      this.showLeft = false
      this.isRightAllButton = true
      this.id = row.id
      this.getListDetails()
      this.formTitle = row
      this.formTitleNow = row
      if (this.formTitle.isMerged === false) {
        this.formTitle.statusName = '未合单'
      } else if (this.formTitle.status === true) {
        this.formTitle.statusName = '已合单'
      }
      console.log(this.formTitle)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    changeadvanced() {
      this.advanced = !this.advanced
    },
    search() {
      this.listQuery.page = 1
      this.labelTitle = '合单结果-查询结果'
      this.getList()
    },
    refresh() {
      this.reload()
    },
    goback() {
      this.showRight = false
      this.showLeft = true
    },
    getList() {
      if (this.formSearch.time0) {
        this.searchStartTime = this.formSearch.time0[0]
        this.searchEndTime = this.formSearch.time0[1]
      } else {
        this.searchStartTime = null
        this.searchEndTime = null
      }
      screenTableExpicking({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
      },
      startTime: this.searchStartTime,
      endTime: this.searchEndTime,
      screen: this.screen
      }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenTableExpickingNum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
      },
      startTime: this.searchStartTime,
      endTime: this.searchEndTime,
      screen: this.screen
      }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getListScan() {
      if (this.viewed === false) {
        screenTableExpicking({ searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        }}).then(response => {
          this.tableData = response.data
        })
        screenTableExpickingNum({ searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        }}).then(response => {
          this.total = response.data
        })
      } else {
        screenTableExpicking({ searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        },
        startTime: this.currentDate,
        endTime: this.currentDate1
        }).then(response => {
          this.tableData = response.data
        })
        screenTableExpickingNum({ searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        },
        startTime: this.currentDate,
        endTime: this.currentDate1
        }).then(response => {
          this.total = response.data
        })
      }
    },
    scanHistory: kkdeboundce(function() {
      this.viewed = !this.viewed
      // if (!this.viewed) {
      // } else {
      // }
      this.getListScan()
    }, 300),
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style>
.datagrid-htable, .datagrid-btable, .datagrid-ftable {
    color: #ffffff;
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
</style>
  <style scoped>
    .el-card /deep/ .el-card__header {
    color:#fff;
  padding: 5px;
  }
   .el-form /deep/.el-form-item__label{
    color:rgb(0, 0, 0);
    font-weight: bold;
  }
  .search {
      margin: 1px;
      padding-top: 10px;
      background-color: rgb(255, 255, 255);
    }
  .btngroups {
    margin: 5px;
  }
  .detailsTable {
   border:#909090 1px solid;

  }
  .btngroupsRight {
    background-color:#081b26c3;
  }
   .show_card1 {
      background-color:#081b26c3;
    }
  </style>
   <style lang="scss" scoped>
   .el-input.is-disabled .el-input__inner {
     border-color: rgb(0, 0, 0)!important;
     background-color: #0c0c0c7b!important;
     color: #fff!important
   }

 // 修改对话框高度
 .show_card {
       background-color:#262626;
     }
     .showAll_dialog {
     .cardContain {
       height:100%;
       .formContain {
         height: 15%;
         border: 1px solid #fff;
         padding: 5px 5px;
       }
       .detailsTable2 {
         height: 85%;
         overflow-y: auto;
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

     .el-form-item__label {
       color: #eaf2ff;
     }
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
   .detailsTable {
    ::v-deep .el-table tbody tr:hover>td {
   background-color:#162a48!important
 }
   }
   .show_card_p {
     .cardContain {
       height:100%;
   }
    ::v-deep.el-dialog {
       background-color: #262626;
       border: #fff 1px solid;
        box-shadow: 0 7px 8px -4px rgba(164, 96, 96, 0.2),
     0 13px 19px 2px rgba(121, 59, 59, 0.14), 0 5px 24px 4px rgba(128, 36, 36, 0.12);

       .el-dialog__body {
         line-height: 30px;
         color: white;
         padding: 10px 15px;
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
       margin: 10px auto !important;
     background-color: #091f2cee;

       .el-dialog__body {
         line-height: 30px;
         color: white;
         padding: 10px 15px;
       }
       .el-dialog__title {
         color: white;
         caret-color: transparent;
       }
       .el-form-item__label {
       color: #eaf2ff;
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

