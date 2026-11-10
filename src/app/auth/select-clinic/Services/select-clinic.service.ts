import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ILoginResult } from '../../login/Models/LoginResult.model';

@Injectable({
  providedIn: 'root'
})
export class SelectClinicService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private http:HttpClient) { 

   
  }
   SelectClinic(Id:number):Observable<ILoginResult>{
    var body={
      ClinicId:Id
    }
    return this.http.post<ILoginResult>(`${environment.ServerUrl}/Auth/SelectClinic`,JSON.stringify(body),{headers:this.headers})
   }
}
