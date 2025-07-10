import { StockMovement } from "../../models/stockmovement";
import { ProductQuantity } from "./product-quantity.model";

export interface DashboardOverview {
  totalProducts: number;
  lowStockProducts: number;
  recentMovements: StockMovement[];
  productQuantities: ProductQuantity[];
  groupId: number;
}