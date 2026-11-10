import { TestBed } from '@angular/core/testing';

import { GramserviceService } from './gramservice.service';

describe('GramserviceService', () => {
  let service: GramserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GramserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
