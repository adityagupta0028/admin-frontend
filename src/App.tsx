import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./components/auth/Login";
import { DashboardPage } from "./pages/DashboardPage";
import { UserPage } from "./pages/UserPage";
import { CategoryPage } from "./pages/CategoryPage";
import { SubCategoryPage } from "./pages/SubCategoryPage";
import { SubSubCategoryPage } from "./pages/SubSubCategoryPage";
import { ProductPage } from "./pages/ProductPage";
import { OrderPage } from "./pages/OrderPage";
import { TransactionPage } from "./pages/TransactionPage";
import { BannerPage } from "./pages/BannerPage";
import { FAQPage } from "./pages/FAQPage";
import { CMSPage } from "./pages/CMSPage";
import { SettingPage } from "./pages/SettingPage";
import { FilterPage } from "./pages/FilterPage";
import { HeroMenuPage } from "./pages/HeroMenuPage";
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
        <Route path="/subsubcategory" element={<SubSubCategoryPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="/banner" element={<BannerPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/cms" element={<CMSPage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/filter" element={<FilterPage />} />
        <Route path="/hero-menu" element={<HeroMenuPage />} />
        
        {/* Redirect any unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
