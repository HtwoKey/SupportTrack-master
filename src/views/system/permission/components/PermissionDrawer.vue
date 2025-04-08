<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}权限`">
		<el-form
			ref="ruleFormRef"
			label-width="100px"
			label-suffix=" :"
			:rules="rules"
			:disabled="drawerProps.isView"
			:model="drawerProps.rowData"
			:hide-required-asterisk="drawerProps.isView"
		>
			<el-form-item label="权限名称" prop="name">
				<el-input v-model="drawerProps.rowData!.name" placeholder="请填写权限名称" clearable></el-input>
			</el-form-item>
      <el-form-item label="权限值" prop="value">
        <el-select v-model="drawerProps.rowData!.value" placeholder="请填写权限值">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
			</el-form-item>
      <el-form-item label="权限路径" prop="uri">
				<el-input v-model="drawerProps.rowData!.uri" placeholder="请填写权限路径" clearable></el-input>
			</el-form-item>
			<el-form-item label="权限描述" prop="description">
				<el-input v-model="drawerProps.rowData!.description" type="textarea" placeholder="请填写权限描述" clearable></el-input>
			</el-form-item>
      <el-form-item label="权限排序" prop="sort">
        <el-input v-model="drawerProps.rowData!.sort" placeholder="请填写权限排序" clearable></el-input>
      </el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>
<script setup lang="ts" name="PermissionDrawer">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import type { Permission } from "@/api/interface";

const rules = reactive({
	name: [{ required: true, message: "请填写资源名称" }],
	uri: [{ required: true, message: "请填写资源路径" }],
  value: [{ required: true, message: "请填写资源值" }],
  sort: [{ required: true, message: "请填写资源排序" }]
});

const options = reactive( [
  {
    label: "查询",
    value: "query"
  },
  {
    label: "新增",
    value: "add"
  },
  {
    label: "修改",
    value: "edit"
  },
  {
    label: "删除",
    value: "delete"
  }
])

interface DrawerProps {
	title: string;
	isView: boolean;
  rowData: Partial<Permission.ResPermissionList>;
	api?: (params: any) => Promise<any>;
	getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
	isView: false,
	title: "",
  rowData: {}
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
			ElMessage.success({ message: `${drawerProps.value.title}权限成功！` });
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
