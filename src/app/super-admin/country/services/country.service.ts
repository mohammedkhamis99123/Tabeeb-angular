import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetGeneric } from 'src/app/common/models/IGenericGet';
import { IGenericResponse } from 'src/app/common/models/IGenericReponse';
import { ICountry } from '../models/ICountry.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http:HttpClient) { }

   getAll(IGetGeneric:IGetGeneric):Observable<IGenericResponse<ICountry[]>>{
  
  
      let url=`${environment.ServerUrl}/Country?`;
       url+=IGetGeneric.Page==null ?'' :`Page=${IGetGeneric.Page}&`
      url+=IGetGeneric.PageSize==null ?'' :`PageSize=${IGetGeneric.PageSize}&`
      url+=IGetGeneric.SearchTerm==null ?'' :`SearchTerm=${encodeURIComponent(IGetGeneric.SearchTerm)}&`
      url+=IGetGeneric.SortBy==null ?'' :`SortBy=${IGetGeneric.SortBy}&`
      url+=IGetGeneric.SortOrder==null ?'' :`SortOrder=${IGetGeneric.SortOrder}&`
  
  
      return this.http.get<IGenericResponse<ICountry[]>>(url);
     }
  
     Add(ICountry:ICountry):Observable<IGenericResponse<any>>{
  
  
  return this.http.post<IGenericResponse<any>>(`${environment.ServerUrl}/Country`, ICountry);   }
     Update(ICountry:ICountry){
      return this.http.put<IGenericResponse<any>>(`${environment.ServerUrl}/Country`,ICountry)
  
     }
  
     Delete(id:number):Observable<IGenericResponse<any>>{
      return this.http.delete<IGenericResponse<any>>(`${environment.ServerUrl}/Country/${id}`)
  
     }
     GetByID(id:number):Observable<IGenericResponse<ICountry>>{
      return this.http.get<IGenericResponse<ICountry>>(`${environment.ServerUrl}/Country/${id}`)
  
     }
  
    Dropdown():Observable<any>{
    return this.http.get<any>(`${environment.ServerUrl}/Country/DropDown`)

    }
  
  
}
