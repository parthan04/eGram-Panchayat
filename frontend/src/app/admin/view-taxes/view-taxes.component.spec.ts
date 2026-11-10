import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaxesComponent } from './view-taxes.component';

describe('ViewTaxesComponent', () => {
  let component: ViewTaxesComponent;
  let fixture: ComponentFixture<ViewTaxesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTaxesComponent]
    });
    fixture = TestBed.createComponent(ViewTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
