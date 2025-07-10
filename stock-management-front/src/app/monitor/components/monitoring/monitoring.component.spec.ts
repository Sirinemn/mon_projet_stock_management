import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringComponent } from './monitoring.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MonitoringService } from '../../service/monitoring.service';

describe('MonitoringComponent', () => {
  let component: MonitoringComponent;
  let fixture: ComponentFixture<MonitoringComponent>;
  const mockMonitoringService = {
    getHealth: jest.fn().mockReturnValue(of({ status: 'UP', details: {} })),
    getInfo: jest.fn().mockReturnValue(of({ appVersion: '1.0.0' }))
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoringComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MonitoringService, useValue: mockMonitoringService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch health and info data on init', () => {
    component.ngOnInit();

    expect(mockMonitoringService.getHealth).toHaveBeenCalled();
    expect(mockMonitoringService.getInfo).toHaveBeenCalled();
    expect(component.healthData?.status).toBe('UP');
    expect(component.infoData?.appVersion).toBe('1.0.0');
  });
});
