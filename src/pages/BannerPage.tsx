import { AdminRoute } from "../components/layout/AdminRoute";
import { BannerManagement } from "../components/banners/BannerManagement";

export function BannerPage() {
  return (
    <AdminRoute>
      <BannerManagement />
    </AdminRoute>
  );
}

