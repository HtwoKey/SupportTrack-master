<template>
	<div>
		<el-drawer v-model="drawerVisible" size="450px" title="分配菜单">
			<el-row class="mb-4">
				<el-button type="primary" @click="allChecked" >全选</el-button>
				<el-button type="primary" @click="resetChecked" >重置</el-button>
			</el-row>
			<el-row class="mb-4">
				<el-tree
					ref="menuTreeRef"
					:data="menuData"
					show-checkbox
					node-key="value"
					:default-checked-keys="roleMenuData"
					:props="defaultProps"
				/>
			</el-row>
			<template #footer>
				<el-button @click="drawerVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmit">确定</el-button>
			</template>
		</el-drawer>
	</div>
</template>

<script setup lang="ts" name="MenuDrawer">
import { ref,onMounted,reactive } from "vue";
import { ElMessage } from "element-plus";
import type { ElTree } from "element-plus";
import type { Role } from "@/api/interface";
import { getMenuTree } from "@/api/modules/menu"
import { getRoleMenu } from "@/api/modules/role"
import type { Menu } from "@/api/interface/index";

const menuTreeRef = ref<InstanceType<typeof ElTree>>()

interface DrawerProps {
	rowData: Partial<Role.ResRoleList>;
	api?: (params: any) => Promise<any>;
	getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
	rowData: {}
});


const defaultProps = {
  children: 'children',
  label: 'label',
}

const menuData = ref<Menu.MenuTreeItem[]>([]);
const roleMenuData = ref<any[]>([]);

const loadMenuTree = async () =>{
	const { data } = await getMenuTree();
	menuData.value = data;
}

const loadRoleMenu = async () => {
	const { data } = await getRoleMenu(drawerProps.value.rowData.id)
	roleMenuData.value = data;
}

const state = reactive({
	menuData: [],
	selectNode: [],
})
const resetChecked = () => {
  menuTreeRef.value!.setCheckedKeys([], false)
}
const allChecked = () => {
	menuTreeRef.value!.setCheckedNodes(state.menuData)
}


// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
	drawerProps.value = params;
	drawerVisible.value = true;
	loadRoleMenu();
	loadMenuTree();
};

// 提交数据（新增/编辑）
const handleSubmit = () => {
	
};

defineExpose({
	acceptParams
});
</script>