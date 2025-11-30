import { AdminRoute } from "../components/layout/AdminRoute";
import { UserManagement } from "../components/users/UserManagement";

export function UserPage() {
  return (
    <AdminRoute>
      <UserManagement />
    </AdminRoute>
  );
}

