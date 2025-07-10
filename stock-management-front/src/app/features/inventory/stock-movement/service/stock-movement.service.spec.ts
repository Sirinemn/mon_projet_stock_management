import { TestBed } from '@angular/core/testing';

import { StockMovementService } from './stock-movement.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StockMovement } from '../../models/stockmovement';

describe('StockMovementService', () => {
  let service: StockMovementService;
  let httpMock: HttpTestingController;
  const mockMovement: StockMovement = { id: 1, type: 'SORTIE', quantity: 10, productId: 1, groupId: 1, userId: 1, createdDate: '', userName: '', productName: '' };


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting() 
      ]
    });
    service = TestBed.inject(StockMovementService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should send a POST request to add a stock movement', () => {
    service.addStockMovement(mockMovement).subscribe(response => {
      expect(response).toEqual({ message: 'Stock movement added successfully' });
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/movement`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockMovement);
    req.flush({ message: 'Stock movement added successfully' });
  });
  it('should fetch a single stock movement by ID', () => {
    service.getStockMovement(1).subscribe(movement => {
      expect(movement).toEqual(mockMovement);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/movement/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovement);
  });
  it('should send a PUT request to update a stock movement', () => {
    service.updateStockMovement(1, mockMovement).subscribe(response => {
      expect(response).toEqual({ message: 'Stock movement updated successfully' });
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/movement/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockMovement);
    req.flush({ message: 'Stock movement updated successfully' });
  });
  it('should send a DELETE request to remove a stock movement', () => {
    service.deleteStockMovement(1).subscribe();

    const req = httpMock.expectOne(`${service['apiUrl']}/movement/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
  it('should fetch stock movements history with filters', () => {
  const mockMovements: StockMovement[] = [mockMovement];
    const filters = { userId: 1, groupId: 2, startDate: '2025-05-01', endDate: '2025-05-14' };

    service.getHistory(filters).subscribe(movements => {
      expect(movements).toEqual(mockMovements);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/history`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filters);
    req.flush(mockMovements);
  });
});
