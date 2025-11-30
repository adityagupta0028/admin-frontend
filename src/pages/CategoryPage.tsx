import { AdminRoute } from "../components/layout/AdminRoute";
import { CategoryManagement } from "../components/categories/CategoryManagement";

export function CategoryPage() {
  return (
    <AdminRoute>
      <CategoryManagement />
    </AdminRoute>
  );
}

