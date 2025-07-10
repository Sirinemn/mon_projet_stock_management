import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../models/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-detail',
  imports: [MatIconModule, MatCardModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit , OnDestroy{
  public isLoading: boolean = false;
  public product: Product | undefined;
  public productId: number = 0;
  public errorMessage: string = '';
  public destroy$ = new Subject<void>();
  public isProductLow: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
      this.productId = this.route.snapshot.params['id'] || 0;
      this.getProduct(this.productId);
  }
  private getProduct(id: number) {
    this.isLoading = true;
    this.productService.getProduct(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (product) =>{
        this.product = product;
        this.isLoading = false;
        if(this.product.quantity <= this.product.threshold) this.isProductLow = true;
      },
      error: (error) => {
        this.isLoading = false
        this.errorMessage = error.error.message || 'Erreur lors du chargement du produit.';
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
