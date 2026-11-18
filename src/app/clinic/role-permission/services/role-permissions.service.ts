
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Permission } from 'src/app/common/enums/Permission.enum';
import { IUpdateRolePermissions } from '../models/IUpdateRolePermissions.model';


@Injectable({
  providedIn: 'root'
})
export class RolePermissionsService {

  private readonly apiUrl = `${environment.ServerUrl}RolePermissions`;

  constructor(private http: HttpClient) {}

  getRolePermissions(roleId: string): Observable<Permission[]> {
    const params = new HttpParams().set('RoleId', roleId);

    return this.http.get<Permission[]>(
      `${this.apiUrl}`,
      { params }
    );
  }

  updateRolePermissions(
    request: IUpdateRolePermissions
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}`,
      request
    );
  }
}
