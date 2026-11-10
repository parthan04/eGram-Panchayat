import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasteCertificatepdfComponent } from './caste-certificatepdf.component';

describe('CasteCertificatepdfComponent', () => {
  let component: CasteCertificatepdfComponent;
  let fixture: ComponentFixture<CasteCertificatepdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CasteCertificatepdfComponent]
    });
    fixture = TestBed.createComponent(CasteCertificatepdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
