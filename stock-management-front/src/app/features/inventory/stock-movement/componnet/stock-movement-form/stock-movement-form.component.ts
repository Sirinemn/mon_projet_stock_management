import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { StockMovementService } from '../../service/stock-movement.service';
import { ProductService } from '../../../products/services/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../../models/product';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../../../auth/models/user';
import { SessionService } from '../../../../../core/services/session.service';
import { CommonModule } from '@angular/common';
import { StockMovement } from '../../../models/stockmovement';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-movement-form',
  imports: [MatCardModule, ReactiveFormsModule, MatRadioModule,MatFormFieldModule, MatProgressSpinnerModule, MatOptionModule, MatInputModule, MatSelectModule, CommonModule],
  templateUrl: './stock-movement-form.component.html',
  styleUrl: './stock-movement-form.component.scss'
})
export class StockMovementFormComponent implements OnInit, OnDestroy {
  public formGroup: FormGroup;
  public products: Product[] = [];
  public isLoading: boolean = false;
  public errorMessage: string = '';
  public messageResponse: string = '';
  private user!: User;
  private userId: number =0
  private groupId: number = 0;
  private destroy$ = new Subject<void>();
  public isEditMode: boolean = false;
  public stockMovementId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private stockMovementService: StockMovementService) {
      this.formGroup = formBuilder.group({
        productId: ['', [Validators.required]],
        quantity: ['', [Validators.required, Validators.min(1)]],
        type: ['', Validators.required],
      })
    }

  ngOnInit(): void {
    this.stockMovementId = this.route.snapshot.paramMap.get('id') || null;
    if (this.stockMovementId) { 
      this.isEditMode = true;
      this.patchProductValue(+this.stockMovementId);
    }
    this.getUser();
    this.loadProducts();
  }
  patchProductValue(stockMovementId: number) {
    this.stockMovementService.getStockMovement(stockMovementId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (stockMovement) => {
        this.formGroup.patchValue({
          productId: stockMovement.productId,
          quantity: stockMovement.quantity,
          type: stockMovement.type,
        });
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = error.error.message || 'Erreur lors du chargement des produits.';
      },
    })
  }
  public updateStockMovement() {
    if (this.formGroup.valid && !this.isLoading) {
      this.isLoading = true;
      const movementData = {
        ...this.formGroup.value,
        userId: this.userId,
        groupId: this.groupId,
      } as StockMovement;
      this.stockMovementService.updateStockMovement(+this.stockMovementId!, movementData).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messageResponse = response.message;
          const snackBarRef = this.snackBar.open(this.messageResponse, 'Fermer', {
            duration: 3000,
          });
          this.formGroup.reset();
          this.router.navigate(['/features/stock/list']);
        },
        error: (error) => {
          this.isLoading = false; 
          this.errorMessage = error.error.message || 'Une erreur est survenue.';
        }
      })
    }

  }
  public addStockMovement() {
    if (this.formGroup.valid && !this.isLoading) {
      this.isLoading = true;
      const movementData = {
        ...this.formGroup.value,
        userId: this.userId,
        groupId: this.groupId,
      } as StockMovement;
      this.stockMovementService.addStockMovement(movementData).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messageResponse = response.message;
          const snackBarRef = this.snackBar.open(this.messageResponse, 'Fermer', {
            duration: 3000,
          });
          this.formGroup.reset();
          this.router.navigate(['/features/stock/list']);
        },
        error: (error) => {
          this.isLoading = false; 
          this.errorMessage = error.error.message || 'Une erreur est survenue.';
        }
      })
    }
  }
  private loadProducts(){
    this.productService.getProducts(this.groupId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = error.error.message || 'Erreur lors du chargement des produits.';
      },
    })

  }
  private getUser()  {
    this.sessionService.getUser$().pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.userId = user.id;
          this.groupId = this.user.groupId;
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'utilisateur', err);
      }
    });
  
  }
  public back() {
    window.history.back();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
