import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupscriptionPackageComponent } from './supscription-package.component';

describe('SupscriptionPackageComponent', () => {
  let component: SupscriptionPackageComponent;
  let fixture: ComponentFixture<SupscriptionPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupscriptionPackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupscriptionPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
