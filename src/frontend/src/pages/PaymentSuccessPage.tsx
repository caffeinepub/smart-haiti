import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
      <div className="mb-8">
        <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Thank You for Your Donation!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your generous support helps us empower students across Haiti. We've sent a confirmation email to your inbox.
        </p>
        <p className="text-muted-foreground mb-8">
          Your contribution makes a real difference in the lives of secondary school students, providing them with
          access to quality education, mentorship, and opportunities for growth.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/">
          <Button size="lg">Return to Home</Button>
        </Link>
        <Link to="/gallery">
          <Button size="lg" variant="outline">
            See Our Impact
          </Button>
        </Link>
      </div>
    </div>
  );
}
