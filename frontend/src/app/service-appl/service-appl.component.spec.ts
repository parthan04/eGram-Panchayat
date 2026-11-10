import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceApplComponent } from './service-appl.component';

describe('ServiceApplComponent', () => {
  let component: ServiceApplComponent;
  let fixture: ComponentFixture<ServiceApplComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceApplComponent]
    });
    fixture = TestBed.createComponent(ServiceApplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
