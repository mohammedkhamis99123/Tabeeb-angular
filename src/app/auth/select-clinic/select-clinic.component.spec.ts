import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectClinicComponent } from './select-clinic.component';

describe('SelectClinicComponent', () => {
  let component: SelectClinicComponent;
  let fixture: ComponentFixture<SelectClinicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectClinicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectClinicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
