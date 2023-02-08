import { TestBed } from '@angular/core/testing';

import { ReadingDataService } from './reading-data.service';

describe('ReadingDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReadingDataService = TestBed.get(ReadingDataService);
    expect(service).toBeTruthy();
  });
});
