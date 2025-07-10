import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { ChartBuilderService } from '../../services/chart-builder.service';
import { ProductQuantity } from '../../models/product-quantity.model';


@Component({
  selector: 'app-pie-chart',
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements AfterViewInit {
  @Input() chartData: ProductQuantity[] = [];
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private chartBuilder: ChartBuilderService) {}

  ngAfterViewInit(): void {
    if (this.chartData.length > 0 && this.pieCanvas) {
      this.chartBuilder.createPieChart(this.pieCanvas.nativeElement, this.chartData);
    }
  }

}
