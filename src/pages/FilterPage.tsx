import { AdminRoute } from "../components/layout/AdminRoute";
import { FilterManagement } from "../components/filters/FilterManagement";

export function FilterPage() {
  return (
    <AdminRoute>
      <FilterManagement />
    </AdminRoute>
  );
}

