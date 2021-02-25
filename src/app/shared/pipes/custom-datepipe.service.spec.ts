import { TestBed } from '@angular/core/testing';

import { CustomDatepipeService } from './custom-datepipe.service';

describe('CustomDatepipeService', () => {
  let service: CustomDatepipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomDatepipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
