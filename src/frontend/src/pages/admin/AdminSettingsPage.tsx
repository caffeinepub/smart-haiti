import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGetSiteSettings, useUpdateSiteSettings } from '../../hooks/useQueries';
import { ExternalBlob } from '../../backend';
import { Loader2, Upload, Eye, EyeOff } from 'lucide-react';
import { useSetAdminCredentials } from '../../hooks/useAdminAuth';

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useGetSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const setCredentials = useSetAdminCredentials();

  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [logoProgress, setLogoProgress] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);

  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  useState(() => {
    if (settings) {
      setWhatsappNumber(settings.whatsappNumber || '');
    }
  });

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!settings) return;

    try {
      await updateSettings.mutateAsync({
        whatsappNumber,
        logo: settings.logo,
        heroBackground: settings.heroBackground,
      });
      toast.success('WhatsApp number updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update WhatsApp number');
    }
  };

  const handleLogoUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!logoFile || !settings) return;

    try {
      const bytes = new Uint8Array(await logoFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setLogoProgress(percentage);
      });

      await updateSettings.mutateAsync({
        whatsappNumber: settings.whatsappNumber,
        logo: blob,
        heroBackground: settings.heroBackground,
      });

      toast.success('Logo updated successfully!');
      setLogoFile(null);
      setLogoProgress(0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update logo');
      setLogoProgress(0);
    }
  };

  const handleHeroUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!heroFile || !settings) return;

    try {
      const bytes = new Uint8Array(await heroFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setHeroProgress(percentage);
      });

      await updateSettings.mutateAsync({
        whatsappNumber: settings.whatsappNumber,
        logo: settings.logo,
        heroBackground: blob,
      });

      toast.success('Hero background updated successfully!');
      setHeroFile(null);
      setHeroProgress(0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update hero background');
      setHeroProgress(0);
    }
  };

  const handleCredentialsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newUsername.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await setCredentials.mutateAsync({
        username: newUsername,
        password: newPassword,
      });
      toast.success('Admin credentials updated successfully! Please log in again with your new credentials.');
      setNewUsername('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update credentials');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Admin Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Credentials</CardTitle>
            <CardDescription>
              Update your administrator username and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCredentialsUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newUsername">New Username</Label>
                <Input
                  id="newUsername"
                  type="text"
                  placeholder="Enter new username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  minLength={3}
                />
                <p className="text-xs text-muted-foreground">
                  Username must be at least 3 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPasswords ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <Button
                type="submit"
                disabled={setCredentials.isPending}
                className="gap-2"
              >
                {setCredentials.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Credentials
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* WhatsApp Number */}
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Contact</CardTitle>
            <CardDescription>
              Set the WhatsApp number for the floating contact button (digits only, no + symbol)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  type="text"
                  placeholder="e.g., 15095551234"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the full number with country code (11-15 digits, no spaces or symbols)
                </p>
              </div>
              <Button
                type="submit"
                disabled={updateSettings.isPending}
                className="gap-2"
              >
                {updateSettings.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save WhatsApp Number
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Site Logo</CardTitle>
            <CardDescription>Upload a new logo for the website header</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogoUpload} className="space-y-4">
              {settings?.logo && (
                <div className="space-y-2">
                  <Label>Current Logo</Label>
                  <img
                    src={settings.logo.getDirectURL()}
                    alt="Current logo"
                    className="h-24 w-24 object-contain border rounded-lg p-2"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="logo">Upload New Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
              </div>
              {logoProgress > 0 && logoProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{logoProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${logoProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <Button
                type="submit"
                disabled={!logoFile || updateSettings.isPending || logoProgress > 0}
                className="gap-2"
              >
                {updateSettings.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload Logo
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Hero Background Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Background</CardTitle>
            <CardDescription>Upload a new background image for the homepage hero section</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleHeroUpload} className="space-y-4">
              {settings?.heroBackground && (
                <div className="space-y-2">
                  <Label>Current Hero Background</Label>
                  <img
                    src={settings.heroBackground.getDirectURL()}
                    alt="Current hero background"
                    className="w-full max-w-md h-48 object-cover border rounded-lg"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="hero">Upload New Hero Background</Label>
                <Input
                  id="hero"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                />
              </div>
              {heroProgress > 0 && heroProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{heroProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${heroProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <Button
                type="submit"
                disabled={!heroFile || updateSettings.isPending || heroProgress > 0}
                className="gap-2"
              >
                {updateSettings.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload Hero Background
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
