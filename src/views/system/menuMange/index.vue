<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="菜单列表"
      :indent="20"
      :columns="columns"
      :request-api="getTableList"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增菜单 </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ console.log(scope.row) }}
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deletePermission(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <MenuDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="menuMange">
import { ref, onMounted } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import { useHandleData } from "@/hooks/useHandleData";
// import authMenuList from "@/assets/json/authMenuList.json";
import ProTable from "@/components/ProTable/index.vue";
import { Menu } from "@/api/interface/index";
import { getMenuList, getMenuTree, addMenu, editMenu, deleteMenu } from "@/api/modules/menu";
import MenuDrawer from "./component/MenuDrawer.vue";

const proTable = ref();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
// const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.username && (newParams.username = "custom-" + newParams.username);
  return getMenuList(newParams);
};

// 初始化参数
const initAddParam = ref({
  parentId: "0",
  icon: "",
  type: "1",
  sort: 0,
  isHide: 0,
  isFull: 0,
  isAffix: 0,
  isKeepAlive: 1
});

// 表格配置项
const columns: ColumnProps<Menu.MenuList>[] = [
  { prop: "meta.title", label: "菜单名称", align: "left", search: { el: "input" } },
  { prop: "meta.icon", label: "菜单图标", width: 100 },
  { prop: "name", label: "路由名称", search: { el: "input" } },
  { prop: "path", label: "菜单路径", width: 200 },
  {
    prop: "component",
    label: "组件路径",
    width: 200
  },
  { prop: "permissionName", label: "资源名称" },
  { prop: "uri", label: "请求地址" },
  { prop: "method", label: "请求方法", width: 100 },
  { prop: "description", label: "资源描述" },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];

// 删除菜单
const deletePermission = async (params: Menu.MenuList) => {
  //console.log(params);
  await useHandleData(deleteMenu, params.id, `删除所选菜单`);
  proTable.value.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof MenuDrawer> | null>(null);
const treeList = ref<Menu.MenuTreeItem[]>([]);

// 初始化获取菜单列表
onMounted(async () => {
  const res = await getMenuTree();
  const rootTree: Menu.MenuTreeItem = {
    value: "0",
    label: "根目录",
    children: res.data
  };
  treeList.value.push(rootTree);
});
const openDrawer = (title: string, rowData: Partial<Menu.ReqMenuParams> = {}) => {
  const params = {
    title,
    treeList: treeList.value,
    isView: title === "查看",
    rowData: title != "新增" ? rowData : initAddParam.value,
    api: title === "新增" ? addMenu : title === "编辑" ? editMenu : undefined,
    getTableList: proTable.value.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
