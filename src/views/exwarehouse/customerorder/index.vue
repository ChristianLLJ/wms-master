<template>
  <div>
    <el-row>
      <el-col v-show="showLeft" :span="spanLeft">
        <el-row>
          <el-dialog title="未能生成发运订单的客户订单列表" :visible.sync="isShowReturn" width="90%" height="60%" class="showAll_dialog">
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
              <el-table-column label="客户订单号" width="120px" align="center" :show-overflow-tooltip="true" prop="deliverId" />
              <el-table-column sortable="custom" label="订单创建时间" align="center" :show-overflow-tooltip="true" prop="createTime">
                <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column sortable="custom" label="要求交货时间" align="center" :show-overflow-tooltip="true" prop="requestDeliveryTime">
                <template slot-scope="scope">{{ scope.row.requestDeliveryTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column sortable="custom" label="预期发货时间" align="center" :show-overflow-tooltip="true" prop="expectSendTime">
                <template slot-scope="scope">{{ scope.row.expectSendTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column sortable="custom" label="滞留时长/天" align="center" :show-overflow-tooltip="true" prop="retentionDays" />
              <el-table-column sortable="custom" width="120px" label="订单状态" align="center" :show-overflow-tooltip="true" prop="status">
                <template slot-scope="scope">
                  <span v-if="scope.row.status=== 1"><el-tag type="danger" size="mini">已创建</el-tag></span>
                  <span v-if="scope.row.status=== 2"><el-tag type="warning" size="mini">部分生成发运订单</el-tag></span>
                  <span v-if="scope.row.status=== 3"><el-tag type="success" size="mini">全部生成发运订单</el-tag></span>
                </template></el-table-column>
              <el-table-column label="客户名称" align="center" :show-overflow-tooltip="true" prop="customerName" />
              <el-table-column label="收货人" align="center" :show-overflow-tooltip="true" prop="receiverName" />
              <el-table-column label="联系电话" align="center" :show-overflow-tooltip="true" prop="phoneNumber" />
              <el-table-column label="收货地/省" align="center" :show-overflow-tooltip="true" prop="province" />
              <el-table-column label="市" width="60px" :show-overflow-tooltip="true" prop="city" />
              <el-table-column label="县" width="60px" :show-overflow-tooltip="true" prop="site" />
              <el-table-column label="详细地址" align="center" :show-overflow-tooltip="true" prop="address" />
              <!-- <el-table-column label="SKU数" width="80px" align="center" :show-overflow-tooltip="true" prop="goodsAmount" /> -->
              <el-table-column sortable="custom" label="总件数" align="center" :show-overflow-tooltip="true" prop="goodsAmount" />
              <!-- <el-table-column label="总金额/元" width="80px" align="center" :show-overflow-tooltip="true" prop="goodsAmount" /> -->
              <!-- <el-table-column label="支付方式" width="80px" align="center" :show-overflow-tooltip="true" prop="paymentType" /> -->
            </el-table>
            <div slot="footer" align="center" class="dialog-footer">
              <el-button align="center" type="primary" @click="isShowReturn = false">确认</el-button>
            </div>
          </el-dialog>
          <div id="btnAndSearch">
            <el-card style="border-radius: 20px; margin-top: 5px;" shadow="always">
              <div class="search">
                <el-form :inline="true" :model="formSearch">
                  <el-form-item label="客户订单状态">
                    <el-select v-model="formSearch.orderState" placeholder="请选择客户订单状态" size="small" clearable multiple>
                      <el-option v-for="item in optionsState" :key="item.typeNumber" :label="item.codeDetailName" :value="item.typeNumber" style="width: 160px;" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="客户">
                    <el-select v-model="formSearch.customerId" placeholder="请选择客户名称" size="small" clearable multiple filterable>
                      <el-option v-for="item in optionsCustom" :key="item.id" :label="item.customName" :value="item.id" style="width: 160px;" />
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
                  <el-form-item label="订单创建时间">
                    <el-date-picker
                      v-model="formSearch.time0"
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
                      <el-button type="success" icon="el-icon-search" size="medium" round @click="search()">查询</el-button>
                    </el-button-group>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
            <div class="btngroups">
              <el-tooltip class="item" effect="dark" content="重新获取当前页面数据" placement="bottom-start">
                <el-button size="small" type="warning" icon="el-icon-refresh" @click="refresh">刷新</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="手动填写toB客户订单" placement="bottom-start">
                <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="addNew">新建</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="按格式上传文件导入客户订单" placement="bottom-start">
                <el-button size="small" type="primary" icon="el-icon-upload">导入</el-button>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="一键审核在下方列表中选中的客户订单" placement="bottom-start">
                <el-button size="small" icon="el-icon-receive" type="success" @click="finish(scope.row)">一键审核</el-button>
              </el-tooltip> -->
              <el-tooltip class="item" effect="dark" content="将下方列表中选中的客户订单生成发运订单" placement="bottom-start">
                <el-button size="small" icon="el-icon-s-order" type="success" @click="toDespatchAll">一键生成发运订单</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看全部/未发运的toB客户订单" placement="bottom-start">
                <el-button size="small" type="danger" icon="el-icon-view" @click="scanHistory">{{ viewed ? "查看全部客户订单" : "查看未发运的客户订单" }}</el-button>
              </el-tooltip>
              <!-- <el-button  icon="el-icon-download" @click="outExcel">导出</el-button>
            <el-button  icon="el-icon-download" @click="outSelfExcel">自定义导出</el-button> -->
            </div>
          </div>
        </el-row>
        <el-card :body-style="{padding:'0px'}" shadow="always">
          <el-table
            ref="multipleTable"
            v-loading="listLoading"
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
            :header-cell-class-name="handleHeadAddClass"
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
                width="40"
                align="center"
              />
              <el-table-column v-if="show" align="center" prop="id" />
              <el-table-column label="客户订单号" width="120px" align="center" :show-overflow-tooltip="true" prop="deliverId" />
              <el-table-column sortable="custom" label="订单创建时间" align="center" :show-overflow-tooltip="true" prop="createTime">
                <template slot-scope="scope">{{ scope.row.createTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column sortable="custom" label="要求交货时间" align="center" :show-overflow-tooltip="true" prop="requestDeliveryTime">
                <template slot-scope="scope">{{ scope.row.requestDeliveryTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column sortable="custom" label="预期发货时间" align="center" :show-overflow-tooltip="true" prop="expectSendTime">
                <template slot-scope="scope">{{ scope.row.expectSendTime| dateYMDHMSFormat }}</template>
              </el-table-column>
              <el-table-column sortable="custom" label="滞留时长/天" align="center" :show-overflow-tooltip="true" prop="retentionDays" />
              <el-table-column sortable="custom" width="120px" label="订单状态" align="center" :show-overflow-tooltip="true" prop="status">
                <template slot-scope="scope">
                  <span v-if="scope.row.status=== 1"><el-tag type="danger" size="mini">已创建</el-tag></span>
                  <span v-if="scope.row.status=== 2"><el-tag type="warning" size="mini">部分生成发运订单</el-tag></span>
                  <span v-if="scope.row.status=== 3"><el-tag type="success" size="mini">全部生成发运订单</el-tag></span>
                </template></el-table-column>
              <el-table-column label="客户名称" align="center" :show-overflow-tooltip="true" prop="customerName" />
              <el-table-column label="收货人" align="center" :show-overflow-tooltip="true" prop="receiverName" />
              <el-table-column label="联系电话" align="center" :show-overflow-tooltip="true" prop="phoneNumber" />
              <el-table-column label="收货地/省" align="center" :show-overflow-tooltip="true" prop="province" />
              <el-table-column label="市" width="60px" :show-overflow-tooltip="true" prop="city" />
              <el-table-column label="县" width="60px" :show-overflow-tooltip="true" prop="site" />
              <el-table-column label="详细地址" align="center" :show-overflow-tooltip="true" prop="address" />
              <!-- <el-table-column label="SKU数" width="80px" align="center" :show-overflow-tooltip="true" prop="goodsAmount" /> -->
              <el-table-column sortable="custom" label="总件数" align="center" :show-overflow-tooltip="true" prop="goodsAmount" />
              <!-- <el-table-column label="总金额/元" width="80px" align="center" :show-overflow-tooltip="true" prop="goodsAmount" /> -->
              <!-- <el-table-column label="支付方式" width="80px" align="center" :show-overflow-tooltip="true" prop="paymentType" /> -->
            </el-table-column>
            <el-table-column
              prop="action"
              label="操作"
              align="center"
              width="160"
            >
              <template slot-scope="scope">
                <el-button-group>
                  <el-button size="mini" icon="el-icon-search" type="primary" @click="searchDetail(scope.row)">查看订单详情</el-button>
                </el-button-group>
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
      <el-col v-show="showRight" :span="spanRight">
        <el-dialog title="生成发运订单" :visible.sync="dialogVisibleDis" width="60%" class="showAll_dialog">
          <el-form>
            <el-form-item label="仓库名称" style="color:#fff">
              <el-select v-model="formTitle.warehouseName" placeholder="请选择仓库" style="width: 80%;">
                <el-option
                  v-for="item in taskStatusOptions"
                  :key="item.warehouseCode"
                  :label="item.warehouseName"
                  :value="item.warehouseName"
                />
              </el-select>
            </el-form-item>
            <el-table
              ref="tablelist"
              :data="dataDis"
              :row-class-name="tableRowClassDetailName"
              border
              size="mini"
              :row-style="{height:'20px'}"
              :cell-style="{padding:'0px'}"
              style="width: 100%, font-size: 10px"
              :height="tableHeightRight"
              :header-cell-style="{background:'#000',color: '#fff'}"
              tooltip-effect="dark"
            >
              <el-table-column label="商品详情——生成发运订单" align="center">
                <el-table-column type="index" label="序号" align="center" />
                <el-table-column label="sku名称" align="center" :show-overflow-tooltip="true" prop="skuName" />
                <el-table-column label="尺寸" align="center" :show-overflow-tooltip="true" prop="skuSize" />
                <el-table-column label="颜色" align="center" :show-overflow-tooltip="true" prop="skuColor" />
                <el-table-column label="订货数量" align="center" :show-overflow-tooltip="true" prop="orderCnt" />
                <el-table-column label="已生成发运订单数" align="center" :show-overflow-tooltip="true" prop="despatchNum" />
                <el-table-column label="待发运数量" align="center" :show-overflow-tooltip="true" prop="remainNum" />
                <!-- <el-table-column label="sku单价" align="center" :show-overflow-tooltip="true" prop="skuPrice" /> -->
                <el-table-column
                  prop="orderCntDis"
                  label="本次发运数量"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model.number="scope.row.orderCntDis" type="number" onkeyup="value=value.replace(/[^\d]/g)" size="mini" @input="changeOrderDisCnt(scope.row)" />
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleDis=false">取消</el-button>
            <el-button type="primary" @click="submitDis">提交</el-button>
          </div>
        </el-dialog>
        <el-dialog v-if="dataDisOrder" title="关联的发运订单" :visible.sync="dialogVisibleDisOrder" width="90%" class="showAll_dialog">
          <el-table
            :data="dataDisOrder"
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
            <el-button type="primary" @click="dialogVisibleDisOrder=false">确定</el-button>
          </div>
        </el-dialog>
        <div id="btnRight">
          <div class="btngroupsRight">
            <el-button-group>
              <el-tooltip class="item" effect="dark" content="返回toB客户订单页面" placement="bottom-start">
                <el-button type="warning" icon="el-icon-back" @click="goback">返回上一页</el-button>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="收起右侧详情界面" placement="bottom-start">
              <el-button v-show="isRightAllButton" type="warning" @click="showRightBack">收起</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="全屏显示右侧详情界面" placement="bottom-start">
              <el-button v-show="isRightAllButton" type="warning" @click="showRightAll">全屏</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="显示左侧订单列表" placement="bottom-start">
              <el-button v-show="!isRightAllButton" type="warning" @click="showRightAllBack">退出全屏</el-button>
            </el-tooltip> -->
              <el-tooltip v-if="isDetailTwo" class="item" effect="dark" content="点击将此toB客户订单生成发运订单" placement="bottom-start">
                <el-button icon="el-icon-s-order" type="primary" @click="toDespatch">生成发运订单</el-button>
              </el-tooltip>
              <el-tooltip v-if="isDetail" class="item" effect="dark" content="点击修改此toB客户订单" placement="bottom-start">
                <el-button icon="el-icon-edit-outline" type="primary" @click="editStart">修改</el-button>
              </el-tooltip>
              <el-tooltip v-if="isEdit" class="item" effect="dark" content="点击取消修改，恢复原客户订单" placement="bottom-start">
                <el-button icon="el-icon-folder-delete" type="success" @click="editNo">取消修改</el-button>
              </el-tooltip>
              <el-tooltip v-if="isEdit" class="item" effect="dark" content="点击提交此toB客户订单" placement="bottom-start">
                <el-button icon="el-icon-document-checked" type="primary" @click="submitEdit">提交修改</el-button>
              </el-tooltip>
              <el-tooltip v-if="isDetail" class="item" effect="dark" content="点击删除此toB客户订单" placement="bottom-start">
                <el-button icon="el-icon-delete" type="danger" @click="deledeNowAll">删除</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="点击此toB客户订单生成的发运订单" placement="bottom-start">
                <el-button icon="el-icon-search" type="primary" @click="searchDisOrder">查看发运订单</el-button>
              </el-tooltip>
            </el-button-group>
          </div>
          <el-card class="show_card1" :body-style="{padding:'0px'}">
            <div slot="header" align="center" style="padding: 15px">
              <span class="title">客户订单-toB 单头信息</span>
            </div>
            <el-form ref="form" :inline="true" :model="formTitle">
              <el-card :body-style="{padding:'0px'}">
                <e-desc>
                  <e-desc-item label="客户订单号">
                    <el-input v-model="formTitle.deliverId" size="small" readonly />
                  </e-desc-item>
                  <e-desc-item label="客户名称">
                    <el-select v-model="formTitle.customerId" placeholder="请选择客户名称" size="small" style="width: 100%;" clearable filterable :disabled="!isEdit" @change="selectCustomer($event)">
                      <el-option v-for="item in optionsCustom" :key="item.id" :label="item.customName" :value="item.id" />
                    </el-select>
                  </e-desc-item>
                  <e-desc-item label="收货人">
                    <el-select v-model="formTitle.receiverName" placeholder="请选择收货人" size="small" style="width: 100%;" clearable filterable :disabled="!isEdit" @change="selectReciever($event)">
                      <el-option v-for="item in optionsReceiver" :key="item.id" :label="item.customName" :value="item.id" />
                    </el-select>
                  </e-desc-item>
                  <e-desc-item label="联系电话">
                    <el-input v-model="formTitle.phoneNumber" placeholder="请输入联系电话" size="small" :readonly="!isEdit" />
                  </e-desc-item>
                  <e-desc-item label="收货地址/省市县">
                    <el-select v-model="formTitle.province" filterable clearable size="small" placeholder="请选择省份" :disabled="!isEdit" @change="selectProvinceFunEdit($event)">
                      <el-option v-for="(item, index) in city" :key="index" :value="item" :label="item.label" />
                    </el-select>
                    <el-select v-model="formTitle.city" filterable clearable size="small" placeholder="请选择城市" :disabled="!isEdit" @change="selectCityFunEdit($event)">
                      <el-option v-for="(item, index) in cityListEdit" :key="index" :value="item" :label="item.label" />
                    </el-select>
                    <el-select v-model="formTitle.site" filterable clearable size="small" placeholder="请选择区县" :disabled="!isEdit" @change="selectSiteFunEdit($event)">
                      <el-option v-for="(item, index) in siteListEdit" :key="index" :value="item" :label="item.label" />
                    </el-select>
                  </e-desc-item>
                  <e-desc-item label="详细地址">
                    <el-input v-model="formTitle.address" placeholder="请输入详细地址" size="small" :readonly="!isEdit" />
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
                      placeholder="请选择要求发货时间"
                      size="small"
                      align="right"
                      unlink-panels
                      :disabled="!isEdit"
                      style="width: 100%;"
                      :picker-options="pickerOptionsRequest"
                    />
                  </e-desc-item>
                  <e-desc-item label="订单状态">
                    <el-input v-model="formTitle.statusName" size="small" readonly />
                  </e-desc-item>
                </e-desc>
              </el-card>
            </el-form>
          </el-card>
        </div>
        <el-card style="background-color: #081b26c3;" :body-style="{padding:'0px'}">
          <div slot="header" style="padding: 15px" align="center">
            <span class="title">客户订单-toB 商品信息</span><span style="padding-left: 20px" />
            <el-button v-if="isEdit" icon="el-icon-plus" type="primary" @click="add">新增</el-button>
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
              <el-table-column label="sku名称" align="center" width="300px" prop="skuName">
                <template slot-scope="scope">
                  <el-form-item prop="skuName">
                    <ComboGrid
                      v-model="scope.row.skuName"
                      value-field="skuName"
                      text-field="skuName"
                      :editable="true"
                      :readonly="scope.row.isRowEdit === 0 ||scope.row.isRowEdit === 2 "
                      :data="skuOptionsNow"
                      :panel-style="{width:'500px'}"
                      :text-formatter="formatSkuText"
                      @filterChange="changedinput($event)"
                      @valueChange="exampleSku(scope.row)"
                    >
                      <DataGrid slot="grid" :border="false">
                        <GridColumn field="skuName" title="sku名称" />
                        <GridColumn field="skuCode" title="sku代码" />
                        <GridColumn field="skuColor" title="sku颜色" />
                        <GridColumn field="skuSize" title="尺寸" />
                        <GridColumn field="skuSeason" title="季节" />
                      </DataGrid>
                    </ComboGrid>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="尺寸" align="center" :show-overflow-tooltip="true" prop="skuSize" />
              <el-table-column label="颜色" align="center" :show-overflow-tooltip="true" prop="skuColor" />
              <el-table-column label="订货数量" align="center" prop="orderCnt">
                <template slot-scope="scope">
                  <el-form-item>
                    <el-input v-model.number="scope.row.orderCnt" :disabled="scope.row.isRowEdit === 0 ||scope.row.isRowEdit === 2 " type="number" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" size="mini" @input="changeOrderCnt(scope.row)" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="已生成发运订单数" align="center" :show-overflow-tooltip="true" prop="despatchNum" />
              <el-table-column label="待发运数量" align="center" :show-overflow-tooltip="true" prop="remainNum" />
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button v-if="scope.row.isRowEdit === 0 || scope.row.isRowEdit === 2" icon="el-icon-edit" type="primary" size="mini" @click="editRow(scope.row)">修改此商品信息</el-button>
                    <el-button v-if="scope.row.isRowEdit === 1" icon="el-icon-check" type="success" size="mini" @click="editRowFinish(scope.row)">确认修改</el-button>
                    <el-button v-if="scope.row.isRowEdit === 1" icon="el-icon-delete" type="danger" size="mini" @click="editRowDelete(scope.$index)">删除</el-button>
                  </el-button-group>
                </template>
              </el-table-column>
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
import city from '@/assets/city.json'
import EDesc from '@/components/Edesc'
import EDescItem from '@/components/Edescitem'
import Pagination from '@/components/Pagination'
import { throttle } from '@/utils/throttle.js'
import { changeAll, despatchUnit } from '@/utils/statechange'
import { searchsystemid, searchcustomer, searchreceiver, searchsku } from '@/utils/search'
import { findDesByTob, selectWarehouse, toBAddDetail, tobUpd, tobDelTotal, tobDelDetail, searchWorkGroupWarehouse, tobScreenHead, tobScreenHeadNum, tobScreenDetail, tobScreenDetailNum, tobGenerate, tobSplit } from '@/api/user'
import elementResizeDetectorMaker from 'element-resize-detector'
var erd = elementResizeDetectorMaker()
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: { Pagination, EDesc, EDescItem },
  data() {
    return {
      isShowReturn: false,
      tableDataReturn: [],
      dataDisOrder: [],
      taskStatusOptions: [],
      searchStartTime: null,
      searchEndTime: null,
      searchStartTime1: null,
      searchEndTime1: null,
      upDisDetail: [],
      formTitleNow: {},
      upEdit: [],
      upEditNew: [],
      upEditDelete: [],
      checkSubmitAllFinish: true,
      checkSubmitTitle: true,
      skuOptions: [],
      skuOptionsNow: [],
      isEdit: false,
      warehouseId: null,
      isDetail: false,
      isDetailTwo: false,
      listQueryReDes: {
        page: 1,
        limit: 50
      },
      dataDis: [],
      dialogVisibleDis: false,
      dialogVisibleDisOrder: false,
      sortField: {},
      selectProvince: {},
      selectCity: {},
      selectArea: {},
      city: city,
      cityList: [],
      siteList: [],
      cityListEdit: [],
      siteListEdit: [],
      statesNow: [1, 2],
      screen: null,
      screenNull: '',
      labelTitle: '客户订单(toB)-未进行发运的记录',
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
      pickerOptionsRequest: {
        shortcuts: [{
          text: '明天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '后天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
            picker.$emit('pick', date)
          }
        }, {
          text: '三天后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 3)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }, {
          text: '两周后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 14)
            picker.$emit('pick', date)
          }
        }]
      },
      formSearch: {
        orderState: [],
        customerId: [],
        province: null,
        city: null,
        site: null,
        time0: [],
        time1: []
      },
      optionsState: [],
      optionsCustom: [],
      optionsReceiver: [],
      isRightAllButton: true,
      showLeft: true,
      showRight: false,
      spanLeft: 24,
      spanRight: 12,
      viewed: true,
      multipleSelection: [],
      deliverId: null,
      advanced: false,
      show: false,
      listLoading: true,
      preDistrLoading: true,
      directDistrLoading: true,
      id: null,
      total: 0,
      laststateTime: 0,
      tableHeight: 500,
      tableHeightRight: 500,
      totalCount: 1, // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
      pagesize: 100, // 每页显示的条数
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
      form: {
        skuCnt: null,
        billType: null,
        customerCode: null,
        goodsAmount: null,
        goodsWeight: null,
        paymentType: null
      },
      formTitle: {
        province: { label: null },
        city: { label: null },
        site: { label: null },
        warehouseName: null,
        warehouse: null,
        warehouseId: null,
        id: null
      },
      tableData: [],
      tabledatas: []
    }
  },
  watch: {
    viewed: function(viewed) {
      switch (viewed) {
        case true:
          this.labelTitle = '客户订单(toB)-未进行发运的记录'
          break
        case false:
          this.labelTitle = '客户订单(toB)-所有记录'
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
    this.getListScan()
    searchsystemid('TOB_STATE').then(res => {
      this.optionsState = res.data
    })
    searchcustomer().then(res => {
      this.optionsCustom = res.data
    }
    )
    searchreceiver().then(res => {
      this.optionsReceiver = res.data
    }
    )
    searchWorkGroupWarehouse({ id: Number(sessionStorage.workGroupId), page: 1, num: 1 }).then(res => {
      this.warehouseId = res.data.results[0]?.id
    }
    )
    selectWarehouse({
      'searchDTO': {
        'page': 1,
        'num': 100000
      },
      'pojo': {
      }
    }).then(res => {
      this.taskStatusOptions = res.data
    })
  },
  updated() {
    this.$nextTick(() => {
      this.$refs['tablelist'].doLayout()
      this.$refs['multipleTable'].doLayout()
      // table是在表格中ref=tablelist
      // doLayout	对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    })
  },
  methods: {
    unitFormat(row) {
      return despatchUnit(row.unit)
    },
    stateFormat(row) {
      const now = new Date().valueOf()
      if (this.laststateTime === 0) {
        searchsystemid(2).then(res => {
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
    searchDisOrder() {
      findDesByTob({ 'id': this.id }).then(res => {
        this.dataDisOrder = res.data
      })
      this.dialogVisibleDisOrder = true
    },
    editNo() {
      this.$confirm('是否确认取消修改?（将丢失已填写内容）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isRightAllButton = true
        this.getListDetails()
        this.formTitle = this.formTitleNow
        this.isEdit = false
        if (this.formTitle.status === 1) {
          this.isDetail = true
          this.isDetailTwo = true
        } else if (this.formTitle.status === 2) {
          this.isDetail = false
          this.isDetailTwo = true
        } else {
          this.isDetail = false
          this.isDetailTwo = false
        }
        searchsku().then(res => {
          this.skuOptions = res.data
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    editRowDelete(index) {
      if (this.tabledatas[index].id) {
        this.upEditDelete.push({ 'id': this.tabledatas[index].id })
      }
      this.tabledatas.splice(index, 1)
      console.log(this.upEditDelete)
    },
    submitEdit() {
      this.upEdit = []
      this.upEditNew = []
      this.checkSubmitTitleFun()
      this.checkSubmitAllFinishFun()
      if (this.checkSubmitAllFinish && this.checkSubmitTitle) {
        for (const item in this.tabledatas) {
          if (this.tabledatas[item].isRowEdit === 2) {
            if (this.tabledatas[item].id) {
              this.upEdit.push(this.tabledatas[item])
            } else {
              this.tabledatas[item].deliverNotifyId = this.formTitle.id
              this.upEditNew.push(this.tabledatas[item])
            }
          }
        }
        this.$confirm('提交所填客户订单信息, 是否确认修改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          tobUpd({ head: this.formTitle,
            details: this.upEdit }).then(res => {
            if (res.code === 200) {
              this.$message.success('修改成功！')
              this.showRight = false
              this.showLeft = true
            }
          })
          toBAddDetail(this.upEditNew)
          tobDelDetail(this.upEditDelete)
          console.log(this.tabledatas)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          })
        })
      }
    },
    checkSubmitAllFinishFun() {
      this.checkSubmitAllFinish = true
      for (const item in this.tabledatas) {
        if (this.tabledatas[item].isRowEdit === 1) {
          this.$message.error('商品信息未完成编辑，请点击右侧绿色“确认修改”按钮！')
          this.checkSubmitAllFinish = false
        }
      }
    },
    checkSubmitTitleFun() {
      this.checkSubmitTitle = true
      if (!this.formTitle.customerName) {
        this.$message.error('单头信息未填写完整，请选择货主名称！')
        this.checkSubmitTitle = false
      } else if (!this.formTitle.receiverName) {
        this.$message.error('单头信息未填写完整，请选择收货人！')
        this.checkSubmitTitle = false
      } else if (!this.formTitle.phoneNumber) {
        this.$message.error('单头信息未填写完整，请输入联系电话！')
        this.checkSubmitTitle = false
      } else if (!this.formTitle.province) {
        this.$message.error('单头信息未填写完整，请选择收货地址/省！')
        this.checkSubmitTitle = false
      } else if (!this.formTitle.city) {
        this.$message.error('单头信息未填写完整，请选择收货地址/市！')
        this.checkSubmitTitle = false
      } else if (!this.formTitle.site) {
        this.$message.error('单头信息未填写完整，请选择收货地址/区县！')
        this.checkSubmitTitle = false
      } else if (!this.formTitle.address) {
        this.$message.error('单头信息未填写完整，请输入详细地址！')
        this.checkSubmitTitle = false
      } else if (!this.formTitle.requestDeliveryTime) {
        this.$message.error('单头信息未填写完整，请选择要求发货时间！')
        this.checkSubmitTitle = false
      }
    },
    add() {
      const list = {
        skuId: '',
        skuCode: '',
        skuBarcode: '',
        skuName: '',
        skuColor: '',
        skuSize: '',
        skuPrice: '',
        orderCnt: '',
        isRowEdit: 1,
        despatchNum: 0,
        remainNum: 0
      }
      this.tabledatas.push(list)
    },
    editRow(row) {
      if (this.isEdit) {
        row.isRowEdit = 1
      } else {
        this.$message.warning('请在上方点击蓝色“修改”按钮后，再修改商品详情信息！')
      }
    },
    editRowFinish(row) {
      if (row.skuName && row.orderCnt) {
        row.isRowEdit = 2
      } else {
        this.$message.error('商品信息未填写完整！')
      }
    },
    formatSkuText(skuName) {
      return skuName
    },
    changeOrderCnt(row) {
      row.remainNum = row.orderCnt
    },
    exampleSku(row) {
      const item = this.skuOptions.find(item1 => item1.skuName === row.skuName)
      row.skuBarcode = item.skuBarcode
      row.skuCode = item.skuCode
      row.skuColor = item.skuColor
      row.skuPrice = item.money
      row.skuSize = item.skuSize
      row.skuId = item.id
    },
    changedinput(even) {
      var reg = new RegExp(even.filterValue)
      this.skuOptionsNow = []
      for (var i = 0; i < this.skuOptions.length; i++) {
        if (reg.test(this.skuOptions[i].skuName)) {
          this.skuOptionsNow.push(this.skuOptions[i])
        }
      }
    },
    selectCustomer(event) {
      console.log(event)
      const item = this.optionsCustom.find(item1 => item1.id === event)
      this.formTitle.customerName = item.customName
      this.formTitle.customerCode = item.customCode
      console.log(this.formTitle.data)
    },
    selectReciever(event) {
      console.log(event)
      const item = this.optionsReceiver.find(item1 => item1.id === event)
      this.formTitle.receiverName = item.customName
      this.formTitle.receiverId = item.id
      this.formTitle.phone = item.phone
      this.formTitle.address = item.address
      this.formTitle.province = item.province
      this.formTitle.city = item.city
      this.formTitle.site = item.site
      console.log(this.formTitle)
    },
    editStart() {
      this.isDetail = false
      this.isDetailTwo = false
      this.isEdit = true
      this.upEditDelete = []
    },
    submitDis() {
      this.$confirm('是否确定按表格中的信息生成发运订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.upDisDetail = []
        for (const item in this.dataDis) {
          if (this.dataDis[item].orderCntDis > 0) {
            this.upDisDetail.push({ 'skuId': this.dataDis[item].skuId, 'orderCnt': this.dataDis[item].orderCntDis })
          }
        }
        var item1 = this.taskStatusOptions.find(item1 => item1.warehouseName === this.formTitle.warehouseName)
        this.formTitle.warehouse = item1.warehouseCode
        this.formTitle.warehouseId = String(item1.id)
        tobSplit({ head: this.formTitle,
          details: this.upDisDetail }).then(res => {
          if (res.code === 200) {
            this.$message.success('提交成功')
            this.searchDisOrder()
          } else {
            this.$message.error(res.msg)
            this.dataDisOrder = res.data
            this.dialogVisibleDisOrder = true
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    changeOrderDisCnt(row) {
      row.remainNum = row.orderCnt - row.despatchNum - row.orderCntDis
    },
    toDespatch() {
      tobScreenDetail({ searchDTO: {
        page: 1,
        num: 10000
      },
      pojo: {
        deliverNotifyId: this.id
      }}).then(response => {
        this.dataDis = response.data
        for (var itemm in this.dataDis) {
          this.$set(this.dataDis[itemm], 'orderCntDis', this.dataDis[itemm].remainNum)
          this.dataDis[itemm].remainNum = 0
          console.log(this.dataDis)
        }
      })
      console.log(this.dataDis)
      this.dialogVisibleDis = true
    },
    toDespatchAll() {
      console.log(sessionStorage)
      if (this.multipleSelection.length) {
        this.$confirm('是否确认将选中的客户订单生成发运订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          tobGenerate({
            head: { id: this.warehouseId },
            details: this.multipleSelection
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('生成发运订单成功！')
              this.$refs.multipleTable.clearSelection()
              this.getList()
            } else {
              this.$message.error(res.msg)
              this.isShowReturn = true
              this.tableDataReturn = res.data
            }
          })
        })
      } else {
        this.$message({
          message: '请在下方列表最左侧的方框内，选择至少一条客户订单',
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
    selectProvinceFunEdit(event) {
      if (event) {
        this.formTitle.province = event.label
        this.cityListEdit = event.children
      } else {
        this.cityListEdit = []
      }
      this.siteListEdit = []
      this.formTitle.city = null
      this.formTitle.site = null
      console.log(this.formTitle)
    },
    selectCityFunEdit(event) {
      if (event) {
        this.formTitle.city = event.label
        this.siteListEdit = event.children
      } else {
        this.siteListEdit = []
        this.formTitle.site = null
      }
    },
    selectSiteFunEdit(event) {
      if (event) {
        this.formTitle.site = event.label
      }
      console.log(this.formTitle)
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
      this.isRightAllButton = true
      this.id = row.id
      this.getListDetails()
      this.formTitle = row
      this.formTitleNow = row
      this.isEdit = false
      if (row.status === 1) {
        this.isDetail = true
        this.isDetailTwo = true
      } else if (row.status === 2) {
        this.isDetail = false
        this.isDetailTwo = true
      } else {
        this.isDetail = false
        this.isDetailTwo = false
      }
      if (this.formTitle.status === 1) {
        this.formTitle.statusName = '已创建'
      } else if (this.formTitle.status === 2) {
        this.formTitle.statusName = '部分生成发运订单'
      } else {
        this.formTitle.statusName = '全部生成发运订单'
      }
      searchsku().then(res => {
        this.skuOptions = res.data
      })
      console.log(this.formTitle)
    },
    goback() {
      if (this.isEdit) {
        this.$confirm('当前正在修改客户订单，是否确认返回上级页面?（将丢失已填写内容）', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.showRight = false
          this.showLeft = true
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消返回'
          })
        })
      } else {
        this.showRight = false
        this.showLeft = true
      }
    },
    // showRightBack() {
    //   this.spanLeft = 24
    //   this.showRight = false
    //   this.showLeft = true
    // },
    // showRightAll() {
    //   this.spanRight = 24
    //   this.showLeft = false
    //   this.isRightAllButton = false
    // },
    // showRightAllBack() {
    //   this.spanRight = 12
    //   this.showLeft = true
    //   this.isRightAllButton = true
    // },
    scanHistory: throttle(function() {
      this.viewed = !this.viewed
      this.getListScan()
    }, 500, true),
    handleClick(tab, event) {
      console.log(tab, event)
    },
    changeadvanced() {
      this.advanced = !this.advanced
    },
    handleChange(val) {
      console.log(val)
    },
    search() {
      this.listQuery.page = 1
      this.labelTitle = '客户订单(toB)-查询结果'
      this.getList()
    },
    getListDetails() {
      tobScreenDetail({ searchDTO: {
        page: this.listQueryDetail.page,
        num: this.listQueryDetail.limit
      },
      pojo: {
        deliverNotifyId: this.id
      }}).then(response => {
        this.tabledatas = response.data
        for (const item in this.tabledatas) {
          this.$set(this.tabledatas[item], 'isRowEdit', 0)
        }
      })
      tobScreenDetailNum({
        pojo: {
          deliverNotifyId: this.id
        }}).then(response => {
        this.totalCount = response.data
      })
    },
    refresh() {
      this.reload()
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
    // 单个删除
    deledeNowAll(index) {
      this.$confirm('是否确认删除此客户订单？（删除后无法撤销）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tobDelTotal({ 'id': this.id }).then(response => {
          if (response.code === 200) {
            this.$message.success('删除成功！')
            this.showRight = false
            this.showLeft = true
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
    getListScan() {
      if (this.viewed === false) {
        this.statesNow = [1, 2, 3]
      } else {
        this.statesNow = [1, 2]
      }
      tobScreenHead({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        city: null,
        province: null,
        site: null
      },
      states: this.statesNow,
      persons: [],
      screen: null
      }).then(response => {
        this.tableData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      tobScreenHeadNum({
        pojo: {
        },
        states: this.statesNow,
        persons: null,
        screen: null
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
      tobScreenHead({ searchDTO: {
        page: this.listQuery.page,
        num: this.listQuery.limit
      },
      pojo: {
        province: this.formSearch.province,
        city: this.formSearch.city,
        site: this.formSearch.site
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
      })
      tobScreenHeadNum({
        pojo: {
          province: this.formSearch.province,
          city: this.formSearch.city,
          site: this.formSearch.site
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
      })
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    },
    addNew() {
      this.$router.push('customerlist')
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      // 去重获取被选中的id值存入到数组中
      for (let i = 0; i < val.length; i++) {
        if (this.multipleSelection.indexOf(val[i].id) === -1) {
          this.multipleSelection.push({ 'id': val[i].id })
        }
      }
      console.log(this.multipleSelection)
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
</style>
  <style scoped>
  /* /deep/ .current-row>td {
    border: 1px solid #ff0000;
    border-left: none;
    border-right: none;
    color: #000000;
    background-color: #000000;
    &:first-child {
      border-left: 1px solid #fc0000;
    }
    &:last-child {
      border-right: 1px solid #fc0000;
    }
  }
  /deep/ .el-table__body tr.current-row>td{
    background-color: #bd6767;
  } */
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

