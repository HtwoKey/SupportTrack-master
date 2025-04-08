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
export const addRole = (params: { roleName: string; roleValue: string }) => {
  return http.post(`/manage/role/add`, params);
};
// 编辑角色
export const editRole = (params: { id: string; roleName: string; roleValue: string }) => {
  return http.put(`/manage/role/edit`, params);
};
// 删除角色
export const deleteRole = (params: { id: string[] }) => {
  return http.delete(`/manage/role/delete`, params);
};
// 获取角色列表
export const getRoleListAll = () => {
  return http.get<Role.ResRoleList>(`/manage/role/list/all`);
};
