<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}用户`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.rowData"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="用户头像" prop="avatar">
        <UploadImg
          v-model:image-url="drawerProps.rowData!.avatar"
          width="135px"
          height="135px"
          :file-size="3"
          border-radius="50%"
        >
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请上传头像</span>
          </template>
          <template #tip> 头像大小不能超过 3M </template>
        </UploadImg>
      </el-form-item>
      <el-form-item label="账号" prop="username">
        <el-input v-model="drawerProps.rowData!.username" placeholder="请填写用账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="drawerProps.rowData!.email" placeholder="请填写邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="fullName">
        <el-input v-model="drawerProps.rowData!.fullName" placeholder="请填写姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="drawerProps.rowData!.phone" placeholder="请填写手机号" clearable></el-input>
      </el-form-item>
      <!-- 角色 -->
      <el-form-item label="角色" prop="roles">
        <el-select v-model="drawerProps.rowData!.roles" placeholder="请选择角色" multiple>
          <el-option v-for="item in drawerProps.roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
            {{ item.roleName }}
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import { User, Role } from "@/api/interface";
import UploadImg from "@/components/Upload/Img.vue";

const rules = reactive({
  username: [{ required: true, message: "请填写用户姓名" }],
  email: [{ required: true, message: "请填写邮箱" }],
  fullName: [{ required: true, message: "请填写姓名" }],
  phone: [{ required: true, message: "请填写手机号" }],
  roles: [{ required: true, message: "请选择角色" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  rowData: Partial<User.ResUserList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  roleList: Role.ResRoleList[];
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  rowData: {},
  roleList: []
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

const props = defineProps<{
  roleList: Role.ResRoleList[];
}>();

onMounted(() => {
  console.log("角色列表:", props.roleList); // 检查数据是否正确传递
});

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
      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
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
