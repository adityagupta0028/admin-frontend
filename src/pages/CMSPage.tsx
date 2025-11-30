import { AdminRoute } from "../components/layout/AdminRoute";
import { CMSManagement } from "../components/cms/CMSManagement";

export function CMSPage() {
  return (
    <AdminRoute>
      <CMSManagement />
    </AdminRoute>
  );
}

