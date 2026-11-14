import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DoctorWorkTimeInfo, IDoctorWorkTime } from '../models/IDoctorWorkTime.model';

@Injectable({
    providedIn: 'root'
})
export class ClinicDoctorsService {

    private readonly baseUrl = `${environment.ServerUrl}ClinicDoctor`;

    constructor(private http: HttpClient) {}

    getClinicDoctors(clinicId: number): Observable<any> {
        return this.http.get<any>(
            `${this.baseUrl}/${clinicId}`
        );
    }

    addClinicDoctor(formData: FormData): Observable<any> {
        return this.http.post<any>(
            `${this.baseUrl}`,
            formData
        );
    }

    GetDoctorWorkTime(doctorId: number, clinicId: number) {
      var url=`${environment.ServerUrl}DoctorWorkTime`
    return this.http.get<IDoctorWorkTime[]>(
        url,
        {
            params: {
                DoctorID: doctorId,
                ClinicID: clinicId
            }
        }
    );
}

      UpdateDoctorWorkTime(request: any) {
        var url=`${environment.ServerUrl}DoctorWorkTime`
          return this.http.put(
              url,
              request
          );
      }

      GetById(id: number, clinicId: number) {
    return this.http.get<any>(
        `${this.baseUrl}/GetClinicDoctor/${id}/${clinicId}`
   
    );
}

UpdatClinicDoctor(data: FormData) {
    return this.http.put(
        `${this.baseUrl}`,
        data
    );
}
}