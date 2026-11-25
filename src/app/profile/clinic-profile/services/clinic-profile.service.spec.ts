import { TestBed } from '@angular/core/testing';

import { ClinicProfileService } from './clinic-profile.service';

describe('ClinicProfileService', () => {
  let service: ClinicProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
