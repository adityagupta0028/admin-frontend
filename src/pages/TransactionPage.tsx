import { AdminRoute } from "../components/layout/AdminRoute";
import { TransactionManagement } from "../components/transactions/TransactionManagement";

export function TransactionPage() {
  return (
    <AdminRoute>
      <TransactionManagement />
    </AdminRoute>
  );
}

