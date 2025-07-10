import { Routes } from '@angular/router';
import { MonitoringComponent } from './components/monitoring/monitoring.component';

export const monitoring_routes: Routes = [
  {title: "Monitoring", path: 'health', component: MonitoringComponent},
]