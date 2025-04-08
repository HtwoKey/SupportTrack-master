<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}资源`">
		<el-form
			ref="ruleFormRef"
			label-width="100px"
			label-suffix=" :"
			:rules="rules"
			:disabled="drawerProps.isView"
			:model="drawerProps.rowData"
			:hide-required-asterisk="drawerProps.isView"
		>
			<el-form-item label="资源名称" prop="name">
				<el-input v-model="drawerProps.rowData!.name" placeholder="请填写资源名称" clearable></el-input>
			</el-form-item>
      <el-form-item label="资源路径" prop="url">
				<el-input v-model="drawerProps.rowData!.url" placeholder="请填写资源路径" clearable></el-input>
			</el-form-item>
      <el-form-item label="资源分类" prop="categoryId">
				<el-select v-model="drawerProps.rowData!.categoryId" placeholder="请选择资源分类">
          <el-option
            v-for="item in drawerProps.options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
			</el-form-item>
			<el-form-item label="资源描述" prop="description">
				<el-input v-model="drawerProps.rowData!.description" type="textarea" placeholder="请填写资源描述" clearable></el-input>
			</el-form-item>
      
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>
<script setup lang="ts" name="ResourcesDrawer">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import type { Resources } from "@/api/interface";

const rules = reactive({
	name: [{ required: true, message: "请填写资源名称" }],
	url: [{ required: true, message: "请填写资源路径" }],
	categoryId: [{ required: true, message: "请选择资源分类" }]
});

interface DrawerProps {
	title: string;
	isView: boolean;
  rowData: Partial<Resources.ResResourcesList>;
  options: any[];
	api?: (params: any) => Promise<any>;
	getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
	isView: false,
	title: "",
  rowData: {},
  options: []
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
	drawerProps.value = params;
	drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
	ruleFormRef.value!.validate(async valid => {
		if (!valid) return;
		try {
			await drawerProps.value.api!(drawerProps.value.rowData);
			ElMessage.success({ message: `${drawerProps.value.title}资源成功！` });
			drawerProps.value.getTableList!();
			drawerVisible.value = false;
		} catch (error) {
			console.log(error);
		}
	});
};

defineExpose({
	acceptParams
});
</script>
