import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
      <div className="mb-8">
        <XCircle className="h-24 w-24 text-destructive mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your donation was not completed. If you experienced any issues, please try again or contact us for
          assistance.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/donate">
          <Button size="lg">Try Again</Button>
        </Link>
        <Link to="/contact">
          <Button size="lg" variant="outline">
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  );
}
