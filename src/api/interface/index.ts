// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    access_token: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    email: string;
    fullName: string;
    phone: string;
    avatar: string;
    isActive: boolean;
  }
  export interface ResUserList {
    userId: string;
    username: string;
    email: string;
    fullName: string;
    phone: string;
    avatar: string;
    isActive: boolean;
    createdAt: string;
    lastLogin: string;
    roles: number[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
}
//* 角色管理模块
export namespace Role {
  export interface ReqRoleParams extends ReqPage {
    roleId: string;
    roleName: string;
    description: string;
  }
  export interface ResRoleList {
    roleId: number;
    roleName: string;
    description: string;
    createdAt: string;
  }
}

// * 菜单管理模块
export namespace Menu {
  export interface MenuQueryParams extends ReqPage {
    id: string;
    name: string;
    title: string;
    isHide: number;
    permissionName: string;
  }

  export interface MenuList {
    id: string;
    name: string;
    path: string;
    component?: string | (() => Promise<unknown>);
    redirect?: string;
    meta: MetaProps;
    permissionName: string;
    uri: string;
    method: string;
    description: string;
    children?: MenuList[];
  }

  export interface MetaProps {
    icon: string;
    title: string;
    activeMenu?: string;
    isLink?: number;
    isHide: number;
    isFull: number;
    isAffix: number;
    isKeepAlive: number;
  }

  export interface ReqMenuParams {
    id: string;
    parentId: string;
    name: string;
    component: string;
    path: string;
    type: string;
    redirect: string;
    sort: number;
    title: string;
    icon: string;
    activeMenu: string;
    isLink: string;
    isHide: number;
    isFull: number;
    isAffix: number;
    isKeepAlive: number;
    permissionName: string;
    uri: string;
    method: string;
    description: string;
  }
  export interface MenuTreeItem {
    value: string;
    label: string;
    children?: MenuTreeItem[];
  }
}

// * 资源管理模块
export namespace Resources {
  export interface ReqResourcesParams extends ReqPage {
    id: string;
    name: string;
    url: string;
    categoryId: string;
  }
  export interface ResResourcesList {
    id: string;
    name: string;
    url: string;
    categoryId: string;
    description: string;
    createTime: string;
  }
  export interface ResCategory {
    id: string;
    name: string;
    sort: number;
    createTime: string;
  }
}

// * 权限管理模块
export namespace Permission {
  export interface ReqPermissionParams extends ReqPage {
    id: string;
    name: string;
    value: string;
  }
  export interface ResPermissionList {
    id: string;
    pid: string;
    name: string;
    value: string;
    uri: string;
    description: string;
    sort: number;
    createTime: string;
  }
}

// * 系统操作日志
export namespace Log {
  export interface ReqOperationLogParams extends ReqPage {
    id: string;
    username: string;
    url: string;
    method: string;
    startTime: string;
    endTime: string;
  }
  export interface ResOperationLogList {
    id: string;
    userId: string;
    username: string;
    ip: string;
    url: string;
    method: string;
    params: string;
    userAgent: string;
    createTime: string;
  }
}

export namespace LoginLog {
  export interface ReqLoginLogParams extends ReqPage {
    userId: string;
    startTime: string;
    endTime: string;
  }
  export interface ResLoginLogList {
    id: string;
    userId: string;
    ip: string;
    address: string;
    userAgent: string;
    createTime: string;
  }
}

export namespace DictType {
  export interface ReqDictTypeParams extends ReqPage {
    name: string;
    status: string;
    startTime: string;
    endTime: string;
  }
  export interface ResDictType {
    id: string;
    name: string;
    status: string;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
    note: string;
  }
}

export namespace DictData {
  export interface ReqDictDataParams extends ReqPage {
    dictTypeId: string;
    label: string;
    status: string;
    startTime: string;
    endTime: string;
  }
  export interface ResDictData {
    id: string;
    dictTypeId: string;
    parentId: string;
    label: string;
    value: string;
    sort: string;
    cssClass: string;
    listClass: string;
    isDefault: string;
    status: string;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
    note: string;
  }
}
