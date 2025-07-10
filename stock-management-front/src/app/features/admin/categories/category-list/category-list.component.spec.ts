import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryListComponent } from './category-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SessionService } from '../../../../core/services/session.service';
import { CategorieService } from '../../../inventory/products/services/categorie.service';
import { AdminService } from '../../services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  const mockSessionService = {
    getUser$: jest.fn().mockReturnValue(of({ id: 1, groupId: 2 }))
  };
  const mockCategoryService = {
    getCategories: jest.fn().mockReturnValue(of([{ id: 1, name: 'Category 1' }]))
  };
  const mockAdminService = {
    addCategory: jest.fn().mockReturnValue(of({})),
    deleteCategory: jest.fn().mockReturnValue(of({})),
  };
  const mockDialog = {
    open: jest.fn().mockReturnValue({ afterClosed: () => of(true) })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SessionService, useValue: mockSessionService },
        { provide: CategorieService, useValue: mockCategoryService },
        { provide: AdminService, useValue: mockAdminService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: { open: jest.fn() } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load user data on init', () => {
    component.ngOnInit();
    expect(component.userId).toBe(1);
    expect(component.groupId).toBe(2);
  });
  it('should toggle category addition state', () => {
    expect(component.isAddingCategory).toBeFalsy();
    component.toggleAddCategory();
    expect(component.isAddingCategory).toBeTruthy();
    component.toggleAddCategory();
    expect(component.isAddingCategory).toBeFalsy();
  });
  it('should add a category successfully', () => {
    component.groupId = 2; 
    component.newCategoryName = 'New Category';
    
    component.addCategory();
    
    expect(mockAdminService.addCategory).toHaveBeenCalledWith('New Category', component.userId);
  });
  it('should delete category when confirmed', () => {
    const category = { id: 1, name: 'Test Category', groupId: 2 };
    
    jest.spyOn(mockDialog, 'open').mockReturnValue({ afterClosed: () => of(true) } as any);
    
    component.deleteCategory(category);
    
    expect(mockAdminService.deleteCategory).toHaveBeenCalledWith(category.id, component.groupId);
  });
  it('should clean up observables on destroy', () => {
    const spy = jest.spyOn(component.destroy$, 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
  
});
