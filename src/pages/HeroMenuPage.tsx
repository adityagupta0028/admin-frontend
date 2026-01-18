import { AdminRoute } from "../components/layout/AdminRoute";
import { HeroMenuManagement } from "../components/heroMenu/HeroMenuManagement";

export function HeroMenuPage() {
  return (
    <AdminRoute>
      <HeroMenuManagement />
    </AdminRoute>
  );
}

