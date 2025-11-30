import { AdminRoute } from "../components/layout/AdminRoute";
import { SubCategoryManagement } from "../components/subcategories/SubCategoryManagement";

export function SubCategoryPage() {
  return (
    <AdminRoute>
      <SubCategoryManagement />
    </AdminRoute>
  );
}

