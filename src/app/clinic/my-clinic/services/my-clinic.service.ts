import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UpdateMyClinic } from '../models/UpdateMyClinic.model';

@Injectable({
  providedIn: 'root'
})
export class MyClinicService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.ServerUrl}Clinic`;

  getClinicById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }



  updateMyClinic(command: UpdateMyClinic): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateMyClinic`, command);
  }

UpdateImages(formData: FormData): Observable<any> {
  return this.http.put<any>(
    `${environment.ServerUrl}ClinicImage`,
    formData
  );
}

}