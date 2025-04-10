<template>
  <div class="table-box">
    <!-- 查询表单 -->
    <div class="table-search"></div>
    <!-- 表格内容 -->
    <div class="card table-main">
      <!-- 表格头部 操作按钮  -->
      <div class="table-header">
        <div class="header-button-lf">
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增菜单</el-button>
        </div>
        <div class="header-button-ri">
          <div name="toolButton">
            <el-button :icon="Refresh" circle @click="getTableList" />
            <el-button :icon="Printer" circle />
            <el-button :icon="Operation" circle />
            <el-button :icon="Search" />
          </div>
        </div>
      </div>
      <el-table ref="tableRef" v-bind="$attrs" :data="tableData" :border="true" row-key="id">
        <el-table-column prop="title" label="菜单名称" width="200" />
        <el-table-column prop="icon" label="图标" width="80" align="center">
          <template #default="scope">
            <el-icon>
              <component :is="scope.row.icon"></component>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="component" label="组件路径" width="350" align="center" />
        <el-table-column prop="path" label="路由路径" width="350" align="center" />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="180" align="center">
          <template #default="scope">
            <span>
              {{ formatDate(scope.row.createTime) }}
            </span>
          </template>
        </el-table-column>
        // 操作列
        <el-table-column label="操作" fixed="right" align="center">
          <!-- 表格操作 -->
          <template #default="scope">
            <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
            <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
            <el-button type="primary" link :icon="Delete" @click="scope.row.id;">删除</el-button>
          </template>
        </el-table-column>
        <!-- 表格无数据情况 -->
        <template #empty>
          <div class="table-empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无数据</div>
          </div>
        </template>
      </el-table>
      <!-- 分页 -->

      <MenuDrawer ref="drawerRef" />
    </div>
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref, watch, onMounted, reactive } from "vue";
import { ElTable } from "element-plus";
import { CirclePlus, Delete, Printer, Operation, Search, Refresh, EditPen, View } from "@element-plus/icons-vue";

import { getMenuList, addMenu, editMenu, getMenuTree } from "@/api/modules/menu";
import type { Menu } from "@/api/interface";
import { formatDate } from "@/utils/util";

import MenuDrawer from "./component/MenuDrawer.vue";

const tableRef = ref<InstanceType<typeof ElTable>>();

const initParam = ref({
  title: "",
  type: ""
});

// 初始化参数
const initAddParam = ref({
  parentId: "0",
  type: "m",
  sort: 0,
  isHide: 0,
  isFull: 0,
  isAffix: 0,
  isKeepAlive: 1
});

// 表格操作 Hooks
// const { tableData, pageable, getTableList, handleSizeChange, handleCurrentChange } =
// 	useTable(getMenuList,initParam, false);

// 初始化请求
onMounted(() => getTableList());
onMounted(() => getMenuTreeList());

let tableData: any = ref([]);

// 获取table数据
const getTableList = async () => {
  let { data } = await getMenuList(initParam.value);
  tableData.value = data;
};

let treeList: any = ref([]);
// 获取菜单树
const getMenuTreeList = async () => {
  const res = await getMenuTree();
  const tree = [
    {
      value: "0",
      label: "根目录",
      children: res.data
    }
  ];
  treeList.value.push(tree);
};

// 监听页面 initParam 改化，重新获取表格数据
watch(() => initParam, getTableList, { deep: true });

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof MenuDrawer> | null>(null);
const openDrawer = (title: string, rowData: Partial<Menu.ReqAddMenuParams> = {}) => {
  const params = {
    title,
    treeList: treeList.value[0],
    isView: title === "查看",
    rowData: title != "新增" ? rowData : initAddParam.value,
    api: title === "新增" ? addMenu : title === "编辑" ? editMenu : undefined,
    getTableList: getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
