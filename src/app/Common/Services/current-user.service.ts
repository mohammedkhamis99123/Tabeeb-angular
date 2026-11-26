import { Injectable } from '@angular/core';
import { Permission } from '../enums/Permission.enum';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  constructor() { }

  hasAnyPermissionOf(permissions: Permission[]): boolean {

      if (sessionStorage.getItem("Roles")=="SuperAdmin")
            return true;

      
    const permissionStr = sessionStorage.getItem("Permissions");
    if (!permissionStr) return false;
    

    try {
      const userPermissions: any[] = permissionStr.split(',').map((e)=> parseInt(e));

      if(userPermissions.includes(1))
        return true
      // استخدام some بدلاً من filter لأننا بنبحث عن مطابقة واحدة على الأقل
      return userPermissions.some((p: any) => permissions.includes(p));
    } catch (error) {
      console.error("Error parsing permissions from sessionStorage", error);
      return false;
    }
  }

  GetClinics(): any[] {
    const clinicsStr = sessionStorage.getItem("Clinics");
    if (!clinicsStr) return [];

    try {
      return JSON.parse(clinicsStr);
    } catch (error) {
      console.error("Error parsing clinics from sessionStorage", error);
      return [];
    }
  }

  GetRole(): string | null {
    // تم التعديل لتجلب الـ Role الحقيقي وليس الـ Clinics
    return sessionStorage.getItem("Role");
  }
}