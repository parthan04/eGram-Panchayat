import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriageCertificateComponent } from './marriage-certificate.component';

describe('MarriageCertificateComponent', () => {
  let component: MarriageCertificateComponent;
  let fixture: ComponentFixture<MarriageCertificateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarriageCertificateComponent]
    });
    fixture = TestBed.createComponent(MarriageCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
