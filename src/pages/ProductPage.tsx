import React from "react";
import { AdminRoute } from "../components/layout/AdminRoute";
import { ProductManagement } from "../components/products/ProductManagement";

export function ProductPage() {
  return (
    <AdminRoute>
      <ProductManagement />
    </AdminRoute>
  );
}

