import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IGetSubscription } from '../models/IGetSubscription.model';
import { ISubscription } from '../models/ISubscription.model';
import { Observable } from 'rxjs';
import { IGenericResponse } from 'src/app/common/models/IGenericReponse';
import { JsonPipe } from '@angular/common';
import { IRenewSubscription } from '../models/IRenewSubscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = `${environment.ServerUrl}Subscription`;

  constructor(private http: HttpClient) {}

  GetAll(IGetSubscription: IGetSubscription):Observable<IGenericResponse<ISubscription[]>> {
       let url=`${environment.ServerUrl}Subscription?`;
           url+=IGetSubscription.Page==null ?'' :`Page=${IGetSubscription.Page}&`
          url+=IGetSubscription.PageSize==null ?'' :`PageSize=${IGetSubscription.PageSize}&`
          url+=IGetSubscription.SearchTerm==null ?'' :`SearchTerm=${encodeURIComponent(IGetSubscription.SearchTerm)}&`
          url+=IGetSubscription.SortBy==null ?'' :`SortBy=${IGetSubscription.SortBy}&`
          url+=IGetSubscription.SortOrder==null ?'' :`SortOrder=${IGetSubscription.SortOrder}&`
          url+=IGetSubscription.clinicId==null ?'' :`ClinicId=${IGetSubscription.clinicId}&`
          url+=IGetSubscription.status==null ?'' :`Status=${IGetSubscription.status}&`
          url+=IGetSubscription.packageId==null ?'' :`PackageId=${IGetSubscription.packageId}&`

          return this.http.get<IGenericResponse<ISubscription[]>>(url);
  }



  Create(data: ISubscription):Observable<any> {
    return this.http.post(`${this.apiUrl}/Create`, data);
  }

  Renew(data: IRenewSubscription) {
    return this.http.post(`${this.apiUrl}/Renew`, data);
  }

  Cancel(clinicId: number) {
    return this.http.post(`${this.apiUrl}/Cancel`, { id: clinicId });
  }

downloadInvoice(invoiceNumber: string): Observable<any> {
  let url = `${environment.ServerUrl}Subscription/GetInvoice/${invoiceNumber}`; 
    return this.http.get(url);
}

getSubscriptionHistory(id:number){
   let url = `${environment.ServerUrl}Subscription/${id}`;
    return this.http.get(url);
}
}