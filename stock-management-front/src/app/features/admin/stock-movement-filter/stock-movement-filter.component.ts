import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../inventory/products/services/product.service';
import { AdminService } from '../services/admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../inventory/models/product';
import { User } from '../../../auth/models/user';
import { Subject, takeUntil } from 'rxjs';
import { SessionService } from '../../../core/services/session.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { StockMovement } from '../../inventory/models/stockmovement';
import { StockMovementService } from '../../inventory/stock-movement/service/stock-movement.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-stock-movement-filter',
  imports: [ReactiveFormsModule, MatProgressSpinnerModule, MatListModule, CommonModule ,MatCardModule, MatFormFieldModule, MatOptionModule, MatDatepickerModule, MatSelectModule, MatNativeDateModule, MatInputModule],
  templateUrl: './stock-movement-filter.component.html',
  styleUrl: './stock-movement-filter.component.scss'
})
export class StockMovementFilterComponent implements OnInit, OnDestroy {

  public filterForm: FormGroup;
  public products: Product[] = []; 
  public isLoading = false;
  public groupId: number = 0;
  public errorMessage: string = '';
  public users: User[] = [];
  public destroy$ = new Subject<void>();
  public user: User | null = null;
  public userId: number = 0;
  public filteredMovements: StockMovement[] = [];
  public filters = {userId: null, productId: null, groupId: null, startDate: null, endDate: null}

  constructor(
    private productService: ProductService,
    private adminService: AdminService,
    private fb: FormBuilder,
    private session: SessionService,
    private stockMovementService: StockMovementService,
    private snackBar: MatSnackBar,
  ) { 
    this.filterForm = this.fb.group({
      userId: [null],
      productId: [null],
      startDate: [null],
      endDate: [null]
    });
  }
  ngOnInit(): void {
    this.getAuthUser();
  }
  public getAuthUser() {
    this.session.getUser$().pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.user = user;
        this.groupId = user?.groupId || 0;
        this.userId = user?.id || 0;
        this.getProducts(this.groupId);
        this.getUsers(this.groupId);
      },
      error: (error) => {
        console.error('Error fetching user', error);
      }
    });
  }
  public getProducts(groupId:number) {
    this.isLoading = true;
    this.productService.getProducts(groupId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.isLoading = false;
      }
      , error: (error) => {
        this.isLoading = false;
        console.error('Error fetching products', error);
      }
    });
  }
  public getUsers(groupId: number): void {
    this.isLoading = true;
    this.adminService.getUsersByGroupId(this.groupId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  onReset() {
    this.filterForm.reset();
    this.filterForm.patchValue({
      userId: null,
      productId: null,
      startDate: null,
      endDate: null
    });
  }
  onSubmit() {
    if (this.filterForm.valid) {
      this.isLoading = true;
      const filterValues = this.filterForm.value;
      const filters = {
      ...filterValues,
      groupId: this.groupId
     };
      this.stockMovementService.getHistory(filters).pipe(takeUntil(this.destroy$)).subscribe({
        next: (movements: StockMovement[]) => {
          this.filteredMovements = movements;
          this.isLoading = false;
          this.errorMessage = '';
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error.message || 'Une erreur est survenue lors de la récupération des mouvements de stock.';
          this.snackBar.open(this.errorMessage, 'Fermer', { duration: 3000 });
          this.filteredMovements = [];
          console.error('Error fetching stock movements', error);
        }
      });
    } else {
      console.error('Form is invalid');
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    }
  }
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
