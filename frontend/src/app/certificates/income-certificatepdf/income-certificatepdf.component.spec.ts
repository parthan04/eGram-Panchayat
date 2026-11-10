import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeCertificatepdfComponent } from './income-certificatepdf.component';

describe('IncomeCertificatepdfComponent', () => {
  let component: IncomeCertificatepdfComponent;
  let fixture: ComponentFixture<IncomeCertificatepdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeCertificatepdfComponent]
    });
    fixture = TestBed.createComponent(IncomeCertificatepdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
