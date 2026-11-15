
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IGetOffers } from '../models/IGetOffers.model';
import { IGenericResponse } from 'src/app/common/models/IGenericReponse';
import { IOffer } from '../models/IOffer.model';


@Injectable({
    providedIn: 'root'
})
export class OffersService {

    private readonly apiUrl = `${environment.ServerUrl}Offer`;

    constructor(private http: HttpClient) {}

    getOffers(get:IGetOffers): Observable<IGenericResponse<IOffer[]>> {

       let url=`${environment.ServerUrl}Offer?`;
            url+=get.Page==null ?'' :`Page=${get.Page}&`
            url+=get.PageSize==null ?'' :`PageSize=${get.PageSize}&`
            url+=!get.SearchTerm ?'' :`SearchTerm=${encodeURIComponent(get.SearchTerm)}&`
            url+=get.SortBy==null ?'' :`SortBy=${get.SortBy}&`
            url+=get.SortOrder==null ?'' :`SortOrder=${get.SortOrder}&`
            url+=get.isActive==null ?'' :`isActive=${get.isActive}&`
            url+=get.from==null ?'' :`from=${get.from}&`
            url+=get.to==null ?'' :`to=${get.to}&`

        return this.http.get<any>(url);
    }

    addOffer(request: IOffer): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}`,
            request
        );
    }
    updateOffer(request: IOffer): Observable<any> {
    return this.http.put<any>(
        `${this.apiUrl}`,
        request
    );
}

deleteOffer(id: number): Observable<any> {
    return this.http.delete<any>(
        `${this.apiUrl}/${id}`
    );
}
    getDoctors(): Observable<any> {
        return this.http.get<any>(
            `${environment.ServerUrl}/ClinicDoctor/GetClinicDoctors`
        );
    }
}
