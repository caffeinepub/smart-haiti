import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AdminLoginButton from '../auth/AdminLoginButton';
import { useGetPublicSiteSettings } from '../../hooks/useQueries';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { data: siteSettings } = useGetPublicSiteSettings();

  const navLinks = [
    { label: 'About', path: '/about' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Videos', path: '/videos' },
    { label: 'Events', path: '/events' },
    { label: 'Blog', path: '/blog' },
    { label: 'Team', path: '/team' },
    { label: 'Sponsors', path: '/sponsors' },
    { label: 'Contact', path: '/contact' },
  ];

  const logoUrl = siteSettings?.logo
    ? siteSettings.logo.getDirectURL()
    : '/assets/generated/smart-haiti-logo.dim_400x400.png';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={logoUrl}
              alt="SMART HAITI"
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-primary">SMART HAITI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Button
              onClick={() => navigate({ to: '/donate' })}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              Donate
            </Button>
            <AdminLoginButton />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-3 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button
              onClick={() => {
                navigate({ to: '/donate' });
                setMobileMenuOpen(false);
              }}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              Donate
            </Button>
            <div className="pt-2">
              <AdminLoginButton />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
