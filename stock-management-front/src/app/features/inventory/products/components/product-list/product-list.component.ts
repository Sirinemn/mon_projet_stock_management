import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../models/product';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Category } from '../../../../admin/models/category';
import { SessionService } from '../../../../../core/services/session.service';
import { User } from '../../../../../auth/models/user';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../mat-dialog/confirm-dialog/confirm-dialog.component';
import { CategorieService } from '../../services/categorie.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthStateService } from '../../../../../core/services/auth-state.service';


@Component({
  standalone: true,
  imports: [MatIconModule ,MatTableModule, MatButtonModule, MatProgressSpinnerModule, RouterLink, MatFormFieldModule, MatOptionModule, MatSelectModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  @Output() categorySelected = new EventEmitter<number>();

  public products: Product[] = []; 
  public dataSource!: MatTableDataSource<Product>;
  public displayedColumns: string[] = [];
  public isLoading = false;
  public categories: Category[] = [];
  public groupId: number = 0;
  private user?: User | null;
  public destroy$ = new Subject<void>();
  public errorMessage: string = '';
  public isAdmin: boolean = false;
  
  constructor(
    private router: Router,
    private productService: ProductService,
    private sessionService: SessionService,
    private authStateService: AuthStateService,
    private dialog: MatDialog,
    private categoryService: CategorieService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.updateColumns();
    window.addEventListener('resize', () => this.updateColumns());
    this.getUser();
    this.isUserAdmin();
  }
  updateColumns() {
    this.displayedColumns = window.innerWidth <= 600
      ? ['name', 'actions']
      : ['name', 'quantity', 'price', 'createdBy', 'actions'];
  }
  private isUserAdmin(): void {
    this.authStateService.getIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }
  public getUser(): void {
    this.sessionService.getUser$().pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.user = user;
        this.groupId = user?.groupId || 0;
        this.getCategories(this.groupId);
        this.getProducts(this.groupId);
      },
      error: (error) => {
        console.error('Error fetching user', error);
        this.snackBar.open('Erreur lors de la récupération des informations utilisateur', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  public getCategories(groupId: number): void {
    this.categoryService.getCategories(groupId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error fetching categories', error);
        this.snackBar.open('Erreur lors de la récupération des catégories', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  public getProducts(groupId: number) {
    this.isLoading = true;
    this.productService.getProducts(groupId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.dataSource = new MatTableDataSource(this.products);
        
        // Configuration du tri après avoir chargé les données
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || "Une erreur est survenue lors de la récupération des produits";
        this.snackBar.open(this.errorMessage, 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  
  public onCategoryChange(categoryId: number): void {
    if (categoryId) {
      this.getProductsByCategory(categoryId);
    } else {
      this.getProducts(this.groupId); // si aucune catégorie sélectionnée, afficher tous les produits
    }
  }
  public getProductsByCategory(categoryId: number): void {
    this.isLoading = true;
    this.productService.getProductsByCategory(categoryId, this.groupId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.dataSource = new MatTableDataSource(this.products);
        
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || "Une erreur est survenue lors de la récupération des produits par catégorie";
        this.snackBar.open(this.errorMessage, 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  public deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation',
        message: `Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler'
      }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.productService.deleteProduct(product.id, this.groupId).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open(`Le produit "${product.name}" a été supprimé avec succès`, 'Fermer', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.getProducts(this.groupId);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || "Une erreur est survenue lors de la suppression";
            this.snackBar.open(this.errorMessage, 'Fermer', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          },
        });
      }
    });
  }
  public editProduct(productId: number) {
    this.router.navigate([`/features/products/edit/${productId}`]);
  }
  public viewProduct(productId: number) {
    this.router.navigate([`/features/products/view/${productId}`]);
  }

  public back() {
    window.history.back();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('resize', () => this.updateColumns());
  }
}
