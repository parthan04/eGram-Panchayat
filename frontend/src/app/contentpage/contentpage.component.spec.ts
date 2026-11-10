import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentpageComponent } from './contentpage.component';

describe('ContentpageComponent', () => {
  let component: ContentpageComponent;
  let fixture: ComponentFixture<ContentpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentpageComponent]
    });
    fixture = TestBed.createComponent(ContentpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
