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
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" >新增资源</el-button>
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
				<el-table-column prop="name" label="资源名称" width="180"  />
				<el-table-column prop="url" label="资源路径"  />
				<el-table-column prop="description" label="资源说明" width="180" />
				<el-table-column prop="categoryId" label="资源分类" width="180" align="center">
					<template #default="scope">
						<span>
							{{ categoryList.find(item => item.id === scope.row.categoryId)?.name }}
						</span>
					</template>
				</el-table-column>
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
						<el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑',scope.row)" >编辑</el-button>
						<el-button type="primary" link :icon="Delete" @click="deleteCategory(scope.row.id)" >删除</el-button>
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
			<ResourcesDrawer ref="drawerRef"/>
		</div>
	</div>
</template>

<script setup lang="ts" name="resource">
import { CirclePlus, Delete, Operation, Search, Refresh,EditPen } from "@element-plus/icons-vue";
import { ref, onMounted, watch } from "vue";
import { useTable } from "@/hooks/useTable";
import { useHandleData } from "@/hooks/useHandleData";
import { formatDate } from "@/utils/util";
import { Resources } from "@/api/interface";
import { ElTable } from "element-plus";
import { useSelection } from "@/hooks/useSelection";
import { getResourcesList, addResources, editResources,getAllResourcesCategoryList, delResources, batchDelResources } from "@/api/modules/resources";
import Pagination from "@/components/ProTable/components/Pagination.vue";
import ResourcesDrawer from "./ResourcesDrawer.vue";

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

const categoryList = ref<Resources.ResCategory[]>([]);

// 表格多选 Hooks
const { selectionChange, selectedListIds, isSelected } = useSelection(props.rowKey);
// 表格操作 Hooks
const { tableData, pageable, getTableList, handleSizeChange, handleCurrentChange } =
	useTable(getResourcesList, props.initParam, true, dataCallback);

// 初始化请求
onMounted(() => getTableList());
onMounted(() => getCategoryList());

// 监听页面 initParam 改化，重新获取表格数据
watch(() => props.initParam, getTableList, { deep: true });

// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection();

// 获取资源分类列表
const getCategoryList = async () => {
	const { data } = await getAllResourcesCategoryList();
	categoryList.value = data;
};

// 删除资源
const deleteCategory =async (id: string) => {
	await useHandleData(delResources, id, "删除分类");
	getTableList();
}
// 批量删除角色信息
const batchDelete = async (id: string[]) => {
	await useHandleData(batchDelResources, { id }, "删除所选资源信息");
	clearSelection();
	getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof ResourcesDrawer> | null>(null);
const openDrawer = (title: string, rowData: Partial<Resources.ResResourcesList> = {}) => {
	const params = {
		title,
		options: categoryList.value,
		isView: title === "查看",
		rowData: { ...rowData },
		api: title === "新增" ? addResources : title === "编辑" ? editResources : undefined,
		getTableList: getTableList
	};
	drawerRef.value?.acceptParams(params);
};
</script>