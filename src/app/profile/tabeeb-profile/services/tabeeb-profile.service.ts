import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { TabeebProfileDto } from '../../clinic-profile/models/TabeebProfileDto.model';
import { IGenericResponse } from 'src/app/common/models/IGenericReponse';

@Injectable({
  providedIn: 'root'
})
export class TabeebProfileService {
  private http = inject(HttpClient);

  // عدّل الرابط حسب الـ Controller والـ Route عندك
  private readonly apiUrl = `${environment.ServerUrl}/Profile`;

  getTabeebProfileInfo(): Observable<IGenericResponse<TabeebProfileDto>> {
    return this.http.get<IGenericResponse<TabeebProfileDto>>(
      `${this.apiUrl}/TabeebProfile`
    );
  }
}