<template>
  <div class="table-box">
		<!-- 查询表单 -->
		
      <div class="card table-search">
        <el-form ref="formRef" :model="searchParam">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-form-item label="用户id">
                <el-input v-model="searchParam.userId" placeholder="请输入用户id" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="操作时间">
                <el-date-picker
                  v-model="value1"
                  type="datetimerange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  @change="changeDate"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <div class="operation">
                <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
                <el-button :icon="Delete" @click="reset">重置</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

		<!-- 表格内容 -->
		<div class="card table-main">
      <!-- 表格头部 操作按钮  -->
      <div class="table-header">
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
				<el-table-column prop="userId" label="用户id" width="100" align="center"/>
        <el-table-column prop="ip" label="IP地址" width="180" align="center" />
        <el-table-column prop="address" label="地址" width="200" align="center" />
        <el-table-column prop="userAgent" label="UA标识"  show-overflow-tooltip/>
				<el-table-column prop="createTime" label="操作时间" width="200" align="center">
					<template #default="scope">
						<span>
							{{ formatDate(scope.row.createTime)}}
						</span>
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
			
		</div>
	</div>
</template>
<script setup lang="ts" name="LoginLog">
import { Operation, Search, Refresh,Delete } from "@element-plus/icons-vue";
import { ref, onMounted,  } from 'vue'
import { useTable } from '@/hooks/useTable'
import { formatDate } from '@/utils/util'
import { getLoginLogList } from "@/api/modules/Log";
import type {LoginLog} from "@/api/interface/index";
import { ElTable } from 'element-plus'
import Pagination from "@/components/ProTable/components/Pagination.vue";
const tableRef = ref<InstanceType<typeof ElTable>>();

const props = defineProps<{
	rowKey: string;
	initParam: Partial<LoginLog.ReqLoginLogParams>;
}>();

const value1 = ref('')

const dataCallback = (data: any) => {
	return {
		list: data.list,
		total: data.total,
		pageNum: data.pageNum,
		pageSize: data.pageSize
	};
};

const changeDate = (data: any) => {
  searchParam.value.startTime = data[0]
  searchParam.value.endTime = data[1]
}


// 表格操作 Hooks
const { tableData, pageable,searchParam, getTableList, handleSizeChange, handleCurrentChange,reset,search } =
	useTable(getLoginLogList, props.initParam, true, dataCallback);

// 初始化请求
onMounted(() => getTableList());
</script>