import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabeebProfileComponent } from './tabeeb-profile.component';

describe('TabeebProfileComponent', () => {
  let component: TabeebProfileComponent;
  let fixture: ComponentFixture<TabeebProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabeebProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabeebProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
