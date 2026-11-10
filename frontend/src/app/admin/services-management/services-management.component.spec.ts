import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesManagementComponent } from './services-management.component';

describe('ServicesManagementComponent', () => {
  let component: ServicesManagementComponent;
  let fixture: ComponentFixture<ServicesManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicesManagementComponent]
    });
    fixture = TestBed.createComponent(ServicesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
