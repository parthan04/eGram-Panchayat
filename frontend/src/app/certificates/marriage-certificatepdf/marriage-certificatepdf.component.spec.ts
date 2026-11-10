import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriageCertificatepdfComponent } from './marriage-certificatepdf.component';

describe('MarriageCertificatepdfComponent', () => {
  let component: MarriageCertificatepdfComponent;
  let fixture: ComponentFixture<MarriageCertificatepdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarriageCertificatepdfComponent]
    });
    fixture = TestBed.createComponent(MarriageCertificatepdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
