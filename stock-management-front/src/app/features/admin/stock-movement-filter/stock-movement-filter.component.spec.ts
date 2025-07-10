import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMovementFilterComponent } from './stock-movement-filter.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ProductService } from '../../inventory/products/services/product.service';
import { AdminService } from '../services/admin.service';
import { SessionService } from '../../../core/services/session.service';
import { StockMovementService } from '../../inventory/stock-movement/service/stock-movement.service';

describe('StockMovementFilterComponent', () => {
  let component: StockMovementFilterComponent;
  let fixture: ComponentFixture<StockMovementFilterComponent>;
  const mockProductService = {
    getProducts: jest.fn().mockReturnValue(of([{ id: 1, name: 'Product 1' }]))
  };

  const mockAdminService = {
    getUsersByGroupId: jest.fn().mockReturnValue(of([{ id: 1, firstname: 'User 1' }]))
  };

  const mockSessionService = {
    getUser$: jest.fn().mockReturnValue(of({ id: 1, groupId: 2 }))
  };

  const mockStockMovementService = {
    getHistory: jest.fn().mockReturnValue(of([{ id: 1, productId: 1, userId: 1, movementType: 'IN' }]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockMovementFilterComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: mockProductService },
        { provide: AdminService, useValue: mockAdminService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: StockMovementService, useValue: mockStockMovementService }

      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockMovementFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load user data on init', () => {
    component.getAuthUser();
    
    expect(component.userId).toBe(1);
    expect(component.groupId).toBe(2);
  });
  it('should fetch stock movements on form submission', () => {
    component.groupId = 2;
    component.filterForm.setValue({
      userId: 1,
      productId: 1,
      startDate: '2023-01-01',
      endDate: '2023-01-31'
    });

    component.onSubmit();

    expect(mockStockMovementService.getHistory).toHaveBeenCalledWith({
      userId: 1,
      productId: 1,
      startDate: '2023-01-01',
      endDate: '2023-01-31',
      groupId: 2
    });
  });
  it('should reset form filters', () => {
    component.filterForm.setValue({
      userId: 1,
      productId: 1,
      startDate: '2023-01-01',
      endDate: '2023-01-31'
    });

    component.onReset();

    expect(component.filterForm.value).toEqual({
      userId: null,
      productId: null,
      startDate: null,
      endDate: null
    });
  });
  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component.destroy$, 'next');
    
    component.ngOnDestroy();
    
    expect(spy).toHaveBeenCalled();
  });
});
