import { TestBed } from '@angular/core/testing';

import { ClinicDoctorService } from './clinic-doctor.service';

describe('ClinicDoctorService', () => {
  let service: ClinicDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
