
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Roles } from 'src/app/common/enums/roles.enum';
import { IRolePermissionGroup } from './models/IRolePermissionGroup.model';
import { RolePermissionsService } from './services/role-permissions.service';
import { Permission } from 'src/app/common/enums/Permission.enum';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-role-permissions',
  templateUrl: './role-permission.component.html',
  styleUrl: './role-permission.component.css'
})
export class RolePermissionsComponent implements OnInit {

roles = Object.values(Roles).filter(
  role => role !== Roles.Admin && role !== Roles.SuperAdmin
);

  selectedRole: Roles | null = null;

  permissionGroups: IRolePermissionGroup[] = [];

  loading = false;
  saving = false;

  constructor(
    private rolePermissionsService: RolePermissionsService,
    protected translate:TranslateService
  ) {}

  ngOnInit(): void {
    this.buildPermissionGroups();

    if (this.roles.length > 0) {
      this.selectedRole = this.roles[0];
      this.loadRolePermissions();
    }
  }

  // Build all permission groups from the Permission enum
  private buildPermissionGroups(): void {

    const groupsConfig = [
      { title: 'General', prefixes: ['AllPermission'] },
      { title: 'Countries', prefixes: ['Country'] },
      { title: 'Cities', prefixes: ['City'] },
      { title: 'Clinics', prefixes: ['Clinic'] },
      { title: 'Clinic Doctors', prefixes: ['ClinicDoctors'] },
      { title: 'Clinic Images', prefixes: ['ClinicImages'] },
      { title: 'Employees', prefixes: ['Employee'] },
      { title: 'Customers', prefixes: ['Customer'] },
      { title: 'Doctors Work Time', prefixes: ['DoctorWorkTime'] },
      { title: 'Offers', prefixes: ['Offer'] },
      { title: 'Role Permissions', prefixes: ['RolePermissions'] },
      { title: 'Specializations', prefixes: ['Specialization'] },
      { title: 'Subscription Packages', prefixes: ['SubscriptionPackage'] },
      {
        title: 'Subscriptions',
        prefixes: [
          'Subscription',
          'CancelSubscription',
          'RenewSubscription',
          'ShowSubscriptionInvoice',
          'ShowSubscriptionHistory'
        ]
      }
    ];

    const allPermissions = Object.keys(Permission)
      .filter(key => isNaN(Number(key)))
      .map(key => ({
        id: Permission[key as keyof typeof Permission] as Permission,
        name: key
      }));

    this.permissionGroups = groupsConfig.map(group => {

      const permissions = allPermissions.filter(permission =>
        group.prefixes.some(prefix =>
          permission.name === prefix ||
          permission.name.includes(prefix)
        )
      );

      return {
        title: group.title,
        permissions: permissions.map(permission => ({
          ...permission,
          selected: false
        }))
      };
    }).filter(group => group.permissions.length > 0);
  }

  onRoleChange(): void {
    if (!this.selectedRole) {
      return;
    }

    this.loadRolePermissions();
  }

  loadRolePermissions(): void {

    if (!this.selectedRole) {
      return;
    }

    this.loading = true;

    this.clearAllPermissions();

    this.rolePermissionsService
      .getRolePermissions(this.selectedRole)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (result:any) => {

          var permissions=result.data
          const selectedIds = new Set(
            (permissions ?? []).map((id:any) => Number(id))
          );

          this.permissionGroups.forEach(group => {
            group.permissions.forEach(permission => {
              permission.selected = selectedIds.has(Number(permission.id));
            });
          });
        },
        error: error => {
          console.error('Error loading role permissions:', error);
          alert('Failed to load role permissions.');
        }
      });
  }

  toggleGroup(group: IRolePermissionGroup, checked: boolean): void {
    group.permissions.forEach(permission => {
      permission.selected = checked;
    });
  }

  toggleAll(checked: boolean): void {
    this.permissionGroups.forEach(group => {
      this.toggleGroup(group, checked);
    });
  }

  clearAllPermissions(): void {
    this.permissionGroups.forEach(group => {
      group.permissions.forEach(permission => {
        permission.selected = false;
      });
    });
  }

  isGroupSelected(group: IRolePermissionGroup): boolean {
    return group.permissions.length > 0 &&
      group.permissions.every(permission => permission.selected);
  }

  isGroupIndeterminate(group: IRolePermissionGroup): boolean {
    const selectedCount = group.permissions.filter(
      permission => permission.selected
    ).length;

    return selectedCount > 0 &&
      selectedCount < group.permissions.length;
  }

  get selectedPermissionsCount(): number {
    return this.permissionGroups.reduce(
      (total, group) =>
        total + group.permissions.filter(p => p.selected).length,
      0
    );
  }

  get totalPermissionsCount(): number {
    return this.permissionGroups.reduce(
      (total, group) => total + group.permissions.length,
      0
    );
  }

  savePermissions(): void {

    if (!this.selectedRole) {
      const toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            showCloseButton: true,
                            customClass: { popup: `color-danger` },
                          });
                  
                          toast.fire({
                            title: this.translate.instant("SelectRole"),
                          });
      return;
    }

    const selectedPermissions: Permission[] =
      this.permissionGroups.flatMap(group =>
        group.permissions
          .filter(permission => permission.selected)
          .map(permission => permission.id)
      );

    const request = {
      roleId: this.selectedRole,
      permissions: selectedPermissions
    };

    this.saving = true;

    this.rolePermissionsService
      .updateRolePermissions(request)
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: () => {
          const toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            showCloseButton: true,
                            customClass: { popup: `color-success` },
                          });
                  
                          toast.fire({
                            title: this.translate.instant("SavedSuccessfully"),
                          });
        },
        error: error => {
          console.error('Error updating role permissions:', error);
          alert('Failed to update role permissions.');
        }
      });
  }

  getGroupSelectedCount(group: IRolePermissionGroup): number {
  return group.permissions.filter(p => p.selected).length;
}
}
