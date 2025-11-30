import { ReactNode } from "react";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { AdminLayout } from "./AdminLayout";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  return (
    <ProtectedRoute>
      <AdminLayout>
        {children}
      </AdminLayout>
    </ProtectedRoute>
  );
}

