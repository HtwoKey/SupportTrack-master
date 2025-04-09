import { ResPage, Role } from "@/api/interface/index";
import http from "@/api";

/**
 * @name 角色模块
 */
// 获取角色列表
export const getRoleList = (params: Role.ReqRoleParams) => {
  return http.get<ResPage<Role.ResRoleList>>(`/manage/role/list`, params);
};
// 新增角色
export const addRole = (params: { roleName: string }) => {
  return http.post(`/manage/role/add`, params);
};
// 编辑角色
export const editRole = (params: { roleId: string; roleName: string }) => {
  return http.put(`/manage/role/update`, params);
};
// 删除角色
export const deleteRole = (roleId: String) => {
  return http.delete(`/manage/role/delete/` + roleId);
};
// 批量删除角色
export const batchDeleteRole = (params: { id: string[] }) => {
  return http.delete(`/manage/role/delete/batch`, params);
};
// 获取角色列表
export const getRoleListAll = () => {
  return http.get<Role.ResRoleList>(`/manage/role/list/all`);
};
