import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMovementDetailComponent } from './stock-movement-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { StockMovementService } from '../../service/stock-movement.service';

describe('StockMovementDetailComponent', () => {
  let component: StockMovementDetailComponent;
  let fixture: ComponentFixture<StockMovementDetailComponent>;
  let mockRouter: any = { events: { subscribe: jest.fn() }, createUrlTree: jest.fn(), serializeUrl: jest.fn(), navigate: jest.fn() };
  const mockActivatedRoute = {
    snapshot: { params: { id:123 } }
  };
  const mockStockMovementService = {
    getStockMovement: jest.fn().mockReturnValue(of({ id: 123, movementType: 'IN', quantity: 10, date: '2025-05-14' }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockMovementDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: StockMovementService, useValue: mockStockMovementService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockMovementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch stock movement on init', () => {
    component.ngOnInit();

    expect(mockStockMovementService.getStockMovement).toHaveBeenCalledWith(123);
    expect(component.stockMovement).toEqual({ id: 123, movementType: 'IN', quantity: 10, date: '2025-05-14' });
  });
  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component.destroy$, 'next');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
