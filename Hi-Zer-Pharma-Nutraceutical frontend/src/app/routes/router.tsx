import { Route, Routes } from "react-router";
import { StorefrontLayout } from "../components/layout/StorefrontLayout";
import { AdminLayout } from "../components/admin/AdminLayout";
import { AdminGuard } from "../components/admin/AdminGuard";

import HomePage from "../pages/storefront/HomePage";
import ShopPage from "../pages/storefront/ShopPage";
import ProductDetailPage from "../pages/storefront/ProductDetailPage";
import CartPage from "../pages/storefront/CartPage";
import CheckoutPage from "../pages/storefront/CheckoutPage";
import OrderTrackingPage from "../pages/storefront/OrderTrackingPage";
import AboutPage from "../pages/storefront/AboutPage";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AddEditProductPage from "../pages/admin/AddEditProductPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "../pages/admin/AdminOrderDetailPage";
import AdminCustomersPage from "../pages/admin/AdminCustomersPage";
import AdminCustomerDetailPage from "../pages/admin/AdminCustomerDetailPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import { Navigate } from "react-router";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders/track" element={<OrderTrackingPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>

      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route path="admin" element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AddEditProductPage />} />
          <Route path="products/:id/edit" element={<AddEditProductPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="customers/:email" element={<AdminCustomerDetailPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
