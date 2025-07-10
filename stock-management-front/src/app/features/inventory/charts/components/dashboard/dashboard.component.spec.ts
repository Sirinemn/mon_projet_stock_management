import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ChartHttpService } from '../../services/chart-http.service';
import { SessionService } from '../../../../../core/services/session.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const mockChartHttpService = {
    getLineChartData: jest.fn().mockReturnValue(of([{ name: 'Stock Flow', series: [{ date: '2023-01-01', value: 100 }] }])),
    getPieChartData: jest.fn().mockReturnValue(of([{ productName: 'Product A', quantity: 50 }]))
  };

  const mockSessionService = {
    getUser$: jest.fn().mockReturnValue(of({ id: 1, groupId: 2 }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ChartHttpService, useValue: mockChartHttpService },
        { provide: SessionService, useValue: mockSessionService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch user data and set groupId', () => {
    component.getUser();

    expect(mockSessionService.getUser$).toHaveBeenCalled();
    expect(component.groupId).toBe(2);
  });
  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component.destroy$, 'next');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
