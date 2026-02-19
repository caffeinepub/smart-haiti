import { useGetSponsors } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export default function SponsorsPage() {
  const { data: sponsors, isLoading } = useGetSponsors();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-12 w-64 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Sponsors & Partners</h1>
          <p className="text-lg opacity-90">Thank you to our amazing supporters who make our work possible</p>
        </div>
      </section>

      {/* Sponsors Grid */}
      <div className="container mx-auto px-4 py-16">
        {!sponsors || sponsors.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              We're building partnerships to expand our impact. Interested in becoming a sponsor?{' '}
              <a href="/contact" className="text-primary hover:underline">
                Contact us
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-full h-32 flex items-center justify-center bg-muted rounded-lg mb-4 p-4">
                      <img
                        src={sponsor.logo?.getDirectURL() || '/assets/generated/sponsor-placeholder.dim_200x200.png'}
                        alt={sponsor.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {sponsor.name}
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{sponsor.description}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Become a Sponsor</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Partner with us to empower the next generation of Haitian leaders. Your support creates lasting change in
            communities across Haiti.
          </p>
          <a href="/contact">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Get in Touch
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
