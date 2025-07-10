import { Routes } from "@angular/router";
import { StockMovementListComponent } from "./componnet/stock-movement-list/stock-movement-list.component";
import { StockMovementFormComponent } from "./componnet/stock-movement-form/stock-movement-form.component";
import { StockMovementDetailComponent } from "./componnet/stock-movement-detail/stock-movement-detail.component";

export const stock_routes: Routes = [
    {title: 'Stock', path: 'list', component: StockMovementListComponent },
    {title: 'Stock', path: 'edit/:id', component: StockMovementFormComponent },
    {title: 'Stock', path: 'add', component: StockMovementFormComponent },
    {title: 'Stock', path: 'view/:id', component: StockMovementDetailComponent}
]