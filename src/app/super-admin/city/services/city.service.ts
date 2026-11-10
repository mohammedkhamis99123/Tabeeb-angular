import { Injectable } from '@angular/core';
import { IGetGeneric } from 'src/app/Common/Models/IGenericGet';
import { ICity } from '../models/Icity.model';
import { Observable } from 'rxjs';
import { IGenericResponse } from 'src/app/Common/Models/IGenericReponse';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { IGetCity } from '../models/IGetCity.model';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http:HttpClient) { }

  getAll(IGetGeneric:IGetCity):Observable<IGenericResponse<ICity[]>>{
    
    
        let url=`${environment.ServerUrl}/City?`;
         url+=IGetGeneric.Page==null ?'' :`Page=${IGetGeneric.Page}&`
        url+=IGetGeneric.PageSize==null ?'' :`PageSize=${IGetGeneric.PageSize}&`
        url+=IGetGeneric.SearchTerm==null ?'' :`SearchTerm=${encodeURIComponent(IGetGeneric.SearchTerm)}&`
        url+=IGetGeneric.SortBy==null ?'' :`SortBy=${IGetGeneric.SortBy}&`
        url+=IGetGeneric.SortOrder==null ?'' :`SortOrder=${IGetGeneric.SortOrder}&`
        url+=IGetGeneric.countryId==null ?'' :`countryId=${IGetGeneric.countryId}&`
        url+=IGetGeneric.isActive==null ?'' :`isActive=${IGetGeneric.isActive}&`

    
    
        return this.http.get<IGenericResponse<ICity[]>>(url);
       }
    
       Add(ICity:ICity):Observable<IGenericResponse<any>>{
    
    
    return this.http.post<IGenericResponse<any>>(`${environment.ServerUrl}/City`, ICity);   }
       Update(ICity:ICity){
        return this.http.put<IGenericResponse<any>>(`${environment.ServerUrl}/City`,ICity)
    
       }
    
       Delete(id:number):Observable<IGenericResponse<any>>{
        return this.http.delete<IGenericResponse<any>>(`${environment.ServerUrl}/City/${id}`)
    
       }
       GetByID(id:number):Observable<IGenericResponse<ICity>>{
        return this.http.get<IGenericResponse<ICity>>(`${environment.ServerUrl}/City/${id}`)
    
       }
    
      Dropdown():Observable<any>{
      return this.http.get<any>(`${environment.ServerUrl}/City/DropDown`)
  
      }
    
}
