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
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" >新增权限</el-button>
					<el-button type="danger" :icon="Delete" plain @click="batchDelete(selectedListIds)" :disabled="!isSelected">批量删除</el-button>
        </div>
        <div class="header-button-ri">
          <div name="toolButton">
            <el-button :icon="Refresh" circle @click="getTableList" />
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
				<el-table-column prop="expand" label="expand" width="100" align="center" type="expand" >
					<template #default="scope">
						{{ scope.row }}
					</template>
				</el-table-column>
        <el-table-column prop="name" label="权限名称"  align="center" />
        <el-table-column prop="value" label="权限值"  align="center" />
        <el-table-column prop="uri" label="对应api" width="300" align="center" />
        <el-table-column prop="sort" label="排序" width="100" align="center" />
        <el-table-column prop="description" label="描述" width="200" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="200" align="center" >
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        // 操作列
				<el-table-column label="操作" width="330" fixed="right" align="center">
					<!-- 表格操作 -->
					<template #default="scope">
						<el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑',scope.row)" >编辑</el-button>
						<el-button type="primary" link :icon="Delete" @click="deletePermission(scope.row.id)" >删除</el-button>
					</template>
				</el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
					v-if="true"
        :pageable="pageable"
        :handleSizeChange="handleSizeChange"
        :handleCurrentChange="handleCurrentChange"
      />
      <!-- 抽屉 -->
      <PermissionDrawer ref="drawerRef"/>
    </div>
  </div>
</template>
<script setup lang="ts" name="permission">
import { CirclePlus, Delete, Operation, Search, Refresh,EditPen } from "@element-plus/icons-vue";
import { ref, onMounted, watch } from "vue";
import { useTable } from "@/hooks/useTable";
import { useHandleData } from "@/hooks/useHandleData";
import { formatDate } from "@/utils/util";
import { Permission} from "@/api/interface";
import { ElTable } from "element-plus";
import { useSelection } from "@/hooks/useSelection";
import { getPermissionList, addPermission,editPermission,delPermission,batchDelPermission } from "@/api/modules/permission";
import Pagination from "@/components/ProTable/components/Pagination.vue";
import PermissionDrawer from "./components/PermissionDrawer.vue";

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

// 表格多选 Hooks
const { selectionChange, selectedListIds, isSelected } = useSelection(props.rowKey);
// 表格操作 Hooks
const { tableData, pageable, getTableList, handleSizeChange, handleCurrentChange } =
	useTable(getPermissionList, props.initParam, true, dataCallback);

// 初始化请求
onMounted(() => getTableList());

// 监听页面 initParam 改化，重新获取表格数据
watch(() => props.initParam, getTableList, { deep: true });

// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection();

// 删除
const deletePermission = async (id: string) => {
  await useHandleData(delPermission, id , "删除权限");
  getTableList();
};

// 批量删除
const batchDelete = async (id: string[]) => {
	await useHandleData(batchDelPermission, { id }, "删除所选权限");
	clearSelection();
	getTableList();
};


const drawerRef = ref<InstanceType<typeof PermissionDrawer> | null>(null);
// 打开抽屉
const openDrawer = (title: string, rowData: Partial<Permission.ResPermissionList> = {}) => {
  const params = {
		title,
		isView: title === "查看",
		rowData: { ...rowData },
		api: title === "新增" ? addPermission : title === "编辑" ? editPermission : undefined,
		getTableList: getTableList
	};
	drawerRef.value?.acceptParams(params);
};
</script>