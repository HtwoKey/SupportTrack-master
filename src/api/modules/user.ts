import { ResPage, User } from "@/api/interface/index";
import http from "@/api";

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserList = (params: User.ReqUserParams) => {
  return http.get<ResPage<User.ResUserList>>(`/manage/user/list`, params);
};

// 新增用户
export const addUser = (params: { id: string }) => {
  return http.post(`/manage/user/add`, params);
};

// 编辑用户
export const editUser = (params: { id: string }) => {
  return http.put(`/manage/user/update`, params);
};

// 删除用户
export const deleteUser = (params: { id: string[] }) => {
  return http.delete(`/manage/user/delete/` + params.id);
};

// 切换用户状态
export const changeUserStatus = (params: { userId: string; isActive: boolean }) => {
  return http.put(`/manage/user/changeStatus`, params);
};

// 重置用户密码
export const resetUserPassWord = (params: { userId: string }) => {
  return http.put(`/manage/user/restPassword`, params);
};
