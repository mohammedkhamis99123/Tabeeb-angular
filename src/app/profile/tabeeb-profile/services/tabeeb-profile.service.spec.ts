import { TestBed } from '@angular/core/testing';

import { TabeebProfileService } from './tabeeb-profile.service';

describe('TabeebProfileService', () => {
  let service: TabeebProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabeebProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
