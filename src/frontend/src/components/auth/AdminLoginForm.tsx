import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth, useIsAdminConfigured, useSetAdminCredentials } from '../../hooks/useAdminAuth';
import { toast } from 'sonner';

export default function AdminLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, isLoggingIn } = useAdminAuth();
  const { data: isConfigured, isLoading: checkingConfig } = useIsAdminConfigured();
  const setCredentials = useSetAdminCredentials();

  const isSetupMode = isConfigured === false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (isSetupMode) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      try {
        await setCredentials.mutateAsync({ username, password });
        toast.success('Admin credentials set successfully! Please log in.');
        setPassword('');
        setConfirmPassword('');
      } catch (err: any) {
        setError(err.message || 'Failed to set credentials');
      }
    } else {
      try {
        await login({ username, password });
        toast.success('Login successful!');
        navigate({ to: '/admin' });
      } catch (err: any) {
        setError(err.message || 'Invalid username or password');
      }
    }
  };

  if (checkingConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/generated/smart-haiti-logo.dim_400x400.png"
              alt="SMART HAITI"
              className="h-16 w-16 object-contain"
            />
          </div>
          <CardTitle className="text-2xl text-center">
            {isSetupMode ? 'Setup Admin Account' : 'Admin Login'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSetupMode
              ? 'Create your administrator credentials to manage the SMART HAITI website'
              : 'Enter your credentials to access the admin panel'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={isSetupMode ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {isSetupMode && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              )}
            </div>

            {isSetupMode && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoggingIn || setCredentials.isPending}
            >
              {isLoggingIn || setCredentials.isPending
                ? 'Please wait...'
                : isSetupMode
                  ? 'Create Admin Account'
                  : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
