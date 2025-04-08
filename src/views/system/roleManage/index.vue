<template>
	<div class="table-box">
		<!-- 查询表单 -->
		<div class="table-search">
		</div>
		<!-- 表格内容 -->
		<div class="card table-main">
				<!-- 表格头部 操作按钮  -->
				<div class="table-header">
					<div class="header-button-lf">
						<el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" >新增角色</el-button>
						<el-button type="danger" :icon="Delete" plain @click="batchDelete(selectedListIds)" :disabled="!isSelected">批量删除用户</el-button>
					</div>
				<div class="header-button-ri">
					<div name="toolButton">
						<el-button :icon="Refresh" circle @click="getTableList" />
						<el-button :icon="Printer" circle />
						<el-button :icon="Operation" circle  />
						<el-button :icon="Search" />
					</div>
				</div>
			</div>
			<el-table
				ref="tableRef"
				v-bind="$attrs"
				:data="tableData"
				:border= true
				:row-key="rowKey"
				@selection-change="selectionChange"
			>
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column prop="id" label="id" width="80" align="center" />
				<el-table-column prop="expand" label="expand" width="80" align="center" type="expand" >
					<template #default="scope">
						{{ scope.row }}
					</template>
				</el-table-column>
				<el-table-column prop="name" label="角色名称" width="180" align="center" />
				<el-table-column prop="adminCount" label="分配角色数量" width="180" align="center"/>
				<el-table-column prop="description" label="描述" width="180" align="center" />
				<el-table-column prop="status" label="角色状态" width="180" align="center" >
					<template #default="scope">
						<el-switch
								v-model = scope.row.status
								:active-text = showStatus(scope.row.status)
								:active-value= 1
								:inactive-value= 0
								@change = changeStatus(scope.row)
							/>
					</template>
				</el-table-column>
				<el-table-column prop="sort" label="排序" align="center" />
				<el-table-column prop="createTime" label="创建时间" width="200" align="center">
					<template #default="scope">
						<span>
							{{ formatDate(scope.row.createTime)}}
						</span>
					</template>
				</el-table-column>
				// 操作列
				<el-table-column label="操作" width="330" fixed="right" align="center">
					<!-- 表格操作 -->
					<template #default="scope">
						<el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑',scope.row)">编辑</el-button>
						<el-button type="primary" link :icon="HelpFilled"  >资源</el-button>
						<el-button type="primary" link :icon="Lock"  >权限</el-button>
						<el-button type="primary" link :icon="Menu" @click="openMenuDrawer(scope.row)" >菜单</el-button>
						<el-button type="primary" link :icon="Delete" @click="deleteRoles(scope.row.id)" >删除</el-button>
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
			<Pagination
				v-if="true"
				:pageable="pageable"
				:handleSizeChange="handleSizeChange"
				:handleCurrentChange="handleCurrentChange"
			/>
			<RoleDrawer ref="drawerRef" />
			<MenuDrawer ref="menuDrawerRef"/>
		</div>
	</div>
</template>
<script setup lang="ts" name="roleTable">
import { ref, watch,onMounted } from "vue";
import { ElTable } from "element-plus";
import { CirclePlus, Delete,Lock,Menu,HelpFilled, Printer, Operation, Search, Refresh,EditPen } from "@element-plus/icons-vue";
import { useSelection } from "@/hooks/useSelection";
import { useTable } from "@/hooks/useTable";
import { useHandleData } from "@/hooks/useHandleData";
import { getRoleList,addRole,editRole,setRoleStatus,deleteRole,batchDeleteRole,setRoleMenu} from "@/api/modules/role";
import type { Role } from "@/api/interface";
import Pagination from "@/components/ProTable/components/Pagination.vue";
import { formatDate } from "@/utils/util";
import RoleDrawer from "./component/RoleDrawer.vue"
import MenuDrawer from "./component/MenuDrawer.vue";
import PermissionDrawer from "./component/PermissionDrawer.vue";

const tableRef = ref<InstanceType<typeof ElTable>>();

const props = defineProps<{
	rowKey: string;
	initParam: any;
}>();

const dataCallback = (data: any) => {
	return {
		list: data.list,
		total: data.total,
		pageNum: data.pageNum,
		pageSize: data.pageSize
	};
};

const showStatus = (status: number) => {
	return status == 1 ? "启用" : "禁用";
};


// 表格多选 Hooks
const { selectionChange, selectedListIds, isSelected } = useSelection(props.rowKey);
// 表格操作 Hooks
const { tableData, pageable, getTableList, handleSizeChange, handleCurrentChange } =
	useTable(getRoleList, props.initParam, true, dataCallback);

// 初始化请求
onMounted(() => getTableList());

// 监听页面 initParam 改化，重新获取表格数据
watch(() => props.initParam, getTableList, { deep: true });


// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof RoleDrawer> | null>(null);
const openDrawer = (title: string, rowData: Partial<Role.ResRoleList> = {}) => {
	const params = {
		title,
		isView: title === "查看",
		rowData: { ...rowData },
		api: title === "新增" ? addRole : title === "编辑" ? editRole : undefined,
		getTableList: getTableList
	};
	drawerRef.value?.acceptParams(params);
};


// 菜单设置
const menuDrawerRef = ref<InstanceType<typeof MenuDrawer> | null>(null);
const openMenuDrawer = (rowData: Partial<Role.ResRoleList> = {}) => {
	console.log("111")
	const params = {
		rowData: { ...rowData },
		api: setRoleMenu,
		getTableList: getTableList
	};
	menuDrawerRef.value?.acceptParams(params);
};

// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection();


// 切换角色状态
const changeStatus = async (row: Role.ResRoleList) => {
	await useHandleData(setRoleStatus, { id: row.id, status: row.status }, `切换【${row.name}】角色状态`);
	getTableList();
};

// 删除角色
const deleteRoles = async (id: number) => {
	await useHandleData(deleteRole, id, "删除角色信息");
	getTableList();
};


// 批量删除角色信息
const batchDelete = async (id: string[]) => {
	await useHandleData(batchDeleteRole, { id }, "删除所选角色信息");
	clearSelection();
	getTableList();
};
</script>

