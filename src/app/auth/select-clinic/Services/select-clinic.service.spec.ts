import { TestBed } from '@angular/core/testing';

import { SelectClinicService } from './select-clinic.service';

describe('SelectClinicService', () => {
  let service: SelectClinicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectClinicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
