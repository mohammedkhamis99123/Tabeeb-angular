import { TestBed } from '@angular/core/testing';

import { MyClinicService } from './my-clinic.service';

describe('MyClinicService', () => {
  let service: MyClinicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyClinicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
