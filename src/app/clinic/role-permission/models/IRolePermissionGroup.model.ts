import { Permission } from "src/app/common/enums/Permission.enum";

export interface IRolePermissionGroup {
  title: string;
  permissions: {
    id: Permission;
    name: string;
    selected: boolean;
  }[];
}