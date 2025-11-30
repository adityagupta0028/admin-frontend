import { AdminRoute } from "../components/layout/AdminRoute";
import { FAQManagement } from "../components/faqs/FAQManagement";

export function FAQPage() {
  return (
    <AdminRoute>
      <FAQManagement />
    </AdminRoute>
  );
}

