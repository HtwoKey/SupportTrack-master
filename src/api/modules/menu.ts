import { Menu } from "@/api/interface/index";
import http from "@/api";

/**
 * 菜单管理模块
 */
// 获取用户列表
export const getMenuList = (params: Menu.MenuQueryParams) => {
  return http.get<Menu.MenuList[]>(`/manage/permission/list`, params);
  //return http.get<Menu.MenuList>(PORT1 + `/user/list`, params);
};

// * 新增菜单
export const addMenu = (params: Menu.ReqMenuParams) => {
  return http.post(`/manage/permission/add`, params);
};

// * 编辑菜单
export const editMenu = (params: Menu.ReqMenuParams) => {
  return http.put(`/manage/permission/update`, params);
};

// * 删除菜单
export const deleteMenu = (id: string) => {
  console.log(id);
  return http.delete(`/manage/permission/delete/` + id);
};

// * 获取菜单树
export const getMenuTree = () => {
  return http.get<Menu.MenuTreeItem[]>(`/manage/permission/tree`);
};
