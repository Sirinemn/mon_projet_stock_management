import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Product } from '../../models/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const mockProduct = { id: 1, name: 'Test Product', quantity: 10, price: 100, createdBy: 'Test User', categoryId: 1, userId: 1, userName: 'Test User', threshold: 5, groupId: 2, groupName: 'Test Group', description: 'Test Description', categoryName: 'Test Category' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting() 
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should send a POST request to add a product', () => {

    service.addProduct(mockProduct).subscribe(response => {
      expect(response).toEqual({ message: 'Product added successfully' });
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush({ message: 'Product added successfully' });
  });
  it('should fetch products for a given group', () => {
    const mockProducts: Product[] = [mockProduct];

    service.getProducts(2).subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}?groupId=2`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });
  it('should fetch a single product by ID', () => {
    service.getProduct(1).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });
  it('should send a PUT request to update a product', () => {
    service.updateProduct(1, mockProduct).subscribe(response => {
      expect(response).toEqual({ message: 'Product updated successfully' });
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);
    req.flush({ message: 'Product updated successfully' });
  });
  it('should send a DELETE request to remove a product', () => {
    service.deleteProduct(1, 2).subscribe();

    const req = httpMock.expectOne(`${service['apiUrl']}/1?groupId=2`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
  it('should fetch products filtered by category and group', () => {
    const mockProducts: Product[] = [mockProduct];
    service.getProductsByCategory(3, 2).subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/product?groupId=2&categoryId=3`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });
});
