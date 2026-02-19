import { createRouter, RouterProvider, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import VideosPage from './pages/VideosPage';
import EventsPage from './pages/EventsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import TeamPage from './pages/TeamPage';
import SponsorsPage from './pages/SponsorsPage';
import DonatePage from './pages/DonatePage';
import ContactPage from './pages/ContactPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';
import AdminVideosPage from './pages/admin/AdminVideosPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminTeamPage from './pages/admin/AdminTeamPage';
import AdminSponsorsPage from './pages/admin/AdminSponsorsPage';
import AdminAboutPage from './pages/admin/AdminAboutPage';
import AdminContactSubmissionsPage from './pages/admin/AdminContactSubmissionsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminDocumentationPage from './pages/admin/AdminDocumentationPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import StripeConfigPage from './pages/admin/StripeConfigPage';
import Layout from './components/layout/Layout';
import AdminLayout from './pages/admin/AdminLayout';

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Toaster />
    </ThemeProvider>
  ),
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/about',
  component: AboutPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/gallery',
  component: GalleryPage,
});

const videosRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/videos',
  component: VideosPage,
});

const eventsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/events',
  component: EventsPage,
});

const blogRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/blog',
  component: BlogPage,
});

const blogPostRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/blog/$postId',
  component: BlogPostPage,
});

const teamRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/team',
  component: TeamPage,
});

const sponsorsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/sponsors',
  component: SponsorsPage,
});

const donateRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/donate',
  component: DonatePage,
});

const contactRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/contact',
  component: ContactPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLoginPage,
});

const adminRootRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/',
  component: AdminDashboardPage,
});

const adminGalleryRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/gallery',
  component: AdminGalleryPage,
});

const adminVideosRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/videos',
  component: AdminVideosPage,
});

const adminBlogRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/blog',
  component: AdminBlogPage,
});

const adminEventsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/events',
  component: AdminEventsPage,
});

const adminTeamRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/team',
  component: AdminTeamPage,
});

const adminSponsorsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/sponsors',
  component: AdminSponsorsPage,
});

const adminAboutRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/about',
  component: AdminAboutPage,
});

const adminContactSubmissionsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/contact-submissions',
  component: AdminContactSubmissionsPage,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/settings',
  component: AdminSettingsPage,
});

const adminDocumentationRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/documentation',
  component: AdminDocumentationPage,
});

const adminStripeRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/stripe',
  component: StripeConfigPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    indexRoute,
    aboutRoute,
    galleryRoute,
    videosRoute,
    eventsRoute,
    blogRoute,
    blogPostRoute,
    teamRoute,
    sponsorsRoute,
    donateRoute,
    contactRoute,
    paymentSuccessRoute,
    paymentFailureRoute,
  ]),
  adminLoginRoute,
  adminRootRoute.addChildren([
    adminDashboardRoute,
    adminGalleryRoute,
    adminVideosRoute,
    adminBlogRoute,
    adminEventsRoute,
    adminTeamRoute,
    adminSponsorsRoute,
    adminAboutRoute,
    adminContactSubmissionsRoute,
    adminSettingsRoute,
    adminDocumentationRoute,
    adminStripeRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
