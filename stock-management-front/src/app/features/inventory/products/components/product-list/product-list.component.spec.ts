import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { SessionService } from '../../../../../core/services/session.service';
import { CategorieService } from '../../services/categorie.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockRouter: any = { events: { subscribe: jest.fn() }, createUrlTree: jest.fn(), serializeUrl: jest.fn(), navigate: jest.fn() };
  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue('mockValue') } }
  };
  const mockSessionService = {
    getUser$: jest.fn().mockReturnValue(of({ id: 1, groupId: 2 }))
  };

  const mockCategoryService = {
    getCategories: jest.fn().mockReturnValue(of([{ id: 1, name: 'Mock Category' }]))
  };

  const mockDialog = {
    open: jest.fn().mockReturnValue({ afterClosed: () => of(true) })
  };

  const mockSnackBar = {
    open: jest.fn()
  };
  const mockProductService = {
    getProducts: jest.fn().mockReturnValue(of([{ id: 1, name: 'Mock Product', quantity: 10, price: 100 }])),
    getProductsByCategory: jest.fn().mockReturnValue(of([{ id: 1, name: 'Mock Product', quantity: 10, price: 100 }])),
    deleteProduct: jest.fn().mockReturnValue(of({}))
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ProductService, useValue: mockProductService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: CategorieService, useValue: mockCategoryService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load categories successfully', () => {
    component.getCategories(2);

    expect(mockCategoryService.getCategories).toHaveBeenCalledWith(2);
    expect(component.categories.length).toBe(1);
  });
  it('should load products successfully', () => {
    component.getProducts(2);

    expect(mockProductService.getProducts).toHaveBeenCalledWith(2);
    expect(component.products.length).toBe(1);
  });
  it('should fetch products by category when category selected', () => {
    component.onCategoryChange(1);

    expect(mockProductService.getProductsByCategory).toHaveBeenCalledWith(1, component.groupId);
  });
  it('should delete product when confirmed', () => {
    const product = { id: 1, name: 'Test Product', quantity: 10, price: 100, createdBy: 'Test User', categoryId: 1, userId: 1, userName: 'Test User', threshold: 5, groupId: 2, groupName: 'Test Group', description: 'Test Description', categoryName: 'Test Category' };

    jest.spyOn(mockDialog, 'open').mockReturnValue({ afterClosed: () => of(true) } as any);

    component.deleteProduct(product);

    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(product.id, component.groupId);
  });
  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component.destroy$, 'next');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
  it('should handle error when loading products', () => {
    const errorResponse = { status: 500, message: 'Internal Server Error' };
    jest.spyOn(mockProductService, 'getProducts').mockReturnValue(throwError(() => ({ error: { message: 'un erreur est survenu lors de la récupération des produits' } })));

    component.getProducts(2);

    expect(component.errorMessage).toBe("un erreur est survenu lors de la récupération des produits");
  });
});
