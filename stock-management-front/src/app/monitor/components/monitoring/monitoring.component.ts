import { Component, OnInit } from '@angular/core';
import { MonitoringService } from '../../service/monitoring.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { HealthData } from '../../models/healthData';

@Component({
  selector: 'app-monitoring',
  imports: [MatCardModule, CommonModule, MatExpansionModule],
  templateUrl: './monitoring.component.html',
  styleUrl: './monitoring.component.scss'
})
export class MonitoringComponent implements OnInit {
  healthData: HealthData | null = null;
  infoData: any;

  constructor(private monitoringService: MonitoringService) {}

  ngOnInit(): void {
    this.monitoringService.getHealth().subscribe(data => this.healthData = data);
    this.monitoringService.getInfo().subscribe(data => this.infoData = data);
  }

}
