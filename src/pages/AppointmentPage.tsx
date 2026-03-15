import { AdminRoute } from "../components/layout/AdminRoute";
import { AppointmentManagement } from "../components/appointments/AppointmentManagement";

export function AppointmentPage() {
  return (
    <AdminRoute>
      <AppointmentManagement />
    </AdminRoute>
  );
}
