import { Injectable } from '@angular/core';
import { IGetSupscriptionPackage } from '../models/IGetSupscriptionPackage.model';
import { Observable } from 'rxjs';
import { IGenericResponse } from 'src/app/common/models/IGenericReponse';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ISubscriptionPackage } from '../models/ISupscriptionPackage.model';

@Injectable({
  providedIn: 'root'
})
export class SupscriptionPackageService {

constructor(private http:HttpClient) { }

  getAll(IGetGeneric:IGetSupscriptionPackage):Observable<IGenericResponse<ISubscriptionPackage[]>>{
    
    
        let url=`${environment.ServerUrl}/SubscriptionPackage?`;
         url+=IGetGeneric.Page==null ?'' :`Page=${IGetGeneric.Page}&`
        url+=IGetGeneric.PageSize==null ?'' :`PageSize=${IGetGeneric.PageSize}&`
        url+=IGetGeneric.SearchTerm==null ?'' :`SearchTerm=${encodeURIComponent(IGetGeneric.SearchTerm)}&`
        url+=IGetGeneric.SortBy==null ?'' :`SortBy=${IGetGeneric.SortBy}&`
        url+=IGetGeneric.SortOrder==null ?'' :`SortOrder=${IGetGeneric.SortOrder}&`
        url+=IGetGeneric.isActive==null ?'' :`isActive=${IGetGeneric.isActive}&`

    
    
        return this.http.get<IGenericResponse<ISubscriptionPackage[]>>(url);
       }
    
       Add(ISupscriptionPackage:ISubscriptionPackage):Observable<IGenericResponse<any>>{
    
    
    return this.http.post<IGenericResponse<any>>(`${environment.ServerUrl}/SubscriptionPackage`, ISupscriptionPackage);   }
       Update(ISupscriptionPackage:ISubscriptionPackage){
        return this.http.put<IGenericResponse<any>>(`${environment.ServerUrl}/SubscriptionPackage`,ISupscriptionPackage)
    
       }
    
       Delete(id:number):Observable<IGenericResponse<any>>{
        return this.http.delete<IGenericResponse<any>>(`${environment.ServerUrl}/SubscriptionPackage/${id}`)
    
       }
       GetByID(id:number):Observable<IGenericResponse<ISubscriptionPackage>>{
        return this.http.get<IGenericResponse<ISubscriptionPackage>>(`${environment.ServerUrl}/SubscriptionPackage/${id}`)
    
       }
    
      Dropdown():Observable<any>{
      return this.http.get<any>(`${environment.ServerUrl}/SubscriptionPackage/DropDown`)
  
      }
    
}

