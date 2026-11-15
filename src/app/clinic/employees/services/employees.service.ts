import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IGenericResponse } from 'src/app/common/models/IGenericReponse';
import { IEmployee } from '../models/IEmployee.model';
import { IGetEmployee } from '../models/IGetEmployee.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeesService {

    private readonly apiUrl = `${environment.ServerUrl}Employee`;

    constructor(private http: HttpClient) {}

    getEmployees(get: IGetEmployee): Observable<IGenericResponse<IEmployee[]>> {
        let url = `${this.apiUrl}?`;
        url += get.Page == null ? '' : `Page=${get.Page}&`;
        url += get.PageSize == null ? '' : `PageSize=${get.PageSize}&`;
        url += !get.SearchTerm ? '' : `SearchTerm=${encodeURIComponent(get.SearchTerm)}&`;
        url += get.SortBy == null ? '' : `SortBy=${get.SortBy}&`;
        url += get.SortOrder == null ? '' : `SortOrder=${get.SortOrder}&`;
        url += get.isActive == null ? '' : `IsActive=${get.isActive}&`;

        return this.http.get<any>(url);
    }

    addEmployee(request: FormData): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}`,
            request
        );
    }

    updateEmployee(request: FormData): Observable<any> {
        return this.http.put<any>(
            `${this.apiUrl}`,
            request
        );
    }

    getById(id: number): Observable<IEmployee> {
        return this.http.get<IEmployee>(
            `${this.apiUrl}/${id}`
        );
    }

    getRoles(): Observable<any> {
        return this.http.get<any>(
            `${environment.ServerUrl}/Role/GetRoles`
        );
    }
}