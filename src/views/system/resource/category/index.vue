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
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" >新增分类</el-button>
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
			>
      <el-table-column prop="id" label="id" width="80" align="center" />
      <el-table-column prop="expand" label="expand" width="100" align="center" type="expand" >
        <template #default="scope">
          {{ scope.row }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="分类名称"  align="center" />
      <el-table-column prop="sort" label="排序"  align="center"/>
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
				<CategoryDrawer ref="drawerRef" />
    </div>
  </div>
</template>
<script setup lang="ts" name="resourcesCategory">
import { CirclePlus, Delete, Operation, Search, Refresh,EditPen } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import { getResourcesCategoryList,addResourcesCategory,editResourcesCategory,delResourcesCategory} from "@/api/modules/resources";
import { useTable } from "@/hooks/useTable";
import { useHandleData } from "@/hooks/useHandleData";
import { formatDate } from "@/utils/util";
import { Resources } from "@/api/interface";
import CategoryDrawer from "./CategoryDrawer.vue";

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

// 初始化请求
onMounted(() => getTableList());


// 表格操作 Hooks
const { tableData, pageable, getTableList, handleSizeChange, handleCurrentChange } =
	useTable(getResourcesCategoryList, props.initParam, true, dataCallback);

// 删除分类
const deleteCategory =async (id: string) => {
	await useHandleData(delResourcesCategory, id, "删除分类");
	getTableList();
}

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof CategoryDrawer> | null>(null);
const openDrawer = (title: string, rowData: Partial<Resources.ResCategory> = {}) => {
	const params = {
		title,
		isView: title === "查看",
		rowData: { ...rowData },
		api: title === "新增" ? addResourcesCategory : title === "编辑" ? editResourcesCategory : undefined,
		getTableList: getTableList
	};
	drawerRef.value?.acceptParams(params);
};


</script>