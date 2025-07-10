import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormComponent } from './product-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SessionService } from '../../../../../core/services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CategorieService } from '../../services/categorie.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockRouter: any = { events: { subscribe: jest.fn() }, createUrlTree: jest.fn(), serializeUrl: jest.fn(), navigate: jest.fn() };
  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue('mockValue') } }
  };
  let mockSessionService: Partial<SessionService>;
  const mockProductService = {
    getProduct: jest.fn().mockReturnValue(of({ id: 1, name: 'Mock Product', description: 'Mock Description', quantity: 10, threshold: 2, price: 100, categoryId: 1 })),
    addProduct: jest.fn().mockReturnValue(of({ message: 'Product added successfully' })),
    updateProduct: jest.fn().mockReturnValue(of({ message: 'Product updated successfully' }))
  };

  const mockCategoryService = {
    getCategories: jest.fn().mockReturnValue(of([{ id: 1, name: 'Mock Category' }]))
  };

  const mockSnackBar = {
    open: jest.fn().mockReturnValue({ afterDismissed: () => of({}) })
  };
  const mockProduct = {
    id: 1,
    name: 'Mock Product',
    description: 'Mock Description',
    quantity: 10,
    threshold: 2,
    price: 100,
    categoryId: 1
  };
  let mockUser = {
    id: 1,
    firstname: 'first',
    lastname: 'last',
    email: 'email@test.fr',
    dateOfBirth: '01/02/1992',
    createdDate: '10/04/2025',
    lastModifiedDate: '10/04/2025',
    firstLogin: false,
    roles: ['USER'],
    groupId: 1,
    groupName: 'group',
    createdBy: 2,
  }

  beforeEach(async () => {
    mockSessionService = {getUser: jest.fn().mockReturnValue(mockUser)}
    
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ProductService, useValue: mockProductService },
        { provide: CategorieService, useValue: mockCategoryService },
        { provide: MatSnackBar, useValue: mockSnackBar }

      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize user data correctly', () => {
    component.initializeUserData();

    expect(component.user).toEqual(mockUser);
    expect(component.groupId).toBe(mockUser.groupId);
    expect(component.groupName).toBe(mockUser.groupName);
  });
  it('should load categories successfully', () => {
    component.loadCategories(1);
    
    expect(mockCategoryService.getCategories).toHaveBeenCalledWith(mockUser.groupId);
    expect(component.categories.length).toBe(1);
  });
  it('should patch form values with product data', () => {
    component.patchProductValue('1');

    expect(mockProductService.getProduct).toHaveBeenCalledWith(1);
    expect(component.formGroup.value.name).toBe('Mock Product');
  });
  it('should add a product successfully', () => {
    component.addProduct();

    expect(mockProductService.addProduct).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/features/products/list']);
  });
  it('should update a product successfully', () => {
    component.productId = '1';
    component.updateProduct();

    expect(mockProductService.updateProduct).toHaveBeenCalledWith(1, expect.any(Object));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/features/products/list']);
  });
  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component.destroy$, 'next');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
