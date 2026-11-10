import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthCertificatepdfComponent } from './birth-certificatepdf.component';

describe('BirthCertificatepdfComponent', () => {
  let component: BirthCertificatepdfComponent;
  let fixture: ComponentFixture<BirthCertificatepdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BirthCertificatepdfComponent]
    });
    fixture = TestBed.createComponent(BirthCertificatepdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
