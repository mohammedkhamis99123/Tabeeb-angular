import { Permission } from "src/app/common/enums/Permission.enum";

export interface IUpdateRolePermissions {
  roleId: string;
  permissions: Permission[];
}