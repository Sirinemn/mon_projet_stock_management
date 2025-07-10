import { Routes } from "@angular/router";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { ProductFormComponent } from "./components/product-form/product-form.component";
import { ProductDetailComponent } from "./components/product-detail/product-detail.component";

export const products_routes: Routes = [
    {title: 'Products', path: 'list', component: ProductListComponent },
    {title: 'Products', path: 'edit/:id', component: ProductFormComponent },
    {title: 'Products', path: 'add', component: ProductFormComponent },
    {title: 'Products', path: 'view/:id', component: ProductDetailComponent}
]