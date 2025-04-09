<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :data-callback="dataCallback">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
        <el-button type="danger" :icon="Delete" plain @click="batchDelete(scope.selectedListIds)" :disabled="!scope.isSelected">
          批量删除用户
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, onMounted } from "vue";
import type { User, Role } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";

import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "./components/UserDrawer.vue";
import { CirclePlus, Delete, EditPen, View, Refresh } from "@element-plus/icons-vue";
import { getUserList, deleteUser, editUser, addUser, changeUserStatus, resetUserPassWord } from "@/api/modules/user";
import { getRoleListAll } from "@/api/modules/role";
import { formatDate } from "@/utils/util";

const userStatus = [
  { userLabel: "启用", userStatus: true },
  { userLabel: "禁用", userStatus: false }
];

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
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

const getRoleList = async () => {
  const { data } = await getRoleListAll();
  return data;
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.username && (newParams.username = "custom-" + newParams.username);
  return getUserList(newParams);
};

// 表格配置项
const columns: ColumnProps<User.ResUserList>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { type: "index", label: "id", width: 80 },
  { type: "expand", label: "Expand", width: 100 },
  {
    prop: "username",
    label: "账号",
    search: { el: "input", key: "keyword", span: 1 }
  },
  { prop: "fullName", label: "姓名" },
  { prop: "email", label: "邮箱" },
  { prop: "phone", label: "电话" },
  {
    prop: "status",
    label: "状态",
    enum: userStatus,
    search: { el: "tree-select", props: { filterable: false }, span: 1 },
    fieldNames: { label: "userLabel", value: "userStatus" },
    render: scope => {
      return (
        <el-switch
          model-value={scope.row.isActive}
          active-text={"启用"}
          inactive-text={"禁用"}
          active-value={true}
          inactive-value={false}
          onClick={() => changeStatus(scope.row)}
        />
      );
    }
  },
  {
    prop: "lastLogin",
    label: "最后登录时间",
    width: 180,
    render: scope => {
      return <span>{formatDate(scope.row.lastLogin)}</span>;
    }
  },
  {
    prop: "createdAt",
    label: "创建时间",
    width: 180,
    render: scope => {
      return <span>{formatDate(scope.row.createdAt)}</span>;
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
];

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteUser, { id: [params.userId] }, `删除【${params.username}】用户`);
  proTable.value.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteUser, { id }, "删除所选用户信息");
  proTable.value.clearSelection();
  proTable.value.getTableList();
};

// 重置用户密码
const resetPass = async (row: User.ResUserList) => {
  await useHandleData(resetUserPassWord, { userId: row.userId }, `重置【${row.username}】用户密码`);
  proTable.value.getTableList();
};

// 切换用户状态
const changeStatus = async (row: User.ResUserList) => {
  await useHandleData(
    changeUserStatus,
    { userId: row.userId, isActive: row.isActive == true ? false : true },
    `切换【${row.username}】用户状态`
  );
  proTable.value.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const roleList = ref<Role.ResRoleList[]>([]);

// 初始化获取角色列表
onMounted(async () => {
  roleList.value = await getRoleList();
});
const openDrawer = (title: string, rowData: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    rowData: { ...rowData },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value.getTableList,
    roleList: roleList.value
  };
  drawerRef.value?.acceptParams(params);
};
</script>
