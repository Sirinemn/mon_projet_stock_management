import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMovementListComponent } from './stock-movement-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { StockMovementService } from '../../service/stock-movement.service';
import { SessionService } from '../../../../../core/services/session.service';
import { AuthStateService } from '../../../../../core/services/auth-state.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('StockMovementListComponent', () => {
  let component: StockMovementListComponent;
  let fixture: ComponentFixture<StockMovementListComponent>;
  let mockRouter: any = { events: { subscribe: jest.fn() }, createUrlTree: jest.fn(), serializeUrl: jest.fn() };
  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue('mockValue') } }
  };
  const mockStockMovementService = {
    getStockMovementsByGroup: jest.fn().mockReturnValue(of([{ id: 1, productName: 'Product A', quantity: 10, createdAt: '2025-05-14' }])),
    deleteStockMovement: jest.fn().mockReturnValue(of({ message: 'Stock movement deleted successfully' }))
  };
  const mockSessionService = {
    getUser$: jest.fn().mockReturnValue(of({ id: 1, groupId: 2 }))
  };
  const mockAuthStateService = {
    getIsAdmin: jest.fn().mockReturnValue(of(true))
  };
  const mockDialog = {
    open: jest.fn().mockReturnValue({ afterClosed: () => of(true) })
  };
  const mockSnackBar = {
    open: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockMovementListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: StockMovementService, useValue: mockStockMovementService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: AuthStateService, useValue: mockAuthStateService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },

      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockMovementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch user data', () => {
    component.getUser();

    expect(mockSessionService.getUser$).toHaveBeenCalled();
    expect(component.groupId).toBe(2);
  });
  it('should load stock movements successfully', () => {
    component.loadStockMovements();

    expect(mockStockMovementService.getStockMovementsByGroup).toHaveBeenCalledWith(2);
    expect(component.movements.length).toBe(1);
  });
  it('should delete stock movement when confirmed', () => {
    jest.spyOn(mockDialog, 'open').mockReturnValue({ afterClosed: () => of(true) } as any);

    component.deleteProduct(1);

    expect(mockStockMovementService.deleteStockMovement).toHaveBeenCalledWith(1);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Stock movement deleted successfully', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
  });
  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component.destroy$, 'next');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
