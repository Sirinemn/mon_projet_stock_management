import { Injectable } from '@angular/core';
import { ProductQuantity } from '../models/product-quantity.model';
import { Chart, PieController, ArcElement, Tooltip, Legend, Title } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartBuilderService {
  public pieChart: Chart | null = null;
  constructor() {
    Chart.register(PieController, ArcElement, Tooltip, Legend, Title);
  }

  private getRandomColor(): string {
    // Couleur aléatoire pour chaque série
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  createPieChart(canvas: HTMLCanvasElement, productQuantities: ProductQuantity[]): void {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const productNames = productQuantities.map(p => p.productName);
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: productNames,
        datasets: [
          {
            label: 'Stock par produit',
            data: productQuantities.map(p => p.quantity),
            backgroundColor: productQuantities.map(() => this.getRandomColor())
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Répartition du stock par produit'
          },
          legend: {
            position: 'top'
          }
        }
      }
    });
  }
}
