import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { IGetGeneric } from 'src/app/common/models/IGenericGet';
import { IGenericResponse } from 'src/app/common/models/IGenericReponse';
import { ICustomer } from '../models/ICustomer.model';
import { IUpdateCustomer } from '../models/IUpdateCustomer.model';



@Injectable({
    providedIn: 'root'
})
export class CustomersService {

    private readonly apiUrl = `${environment.ServerUrl}Customer`;

    constructor(private http: HttpClient) {}

    // Get Customers
    getCustomers(
        request: IGetGeneric
    ): Observable<IGenericResponse<ICustomer[]>> {

        let url = `${this.apiUrl}?`;

        url += request.Page == null ? '' : `Page=${request.Page}&`;
        url += request.PageSize == null ? '' : `PageSize=${request.PageSize}&`;

        url += !request.SearchTerm
            ? ''
            : `SearchTerm=${encodeURIComponent(request.SearchTerm)}&`;

        url += request.SortBy == null ? '' : `SortBy=${request.SortBy}&`;
        url += request.SortOrder == null ? '' : `SortOrder=${request.SortOrder}&`;

        return this.http.get<IGenericResponse<ICustomer[]>>(url);
    }

    // Add Customer
    addCustomer(request: ICustomer): Observable<any> {
        return this.http.post<any>(this.apiUrl, request);
    }

    // Update Medical File
    updateCustomer(request: IUpdateCustomer): Observable<any> {
        return this.http.put<any>(this.apiUrl, request);
    }
}