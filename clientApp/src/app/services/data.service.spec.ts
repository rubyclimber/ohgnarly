import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService],
      imports: [HttpClientModule]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  it('should retrieve messages', inject([DataService], (service: DataService) => {
    service.messageSearch('03/18/2017').subscribe(messages => {
      expect(messages.length).toBeTruthy();
    });
  }));
});
