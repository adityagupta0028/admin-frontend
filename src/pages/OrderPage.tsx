import { AdminRoute } from "../components/layout/AdminRoute";
import { OrderManagement } from "../components/orders/OrderManagement";

export function OrderPage() {
  return (
    <AdminRoute>
      <OrderManagement />
    </AdminRoute>
  );
}

