import { AdminRoute } from "../components/layout/AdminRoute";
import { CustomRingRequestManagement } from "../components/customRingRequests/CustomRingRequestManagement";

export function CustomRingRequestPage() {
  return (
    <AdminRoute>
      <CustomRingRequestManagement />
    </AdminRoute>
  );
}
