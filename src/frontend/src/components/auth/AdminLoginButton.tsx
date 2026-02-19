import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { toast } from 'sonner';

export default function AdminLoginButton() {
  const { isAuthenticated, logout, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (isAuthenticated) {
      try {
        await logout();
        toast.success('Logged out successfully');
        navigate({ to: '/' });
      } catch (error) {
        toast.error('Failed to logout');
      }
    } else {
      navigate({ to: '/admin/login' });
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Button
      onClick={handleClick}
      variant={isAuthenticated ? 'outline' : 'default'}
      size="sm"
      className="gap-2"
    >
      {isAuthenticated ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
      {isAuthenticated ? 'Admin Logout' : 'Admin Login'}
    </Button>
  );
}
