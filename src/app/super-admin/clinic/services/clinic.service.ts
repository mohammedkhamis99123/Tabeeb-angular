import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGetClinic } from '../models/IGetClinic.model';
import { from, Observable } from 'rxjs';
import { IGenericResponse } from 'src/app/common/models/IGenericReponse';
import { IClinic } from '../models/IClinic.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

 constructor(private http:HttpClient) { }

  getAll(IGetGeneric:IGetClinic):Observable<IGenericResponse<IClinic[]>>{
    
    
        let url=`${environment.ServerUrl}/Clinic?`;
         url+=IGetGeneric.Page==null ?'' :`Page=${IGetGeneric.Page}&`
        url+=IGetGeneric.PageSize==null ?'' :`PageSize=${IGetGeneric.PageSize}&`
        url+=IGetGeneric.SearchTerm==null ?'' :`SearchTerm=${encodeURIComponent(IGetGeneric.SearchTerm)}&`
        url+=IGetGeneric.SortBy==null ?'' :`SortBy=${IGetGeneric.SortBy}&`
        url+=IGetGeneric.SortOrder==null ?'' :`SortOrder=${IGetGeneric.SortOrder}&`
        url+=IGetGeneric.cityId==null ?'' :`cityId=${IGetGeneric.cityId}&`
        url+=IGetGeneric.isActive==null ?'' :`isActive=${IGetGeneric.isActive}&`
        url+=IGetGeneric.subscriptionPackageId==null ?'' :`subscriptionPackageId=${IGetGeneric.subscriptionPackageId}&`
        url+=IGetGeneric.from==null ?'' :`from=${IGetGeneric.from}&`
        url+=IGetGeneric.to==null ?'' :`to=${IGetGeneric.to}&`



    
    
        return this.http.get<IGenericResponse<IClinic[]>>(url);
       }
    
       Add(IClinic:IClinic):Observable<IGenericResponse<any>>{
    
    
    return this.http.post<IGenericResponse<any>>(`${environment.ServerUrl}/Clinic`, IClinic);   }
       Update(IClinic:IClinic){
        return this.http.put<IGenericResponse<any>>(`${environment.ServerUrl}/Clinic`,IClinic)
    
       }
    
       Delete(id:number):Observable<IGenericResponse<any>>{
        return this.http.delete<IGenericResponse<any>>(`${environment.ServerUrl}/Clinic/${id}`)
    
       }
       GetByID(id:number):Observable<IGenericResponse<IClinic>>{
        return this.http.get<IGenericResponse<IClinic>>(`${environment.ServerUrl}/Clinic/${id}`)
    
       }
    
      Dropdown():Observable<any>{
      return this.http.get<any>(`${environment.ServerUrl}/Clinic/DropDown`)
  
      }

      UpdateImages(formdata:FormData):Observable<any>{
        
        return this.http.put<any>(`${environment.ServerUrl}/ClinicImage`,formdata,undefined)
      }
    
}

