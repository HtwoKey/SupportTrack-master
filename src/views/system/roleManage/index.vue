<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :data-callback="dataCallback" row-key="roleId">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除角色
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Menu" @click="openMenuDrawer(scope.row)">分配菜单</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteRoles(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <RoleDrawer ref="drawerRef" />
    <!-- <MenuDrawer ref="menuDrawerRef" /> -->
  </div>
</template>
<script setup lang="tsx" name="roleTable">
import { ref } from "vue";
import { CirclePlus, Delete, Menu, EditPen } from "@element-plus/icons-vue";
import { useHandleData } from "@/hooks/useHandleData";
import { getRoleList, addRole, editRole, deleteRole, batchDeleteRole } from "@/api/modules/role";
import type { Role } from "@/api/interface";
import { formatDate } from "@/utils/util";
import RoleDrawer from "./component/RoleDrawer.vue";
//import MenuDrawer from "./component/MenuDrawer.vue";
import ProTable from "@/components/ProTable/index.vue";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.username && (newParams.username = "custom-" + newParams.username);
  return getRoleList(newParams);
};

// 表格配置项
const columns: ColumnProps<Role.ResRoleList>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { type: "index", label: "Id", width: 80 },
  { type: "expand", label: "Expand", width: 100 },
  {
    prop: "roleName",
    label: "角色名称",
    search: { el: "input", key: "keyword", span: 1 }
  },
  { prop: "description", label: "描述" },
  {
    prop: "createdAt",
    label: "创建时间",
    render: scope => {
      return <span>{formatDate(scope.row.createdAt)}</span>;
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
];

// 删除角色
const deleteRoles = async (row: Role.ResRoleList) => {
  await useHandleData(deleteRole, row.roleId, `删除所选角色`);
  proTable.value?.getTableList();
};

// 批量删除角色信息
const batchDelete = async (id: string[]) => {
  // 重新设置 id为 ids=1&ids=2&ids=3
  const ids = id.join(",");
  await useHandleData(batchDeleteRole, { ids }, "删除所选角色信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof RoleDrawer> | null>(null);
const openDrawer = (title: string, rowData: Partial<Role.ResRoleList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    rowData: { ...rowData },
    api: title === "新增" ? addRole : title === "编辑" ? editRole : undefined,
    getTableList: proTable.value.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 菜单设置
// const menuDrawerRef = ref<InstanceType<typeof MenuDrawer> | null>(null);
// const openMenuDrawer = (rowData: Partial<Role.ResRoleList> = {}) => {
//   console.log("111");
//   const params = {
//     rowData: { ...rowData },
//     api: setRoleMenu,
//     getTableList: getTableList
//   };
//   menuDrawerRef.value?.acceptParams(params);
// };
</script>
