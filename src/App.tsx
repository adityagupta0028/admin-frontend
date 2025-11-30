import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./components/auth/Login";
import { DashboardPage } from "./pages/DashboardPage";
import { UserPage } from "./pages/UserPage";
import { CategoryPage } from "./pages/CategoryPage";
import { SubCategoryPage } from "./pages/SubCategoryPage";
import { ProductPage } from "./pages/ProductPage";
import { OrderPage } from "./pages/OrderPage";
import { TransactionPage } from "./pages/TransactionPage";
import { BannerPage } from "./pages/BannerPage";
import { FAQPage } from "./pages/FAQPage";
import { CMSPage } from "./pages/CMSPage";
import { SettingPage } from "./pages/SettingPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/subcategory" element={<SubCategoryPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="/banner" element={<BannerPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/cms" element={<CMSPage />} />
        <Route path="/setting" element={<SettingPage />} />
        
        {/* Redirect any unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
