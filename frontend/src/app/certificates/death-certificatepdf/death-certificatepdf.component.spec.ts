import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeathCertificatepdfComponent } from './death-certificatepdf.component';

describe('DeathCertificatepdfComponent', () => {
  let component: DeathCertificatepdfComponent;
  let fixture: ComponentFixture<DeathCertificatepdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeathCertificatepdfComponent]
    });
    fixture = TestBed.createComponent(DeathCertificatepdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
