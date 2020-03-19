import { TestBed } from '@angular/core/testing';

import { WeatherBoardService } from './weather-board.service';

describe('WeatherBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeatherBoardService = TestBed.get(WeatherBoardService);
    expect(service).toBeTruthy();
  });
});
