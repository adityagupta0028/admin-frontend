import { AdminRoute } from "../components/layout/AdminRoute";
import { SubSubCategoryManagement } from "../components/subsubcategories/SubSubCategoryManagement";

export function SubSubCategoryPage() {
  return (
    <AdminRoute>
      <SubSubCategoryManagement />
    </AdminRoute>
  );
}

