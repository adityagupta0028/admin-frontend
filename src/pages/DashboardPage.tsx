import { AdminRoute } from "../components/layout/AdminRoute";
import { Dashboard } from "../components/dashboard/Dashboard";

export function DashboardPage() {
  return (
    <AdminRoute>
      <Dashboard />
    </AdminRoute>
  );
}

