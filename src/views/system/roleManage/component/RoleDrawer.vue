<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}角色`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.rowData"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="drawerProps.rowData!.roleName" placeholder="请填写角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="drawerProps.rowData!.description" placeholder="请填写角色描述" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="RoleDrawer">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import type { Role } from "@/api/interface";

const rules = reactive({
  roleName: [{ required: true, message: "请填写角色名" }],
  description: [{ required: true, message: "请填写角色描述" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  rowData: Partial<Role.ResRoleList>;
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
      if (drawerProps.value.api) {
        await drawerProps.value.api(drawerProps.value.rowData);
      } else {
        console.warn("API function is not provided.");
      }
      ElMessage.success({ message: `${drawerProps.value.title}角色成功！` });
      if (drawerProps.value.getTableList) {
        drawerProps.value.getTableList();
      } else {
        console.warn("getTableList function is not provided.");
      }
      drawerVisible.value = false;
    } catch (error) {
      console.error(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
