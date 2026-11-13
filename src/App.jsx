import { Fragment, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "./i18n/Link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import WebDesignPage from "./pages/WebDesignPage";
import ServicesPage from "./pages/ServicesPage";
import PortfolioPage from "./pages/PortfolioPage";
import AboutPage from "./pages/AboutPage";
import TeamPage from "./pages/TeamPage";
import ContactPage from "./pages/ContactPage";
import { SERVICE_PAGES } from "./data/servicePages";
import { BLOG_CATEGORIES } from "./data/blog";
import { categoryPath } from "./lib/blog";
import LegacyHashRedirect from "./ui/LegacyHashRedirect";
import TermsPage from "./pages/TermsPage";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import CompleteProfile from "./pages/CompleteProfile";
import AuthPending from "./pages/AuthPending";
import ScrollToTop from "./ui/ScrollToTop";
import { LangProvider } from "./i18n/LangContext";

import RequireStep from "./features/auth/RequireStep";
import AuthBootstrap from "./features/auth/AuthBootstrap";
import DashboardLayout from "./features/dashboard/DashboardLayout";
import ProtectedRoute from "./features/dashboard/ProtectedRoute";
import SuperOnlyRoute from "./features/dashboard/SuperOnlyRoute";

// صفحه‌های خدمت (۲۲ صفحه با یک قالب) فقط وقتی لازم شدند لود می‌شوند.
const ServicePage = lazy(() => import("./pages/ServicePage"));

// وبلاگ: صفحه‌ی اصلی، دسته‌ها و مقاله فقط وقتی لازم شدند لود می‌شوند.
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogCategoryPage = lazy(() => import("./pages/BlogCategoryPage"));
const BlogArticlePage = lazy(() => import("./pages/BlogArticlePage"));

const UserOverview = lazy(() => import("./pages/dashboard/user/Overview"));
const UserProjects = lazy(() => import("./pages/dashboard/user/Projects"));
const UserHistory = lazy(() => import("./pages/dashboard/user/History"));
const UserSupport = lazy(() => import("./pages/dashboard/user/Support"));
const UserProfile = lazy(() => import("./pages/dashboard/user/Profile"));

const AdminOverview = lazy(() => import("./pages/dashboard/admin/Overview"));
const AdminRequests = lazy(() => import("./pages/dashboard/admin/Requests"));
const AdminUsers = lazy(() => import("./pages/dashboard/admin/Users"));
const AdminProjects = lazy(() => import("./pages/dashboard/admin/Projects"));
const AdminSupport = lazy(() => import("./pages/dashboard/admin/Support"));
const AdminHistory = lazy(() => import("./pages/dashboard/admin/History"));
const AdminConsultations = lazy(
  () => import("./pages/dashboard/admin/Consultations"),
);
const AdminComments = lazy(() => import("./pages/dashboard/admin/Comments"));
const AdminBlogPosts = lazy(() => import("./pages/dashboard/admin/BlogPosts"));
const AdminBlogPostForm = lazy(
  () => import("./pages/dashboard/admin/BlogPostForm"),
);
const Admins = lazy(() => import("./pages/dashboard/admin/Admins"));
const Roles = lazy(() => import("./pages/dashboard/admin/Roles"));
const AdminProfile = lazy(() => import("./pages/dashboard/admin/Profile"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppRoutes() {
  return (
    <>
      <LegacyHashRedirect />
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          {/* صفحه‌های عمومی دو زبانه‌اند: بدون پیشوند = فارسی، /en/... = انگلیسی */}
          {["", "/en"].map((prefix) => (
            <Fragment key={`public-${prefix || "fa"}`}>
              <Route path={prefix || "/"} element={<Home />} />
              <Route path={`${prefix}/services`} element={<ServicesPage />} />
              <Route path={`${prefix}/portfolio`} element={<PortfolioPage />} />
              <Route path={`${prefix}/about`} element={<AboutPage />} />
              <Route path={`${prefix}/team`} element={<TeamPage />} />
              <Route path={`${prefix}/contact`} element={<ContactPage />} />

              {/* ۲۲ صفحه‌ی مستقل خدمت: /services/... و /web-design/... */}
              {SERVICE_PAGES.map((page) => (
                <Route
                  key={page.path}
                  path={`${prefix}${page.path}`}
                  element={<ServicePage path={page.path} />}
                />
              ))}
              <Route path={`${prefix}/web-design`} element={<WebDesignPage />} />
              <Route
                path={`${prefix}/services/*`}
                element={<Navigate to="/services" replace />}
              />
              <Route path={`${prefix}/terms`} element={<TermsPage />} />

              {/* وبلاگ: /blog، یک صفحه‌ی مستقل برای هر دسته، و /blog/<slug> برای مقاله */}
              <Route path={`${prefix}/blog`} element={<BlogPage />} />
              {BLOG_CATEGORIES.map((category) => (
                <Route
                  key={category.slug}
                  path={`${prefix}${categoryPath(category.slug)}`}
                  element={<BlogCategoryPage slug={category.slug} />}
                />
              ))}
              <Route
                path={`${prefix}/blog/category/*`}
                element={<Navigate to="/blog" replace />}
              />
              <Route
                path={`${prefix}/blog/:slug`}
                element={<BlogArticlePage lang={prefix ? "en" : undefined} />}
              />
            </Fragment>
          ))}

          {/* صفحه‌های ورود هم دو زبانه‌اند: /auth/... و /en/auth/... */}
          <Fragment>
            {["", "/en"].map((prefix) => (
              <Fragment key={prefix || "fa"}>
                <Route path={`${prefix}/auth/login`} element={<Login />} />
                <Route path={`${prefix}/auth/admin`} element={<AdminLogin />} />
                <Route
                  path={`${prefix}/auth/admin/forgot-password`}
                  element={<AdminForgotPassword />}
                />

                <Route
                  path={`${prefix}/auth/otp`}
                  element={
                    <RequireStep step="phone">
                      <VerifyOtp />
                    </RequireStep>
                  }
                />

                <Route
                  path={`${prefix}/auth/complete-profile`}
                  element={
                    <RequireStep step="verified">
                      <CompleteProfile />
                    </RequireStep>
                  }
                />

                <Route
                  path={`${prefix}/auth/pending`}
                  element={<AuthPending />}
                />
              </Fragment>
            ))}
          </Fragment>

          <Route element={<ProtectedRoute area="user" />}>
            <Route path="/dashboard" element={<DashboardLayout area="user" />}>
              <Route index element={<UserOverview />} />
              <Route path="projects" element={<UserProjects />} />
              <Route path="history" element={<UserHistory />} />
              <Route path="support" element={<UserSupport />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute area="admin" />}>
            <Route path="/admin" element={<DashboardLayout area="admin" />}>
              <Route index element={<AdminOverview />} />
              <Route path="requests" element={<AdminRequests />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="history" element={<AdminHistory />} />
              <Route path="consultations" element={<AdminConsultations />} />
              <Route path="comments" element={<AdminComments />} />
              <Route path="blog" element={<AdminBlogPosts />} />
              <Route path="blog/new" element={<AdminBlogPostForm />} />
              <Route path="blog/:id/edit" element={<AdminBlogPostForm />} />
              <Route path="profile" element={<AdminProfile />} />

              <Route element={<SuperOnlyRoute />}>
                <Route path="admins" element={<Admins />} />
                <Route path="roles" element={<Roles />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}

      <Toaster
        position="bottom-center"
        toastOptions={{
          className:
            "!bg-surface !text-foreground !border !border-border !text-sm",
        }}
      />

      <LangProvider>
        <AuthBootstrap>
          <AppRoutes />
        </AuthBootstrap>
      </LangProvider>
    </QueryClientProvider>
  );
}

export default App;
