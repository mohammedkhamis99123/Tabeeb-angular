import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin } from '../Models/Login.model';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { ILoginResult } from '../Models/LoginResult.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private HttpClient: HttpClient) {}

  Login(login: ILogin): Observable<ILoginResult> {
    return this.HttpClient.post<ILoginResult>(
      `${environment.ServerUrl}/Auth/Login`,
      JSON.stringify(login),
      { headers: this.headers }
    );
  }
  refreshToken(): Observable<ILoginResult> {
const refreshToken = sessionStorage.getItem('refreshtokenToken');  
  
    return this.HttpClient.post<ILoginResult>(
      `${environment.ServerUrl}/Auth/RefreshToken`,
  
      { refreshToken }
    );
  }


    Test(): Observable<any> {
    return this.HttpClient.get<ILoginResult>(
      `${environment.ServerUrl}/City`,
  
    );
  }
}