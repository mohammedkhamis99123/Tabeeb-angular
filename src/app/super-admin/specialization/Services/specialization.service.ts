import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetGeneric } from 'src/app/Common/Models/IGenericGet';
import { IGenericResponse } from 'src/app/Common/Models/IGenericReponse';
import { environment } from 'src/environments/environment.prod';
import { ISpecialization } from '../Models/ISpecialization';

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {

  constructor(private http:HttpClient) { 


  }

  getAll(IGetGeneric:IGetGeneric):Observable<IGenericResponse<ISpecialization[]>>{


    let url=`${environment.ServerUrl}/Specialization?`;
     url+=IGetGeneric.Page==null ?'' :`Page=${IGetGeneric.Page}&`
    url+=IGetGeneric.PageSize==null ?'' :`PageSize=${IGetGeneric.PageSize}&`
    url+=IGetGeneric.SearchTerm==null ?'' :`SearchTerm=${encodeURIComponent(IGetGeneric.SearchTerm)}&`
    url+=IGetGeneric.SortBy==null ?'' :`SortBy=${IGetGeneric.SortBy}&`
    url+=IGetGeneric.SortOrder==null ?'' :`SortOrder=${IGetGeneric.SortOrder}&`


    return this.http.get<IGenericResponse<ISpecialization[]>>(url);
   }

   Add(ISpecialization:ISpecialization):Observable<IGenericResponse<any>>{


return this.http.post<IGenericResponse<any>>(`${environment.ServerUrl}/Specialization`, ISpecialization);   }
   Update(ISpecialization:ISpecialization){
    return this.http.put<IGenericResponse<any>>(`${environment.ServerUrl}/Specialization`,ISpecialization)

   }

   Delete(id:number):Observable<IGenericResponse<any>>{
    return this.http.delete<IGenericResponse<any>>(`${environment.ServerUrl}/Specialization/${id}`)

   }
   GetByID(id:number):Observable<IGenericResponse<ISpecialization>>{
    return this.http.get<IGenericResponse<ISpecialization>>(`${environment.ServerUrl}/Specialization/${id}`)

   }


}
