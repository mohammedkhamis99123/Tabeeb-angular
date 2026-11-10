import { TestBed } from '@angular/core/testing';

import { SupscriptionPackageService } from './supscription-package.service';

describe('SupscriptionPackageService', () => {
  let service: SupscriptionPackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupscriptionPackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
