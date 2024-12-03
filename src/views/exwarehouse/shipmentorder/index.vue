<template>
  <div>
    <el-row>
      <el-col v-show="showLeft" :span="spanLeft">
        <el-dialog :title="titleReturn" :visible.sync="isShowReturn" width="90%" height="60%" class="showAll_dialog">
          <el-table
            :data="tableDataReturn"
            :row-class-name="tableRowClassName"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            :max-height="tableHeight"
            size="mini"
            style="width: 100%, font-size: 10px"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
              align="center"
            />
            <el-table-column label="发运订单号" width="115px" align="center" :show-overflow-tooltip="true" prop="despatchId" />
            <el-table-column label="仓库名称" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
            <el-table-column label="货主名称" align="center" :show-overflow-tooltip="true" prop="customerName" />
            <el-table-column label="收货人" align="center" :show-overflow-tooltip="true" prop="receiverName" />
            <el-table-column label="收货地/省" align="center" :show-overflow-tooltip="true" prop="province" />
            <el-table-column label="市" width="60px" :show-overflow-tooltip="true" prop="city" />
            <el-table-column label="县" width="60px" :show-overflow-tooltip="true" prop="site" />
            <el-table-column label="详细地址" align="center" :show-overflow-tooltip="true" prop="address" />
            <el-table-column label="订单状态" align="center" :show-overflow-tooltip="true" prop="status" :formatter="stateFormat" />
            <el-table-column label="是否预配" align="center" :show-overflow-tooltip="true" prop="isPreDistributed">
              <template slot-scope="scope">
                <span v-if="scope.row.isPreDistributed=== 0"><el-tag type="warning" size="mini">未预配</el-tag></span>
                <span v-if="scope.row.isPreDistributed=== 1"><el-tag type="success" size="mini">预配成功</el-tag></span>
                <span v-if="scope.row.isPreDistributed=== 2"><el-tag type="danger" size="mini">预配失败</el-tag></span>
              </template></el-table-column>
            <el-table-column align="center" prop="verifyStatus" label="审核状态" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.verifyStatus=== 1"><el-tag type="warning" size="mini">待审核</el-tag></span>
                <span v-if="scope.row.verifyStatus=== 2"><el-tag type="success" size="mini">审核通过</el-tag></span>
                <span v-if="scope.row.verifyStatus=== 11"><el-tag type="danger" size="mini">审核未通过</el-tag></span>
              </template>
            </el-table-column>
            <el-table-column label="审核人" align="center" :show-overflow-tooltip="true" prop="reviewerName" />
            <el-table-column label="订单创建时间" align="center" :show-overflow-tooltip="true" prop="createTime">
              <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat2 }}</template>
            </el-table-column>
            <el-table-column label="要求交货时间" align="center" :show-overflow-tooltip="true" prop="requestDeliveryTime">
              <template slot-scope="scope">{{ scope.row.requestDeliveryTime| dateYMDHMSFormat2 }}</template>
            </el-table-column>
            <el-table-column label="预期发货时间" align="center" :show-overflow-tooltip="true" prop="expectSendTime">
              <template slot-scope="scope">{{ scope.row.expectSendTime| dateYMDHMSFormat2 }}</template>
            </el-table-column>
            <el-table-column label="审核时间" align="center" :show-overflow-tooltip="true" prop="reviewerTime">
              <template slot-scope="scope">{{ scope.row.reviewerTime| dateYMDHMSFormat2 }}</template>
            </el-table-column>
          </el-table>
          <div slot="footer" align="center" class="dialog-footer">
            <el-button align="center" type="primary" @click="isShowReturn = false">确认</el-button>
          </div>
        </el-dialog>
        <div id="btnAndSearch">
          <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
            <div class="search">
              <el-form :inline="true" :model="formSearch">
                <el-form-item label="发运订单状态">
                  <el-select v-model="formSearch.orderState" placeholder="请选择发运订单状态" size="small" clearable multiple>
                    <el-option v-for="item in optionsState" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" style="width: 160px;" />
                  </el-select>
                </el-form-item>
                <el-form-item label="是否预配">
                  <el-select v-model="formSearch.isPreDistributed" placeholder="请选择预配状态" size="small" clearable>
                    <el-option v-for="item in optionsPreDis" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
                  </el-select>
                </el-form-item>
                <el-form-item label="是否审核">
                  <el-select v-model="formSearch.verifyStatus" placeholder="请选择审核状态" size="small" clearable>
                    <el-option v-for="item in optionsVerify" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
                  </el-select>
                </el-form-item>
                <el-form-item label="收货地址">
                  <el-select v-model="formSearch.province" filterable clearable size="small" placeholder="请选择省份" @change="selectProvinceFun($event)">
                    <el-option v-for="(item, index) in city" :key="index" :value="item" :label="item.label" />
                  </el-select>
                  <el-select v-model="formSearch.city" filterable clearable size="small" placeholder="请选择城市" @change="selectCityFun($event)">
                    <el-option v-for="(item, index) in cityList" :key="index" :value="item" :label="item.label" />
                  </el-select>
                  <el-select v-model="formSearch.site" filterable clearable size="small" placeholder="请选择区县" @change="selectSiteFun($event)">
                    <el-option v-for="(item, index) in siteList" :key="index" :value="item" :label="item.label" />
                  </el-select>
                </el-form-item>
                <el-form-item label="仓库">
                  <el-select v-model="formSearch.warehouseCode" placeholder="请选择仓库名称" size="small" clearable filterable>
                    <el-option v-for="item in optionsWarehouse" :key="item.id" :label="item.warehouseName" :value="item.warehouseCode" />
                  </el-select>
                </el-form-item>
                <el-form-item label="货主">
                  <el-select v-model="formSearch.customerId" placeholder="请选择货主名称" size="small" clearable multiple filterable>
                    <el-option v-for="item in optionsCustom" :key="item.id" :label="item.customName" :value="item.id" style="width: 160px;" />
                  </el-select>
                </el-form-item>
                <el-form-item label="订单创建时间">
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
                <el-form-item label="要求交货时间">
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
            <el-tooltip class="item" effect="dark" content="手动填写发运订单" placement="bottom-start">
              <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="addNew">新建</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="从ERP系统中导入发运订单" placement="bottom-start">
              <el-button size="small" type="primary" icon="el-icon-upload">ERP导入</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="一键导出在下方列表中选中的发运订单" placement="bottom-start">
              <el-button size="small" type="primary" icon="el-icon-export" @click="outSelfExcel">一键导出</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="一键审核在下方列表中选中的发运订单" placement="bottom-start">
              <el-button size="small" icon="el-icon-receive" type="success" @click="reviewAll">一键审核</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="预配选中的发运订单" placement="bottom-start">
              <el-button size="small" type="success" icon="el-icon-preDistribution" @click="preDistributionAll">预配</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="将选中的发运订单生成波次计划" placement="bottom-start">
              <el-button size="small" type="success" icon="el-icon-document" @click="generateWave">波次生成</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看全部/未进行发运的发运订单" placement="bottom-start">
              <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed ? "查看全部发运订单" : "查看未发运的发运订单" }}</el-button>
            </el-tooltip>
            <!-- <el-button  icon="el-icon-download" @click="outExcel">导出</el-button>
            <el-button  icon="el-icon-download" @click="outSelfExcel">自定义导出</el-button> -->
          </div>
        </div>
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
            border
            :header-cell-style="{background:'#000',color: '#fff'}"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
          >
            <el-table-column
              type="selection"
              width="40"
              show-overflow-tooltip
              reserve-selection
            />
            <el-table-column :label="labelTitle" align="center">
              <el-table-column
                type="index"
                label="序号"
                width="35"
                align="center"
              />
              <el-table-column label="发运订单号" width="115px" align="center" :show-overflow-tooltip="true" prop="despatchId" />
              <el-table-column label="仓库名称" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
              <el-table-column label="货主名称" align="center" :show-overflow-tooltip="true" prop="customerName" />
              <el-table-column label="收货人" align="center" :show-overflow-tooltip="true" prop="receiverName" />
              <el-table-column label="收货地/省" width="60px" align="center" :show-overflow-tooltip="true" prop="province" />
              <el-table-column label="市" width="60px" :show-overflow-tooltip="true" prop="city" />
              <el-table-column label="县" width="60px" :show-overflow-tooltip="true" prop="site" />
              <el-table-column label="详细地址" align="center" :show-overflow-tooltip="true" prop="address" />
              <el-table-column sortable="custom" label="订单状态" align="center" :show-overflow-tooltip="true" prop="status" :formatter="stateFormat" />
              <el-table-column sortable="custom" label="是否预配" align="center" :show-overflow-tooltip="true" prop="isPreDistributed">
                <template slot-scope="scope">
                  <span v-if="scope.row.isPreDistributed=== 0"><el-tag type="warning" size="mini">未预配</el-tag></span>
                  <span v-if="scope.row.isPreDistributed=== 1"><el-tag type="success" size="mini">预配成功</el-tag></span>
                  <span v-if="scope.row.isPreDistributed=== 2"><el-tag type="danger" size="mini">预配失败</el-tag></span>
                </template></el-table-column>
              <el-table-column sortable="custom" align="center" prop="verifyStatus" label="审核状态" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.verifyStatus=== 1"><el-tag type="warning" size="mini">待审核</el-tag></span>
                  <span v-if="scope.row.verifyStatus=== 2"><el-tag type="success" size="mini">审核通过</el-tag></span>
                  <span v-if="scope.row.verifyStatus=== 11"><el-tag type="danger" size="mini">审核未通过</el-tag></span>
                </template>
              </el-table-column>
              <el-table-column label="审核人" align="center" :show-overflow-tooltip="true" prop="reviewerName" />
              <el-table-column width="75px" sortable="custom" label="订单创建时间" align="center" :show-overflow-tooltip="true" prop="createTime">
                <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat2 }}</template>
              </el-table-column>
              <el-table-column width="75px" sortable="custom" label="要求交货时间" align="center" :show-overflow-tooltip="true" prop="requestDeliveryTime">
                <template slot-scope="scope">{{ scope.row.requestDeliveryTime| dateYMDHMSFormat2 }}</template>
              </el-table-column>
              <el-table-column width="75px" sortable="custom" label="预期发货时间" align="center" :show-overflow-tooltip="true" prop="expectSendTime">
                <template slot-scope="scope">{{ scope.row.expectSendTime| dateYMDHMSFormat2 }}</template>
              </el-table-column>
              <el-table-column width="75px" sortable="custom" label="审核时间" align="center" :show-overflow-tooltip="true" prop="reviewerTime">
                <template slot-scope="scope">{{ scope.row.reviewerTime| dateYMDHMSFormat2 }}</template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              width="160px"
              prop="action"
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-search" type="primary" @click="searchDetail(scope.row)">查看订单详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            :page-sizes="[50, 100, 1000]"
            @pagination="getList"
          />
        </el-card>
      </el-col>
      <el-col v-show="showRight" :span="spanRight" class="show_card1">
        <div id="btnRight">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="返回发运订单列表" placement="bottom-start">
              <el-button type="warning" icon="el-icon-back" @click="goback">返回上一页</el-button>
            </el-tooltip>
            <el-tooltip v-if="isRightReview" class="item" effect="dark" content="点击审核此发运订单" placement="bottom-start">
              <el-button icon="el-icon-receive" type="primary" @click="reviewRight">审核</el-button>
            </el-tooltip>
            <el-tooltip v-if="isRightPreDis" class="item" effect="dark" content="点击预配此发运订单" placement="bottom-start">
              <el-button icon="el-icon-preDistribution" type="primary" @click="preDistributionRight">预配</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="点击将此发运订单生成波次计划" placement="bottom-start">
              <el-button icon="el-icon-document" type="primary" @click="generateWaveRight">生成波次计划</el-button>
            </el-tooltip>
            <el-tooltip v-if="isRightReview" class="item" effect="dark" content="点击删除此发运订单" placement="bottom-start">
              <el-button icon="el-icon-delete" type="danger" @click="deleteRight">删除</el-button>
            </el-tooltip>
          </el-button-group>
          <el-card class="show_card1" :body-style="{padding:'0px'}" style="background-color: #081b26c3;">
            <div slot="header" align="center" style="padding: 15px">
              <span class="title">发运订单 单头信息</span>
            </div>
            <el-form ref="form" :inline="true" :model="formTitle">
              <el-card :body-style="{padding:'0px'}">
                <e-desc>
                  <e-desc-item label="发运订单号">
                    <el-input v-model="formTitle.despatchId" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="仓库名称">
                    <el-input v-model="formTitle.warehouseName" placeholder="请输入收货人" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="货主名称">
                    <el-select v-model="formTitle.customerName" placeholder="请选择货主名称" size="small" style="width: 100%;" clearable filterable disabled @change="selectCustomer($event)">
                      <el-option v-for="item in optionsCustom" :key="item.id" :label="item.customerName" :value="item.id" />
                    </el-select>
                  </e-desc-item>
                  <e-desc-item label="收货人">
                    <el-input v-model="formTitle.receiverName" placeholder="请输入收货人" size="small" readonly />
                  </e-desc-item>
                  <!-- <e-desc-item label="联系电话">
                    <el-input v-model="formTitle.phoneNumber" placeholder="请输入联系电话" size="small" readonly />
                  </e-desc-item> -->
                  <e-desc-item label="收货地址/省市县">
                    <el-select v-model="formTitle.province" filterable clearable size="small" placeholder="请选择省份" disabled @change="selectProvinceFun($event)">
                      <el-option v-for="(item, index) in city" :key="index" :value="item" :label="item.label" />
                    </el-select>
                    <el-select v-model="formTitle.city" filterable clearable size="small" placeholder="请选择城市" disabled @change="selectCityFun($event)">
                      <el-option v-for="(item, index) in cityList" :key="index" :value="item" :label="item.label" />
                    </el-select>
                    <el-select v-model="formTitle.site" filterable clearable size="small" placeholder="请选择区县" disabled @change="selectAreaFun($event)">
                      <el-option v-for="(item, index) in siteList" :key="index" :value="item" :label="item.label" />
                    </el-select>
                  </e-desc-item>
                  <e-desc-item label="详细地址">
                    <el-input v-model="formTitle.address" placeholder="请输入详细地址" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="订单创建时间">
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
                  <e-desc-item label="要求发货时间">
                    <el-date-picker
                      v-model="formTitle.requestDeliveryTime"
                      type="datetime"
                      size="small"
                      align="right"
                      unlink-panels
                      disabled
                      style="width: 100%;"
                      :picker-options="pickerOptions"
                    />
                  </e-desc-item>
                  <e-desc-item label="预期发货时间">
                    <el-date-picker
                      v-model="formTitle.expectSendTime"
                      type="datetime"
                      size="small"
                      align="right"
                      unlink-panels
                      disabled
                      style="width: 100%;"
                      :picker-options="pickerOptions"
                    />
                  </e-desc-item>
                  <e-desc-item label="审核时间">
                    <el-date-picker
                      v-model="formTitle.reviewerTime"
                      type="datetime"
                      size="small"
                      align="right"
                      unlink-panels
                      disabled
                      style="width: 100%;"
                      :picker-options="pickerOptions"
                    />
                  </e-desc-item>
                  <e-desc-item label="订单状态">
                    <el-input v-model="formTitle.statusName" size="small" readonly style="width: 43.3%;" />
                  </e-desc-item>
                </e-desc>
              </el-card>
            </el-form>
          </el-card>
        </div>
        <el-card style="background-color: #081b26c3" :body-style="{padding:'0px'}">
          <div slot="header" align="center" style="padding: 15px">
            <span class="title">商品信息</span>
          </div>
          <el-table
            ref="tablelist"
            :data="tabledatas"
            :row-class-name="tableRowClassDetailName"
            :summary-method="getSummaries"
            show-summary
            border
            row-key="id"
            size="mini"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            style="width: 100%, font-size: 10px"
            :height="tableHeightRight"
            :header-cell-style="{background:'#000',color: '#fff'}"
            tooltip-effect="dark"
          >
            <el-table-column type="index" label="序号" align="center" />
            <!-- <el-table-column label="发货明细单编号" align="center" :show-overflow-tooltip="true" prop="deliveryDetailId" /> -->
            <el-table-column label="sku名称" align="center" :show-overflow-tooltip="true" prop="skuName" />
            <el-table-column label="sku代码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
            <!-- <el-table-column label="详细描述" align="center" :show-overflow-tooltip="true" prop="chineseDescribe" /> -->
            <!-- <el-table-column label="英文描述" align="center" :show-overflow-tooltip="true" prop="englishDescribe" />
              <el-table-column label="别名代码" align="center" :show-overflow-tooltip="true" prop="otherName" /> -->
            <el-table-column label="订货数" align="center" :show-overflow-tooltip="true" prop="orderCnt" />
            <el-table-column label="预配数" align="center" :show-overflow-tooltip="true" prop="preDistributionCnt" />
            <el-table-column label="分配数" align="center" :show-overflow-tooltip="true" prop="distributionCnt" />
            <el-table-column label="拣货数" align="center" :show-overflow-tooltip="true" prop="takeCnt" />
            <el-table-column label="发货数" align="center" :show-overflow-tooltip="true" prop="deliverCnt" />
            <el-table-column label="拆零数" align="center" :show-overflow-tooltip="true" prop="pieceCnt" />
            <el-table-column label="单位" align="center" :show-overflow-tooltip="true" prop="unit" />
            <!-- <el-table-column label="单位" align="center" :show-overflow-tooltip="true" prop="unit" :formatter="unitFormat" /> -->
            <!-- <el-table-column label="周转规则" align="center" :show-overflow-tooltip="true" prop="turnRule" />
            <el-table-column label="预配规则" align="center" :show-overflow-tooltip="true" prop="preDistributionRule" />
            <el-table-column label="分配规则" align="center" :show-overflow-tooltip="true" prop="distributionRule" /> -->
            <el-table-column label="体积/L" align="center" :show-overflow-tooltip="true" prop="volume" />
            <el-table-column label="重量/kg" align="center" :show-overflow-tooltip="true" prop="weight" />
            <el-table-column label="净重/kg" align="center" :show-overflow-tooltip="true" prop="netWeight" />
            <!-- <el-table-column label="金额/元" align="center" :show-overflow-tooltip="true" prop="money" /> -->
          </el-table>
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="currentPage"
            :page-sizes="[50, 100, 1000]"
            :total="totalCount"
            :page.sync="listQueryDetail.page"
            :limit.sync="listQueryDetail.limit"
            @pagination="getListDetails"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import city from '@/assets/city.json'
import EDesc from '@/components/Edesc'
import EDescItem from '@/components/Edescitem'
import Pagination from '@/components/Pagination'
import { kkdeboundce } from '@/utils/kkdebounce'
import { changeAll, despatchUnit } from '@/utils/statechange'
import { searchsystemid, searchcustomer, searchallwarehouse } from '@/utils/search'
import { deleteDespatchWave, checkDespatchReject, checkDespatch, screenDespatch, screenDespatchSum, generateWaveManual, generateByDespatchs, oneDespatchWaveManual, screenDespatchDetailSum, screenDespatchDetail, preDistributionList, exportDespatchAndDetailExcelSelect, exportDespatchAndDetailExcel } from '@/api/user'
import elementResizeDetectorMaker from 'element-resize-detector'
var erd = elementResizeDetectorMaker()
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination, EDesc, EDescItem },
  data() {
    return {
      isRightReview: false,
      isRightPreDis: false,
      isShowReturn: false,
      titleReturn: '发运订单列表',
      searchStartTime: null,
      searchEndTime: null,
      searchStartTime1: null,
      searchEndTime1: null,
      addSelect: [], // 审核不通过时的提交内容
      city: city,
      cityList: [],
      siteList: [],
      sortField: {},
      screen: null,
      screenNull: '',
      isPreButton: false,
      optionsState: [],
      optionsCustom: [],
      viewed: true,
      labelTitle: '发运订单-未进行发运的记录',
      formSearch: {
        orderState: [],
        customerId: [],
        province: null,
        city: null,
        site: null,
        time0: [],
        time1: []
      },
      optionsPreDis: [
        { codeDetailName: '未预配', typeNumber: 0 },
        { codeDetailName: '预配成功', typeNumber: 1 },
        { codeDetailName: '预配失败', typeNumber: 2 }
      ],
      optionsVerify: [
        { codeDetailName: '待审核', typeNumber: 1 },
        { codeDetailName: '审核通过', typeNumber: 2 },
        { codeDetailName: '审核未通过', typeNumber: 11 }
      ],
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
      optionsWarehouse: [],
      stateOptions: [],
      formTitle: {},
      showLeft: true,
      showRight: false,
      spanLeft: 24,
      spanRight: 12,
      endTime1: 0,
      startTime1: 0,
      idRow: null,
      multipleSelection: [],
      options: [],
      laststateTime: 0,
      despatchId: null,
      type: null,
      status: null,
      statesNow: [0, 1],
      customerName: null,
      warehouse: null,
      reviewerName: null,
      advanced: false,
      show: false,
      listLoading: true,
      directDistrLoading: true,
      id: null,
      tableHeight: 500,
      tableHeightRight: 500,
      total: 0,
      formLabelWidth: '120px',
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 10, // 每页显示的条数
      getRowKeys(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      listQueryDetail: {
        page: 1,
        limit: 50
      },
      rform: {
        status: null,
        skuCode: null,
        unit: null,
        deliveryDetailId: null,
        turnRule: null,
        distributionRule: null
      },
      uform: {
        id: null,
        distributionId: null,
        receiverId: null,
        receiver: null,
        road: null,
        distributionTagetCnt: null,
        weight: null,
        length: null,
        wide: null,
        hight: null,
        cnt: null,
        volumn: null,
        shippingType: null,
        station: null,
        payType: null,
        payDiscribe: null,
        deliveryType: null,
        deliveryTypeDiscribe: null,
        loadPlace: null,
        deliveryPlace: null
      },
      tableData: [],
      tableDataReturn: [],
      tabledatas: []
    }
  },
  watch: {
    viewed: function(viewed) {
      switch (viewed) {
        case true:
          this.labelTitle = '发运订单-未进行发运的记录'
          break
        case false:
          this.labelTitle = '发运订单所有记录'
      }
    }
  },
  created() {
    this.getListScan()
    searchsystemid('DESPATCH_STATE').then(res => {
      this.optionsState = res.data
    })
    searchcustomer().then(res => {
      this.optionsCustom = res.data
    })
    searchallwarehouse().then(res => {
      this.optionsWarehouse = res.data
    })
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
    deleteRight() {
      this.$confirm('是否确认删除当前发运订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDespatchWave({ 'id': this.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.reload()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(action => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    refreshRight() {
      screenDespatch({
        pojo: { 'id': this.id
        }
      }).then(response => {
        this.formTitle = response.data
      })
    },
    reviewRight() {
      this.$confirm('是否确定审核当前发运订单', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '审核通过',
        cancelButtonText: '审核不通过',
        type: 'warning'
      }).then(() => {
        checkDespatch([{ 'id': this.id }]).then(res => {
          if (res.code === 200) {
            this.$message.success('已审核通过')
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(action => {
        if (action === 'cancel') {
          this.$prompt('请输入审核不通过的理由', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning', // 图标样式 "warning"|"error"...
            inputErrorMessage: '输入不能为空，请在框内输入不通过理由',
            inputValidator: (value) => { // 点击按钮时，对文本框里面的值进行验证
              if (!value) {
                return '输入不能为空，请在框内输入不通过理由'
              }
            }
          }).then(({ value }) => {
            checkDespatchReject([{ 'id': this.id, 'remarks': value }]).then(res => {
              if (res.code === 200) {
                this.$message.success('已审核不通过')
              } else {
                this.$message.error(res.msg)
              }
            })
            // TO DO DO ...
          }).catch((err) => {
            console.log(err)
            this.$message({
              type: 'info',
              message: '已取消审核'
            })
          })
        } else if (action === 'close') {
          this.$message({
            type: 'info',
            message: '已取消审核'
          })
        }
      })
    },
    preDistributionRight() {
      this.$confirm('是否确认预配当前发运订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        preDistributionList([{ 'id': this.id }]).then(res => {
          if (res.code === 200) {
            this.$message.success('预配成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(action => {
        this.$message({
          type: 'info',
          message: '已取消预配'
        })
      })
    },
    generateWaveRight() {
      this.$confirm('是否确认将当前发运订单生成波次计划', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        oneDespatchWaveManual([{ 'id': this.id }]).then(res => {
          this.$message.success('已生成波次计划')
          this.refreshRight()
        })
      }).catch(action => {
        this.$message({
          type: 'info',
          message: '已取消生成波次'
        })
      })
    },
    selectProvinceFun(event) {
      if (event) {
        this.formSearch.province = event.label
        this.cityList = event.children
      } else {
        this.cityList = []
      }
      this.siteList = []
      this.formSearch.city = null
      this.formSearch.site = null
    },
    selectCityFun(event) {
      if (event) {
        this.formSearch.city = event.label
        this.siteList = event.children
      } else {
        this.siteList = []
        this.formSearch.site = null
      }
    },
    selectSiteFun(event) {
      if (event) {
        this.formSearch.site = event.label
      }
    },
    reviewAll() {
      if (this.multipleSelection.length) {
        this.$confirm('是否确定审核选中的发运订单', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '审核通过',
          cancelButtonText: '审核不通过',
          type: 'warning'
        }).then(() => {
          checkDespatch(this.multipleSelection).then(res => {
            if (res.code === 200) {
              this.$message.success('已审核通过')
              this.$refs.multipleTable.clearSelection()
              this.getList()
            } else {
              this.$message.error(res.msg)
              this.isShowReturn = true
              this.titleReturn = '发运订单列表——未能进行审核操作（原因：之前已审核）'
              this.tableDataReturn = res.data
            }
          })
        }).catch(action => {
          if (action === 'cancel') {
            this.$prompt('请输入审核不通过的理由', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning', // 图标样式 "warning"|"error"...
              inputErrorMessage: '输入不能为空，请在框内输入不通过理由',
              inputValidator: (value) => { // 点击按钮时，对文本框里面的值进行验证
                if (!value) {
                  return '输入不能为空，请在框内输入不通过理由'
                }
              }
            }).then(({ value }) => {
              this.addSelect = this.multipleSelection
              for (const item in this.addSelect) {
                this.$set(this.addSelect[item], 'remarks', value)
              }
              console.log(this.addSelect)
              checkDespatchReject(this.addSelect).then(res => {
                if (res.code === 200) {
                  this.$message.success('已审核不通过')
                  this.$refs.multipleTable.clearSelection()
                  this.getList()
                } else {
                  this.$message.error(res.msg)
                  this.isShowReturn = true
                  this.titleReturn = '发运订单列表——未能进行审核操作（原因：之前已审核）'
                  this.tableDataReturn = res.data
                }
              })
              // TO DO DO ...
            }).catch((err) => {
              console.log(err)
              this.$message({
                type: 'info',
                message: '已取消一键审核'
              })
            })
          } else if (action === 'close') {
            this.$message({
              type: 'info',
              message: '已取消一键审核'
            })
          }
        })
      } else {
        this.$message({
          message: '请在下方列表最左侧的方框内，选择至少一条发运订单',
          type: 'warning'
        })
      }
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
    searchDetail(row) {
      this.spanLeft = 24
      this.showRight = true
      this.spanRight = 24
      this.showLeft = false
      this.id = row.id
      this.getListDetails()
      this.formTitle = row
      if (row.verifyStatus === 1) {
        this.isRightReview = true
      } else {
        this.isRightReview = false
      }
      if ((row.verifyStatus === 2) && (row.isPreDistributed !== 1)) {
        this.isRightPreDis = true
      } else {
        this.isRightPreDis = false
      }
      searchsystemid('DESPATCH_STATE').then(res => {
        this.options = res.data
      })
      for (var j = 0; j < this.options.length; j++) {
        if (this.formTitle.status === this.options[j].typeNumber) {
          this.formTitle.statusName = this.options[j].codeDetailName
        }
      }
      console.log(row)
    },
    goback() {
      this.showRight = false
      this.showLeft = true
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    changeadvanced() {
      this.advanced = !this.advanced
    },
    handleChange(val) {
      console.log(val)
    },
    tableRowClassName({ rowIndex }) {
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
    outExcel() {
      const data = {
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        }
      }
      exportDespatchAndDetailExcel(data).then((res) => {
        let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', `发运订单.xls`)
        document.body.appendChild(a)
        a.click()
        url = window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
    },
    outSelfExcel() {
      if (this.multipleSelection.length) {
        this.$confirm('是否确认导出所选单据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exportDespatchAndDetailExcelSelect(this.multipleSelection).then((res) => {
            let url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.setAttribute('download', `发运订单.xls`)
            document.body.appendChild(a)
            a.click()
            url = window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
          })
        })
      } else {
        this.$message({
          message: '请在下方列表最左侧的方框内，选择至少一条发运订单',
          type: 'warning'
        })
      }
    },
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid('DESPATCH_STATE').then(res => {
          this.options = res.data
        })
        this.laststateTime = now
      } else {
        if ((now - this.laststateTime) > 5000) {
          this.laststateTime = now
        }
      }
      return changeAll(row.status, this.options)
    },
    unitFormat(row) {
      return despatchUnit(row.unit)
    },
    generateWave() {
      if (this.multipleSelection.length) {
        this.$confirm('<p>请选择波次生成方式</p><ul><li><strong>合并生成：</strong>将选中的发运订单合并生成一个波次</li><li><strong>一单到底：</strong>将选中的发运订单分别单独生成波次</li></ul>', '提示', {
          distinguishCancelAndClose: true,
          dangerouslyUseHTMLString: true,
          confirmButtonText: '一单到底',
          cancelButtonText: '合并生成',
          type: 'warning'
        }).then(() => {
          oneDespatchWaveManual(this.multipleSelection).then(res => {
            this.$message.success('已生成')
            this.$refs.multipleTable.clearSelection()
            this.getList()
          })
        }).catch(action => {
          if (action === 'cancel') {
            generateWaveManual(this.multipleSelection).then(res => {
              this.$message.success('已生成')
              this.$refs.multipleTable.clearSelection()
              this.getList()
            })
          } else if (action === 'close') {
            this.$message({
              type: 'info',
              message: '已取消生成波次'
            })
          }
        })
      } else {
        this.$message({
          message: '请在下方列表最左侧的方框内，选择至少一条发运订单',
          type: 'warning'
        })
      }
    },
    preDistributionAll() {
      if (this.multipleSelection.length) {
        this.$confirm('是否确认预配选中发运计划单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          preDistributionList(this.multipleSelection).then(res => {
            if (res.code === 200) {
              this.$message.success('预配成功')
              this.$refs.multipleTable.clearSelection()
              this.getList()
            } else {
              this.$message.error(res.msg)
              this.isShowReturn = true
              this.titleReturn = '发运订单列表——未能进行预配（原因：1.订单未审核 2.之前已预配 3.库存不足）'
              this.tableDataReturn = res.data
            }
          })
        })
      } else {
        this.$message({
          message: '请在下方列表最左侧的方框内，选择至少一条发运订单',
          type: 'warning'
        })
      }
    },
    submit() {
      this.$confirm('确认生成配送单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        generateByDespatchs({ head: this.uform, details: this.multipleSelection }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '生成成功!'
            })
            this.reload()
            this.$refs.multipleTable.clearSelection()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    search() {
      this.listQuery.page = 1
      this.labelTitle = '发运订单-查询结果'
      this.getList()
    },
    getListDetails() {
      screenDespatchDetail({ searchDTO: {
        page: this.listQueryDetail.page,
        num: this.listQueryDetail.limit
      },
      pojo: {
        pid: this.id,
        status: this.rform.status,
        skuCode: this.rform.skuCode,
        unit: this.rform.unit,
        deliveryDetailId: this.rform.deliveryDetailId,
        turnRule: this.rform.turnRule,
        distributionRule: this.rform.distributionRule
      }}).then(response => {
        this.tabledatas = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      screenDespatchDetailSum({ searchDTO: {
        page: this.listQueryDetail.page,
        num: this.listQueryDetail.limit
      },
      pojo: {
        pid: this.id,
        status: this.rform.status,
        skuCode: this.rform.skuCode,
        unit: this.rform.unit,
        deliveryDetailId: this.rform.deliveryDetailId,
        turnRule: this.rform.turnRule,
        distributionRule: this.rform.distributionRule
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
    refresh() {
      this.reload()
    },
    getListScan() {
      if (this.viewed === false) {
        this.statesNow = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
      } else {
        this.statesNow = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      }
      screenDespatch({
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        },
        states: this.statesNow
      }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenDespatchSum({
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        },
        states: this.statesNow
      }).then(response => {
        this.total = response.data
        setTimeout(() => {
          this.listLoading = false
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
      screenDespatch({
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
          province: this.formSearch.province,
          city: this.formSearch.city,
          site: this.formSearch.site,
          type: this.type,
          status: this.status,
          customerName: this.customerName,
          warehouse: this.formSearch.warehouseCode,
          isPreDistributed: this.formSearch.isPreDistributed,
          verifyStatus: this.formSearch.verifyStatus
        },
        states: this.formSearch.orderState,
        persons: this.formSearch.customerId,
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
      screenDespatchSum({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        province: this.formSearch.province,
        city: this.formSearch.city,
        site: this.formSearch.site,
        type: this.type,
        status: this.status,
        customerName: this.customerName,
        warehouse: this.formSearch.warehouseCode,
        isPreDistributed: this.formSearch.isPreDistributed,
        verifyStatus: this.formSearch.verifyStatus
      },
      states: this.formSearch.orderState,
      persons: this.formSearch.customerId,
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
    addNew() {
      this.$router.push('shipmentlist')
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      // 去重获取被选中的id值存入到数组中
      for (let i = 0; i < val.length; i++) {
        if (this.multipleSelection.indexOf(val[i].id) === -1) {
          this.multipleSelection.push({ 'id': val[i].id, 'reviewerId': Number(sessionStorage.getItem('getUserId')) })
        }
      }
      console.log(this.multipleSelection)
    }
  }
}
</script>
<style>
.show_card1 {
      background-color:#081b26c3;
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
  .search {
      margin: 1px;
      padding-top: 10px;
      background-color: rgb(255, 255, 255);
    }
  .btngroups {
   margin: 5px;
  }
    .pagContainer{
    background-color: rgb(75, 200, 175);
  }
    .el-card /deep/ .el-card__header {
      color:#fff;
    padding: 5px;
    }
     .el-form /deep/.el-form-item__label{
      color:rgb(0, 0, 0);
      font-weight: bold;
    }
      .pagContainer{
      background-color: rgb(75, 200, 175);
    }
    </style>
  <style lang="scss" scoped>
// 修改对话框高度
  .showAll_dialog {
    ::v-deep.el-dialog {
      margin: 10px auto !important;
      height: 85%;
      background-color: #091f2cee;

      .el-dialog__body {
        line-height: 30px;
        color: white;
        height: 80%
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
<style lang="scss" scoped>
// 修改对话框高度
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
  background-color: #091f2c;

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
</style>

