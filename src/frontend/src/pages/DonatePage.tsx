import { useState } from 'react';
import { useCreateCheckoutSession, useIsStripeConfigured } from '../hooks/useStripeCheckout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DonatePage() {
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const createCheckoutSession = useCreateCheckoutSession();
  const { data: isConfigured, isLoading: configLoading } = useIsStripeConfigured();

  const suggestedAmounts = [25, 50, 100, 250];

  const handleDonate = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;

    if (!finalAmount || finalAmount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    try {
      const items = [
        {
          productName: frequency === 'monthly' ? 'Monthly Donation to SMART HAITI' : 'Donation to SMART HAITI',
          productDescription: `Support our mission to empower Haitian students`,
          priceInCents: BigInt(Math.round(finalAmount * 100)),
          currency: 'usd',
          quantity: BigInt(1),
        },
      ];

      const session = await createCheckoutSession.mutateAsync(items);
      if (!session?.url) throw new Error('Stripe session missing url');
      window.location.href = session.url;
    } catch (error) {
      console.error('Donation error:', error);
      toast.error('Failed to process donation. Please try again.');
    }
  };

  if (configLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert>
          <AlertDescription>
            Donation system is being configured. Please check back soon or contact us directly to support our mission.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <section
        className="relative h-[400px] flex items-center justify-center text-white"
        style={{
          backgroundImage: 'url(/assets/generated/donation-hero.dim_1200x500.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Our Mission</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Your donation helps us provide quality education, mentorship, and opportunities to students across Haiti
          </p>
        </div>
      </section>

      {/* Donation Form */}
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Make a Donation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Frequency */}
            <div>
              <Label className="text-base mb-3 block">Donation Frequency</Label>
              <RadioGroup value={frequency} onValueChange={(v) => setFrequency(v as 'one-time' | 'monthly')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <Label htmlFor="one-time" className="cursor-pointer">
                    One-time
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly" className="cursor-pointer">
                    Monthly (recurring)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Suggested Amounts */}
            <div>
              <Label className="text-base mb-3 block">Select Amount</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {suggestedAmounts.map((amt) => (
                  <Button
                    key={amt}
                    variant={amount === amt && !customAmount ? 'default' : 'outline'}
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount('');
                    }}
                    className="h-16 text-lg"
                  >
                    ${amt}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <Label htmlFor="custom-amount" className="text-base mb-2 block">
                Or Enter Custom Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="custom-amount"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="pl-8 h-12 text-lg"
                />
              </div>
            </div>

            {/* Donate Button */}
            <Button
              onClick={handleDonate}
              disabled={createCheckoutSession.isPending}
              className="w-full h-14 text-lg bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {createCheckoutSession.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-5 w-5" />
                  Donate ${customAmount || amount}
                  {frequency === 'monthly' && '/month'}
                </>
              )}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Your donation is secure and will be processed through Stripe. Thank you for supporting SMART HAITI!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
