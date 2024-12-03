<template>
  <div>
    <el-row>
      <el-dialog title="生成分拣任务单" :visible.sync="dialogVisibleDistribution" width="60%" class="showAll_dialog">
        <el-form align="center">
          <el-form-item label="库区名称" align="center">
            <el-select v-model="formDistribution.warehouseAreaName" placeholder="请选择库区" style="width: 80%;" multiple>
              <el-option
                v-for="item in taskStatusOptions"
                :key="item.areaCode"
                :label="item.areaName"
                :value="item.areaName"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-table
          :data="fullboxOptions"
          tooltip-effect="dark"
          :row-style="{ height: '20px' }"
          :cell-style="{ padding: '0px' }"
          size="mini"
          style="width: 100%, font-size: 10px"
          border
          :header-cell-style="{background:'#000',color: '#fff'}"
          overflow="auto"
        >
          <el-table-column label="整箱分拣设备" align="center">
            <el-table-column type="index" label="序号" width="50" align="center" />
            <el-table-column label="设备名称" align="center" :show-overflow-tooltip="true" prop="deviceName" />
            <el-table-column label="设备代码" align="center" :show-overflow-tooltip="true" prop="deviceCode" />
            <el-table-column label="所属仓库" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
            <el-table-column label="所处库区" align="center" :show-overflow-tooltip="true" prop="areaName" />
            <el-table-column prop="action" label="操作" align="center">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button v-if="scope.row.isCheck === 0" size="mini" icon="el-icon-check" type="primary" @click="selectFullbox(scope.row)">选择此整箱分拣设备</el-button>
                  <el-button v-if="scope.row.isCheck === 1" size="mini" icon="el-icon-close" type="danger" @click="unSelectFullbox(scope.row)">取消选择此整箱分拣设备</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <el-table
          :data="pieceOptions"
          tooltip-effect="dark"
          :row-style="{ height: '20px' }"
          :cell-style="{ padding: '0px' }"
          size="mini"
          style="width: 100%, font-size: 10px"
          border
          :header-cell-style="{background:'#000',color: '#fff'}"
          overflow="auto"
        >
          <el-table-column label="拆零分拣设备" align="center">
            <el-table-column type="index" label="序号" width="50" align="center" />
            <el-table-column label="设备名称" align="center" :show-overflow-tooltip="true" prop="deviceName" />
            <el-table-column label="设备代码" align="center" :show-overflow-tooltip="true" prop="deviceCode" />
            <el-table-column label="所属仓库" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
            <el-table-column label="所处库区" align="center" :show-overflow-tooltip="true" prop="areaName" />
            <el-table-column prop="action" label="操作" align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.row.isCheck === 0" size="mini" icon="el-icon-check" type="primary" @click="selectPiece(scope.row)">选择此拆零分拣设备</el-button>
                <el-button v-if="scope.row.isCheck === 1" size="mini" icon="el-icon-close" type="danger" @click="unSelectPiece(scope.row)">取消选择此拆零分拣设备</el-button>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <!-- <el-table
          :data="packingOptions"
          tooltip-effect="dark"
          :row-style="{ height: '20px' }"
          :cell-style="{ padding: '0px' }"
          size="mini"
          style="width: 100%, font-size: 10px"
          border
          :header-cell-style="{background:'#000',color: '#fff'}"
          overflow="auto"
        >
          <el-table-column label="装箱设备" align="center">
            <el-table-column type="index" label="序号" width="50" align="center" />
            <el-table-column label="设备名称" align="center" :show-overflow-tooltip="true" prop="deviceName" />
            <el-table-column label="设备代码" align="center" :show-overflow-tooltip="true" prop="deviceCode" />
            <el-table-column label="所属仓库" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
            <el-table-column label="所处库区" align="center" :show-overflow-tooltip="true" prop="areaName" />
            <el-table-column prop="action" label="操作" align="center">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button v-if="scope.row.isCheck === 0" size="mini" icon="el-icon-check" type="primary" @click="selectPacking(scope.row)">选择此装箱设备</el-button>
                  <el-button v-if="scope.row.isCheck === 1" size="mini" icon="el-icon-close" type="danger" @click="unSelectPacking(scope.row)">取消选择此装箱设备</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table> -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleDistribution = false">取消</el-button>
          <el-button type="primary" @click="submitDistribution">提交</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增发运订单" :visible.sync="dialogVisibleDes" width="60%" class="showAll_dialog">
        <el-form :inline="true" size="mini" class="demo-form-inline" :model="formAddDes" label-width="120px">
          <el-form-item label="发运订单号">
            <template>
              <span>
                <ComboGrid
                  v-model="formAddDes.despatchId"
                  value-field="despatchId"
                  text-field="despatchId"
                  :editable="true"
                  :multiple="false"
                  :data="formAddDesAllNow"
                  :panel-style="{width:'800px' }"
                  @filterChange="changedinput($event)"
                  @valueChange="changeAddDes()"
                >
                  <DataGrid slot="grid" :border="false">
                    <GridColumn field="despatchId" panel-witdh="700px" title="发运订单号" />
                    <GridColumn field="customerName" title="客户名称" />
                    <GridColumn field="warehouseName" title="仓库名称" />
                    <GridColumn field="createTime" title="创建时间" />
                    <GridColumn field="requestDeliveryTime" title="要求交货时间" />
                    <GridColumn field="expectSendTime" title="预期交货时间" />
                  </DataGrid>
                </ComboGrid>
                <!-- <diskUse :table="diskTable.slice((currentPage2-1)*pageSize2,currentPage2*pageSize2)" /> -->
              </span>
            </template>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input v-model="formAddDes.customerName" :readonly="true" />
          </el-form-item>
          <el-form-item label="仓库名称">
            <el-input v-model="formAddDes.warehouseName" :readonly="true" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="formAddDes.createTime"
              type="date"
              style="width:165px"
              placeholder="请选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :readonly="true"
            />
          </el-form-item>
          <el-form-item label="要求交货时间">
            <el-date-picker
              v-model="formAddDes.requestDeliveryTime"
              type="date"
              style="width:165px"
              placeholder="请选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :readonly="true"
            />
          </el-form-item>
          <el-form-item label="预期交货时间">
            <el-date-picker
              v-model="formAddDes.expectSendTime"
              type="date"
              style="width:165px"
              placeholder="请选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :readonly="true"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleDes = false">取消</el-button>
          <el-button type="primary" @click="submitAddDes">提交</el-button>
        </div>
      </el-dialog>
      <el-col v-show="showLeft" :span="spanLeft">
        <el-row>
          <div id="btnAndSearch">
            <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
              <div class="search">
                <el-form :inline="true" :model="formSearch">
                  <el-form-item label="波次计划状态">
                    <el-select v-model="formSearch.orderState" placeholder="请选择波次计划状态" size="small" clearable multiple>
                      <el-option v-for="item in optionsState" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="波次规则类型">
                    <el-select v-model="formSearch.waveRuleId" placeholder="请选择波次规则类型" size="small" clearable multiple>
                      <el-option v-for="item in optionsWaveRule" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="仓库">
                    <el-select v-model="formSearch.warehouseCodes" placeholder="请选择仓库名称" size="small" clearable multiple>
                      <el-option v-for="item in optionsWarehouse" :key="item.id" :label="item.warehouseName" :value="item.warehouseCode" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="波次创建时间">
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
                <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="按格式导出选中的波次计划" placement="bottom-start">
                <el-button size="small" type="primary" icon="el-icon-export">导出</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="一键审核在下方列表中选中的波次计划" placement="bottom-start">
                <el-button size="small" icon="el-icon-receive" type="success" @click="reviewAll">一键审核</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="一键将选中的波次计划生成分拣任务" placement="bottom-start">
                <el-button size="small" type="success" icon="el-icon-preDistribution" @click="createSortAll">一键生成分拣任务单</el-button>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="选择显示波次计划的自定义字段" placement="bottom-start">
                  <el-popover placement="bottom" width="400" trigger="click">
                    <el-checkbox-group v-model="colOptions">
                      <el-checkbox v-for="item in colSelect" :key="item" :label="item" />
                    </el-checkbox-group>
                    <el-button size="small" type="danger" slot="reference">显示自定义字段</el-button>
                  </el-popover>
                </el-tooltip> -->
              <el-tooltip class="item" effect="dark" content="查看全部/未完成的波次计划" placement="bottom-start">
                <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed ? "查看全部波次计划" : "查看未完成的波次计划" }}</el-button>
              </el-tooltip>
              <!-- <el-button  icon="el-icon-download" @click="outExcel">导出</el-button>
              <el-button  icon="el-icon-download" @click="outSelfExcel">自定义导出</el-button> -->
            </div>
          </div>
          <el-dialog title="生成装箱单" :visible.sync="dialogVisiblePacking" width="60%" class="showAll_dialog">
            <el-form :inline="true" size="mini" class="demo-form-inline" :model="formPacking" label-width="120px">
              <el-form-item label="包装">
                <el-select v-model="formPacking.id" size="mini" placeholder="请选择">
                  <el-option v-for="item in packingFormOptions" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisiblePacking = false">取消</el-button>
              <el-button type="primary" @click="submitPackingForm">提交</el-button>
            </div>
          </el-dialog>
          <el-table
            ref="multipleTable"
            :header-cell-class-name="handleHeadAddClass"
            :height="tableHeight"
            :data="tableData"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            :row-class-name="tableRowClassName"
            tooltip-effect="dark"
            :row-style="{ height: '20px' }"
            :cell-style="{ padding: '0px' }"
            size="mini"
            style="width: 100%, font-size: 10px"
            border
            :header-cell-style="{background:'#000',color: '#fff'}"
            overflow="auto"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
          >
            <el-table-column type="selection" align="center" />
            <el-table-column :label="labelTitle" align="center">
              <el-table-column type="index" label="序号" align="center" />
              <el-table-column label="波次编号" align="center" :show-overflow-tooltip="true" prop="waveId" />
              <el-table-column
                label="波次规则类型"
                sortable="custom"
                align="center"
                width="150px"
                :show-overflow-tooltip="true"
                prop="waveRuleName"
              />
              <el-table-column label="仓库名称" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
              <el-table-column sortable="custom" label="波次创建时间" align="center" :show-overflow-tooltip="true" prop="createTime">
                <template slot-scope="scope">{{ scope.row.createTime | dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column
                prop="status"
                sortable="custom"
                label="波次计划状态"
                width="160px"
                :show-overflow-tooltip="true"
                align="center"
                :formatter="waveStateFormat"
              />
              <el-table-column sortable="custom" label="审核状态" align="center" :show-overflow-tooltip="true" prop="checkStatus">
                <template slot-scope="scope">
                  <span v-if="scope.row.checkStatus=== 1"><el-tag type="warning" size="mini">待审核</el-tag></span>
                  <span v-if="scope.row.checkStatus=== 2"><el-tag type="success" size="mini">审核通过</el-tag></span>
                  <span v-if="scope.row.checkStatus=== 11"><el-tag type="danger" size="mini">审核未通过</el-tag></span>
                </template>
              </el-table-column>
              <el-table-column sortable="custom" label="审核人" align="center" :show-overflow-tooltip="true" prop="reviewerName" />
              <el-table-column sortable="custom" label="审核时间" align="center" :show-overflow-tooltip="true" prop="reviewerTime">
                <template slot-scope="scope">{{ scope.row.reviewerTime | dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column sortable="custom" label="总体积/L" align="center" :show-overflow-tooltip="true" prop="volume" />
              <el-table-column sortable="custom" label="总重/kg" align="center" :show-overflow-tooltip="true" prop="weight" />
              <el-table-column
                v-if="colData[0].istrue"
                label="用户自定义1"
                align="center"
                :show-overflow-tooltip="true"
                prop="userDefined1"
              />
              <el-table-column
                v-if="colData[1].istrue"
                label="用户自定义2"
                align="center"
                :show-overflow-tooltip="true"
                prop="userDefined2"
              />
              <el-table-column
                v-if="colData[2].istrue"
                label="用户自定义3"
                align="center"
                :show-overflow-tooltip="true"
                prop="userDefined3"
              />
            </el-table-column>
            <el-table-column width="450px" prop="action" label="操作" align="center">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button size="mini" icon="el-icon-s-order" type="success" @click="createSort(scope.row)">生成分拣任务单</el-button>
                  <el-button size="mini" icon="el-icon-search" type="primary" @click="searchDetail(scope.row)">查看波次详情</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          />
        </el-row></el-col>
      <el-col v-show="showRight" :span="spanRight" class="show_card1">
        <div id="btnRight">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="返回波次计划列表" placement="bottom-start">
              <el-button type="warning" icon="el-icon-back" @click="goback">返回上一页</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看此波次计划关联的发运订单" placement="bottom-start">
              <el-button type="primary" icon="el-icon-search" @click="scanDespatch">查看发运订单</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看此波次计划关联的分拣任务单" placement="bottom-start">
              <el-button type="primary" icon="el-icon-search" @click="scanSort">查看分拣任务单</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看此波次计划关联的装箱单" placement="bottom-start">
              <el-button type="primary" icon="el-icon-search" @click="scanPack">查看装箱单</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="点击选择设备，将此波次计划生成分拣任务单" placement="bottom-start">
              <el-button icon="el-icon-s-order" type="success" @click="createSortRight">生成分拣任务单</el-button>
            </el-tooltip>
            <el-tooltip v-if="isDetail" class="item" effect="dark" content="点击审核此波次计划" placement="bottom-start">
              <el-button icon="el-icon-receive" type="success" @click="reviewRight()">审核</el-button>
            </el-tooltip>
            <el-tooltip v-if="isDetail" class="item" effect="dark" content="点击删除此波次计划" placement="bottom-start">
              <el-button icon="el-icon-delete" type="danger" @click="deleteRight()">删除</el-button>
            </el-tooltip>
          </el-button-group>
          <el-card class="show_card1" :body-style="{padding:'0px'}">
            <div slot="header" align="center" style="padding: 15px">
              <span class="title">波次计划单头信息</span>
            </div>
            <el-form ref="form" :inline="true" :model="formTitle">
              <el-card :body-style="{padding:'0px'}">
                <e-desc>
                  <e-desc-item label="波次编号">
                    <el-input v-model="formTitle.waveId" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="波次规则名称">
                    <el-input v-model="formTitle.waveRuleName" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="仓库名称">
                    <el-input v-model="formTitle.warehouse" size="small" readonly />
                  </e-desc-item>
                  <!-- <e-desc-item label="联系电话">
                      <el-input v-model="formTitle.phoneNumber" placeholder="请输入联系电话" size="small" readonly />
                    </e-desc-item> -->
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
                  <e-desc-item label="审核时间">
                    <el-date-picker
                      v-model="formTitle.reviewerTime"
                      type="datetime"
                      placeholder="暂未审核"
                      size="small"
                      align="right"
                      unlink-panels
                      disabled
                      style="width: 100%;"
                      :picker-options="pickerOptions"
                    />
                  </e-desc-item>
                  <e-desc-item label="波次计划状态">
                    <el-input v-model="formTitle.statusName" size="small" readonly />
                  </e-desc-item>
                </e-desc>
              </el-card>
            </el-form>
          </el-card>
        </div>
        <el-card style="background-color: #081b26c3" :body-style="{padding:'0px'}">
          <div v-show="showHH">
            <div slot="header" align="center" style="padding: 15px">
              <span class="title" style="color:#ffffff">关联发运订单信息</span><span style="padding-left: 20px" />
              <el-tooltip v-if="isDetail" class="item" effect="dark" content="点击修改此波次计划" placement="bottom-start">
                <el-button icon="el-icon-edit" type="primary" @click="editWave()">修改</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="在此波次计划中新增发运订单" placement="bottom-start">
                <el-button v-if="isEdit" icon="el-icon-circle-plus" type="warning" @click="addDespatch">新增发运订单</el-button>
              </el-tooltip>
              <el-tooltip v-if="isEdit" class="item" effect="dark" content="点击结束修改" placement="bottom-start">
                <el-button icon="el-icon-folder" type="success" @click="editFinish">结束修改</el-button>
              </el-tooltip>
            </div>
            <el-table
              :height="tableHeightRight"
              :data="tabledatas"
              :row-class-name="tableRowClassDetailName"
              border
              size="mini"
              :row-style="{ height: '10px' }"
              :cell-style="{ padding: '0px' }"
              element-loading-text="正在加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              :header-cell-style="{background:'#000',color: '#fff'}"
              tooltip-effect="dark"
              style="width: 70%, font-size: 10px"
            >
              <el-table-column label="发运订单" align="center">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50"
                  align="center"
                />
                <el-table-column label="发运订单号" width="115px" align="center" :show-overflow-tooltip="true" prop="despatchId" />
                <el-table-column label="仓库名称" align="center" :show-overflow-tooltip="true" prop="warehouse" />
                <el-table-column label="客户名称" align="center" :show-overflow-tooltip="true" prop="customerName" />
                <el-table-column label="收货人" align="center" :show-overflow-tooltip="true" prop="receiverName" />
                <el-table-column label="订单状态" align="center" :show-overflow-tooltip="true" prop="status" :formatter="stateFormat" />
                <el-table-column label="是否预配" align="center" :show-overflow-tooltip="true" prop="isPreDistributed">
                  <template slot-scope="scope">
                    <span v-if="scope.row.isPreDistributed=== 0">未预配</span>
                    <span v-if="scope.row.isPreDistributed=== 1">预配成功</span>
                    <span v-if="scope.row.isPreDistributed=== 2">预配失败</span>
                  </template></el-table-column>
                <el-table-column prop="verifyStatus" label="审核状态" align="center" width="100">
                  <template slot-scope="scope">
                    <span v-if="scope.row.verifyStatus=== 1"><el-tag type="warning" size="mini">待审核</el-tag></span>
                    <span v-if="scope.row.verifyStatus=== 2"><el-tag type="success" size="mini">审核通过</el-tag></span>
                    <span v-if="scope.row.verifyStatus=== 11"><el-tag type="danger" size="mini">审核不通过</el-tag></span>
                  </template>
                </el-table-column>
                <el-table-column label="审核人" align="center" :show-overflow-tooltip="true" prop="reviewerName" />
                <el-table-column label="创建时间" align="center" :show-overflow-tooltip="true" prop="createTime">
                  <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
                </el-table-column>
                <el-table-column label="要求交货时间" align="center" :show-overflow-tooltip="true" prop="requestDeliveryTime">
                  <template slot-scope="scope">{{ scope.row.requestDeliveryTime| dateYMDHMSFormat }}</template>
                </el-table-column>
                <el-table-column label="预期发货时间" align="center" :show-overflow-tooltip="true" prop="expectSendTime">
                  <template slot-scope="scope">{{ scope.row.expectSendTime| dateYMDHMSFormat }}</template>
                </el-table-column>
                <el-table-column label="审核时间" align="center" :show-overflow-tooltip="true" prop="reviewerTime">
                  <template slot-scope="scope">{{ scope.row.reviewerTime| dateYMDHMSFormat }}</template>
                </el-table-column>
              </el-table-column>
              <el-table-column width="100px" prop="action" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button :disabled="!isEdit" size="mini" icon="el-icon-delete" type="danger" @click="deleteDes(scope.$index)">移除</el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagContainer">
              <el-pagination
                :current-page="currentPage"
                :page-sizes="[50, 100, 1000]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
          <div v-if="sortShowHH">
            <div slot="header" align="center" style="padding: 15px">
              <span class="title" style="color:#ffffff">关联分拣任务单信息</span>
            </div>
            <el-table
              :ref="tablelist"
              :height="tableHeightRight"
              :data="sortTabledata"
              :row-class-name="tableRowClassDetailName"
              border
              size="mini"
              :row-style="{ height: '20px' }"
              :cell-style="{ padding: '0px' }"
              style="width: 100%, font-size: 10px"
              element-loading-text="正在加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              :header-cell-style="{background:'#000',color: '#fff'}"
              tooltip-effect="dark"
            >
              <el-table-column label="分拣任务单" align="center">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50"
                  align="center"
                />
                <el-table-column label="分拣任务单号" align="center" :show-overflow-tooltip="true" prop="taskId" />
                <!-- <el-table-column label="分拣设备" align="center" :show-overflow-tooltip="true" prop="device" /> -->
                <el-table-column label="分拣状态" align="center" :show-overflow-tooltip="true" prop="status">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status=== 1"><el-tag type="danger" size="mini">已创建</el-tag></span>
                    <span v-if="scope.row.status=== 2"><el-tag type="warning" size="mini">分拣中</el-tag></span>
                    <span v-if="scope.row.status=== 3"><el-tag type="success" size="mini">已分拣</el-tag></span>
                    <span v-if="scope.row.status=== 4"><el-tag type="danger" size="mini">已取消</el-tag></span>
                  </template></el-table-column>
                <el-table-column label="波次任务单号" align="center" :show-overflow-tooltip="true" prop="waveCode" />
                <!-- <el-table-column label="sku数" align="center" :show-overflow-tooltip="true" prop="device" />
              <el-table-column label="箱数" align="center" :show-overflow-tooltip="true" prop="device" />
              <el-table-column label="单件数" align="center" :show-overflow-tooltip="true" prop="device" /> -->
                <el-table-column label="创建时间" align="center" :show-overflow-tooltip="true" prop="createTime">
                  <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
                </el-table-column>
                <el-table-column label="分配时间" align="center" :show-overflow-tooltip="true" prop="distributionTime">
                  <template slot-scope="scope">{{ scope.row.distributionTime| dateYMDHMSFormat }}</template>
                </el-table-column>
                <el-table-column label="拣货时间" align="center" :show-overflow-tooltip="true" prop="pickingTime">
                  <template slot-scope="scope">{{ scope.row.pickingTime| dateYMDHMSFormat }}</template>
                </el-table-column>
                <el-table-column label="批次属性" align="center" :show-overflow-tooltip="true" prop="batchType" />
                <!-- <el-table-column label="审核状态" align="center" :show-overflow-tooltip="true" prop="verifyStatus">
                  <template slot-scope="scope">
                    <span v-if="scope.row.verifyStatus=== 1"><el-tag type="danger" size="mini">待审核</el-tag></span>
                    <span v-if="scope.row.verifyStatus=== 2"><el-tag type="warning" size="mini">审核通过</el-tag></span>
                    <span v-if="scope.row.verifyStatus=== 3"><el-tag type="success" size="mini">审核不通过</el-tag></span>
                  </template></el-table-column>
                <el-table-column label="审核时间" align="center" :show-overflow-tooltip="true" prop="reviewerTime">
                  <template slot-scope="scope">{{ scope.row.reviewerTime| dateYMDHMSFormat }}</template>
                </el-table-column>
                <el-table-column label="审核人" align="center" :show-overflow-tooltip="true" prop="reviewerName" /> -->
              </el-table-column>
            </el-table>
            <div class="pagContainer">
              <el-pagination
                :current-page="currentPage"
                :page-sizes="[10, 20, 50]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCountSort"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
          <div v-if="packShowHH">
            <div slot="header" align="center" style="padding: 15px">
              <span class="title" style="color:#ffffff">关联装箱单信息</span>
            </div>
            <el-table
              :height="tableHeightRight"
              :data="packTabledata"
              :row-class-name="tableRowClassDetailName"
              :expand-row-keys="expandsPack"
              :row-key="getRowKeysPack"
              border
              size="mini"
              :row-style="{ height: '20px' }"
              :cell-style="{ padding: '0px' }"
              style="width: 100%, font-size: 10px"
              element-loading-text="正在加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              :header-cell-style="{background:'#000',color: '#fff'}"
              tooltip-effect="dark"
              @expand-change="expandChangePack"
            >
              <el-table-column label="装箱单" align="center">
                <el-table-column type="expand" width="40px" align="center">
                  <div class="detailsTable">
                    <template>
                      <el-table
                        :data="packTabledataDetail"
                        :row-class-name="tableRowClassDetailName"
                        border
                        size="mini"
                        :row-style="{ height: '20px' }"
                        :cell-style="{ padding: '0px' }"
                        style="width: 100%, font-size: 10px"
                      >
                        <el-table-column label="装箱单号" align="center" :show-overflow-tooltip="true" prop="exPickingId" />
                        <el-table-column label="sku编码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
                        <el-table-column label="sku数量" align="center" :show-overflow-tooltip="true" prop="skuCnt" />
                        <el-table-column label="sku单价" align="center" :show-overflow-tooltip="true" prop="skuPrice" />
                        <el-table-column label="尺寸" align="center" :show-overflow-tooltip="true" prop="goodsSize" />
                        <el-table-column label="颜色" align="center" :show-overflow-tooltip="true" prop="goodsColor" />
                        <el-table-column
                          label="供应商名称"
                          align="center"
                          :show-overflow-tooltip="true"
                          prop="supplierName"
                        />
                        <el-table-column
                          label="生产厂家"
                          align="center"
                          :show-overflow-tooltip="true"
                          prop="productCompany"
                        />
                        <el-table-column label="生产时间" align="center" :show-overflow-tooltip="true" prop="productTime">
                          <template slot-scope="scope">{{ scope.row.productTime | dateYMDHMSFormat }}</template>
                        </el-table-column>
                        <el-table-column
                          label="生产批次"
                          align="center"
                          :show-overflow-tooltip="true"
                          prop="productBatch"
                        />
                        <el-table-column label="跟踪号" align="center" :show-overflow-tooltip="true" prop="traceCode" />
                      </el-table>
                      <!-- <div class="pagContainer">
                        <el-pagination
                          :current-page="currentPage"
                          :page-sizes="[10, 20, 50]"
                          :page-size="pagesize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="totalCountPackDetail"
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                        />
                      </div> -->
                    </template>
                  </div>
                </el-table-column>
                <el-table-column
                  type="index"
                  label="序号"
                  width="50"
                  align="center"
                />
                <el-table-column label="装箱单号" align="center" :show-overflow-tooltip="true" prop="exPickingId" />
                <el-table-column label="装箱类型" align="center" :show-overflow-tooltip="true" prop="exPickingType" />
                <el-table-column label="客户名称" align="center" :show-overflow-tooltip="true" prop="customerName" />
                <!-- <el-table-column label="收货人编号" align="center" :show-overflow-tooltip="true" prop="receiverId" /> -->
                <el-table-column label="来源单据" align="center" :show-overflow-tooltip="true" prop="billSource" />
                <el-table-column label="仓库代码" align="center" :show-overflow-tooltip="true" prop="warehouseCode" />
                <el-table-column label="货主代码" align="center" :show-overflow-tooltip="true" prop="cargoOwnerCode" />
                <el-table-column label="作业类型" align="center" :show-overflow-tooltip="true" prop="workType" />
                <el-table-column label="波次号" align="center" :show-overflow-tooltip="true" prop="waveNumber" />
              </el-table-column>
            </el-table>
            <div class="pagContainer">
              <el-pagination
                :current-page="currentPage"
                :page-sizes="[50, 100, 1000]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCountPack"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import EDesc from '@/components/Edesc'
import EDescItem from '@/components/Edescitem'
import { waveChangeState, changeAll } from '@/utils/statechange'
import Pagination from '@/components/Pagination'
import { kkdeboundce } from '@/utils/kkdebounce'
import { searchsystemid, searchallwarehouse } from '@/utils/search'
import { deleteDesInwave, searchWorkGroupWarehouse, checkWaveReject, checkWave, updateWave, screenDespatch, searchAllDespatchByWaveIdSum, selectArea, screenContainer, generatePickTaskDiy, selectDevice, screenWave, screenWaveSum, deleteWave, screenExPickingSum, screenTablePickupNum, screenExPickingDetailSum, screenExPickingDetail, screenExPicking, screenTablePickup, generateExPickingAndDetail, searchAllDespatchByWaveId } from '@/api/user'
import elementResizeDetectorMaker from 'element-resize-detector'
var erd = elementResizeDetectorMaker()
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination, EDesc, EDescItem },
  data() {
    return {
      sortField: {},
      screen: null,
      isEdit: false,
      searchStartTime: null,
      searchEndTime: null,
      addSelect: [], // 审核不通过时的提交内容
      isDetail: false,
      isSortAll: false,
      optionsDes: [],
      isCheckFullbox: false,
      isCheckPiece: false,
      isCheckPacking: false,
      isCheckWarehouse: false,
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
      labelTitle: '波次计划-进行中的记录',
      optionsWarehouse: [],
      optionsWaveRule: [],
      formSearch: {
        orderState: [],
        time0: [],
        warehouseCodes: [],
        waveRuleId: []
      },
      formTitle: {
        id: null
      },
      showLeft: true,
      showRight: false,
      spanLeft: 24,
      spanRight: 24,
      viewed: true,
      addDesFinal: [],
      idNow: null,
      addDesIdList: [],
      formAddDes: {
        despatchId: null,
        customerName: null,
        createTime: null,
        id: null,
        requestDeliveryTime: null,
        warehouseName: null,
        expectSendTime: null,
        verifyStatus: null,
        reviewerName: null,
        reviewerTime: null,
        priority: null
      },
      formAddDesAll: [],
      formAddDesAllNow: [],
      laststateTime: 0,
      optionsState: [],
      packingFormOptions: [],
      taskStatusOptions: [],
      fullboxOptions: [],
      pieceOptions: [],
      packingOptions: [],
      formPacking: {
        id: null
      },
      dialogVisiblePacking: false,
      dialogVisibleDes: false,
      subFormDistribution: [],
      formDistribution: {
        pid: null,
        warehouseName: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseAreaId: null,
        warehouseAreaName: [],
        warehouseAreaCode: null,
        fullboxDevice: null,
        pieceDevice: null,
        packingDevice: null,
        fullBoxDeviceId: null,
        pieceDeviceId: null,
        packingDeviceId: null,
        warehouseAreaJson: [],
        pieceDeviceJson: [],
        packingDeviceJson: [],
        fullBoxDeviceJson: []
      },
      dialogVisibleDistribution: false,
      colData: [{ title: '用户自定义1', istrue: false },
        { title: '用户自定义2', istrue: false },
        { title: '用户自定义3', istrue: false }],
      colOptions: [],
      colSelect: [],
      multipleSelection: [],
      tableHeight: 50,
      tableHeightRight: 50,
      expands: [],
      expandsPack: [],
      packTabledataDetail: [],
      showHH: true,
      moonShowHH: false,
      sortShowHH: false,
      packShowHH: false,
      id: null,
      total: 0,
      tableLoading: true,
      currentPage: 1, // 第几页
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      totalCountPack: 0,
      totalCountPackDetail: 0,
      totalCountSort: 0,
      totalCountMoon: 0,
      pagesize: 50, // 每页显示的条数
      formLabelWidth: '120px',
      getRowKeys(row) {
        return row.id
      },
      getRowKeysPack(row) {
        return row.id
      },
      listQuery: {
        page: 1,
        limit: 50
      },
      tableData: [],
      tabledatas: [],
      sortTabledata: []
    }
  },
  watch: {
    viewed: function(viewed) {
      switch (viewed) {
        case true:
          this.labelTitle = '波次计划-进行中的记录'
          break
        case false:
          this.labelTitle = '波次计划-所有记录'
      }
    }
  },
  updated() {
    // this.$nextTick(() => {
    //   this.$refs['tablelist'].doLayout()
    //   this.$refs['multipleTable'].doLayout()
    // })
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
    this.getListScan()
    // var _this = this
    // for (let i = 0; i < _this.colData.length; i++) {
    //   _this.colSelect.push(_this.colData[i].title)
    //   if (_this.colData[i].title === '用户自定义1' ||
    //     _this.colData[i].title === '用户自定义2' ||
    //     _this.colData[i].title === '用户自定义3') { // 初始化不想展示的列可以放在这个条件里
    //     continue
    //   }
    //   _this.colOptions.push(_this.colData[i].title)
    // }
    searchsystemid('WAVE_STATE').then(res => {
      this.optionsState = res.data
    })
    searchsystemid('WAVE_RULE').then(res => {
      this.optionsWaveRule = res.data
    })
    searchallwarehouse().then(res => {
      this.optionsWarehouse = res.data
    })
    searchWorkGroupWarehouse({ id: Number(sessionStorage.workGroupId), page: 1, num: 1 }).then(res => {
      this.formDistribution.warehouseId = res.data.results[0].id
      this.formDistribution.warehouseName = res.data.results[0].warehouseName
      this.formDistribution.warehouseCode = res.data.results[0].warehouseCode
    }
    )
  },
  methods: {
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
    changedinput(even) {
      var reg = new RegExp(even.filterValue)
      this.formAddDesAllNow = []
      for (var i = 0; i < this.formAddDesAll.length; i++) {
        if (reg.test(this.formAddDesAll[i].despatchId)) {
          this.formAddDesAllNow.push(this.formAddDesAll[i])
        }
      }
    },
    editFinish() {
      this.isEdit = false
      if (this.formTitle.checkStatus === 1) {
        this.isDetail = true
      } else {
        this.isDetail = false
      }
    },
    editWave() {
      this.isEdit = true
      this.isDetail = false
    },
    reviewRight() {
      this.$confirm('是否确定审核此波次计划', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '审核通过',
        cancelButtonText: '审核不通过',
        type: 'warning'
      }).then(() => {
        checkWave([{ 'id': this.formTitle.id }]).then(res => {
          this.$message.success('已审核通过')
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
            checkWaveReject([{ 'id': this.formTitle.id, 'remarks': value }]).then(res => {
              this.$message.success('已审核不通过')
              this.getList()
            })
            // TO DO DO ...
          }).catch(() => {
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
    reviewAll() {
      if (this.multipleSelection.length) {
        this.$confirm('是否确定审核选中的波次计划', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '审核通过',
          cancelButtonText: '审核不通过',
          type: 'warning'
        }).then(() => {
          checkWave(this.multipleSelection).then(res => {
            this.$message.success('已审核通过')
            this.$refs.multipleTable.clearSelection()
            this.getList()
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
              checkWaveReject(this.addSelect).then(res => {
                this.$message.success('已审核不通过')
                this.getList()
              })
              // TO DO DO ...
            }).catch(() => {
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
          message: '请在下方列表最左侧的方框内，选择至少一条波次计划单',
          type: 'warning'
        })
      }
    },
    selectPacking(row) {
      // for (var i = 0; i < this.packingOptions.length; i++) {
      //   this.$set(this.packingOptions[i], 'isCheck', 3)
      // }
      row.isCheck = 1
      this.$forceUpdate()
    },
    selectPiece(row) {
      // for (var i = 0; i < this.pieceOptions.length; i++) {
      //   this.pieceOptions[i].isCheck = 3
      // }
      row.isCheck = 1
      this.$forceUpdate()
    },
    selectFullbox(row) {
      // for (var i = 0; i < this.fullboxOptions.length; i++) {
      //   this.fullboxOptions[i].isCheck = 3
      // }
      row.isCheck = 1
      this.$forceUpdate()
    },
    unSelectFullbox(row) {
      row.isCheck = 0
      this.$forceUpdate()
    },
    unSelectPacking(row) {
      row.isCheck = 0
      this.$forceUpdate()
    },
    unSelectPiece(row) {
      row.isCheck = 0
      this.$forceUpdate()
    },
    searchDetail(row) {
      this.showHH = true
      this.moonShowHH = false
      this.sortShowHH = false
      this.packShowHH = false
      this.isEdit = false
      this.showRight = true
      this.showLeft = false
      this.isRightAllButton = true
      this.formTitle.id = row.id
      this.formTitle = row
      if (row.checkStatus === 1) {
        this.isDetail = true
      } else {
        this.isDetail = false
      }
      searchsystemid('WAVE_STATE').then(res => {
        this.optionsState = res.data
      })
      for (var j = 0; j < this.optionsState.length; j++) {
        if (this.formTitle.status === this.optionsState[j].typeNumber) {
          this.formTitle.statusName = this.optionsState[j].codeDetailName
        }
      }
      this.getListDetails(this.pagesize, this.currentPage)
    },
    goback() {
      this.showRight = false
      this.showLeft = true
    },
    showRightBack() {
      this.spanLeft = 24
      this.showRight = false
      this.showLeft = true
    },
    showRightAll() {
      this.spanRight = 24
      this.showLeft = false
      this.isRightAllButton = false
    },
    showRightAllBack() {
      this.spanRight = 12
      this.showLeft = true
      this.isRightAllButton = true
    },
    scanHistory: kkdeboundce(function() {
      this.viewed = !this.viewed
      // if (!this.viewed) {
      // } else {
      // }
      this.getListScan()
    }, 300),
    addDespatch() {
      screenDespatch(
        {
          'searchDTO': {
            'page': 1,
            'num': 10000
          },
          'pojo': {
            'status': '1'
          }
        }
      ).then(
        res => {
          var moment = require('moment')
          res.data.forEach(item => {
            item.createTime = moment(item.createTime).format('Y-M-D')
            item.requestDeliveryTime = moment(item.requestDeliveryTime).format('Y-M-D')
            item.expectSendTime = moment(item.expectSendTime).format('Y-M-D')
            item.reviewerTime = moment(item.reviewerTime).format('Y-M-D')
          })
          this.formAddDesAll = res.data
          this.dialogVisibleDes = true
        }
      )
    },
    changeAddDes() {
      var findItem = this.formAddDesAll.find(item => item.despatchId === this.formAddDes.despatchId)
      this.formAddDes.customerName = findItem.customerName
      this.formAddDes.warehouseName = findItem.warehouseName
      this.formAddDes.createTime = findItem.createTime
      this.formAddDes.requestDeliveryTime = findItem.requestDeliveryTime
      this.formAddDes.expectSendTime = findItem.expectSendTime
      this.formAddDes.id = findItem.id
      this.formAddDes.verifyStatus = findItem.verifyStatus
      this.formAddDes.reviewerName = findItem.reviewerName
      this.formAddDes.reviewerTime = findItem.reviewerTime
      this.formAddDes.priority = findItem.priority
    },
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid('DESPATCH_STATE').then(res => {
          this.optionsDes = res.data
        })
        this.laststateTime = now
      } else {
        if ((now - this.laststateTime) > 5000) {
          this.laststateTime = now
        }
      }
      return changeAll(row.status, this.optionsDes)
    },
    getDeviceOptions() {
      var searchDTO = {
        'page': 1,
        'num': 100000
      }
      selectArea({
        searchDTO,
        'pojo': {
          'areaType': 1
        }
      }).then(res => {
        this.taskStatusOptions = res.data
      })
      selectDevice({
        searchDTO,
        'pojo': {
          'deviceType': 2
        }
      }).then(res => {
        this.fullboxOptions = res.data
        for (var i = 0; i < this.fullboxOptions.length; i++) {
          this.fullboxOptions[i].isCheck = 0
        }
      })
      selectDevice({
        searchDTO,
        'pojo': {
          'deviceType': 3
        }
      }).then(res => {
        this.pieceOptions = res.data
        for (var i = 0; i < this.pieceOptions.length; i++) {
          this.pieceOptions[i].isCheck = 0
        }
      })
      selectDevice({
        searchDTO,
        'pojo': {
          'deviceType': 4
        }
      }).then(res => {
        this.packingOptions = res.data
        for (var i = 0; i < this.packingOptions.length; i++) {
          this.packingOptions[i].isCheck = 0
        }
      })
    },
    getPackingOptions() {
      var searchDTO = {
        'page': 1,
        'num': 100000
      }
      screenContainer({
        searchDTO,
        'pojo': {
          'isUsable': 1
        }
      }).then(res => {
        this.packingFormOptions = res.data
      })
    },
    // changeTaskOptions() {
    //   var item = this.taskStatusOptions.find(item1 => item1.areaName === this.formDistribution.warehouseAreaName)
    //   this.formDistribution.warehouseAreaId = item.id
    //   this.formDistribution.warehouseAreaCode = item.areaCode
    //   this.isCheckWarehouse = true
    // },
    submitDistribution() {
      this.isCheckWarehouse = false
      this.formDistribution.warehouseAreaJson = []
      // this.formDistribution.warehouseAreaJson.length = this.formDistribution.warehouseAreaName.length
      // console.log(this.formDistribution.warehouseAreaJson)
      for (let i = 0; i < this.formDistribution.warehouseAreaName.length; i++) {
        var item = this.taskStatusOptions.find(item => item.areaName === this.formDistribution.warehouseAreaName[i])
        console.log(this.taskStatusOptions)
        console.log(this.formDistribution)
        this.formDistribution.warehouseAreaJson.push({ warehouseAreaId: item.id, warehouseAreaCode: item.areaCode })
        this.isCheckWarehouse = true
      }
      this.isCheckFullbox = false
      this.isCheckPiece = false
      this.isCheckPacking = false
      this.formDistribution.pieceDeviceJson = []
      this.formDistribution.fullBoxDeviceJson = []
      this.formDistribution.packingDeviceJson = []
      var fullboxNum = 0
      var pieceNum = 0
      // var packingNum = 0
      // this.formDistribution.warehouseAreaJson.length = this.formDistribution.warehouseAreaName.length

      for (let i = 0; i < this.fullboxOptions.length; i++) {
        if (this.fullboxOptions[i].isCheck === 1) {
          fullboxNum += 1
          this.isCheckFullbox = true
        }
      }
      for (let i = 0; i < this.pieceOptions.length; i++) {
        if (this.pieceOptions[i].isCheck === 1) {
          pieceNum += 1
          this.isCheckPiece = true
        }
      }
      // for (let i = 0; i < this.packingOptions.length; i++) {
      //   if (this.packingOptions[i].isCheck === 1) {
      //     packingNum += 1
      //     this.isCheckPacking = true
      //   }
      // }
      for (let i = 0; i < this.fullboxOptions.length; i++) {
        if (this.fullboxOptions[i].isCheck === 1) {
          this.formDistribution.fullBoxDeviceJson.push({ fullBoxDeviceId: this.fullboxOptions[i].id, fullboxDevice: this.fullboxOptions[i].deviceName, fullPercent: 1 / fullboxNum })
        }
      }
      for (let i = 0; i < this.pieceOptions.length; i++) {
        if (this.pieceOptions[i].isCheck === 1) {
          this.formDistribution.pieceDeviceJson.push({ pieceDeviceId: this.pieceOptions[i].id, pieceDevice: this.pieceOptions[i].deviceName, piecePercent: 1 / pieceNum })
        }
      }
      // for (let i = 0; i < this.packingOptions.length; i++) {
      //   if (this.packingOptions[i].isCheck === 1) {
      //     this.formDistribution.packingDeviceJson.push({ packingDeviceId: this.packingOptions[i].id, packingDevice: this.packingOptions[i].deviceName, packingPercent: 1 / packingNum })
      //   }
      // }
      if (!this.isCheckWarehouse) {
        this.$message({
          message: '请选择库区名称',
          type: 'error'
        })
      } else if (!this.isCheckFullbox) {
        this.$message({
          message: '请选择整箱分拣设备',
          type: 'error'
        })
      } else if (!this.isCheckPiece) {
        this.$message({
          message: '请选择拆零分拣设备',
          type: 'error'
        })
      // } else if (!this.isCheckPacking) {
      //   this.$message({
      //     message: '请选择装箱设备',
      //     type: 'error'
      //   })
      } else {
        this.$confirm('是否确认生成分拣任务单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.subFormDistribution = []
          if (this.isSortAll === true) {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              this.subFormDistribution.push({ pid: this.multipleSelection[i].id, warehouseId: this.formDistribution.warehouseId, warehouseName: this.formDistribution.warehouseName, warehouseCode: this.formDistribution.warehouseCode, warehouseAreaJson: JSON.stringify(this.formDistribution.warehouseAreaJson), fullBoxDeviceJson: JSON.stringify(this.formDistribution.fullBoxDeviceJson), pieceDeviceJson: JSON.stringify(this.formDistribution.pieceDeviceJson) })
            }
          } else {
            this.subFormDistribution = [{ pid: this.formDistribution.pid, warehouseId: this.formDistribution.warehouseId, warehouseName: this.formDistribution.warehouseName, warehouseCode: this.formDistribution.warehouseCode, warehouseAreaJson: JSON.stringify(this.formDistribution.warehouseAreaJson), fullBoxDeviceJson: JSON.stringify(this.formDistribution.fullBoxDeviceJson), pieceDeviceJson: JSON.stringify(this.formDistribution.pieceDeviceJson) }]
          }
          generatePickTaskDiy(
            this.subFormDistribution
          ).then(res => {
            if (res.code === 200) {
              this.$message.success('已生成分拣任务单')
              this.dialogVisibleDistribution = false
              this.getlist()
            } else {
              this.$message({
                type: 'info',
                message: '生成失败'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消生成'
          })
        })
      }
    },
    submitAddDes() {
      this.$confirm('是否确认在当前波次新增发运订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addDesFinal = JSON.parse(JSON.stringify(this.addDesIdList))
        this.addDesFinal.push({ id: this.formAddDes.id }) // 进行动态的操作
        updateWave(
          {
            head: {
              id: this.formTitle.id
            },
            details: [
              {
                'id': this.formAddDes.id
              }
            ]
          }
        ).then(res => {
          if (res.code === 200) {
            this.$message.success('新增发运订单成功')
            this.tabledatas.push(this.formAddDes)
            this.dialogVisibleDes = false
          } else {
            this.$message.error('新增失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消新增'
        })
      })
    },
    submitPackingForm() {
      generateExPickingAndDetail(
        {
          head: {
            id: this.formPacking.id
          },
          details: this.multipleSelection
        }).then(res => {
        if (res.code === 200) {
          this.$message.success('已生成装箱单')
          this.multipleSelection = []
          this.reload()
        } else {
          this.$message.error('生成失败')
        }
      })
    },
    expandChangePack(row, expandedRows) {
      this.expandsPack = []
      if (expandedRows.length > 0) {
        row ? this.expands.push(row.id) : ''
        this.formTitle.id = row.id
        this.getListDetailsPack(this.pagesize, this.currentPage)
      }
    },
    waveStateFormat(row) {
      return waveChangeState(row.status)
    },
    getListDetails(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      searchAllDespatchByWaveId({
        searchDTO,
        pojo: {
          waveId: this.formTitle.id
        }
      }).then(response => {
        this.tabledatas = response.data
        this.addDesIdList = []
        response.data.forEach(item => {
          this.addDesIdList.push({ id: item.id })
        })
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      searchAllDespatchByWaveIdSum({
        searchDTO,
        pojo: {
          waveId: this.formTitle.id
        }
      }).then(response => {
        this.totalCount = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    getListDetailsPack(n1, n2) {
      var searchDTO = {
        'page': n2,
        'num': n1
      }
      this.tableLoading = true
      screenExPickingDetail({
        searchDTO,
        pojo: {
          exPickingId: this.formTitle.id
        }
      }).then(response => {
        this.packTabledataDetail = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      screenExPickingDetailSum({
        searchDTO,
        pojo: {
          exPickingId: this.formTitle.id
        }
      }).then(response => {
        this.totalCountPackDetail = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    scanDespatch() {
      this.showHH = true
      this.moonShowHH = false
      this.sortShowHH = false
      this.packShowHH = false
      this.isEdit = false
      if (this.formTitle.checkStatus === 1) {
        this.isDetail = true
      } else {
        this.isDetail = false
      }
    },
    scanSort() {
      this.showHH = false
      this.moonShowHH = false
      this.sortShowHH = true
      this.packShowHH = false
      this.isEdit = false
      if (this.formTitle.checkStatus === 1) {
        this.isDetail = true
      } else {
        this.isDetail = false
      }
      var searchDTO = {
        'page': 1,
        'num': 100000
      }
      screenTablePickup(
        {
          searchDTO,
          pojo: {
            'pid': this.formTitle.id
          }
        }
      ).then(response => {
        if (response.data.length === 0) {
          this.$confirm('此波次尚未生成分拣任务，是否选择生成?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isSortAll = false
            this.isCheckFullbox = false
            this.isCheckPiece = false
            this.isCheckPacking = false
            this.isCheckWarehouse = false
            this.formDistribution = {
              pid: null,
              warehouseName: null,
              warehouseId: null,
              warehouseCode: null,
              warehouseAreaId: null,
              warehouseAreaName: [],
              warehouseAreaCode: null,
              fullboxDevice: null,
              pieceDevice: null,
              packingDevice: null,
              fullBoxDeviceId: null,
              pieceDeviceId: null,
              packingDeviceId: null,
              warehouseAreaJson: [],
              pieceDeviceJson: [],
              packingDeviceJson: [],
              fullBoxDeviceJson: []
            }
            searchWorkGroupWarehouse({ id: Number(sessionStorage.workGroupId), page: 1, num: 1 }).then(res => {
              this.formDistribution.warehouseId = res.data.results[0].id
              this.formDistribution.warehouseName = res.data.results[0].warehouseName
              this.formDistribution.warehouseCode = res.data.results[0].warehouseCode
            }
            )
            this.formDistribution.pid = this.formTitle.id
            console.log(this.formTitle.id)
            this.getDeviceOptions()
            this.dialogVisibleDistribution = true
            screenTablePickupNum({
              searchDTO,
              pojo: {
                'pid': this.formTitle.id
              }
            }).then(response => {
              this.totalCountSort = response.data
              setTimeout(() => {
                this.tableLoading = false
              }, 0.5 * 1000)
            })
          })
        } else {
          this.sortTabledata = response.data
          setTimeout(() => {
            this.tableLoading = false
          }, 0.5 * 1000)
        }
      })
    },
    scanPack() {
      this.packShowHH = true
      this.showHH = false
      this.moonShowHH = false
      this.sortShowHH = false
      this.isEdit = false
      if (this.formTitle.checkStatus === 1) {
        this.isDetail = true
      } else {
        this.isDetail = false
      }
      var searchDTO = {
        'page': 1,
        'num': 100000
      }
      this.tableLoading = true
      screenExPicking(
        {
          searchDTO,
          pojo: {
            waveNumber: this.formTitle.id
          }
        }
      ).then(response => {
        this.packTabledata = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
      screenExPickingSum({
        searchDTO,
        pojo: {
          waveNumber: this.formTitle.id
        }
      }).then(response => {
        this.totalCountPack = response.data
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
    // 原来的
    // createSort(row) {
    //   this.$confirm('是否确认生成分拣任务单?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     generatePickingTaskManual(row).then(res => {
    //       if (res.code === 200) {
    //         this.$message.success('已生成')
    //         this.reload()
    //       } else {
    //         this.$message.error('生成失败')
    //       }
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '取消生成'
    //     })
    //   })
    // },
    createSortRight() {
      var searchDTO = {
        'page': 1,
        'num': 100000
      }
      this.isSortAll = false
      this.isCheckFullbox = false
      this.isCheckPiece = false
      this.isCheckPacking = false
      this.isCheckWarehouse = false
      this.formDistribution = {
        pid: null,
        warehouseName: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseAreaId: null,
        warehouseAreaName: [],
        warehouseAreaCode: null,
        fullboxDevice: null,
        pieceDevice: null,
        packingDevice: null,
        fullBoxDeviceId: null,
        pieceDeviceId: null,
        packingDeviceId: null,
        warehouseAreaJson: [],
        pieceDeviceJson: [],
        packingDeviceJson: [],
        fullBoxDeviceJson: []
      }
      searchWorkGroupWarehouse({ id: Number(sessionStorage.workGroupId), page: 1, num: 1 }).then(res => {
        this.formDistribution.warehouseId = res.data.results[0].id
        this.formDistribution.warehouseName = res.data.results[0].warehouseName
        this.formDistribution.warehouseCode = res.data.results[0].warehouseCode
      }
      )
      this.formDistribution.pid = this.formTitle.id
      console.log(this.formTitle.id)
      this.getDeviceOptions()
      this.dialogVisibleDistribution = true
      screenTablePickupNum({
        searchDTO,
        pojo: {
          'pid': this.formTitle.id
        }
      }).then(response => {
        this.totalCountSort = response.data
        setTimeout(() => {
          this.tableLoading = false
        }, 0.5 * 1000)
      })
    },
    createSort(row) {
      this.isSortAll = false
      this.isCheckFullbox = false
      this.isCheckPiece = false
      this.isCheckPacking = false
      this.isCheckWarehouse = false
      this.formDistribution = {
        pid: null,
        warehouseName: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseAreaId: null,
        warehouseAreaName: [],
        warehouseAreaCode: null,
        fullboxDevice: null,
        pieceDevice: null,
        packingDevice: null,
        fullBoxDeviceId: null,
        pieceDeviceId: null,
        packingDeviceId: null,
        warehouseAreaJson: [],
        pieceDeviceJson: [],
        packingDeviceJson: [],
        fullBoxDeviceJson: []
      }
      searchWorkGroupWarehouse({ id: Number(sessionStorage.workGroupId), page: 1, num: 1 }).then(res => {
        this.formDistribution.warehouseId = res.data.results[0].id
        this.formDistribution.warehouseName = res.data.results[0].warehouseName
        this.formDistribution.warehouseCode = res.data.results[0].warehouseCode
      }
      )
      this.dialogVisibleDistribution = true
      this.getDeviceOptions()
      this.formDistribution.pid = row.id
      this.formTitle.id = row.id
    },
    createSortAll() {
      if (this.multipleSelection.length) {
        this.isSortAll = true
        this.isCheckFullbox = false
        this.isCheckPiece = false
        this.isCheckPacking = false
        this.isCheckWarehouse = false
        this.formDistribution = {
          pid: null,
          warehouseName: null,
          warehouseId: null,
          warehouseCode: null,
          warehouseAreaId: null,
          warehouseAreaName: [],
          warehouseAreaCode: null,
          fullboxDevice: null,
          pieceDevice: null,
          packingDevice: null,
          fullBoxDeviceId: null,
          pieceDeviceId: null,
          packingDeviceId: null,
          warehouseAreaJson: [],
          pieceDeviceJson: [],
          packingDeviceJson: [],
          fullBoxDeviceJson: []
        }
        searchWorkGroupWarehouse({ id: Number(sessionStorage.workGroupId), page: 1, num: 1 }).then(res => {
          this.formDistribution.warehouseId = res.data.results[0].id
          this.formDistribution.warehouseName = res.data.results[0].warehouseName
          this.formDistribution.warehouseCode = res.data.results[0].warehouseCode
        }
        )
        this.dialogVisibleDistribution = true
        this.getDeviceOptions()
      } else {
        this.$message({
          message: '请在下方列表最左侧的方框内，选择至少一条波次计划单',
          type: 'warning'
        })
      }
    },
    createPack(row) {
      this.dialogVisiblePacking = true
      this.multipleSelection = [{ id: row.id }]
      this.getPackingOptions()
    },
    createPackingAll() {
      if (this.multipleSelection.length !== 0) {
        this.dialogVisiblePacking = true
        this.getPackingOptions()
      } else {
        this.$message.error('请至少选择一个波次')
      }
    },
    refresh() {
      this.reload()
    },
    // 单个删除
    deleteDes(index) {
      this.$confirm('是否将此发运订单从波次计划中移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDesInwave([
          {
            'id': this.tabledatas[index].id
          }
        ]
        ).then(res => {
          if (res.code === 200) {
            this.$message.success('移除发运订单成功')
            this.tabledatas.splice(index, 1)
          } else {
            this.$message.error('移除失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消移除'
        })
      })
    },
    deleteRight() {
      this.$confirm('是否确认删除此波次计划?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWave({ id: this.formTitle.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.reload()
          } else {
            this.$message.error('删除失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    clear() {
      this.listQuery.page = 1
      this.getList()
    },
    search() {
      this.listQuery.page = 1
      this.labelTitle = '波次计划-查询结果'
      this.getList()
    },
    getListScan() {
      this.listLoading = true
      if (this.viewed === false) {
        this.statesNow = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      } else {
        this.statesNow = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      }
      screenWave({ searchDTO: {
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
      screenWaveSum({
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
      screenWave({
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        },
        states: this.formSearch.orderState,
        warehouseCodes: this.formSearch.warehouseCodes,
        waveRuleId: this.formSearch.waveRuleId,
        startTime: this.searchStartTime,
        endTime: this.searchEndTime,
        screen: this.screen
      }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      screenWaveSum({
        searchDTO: {
          page: this.listQuery.page,
          num: this.listQuery.limit
        },
        pojo: {
        },
        states: this.formSearch.orderState,
        warehouseCodes: this.formSearch.warehouseCodes,
        waveRuleId: this.formSearch.waveRuleId,
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
    // 选
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
  .el-input.is-disabled .el-input__inner {
      border-color: #f5f7fa;
      background-color: #ffffff;
      color: #606266;
  }
  .pagContainer {
    background-color: #000000;
  }
  .show_card1 {
        background-color:#081b26c3;
      }
  .search {
        margin: 1px;
        padding-top: 10px;
        background-color: rgb(255, 255, 255);
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

  .datagrid-htable, .datagrid-btable, .datagrid-ftable {
    color: #ffffff;
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
  .btngroups {
   margin: 5px;
  }
  </style>
  <style lang= "scss" scoped>
  .showAll_dialog {
    ::v-deep.el-dialog {
      margin: 10px auto !important;
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
          color: rgb(9, 205, 219)
        }
      }
    }
  }
  </style>

