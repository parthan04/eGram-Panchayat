import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeathCertificateComponent } from './death-certificate.component';

describe('DeathCertificateComponent', () => {
  let component: DeathCertificateComponent;
  let fixture: ComponentFixture<DeathCertificateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeathCertificateComponent]
    });
    fixture = TestBed.createComponent(DeathCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
