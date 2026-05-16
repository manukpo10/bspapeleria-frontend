import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';
import { EnrolledRoute } from './routes/EnrolledRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProductListPage = lazy(() => import('./pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CourseListPage = lazy(() => import('./pages/CourseListPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const CourseLearnPage = lazy(() => import('./pages/CourseLearnPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CheckoutSuccessPage = lazy(() => import('./pages/CheckoutSuccessPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const RecoverPasswordPage = lazy(() => import('./pages/RecoverPasswordPage'));

const DashboardLayoutPage = lazy(() => import('./pages/DashboardLayoutPage'));
const DashboardOverviewPage = lazy(() => import('./pages/DashboardOverviewPage'));
const DashboardCoursesPage = lazy(() => import('./pages/DashboardCoursesPage'));
const DashboardProductsPage = lazy(() => import('./pages/DashboardProductsPage'));
const DashboardOrdersPage = lazy(() => import('./pages/DashboardOrdersPage'));
const DashboardWishlistPage = lazy(() => import('./pages/DashboardWishlistPage'));
const DashboardProfilePage = lazy(() => import('./pages/DashboardProfilePage'));
const DashboardAddressesPage = lazy(() => import('./pages/DashboardAddressesPage'));
const DashboardNotificationsPage = lazy(() => import('./pages/DashboardNotificationsPage'));

const AdminLayoutPage = lazy(() => import('./pages/AdminLayoutPage'));
const AdminOverviewPage = lazy(() => import('./pages/AdminOverviewPage'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
const AdminProductBuilderPage = lazy(() => import('./pages/AdminProductBuilderPage'));
const AdminCoursesPage = lazy(() => import('./pages/AdminCoursesPage'));
const AdminCourseBuilderPage = lazy(() => import('./pages/AdminCourseBuilderPage'));
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const AdminCouponsPage = lazy(() => import('./pages/AdminCouponsPage'));
const AdminSettingsPage = lazy(() => import('./pages/AdminSettingsPage'));

const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/nosotros" element={<AboutPage />} />
            <Route path="/productos" element={<ProductListPage />} />
            <Route path="/productos/:slug" element={<ProductDetailPage />} />
            <Route path="/cursos" element={<CourseListPage />} />
            <Route path="/cursos/:slug" element={<CourseDetailPage />} />
            <Route path="/cursos/:slug/aprender" element={<EnrolledRoute><CourseLearnPage /></EnrolledRoute>} />
            <Route path="/preguntas-frecuentes" element={<FAQPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/exito" element={<CheckoutSuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/recuperar-password" element={<RecoverPasswordPage />} />

            {/* User Dashboard */}
            <Route path="/mi-cuenta" element={<ProtectedRoute><DashboardLayoutPage /></ProtectedRoute>}>
              <Route path="overview" element={<DashboardOverviewPage />} />
              <Route path="mis-cursos" element={<DashboardCoursesPage />} />
              <Route path="mis-productos" element={<DashboardProductsPage />} />
              <Route path="pedidos" element={<DashboardOrdersPage />} />
              <Route path="wishlist" element={<DashboardWishlistPage />} />
              <Route path="perfil" element={<DashboardProfilePage />} />
              <Route path="direcciones" element={<DashboardAddressesPage />} />
              <Route path="notificaciones" element={<DashboardNotificationsPage />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<RoleRoute role="admin"><AdminLayoutPage /></RoleRoute>}>
            <Route path="overview" element={<AdminOverviewPage />} />
            <Route path="productos" element={<AdminProductsPage />} />
            <Route path="productos/nuevo" element={<AdminProductBuilderPage />} />
            <Route path="productos/:id/builder" element={<AdminProductBuilderPage />} />
            <Route path="cursos" element={<AdminCoursesPage />} />
            <Route path="cursos/nuevo" element={<AdminCourseBuilderPage />} />
            <Route path="cursos/:id/builder" element={<AdminCourseBuilderPage />} />
            <Route path="pedidos" element={<AdminOrdersPage />} />
            <Route path="usuarios" element={<AdminUsersPage />} />
            <Route path="cupones" element={<AdminCouponsPage />} />
            <Route path="configuracion" element={<AdminSettingsPage />} />
          </Route>

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/500" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
