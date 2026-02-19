import { useState, useEffect } from 'react';
import { useIsStripeConfigured, useSetStripeConfiguration } from '../../hooks/useStripeCheckout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function StripeConfigPage() {
  const { data: isConfigured, isLoading } = useIsStripeConfigured();
  const setConfig = useSetStripeConfiguration();
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US,CA,GB,FR,DE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      toast.error('Please enter your Stripe secret key');
      return;
    }

    const countryList = countries.split(',').map(c => c.trim()).filter(Boolean);
    if (countryList.length === 0) {
      toast.error('Please enter at least one country code');
      return;
    }

    try {
      await setConfig.mutateAsync({
        secretKey: secretKey.trim(),
        allowedCountries: countryList,
      });
      toast.success('Stripe configuration saved successfully!');
      setSecretKey('');
    } catch (error) {
      console.error('Stripe config error:', error);
      toast.error('Failed to save Stripe configuration');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Stripe Configuration</h2>

      {isConfigured && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Stripe is currently configured and active. You can update the configuration below.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Configure Stripe Payment Processing</CardTitle>
          <CardDescription>
            Enter your Stripe secret key and allowed countries to enable donation processing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="secretKey">Stripe Secret Key *</Label>
              <Input
                id="secretKey"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="sk_test_..."
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Find this in your Stripe Dashboard under Developers → API keys
              </p>
            </div>
            <div>
              <Label htmlFor="countries">Allowed Countries (comma-separated) *</Label>
              <Input
                id="countries"
                value={countries}
                onChange={(e) => setCountries(e.target.value)}
                placeholder="US,CA,GB,FR,DE"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use ISO 3166-1 alpha-2 country codes (e.g., US, CA, GB)
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={setConfig.isPending}>
              {setConfig.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Configuration'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Testing Stripe</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Use these test card numbers in test mode:
          </p>
          <ul className="text-sm space-y-2">
            <li><strong>Success:</strong> 4242 4242 4242 4242</li>
            <li><strong>Decline:</strong> 4000 0000 0000 0002</li>
            <li>Use any future expiry date and any 3-digit CVC</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
