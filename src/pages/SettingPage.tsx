import { AdminRoute } from "../components/layout/AdminRoute";
import { Settings } from "../components/settings/Settings";

export function SettingPage() {
  return (
    <AdminRoute>
      <Settings />
    </AdminRoute>
  );
}

