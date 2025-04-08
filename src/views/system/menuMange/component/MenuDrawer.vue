<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="450px"
    :title="`${drawerProps.title}菜单`"
  >
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.rowData"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="上级菜单" prop="parentId">
        <el-tree-select
          v-model="drawerProps.rowData!.parentId"
          :data="drawerProps.treeList"
          check-strictly
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="drawerProps.rowData!.type" @change="changeHandler">
          <el-radio label="m">主菜单</el-radio>
          <el-radio label="c">副菜单</el-radio>
          <el-radio label="v">副页面</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="菜单名称" prop="title">
        <el-input
          v-model="drawerProps.rowData!.title"
          placeholder="请填写菜单名称"
          clearable
        ></el-input>
      </el-form-item>

      <el-col :span="24" v-if="drawerProps.rowData!.type != 'v'">
        <el-form-item label="菜单图标" prop="icon">
          <SelectIcon v-model:iconValue="drawerProps.rowData!.icon" />
        </el-form-item>
      </el-col>

      <el-form-item label="路由名称" prop="name">
        <el-input
          v-model="drawerProps.rowData!.name"
          placeholder="请填写路由名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="路由地址" prop="path">
        <el-input
          v-model="drawerProps.rowData!.path"
          placeholder="请填写路由地址"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="组件路径" prop="component">
        <el-input
          v-model="drawerProps.rowData!.component"
          placeholder="请填写组件路径"
          clearable
        ></el-input>
      </el-form-item>

      <el-col :span="24" v-if="drawerProps.rowData!.type == 'm'">
        <el-form-item label="重定向地址" prop="redirect">
          <el-input
            v-model="drawerProps.rowData!.redirect"
            placeholder="请填写重定向地址"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="24" v-show="drawerProps.rowData!.type == 'v'">
        <el-form-item label="上级菜单" prop="activeMenu">
          <el-input
            v-model="drawerProps.rowData!.activeMenu"
            placeholder="请填写上级菜单地址"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>

      <el-form-item label="是否外链" prop="isLink">
        <el-input
          v-model="drawerProps.rowData!.isLink"
          placeholder="请填写外链地址"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="是否全屏" prop="isFull">
        <el-switch v-model="drawerProps.rowData!.isFull" :active-value="1" :inactive-value="0" />
      </el-form-item>

      <el-form-item label="是否固定" prop="isAffix">
        <el-switch v-model="drawerProps.rowData!.isAffix" :active-value="1" :inactive-value="0" />
      </el-form-item>

      <el-form-item label="是否隐藏" prop="isHide">
        <el-switch v-model="drawerProps.rowData!.isHide" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="是否缓存" prop="isKeepAlive">
        <el-switch
          v-model="drawerProps.rowData!.isKeepAlive"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="显示排序" prop="sort">
        <el-input
          v-model="drawerProps.rowData!.sort"
          placeholder="请填写排序"
          clearable
          type="number"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>
<script setup lang="ts" name="MenuDrawer">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { Menu } from '@/api/interface'
import SelectIcon from '@/components/SelectIcon/index.vue'

const rules = reactive({
  title: [{ required: true, message: '请填写菜单名称' }],
  name: [{ required: true, message: '请填写路由名称' }],
  path: [{ required: true, message: '请填写路由地址' }]
})

// 将number类型转换为string类型
const numberToString = (data: any) => {
  if (typeof data === 'number') {
    return data.toString()
  }
  return data
}

const changeHandler = (val: any) => {
  console.log(val)
}

interface DrawerProps {
  title: string
  isView: boolean
  rowData: Partial<Menu.ReqAddMenuParams>
  treeList: []
  api?: (params: any) => Promise<any>
  getTableList?: () => void
}
const drawerVisible = ref(false)
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: '',
  rowData: {},
  treeList: []
})
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  console.log(params)
  params.rowData.parentId = numberToString(params.rowData.parentId)
  drawerProps.value = params
  drawerVisible.value = true
}

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>()
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      await drawerProps.value.api!(drawerProps.value.rowData)
      ElMessage.success({ message: `${drawerProps.value.title}菜单成功！` })
      drawerProps.value.getTableList!()
      drawerVisible.value = false
      // 清空表单
      ruleFormRef.value!.resetFields()
    } catch (error) {
      console.log(error)
    }
  })
}

defineExpose({
  acceptParams
})
</script>
