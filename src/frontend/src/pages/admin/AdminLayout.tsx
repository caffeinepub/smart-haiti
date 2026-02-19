import { Link, Outlet, useNavigate } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Images, 
  Video, 
  Calendar, 
  Users, 
  Award, 
  FileText, 
  MessageSquare,
  Settings,
  BookOpen,
  LogOut,
  CreditCard,
  Info
} from 'lucide-react';
import AdminGuard from '../../components/auth/AdminGuard';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { toast } from 'sonner';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate({ to: '/' });
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Images, label: 'Gallery', path: '/admin/gallery' },
    { icon: Video, label: 'Videos', path: '/admin/videos' },
    { icon: FileText, label: 'Blog', path: '/admin/blog' },
    { icon: Calendar, label: 'Events', path: '/admin/events' },
    { icon: Users, label: 'Team', path: '/admin/team' },
    { icon: Award, label: 'Sponsors', path: '/admin/sponsors' },
    { icon: Info, label: 'About', path: '/admin/about' },
    { icon: MessageSquare, label: 'Contact Submissions', path: '/admin/contact-submissions' },
    { icon: CreditCard, label: 'Stripe Config', path: '/admin/stripe' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: BookOpen, label: 'Documentation', path: '/admin/documentation' },
  ];

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-muted/30">
        {/* Sidebar */}
        <aside className="w-64 bg-background border-r">
          <div className="p-6">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/assets/generated/smart-haiti-logo.dim_400x400.png"
                alt="SMART HAITI"
                className="h-8 w-8 object-contain"
              />
              <span className="text-lg font-bold text-primary">Admin Panel</span>
            </Link>
          </div>
          <nav className="px-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted hover:text-primary transition-colors"
                activeProps={{
                  className: 'bg-primary/10 text-primary hover:bg-primary/15',
                }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-3 mt-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </AdminGuard>
  );
}
