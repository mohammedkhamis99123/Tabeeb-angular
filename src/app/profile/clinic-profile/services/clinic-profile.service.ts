import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClinicProfileDto } from '../models/ClinicProfileDto.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ClinicProfileService {
  // عدّل الـ baseUrl حسب إعدادات الـ environment عندك
  private readonly apiUrl = `${environment.ServerUrl}/Profile/ClinicProfile`;

  constructor(private http: HttpClient) {}

  getClinicProfile(id: number): Observable<ClinicProfileDto> {
    const params = new HttpParams().set('id', id.toString());
    // لو الـ endpoint بتاعك route parameter مثل /api/clinic-profile/{id} استخدم:
    // return this.http.get<ClinicProfileDto>(`${this.baseUrl}/${id}`);
    return this.http.get<ClinicProfileDto>(`${this.apiUrl}/${id}`);
  }
}