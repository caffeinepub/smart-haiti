import { useGetAboutSections } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function AboutPage() {
  const { data: sections, isLoading } = useGetAboutSections();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-12 w-64 mx-auto mb-8" />
        <div className="space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const sortedSections = sections?.sort((a, b) => a.id.localeCompare(b.id)) || [];

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About SMART HAITI</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Learn more about our mission, vision, and the impact we're making in Haitian communities
          </p>
        </div>
      </section>

      {/* Sections */}
      <div className="container mx-auto px-4 py-16">
        {sortedSections.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No content available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-16">
            {sortedSections.map((section, index) => (
              <div
                key={section.id}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
              >
                {section.image && (
                  <div className="w-full md:w-1/2">
                    <img
                      src={section.image.getDirectURL()}
                      alt={section.title}
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                )}
                <div className={`w-full ${section.image ? 'md:w-1/2' : ''}`}>
                  <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                  <div className="prose prose-lg max-w-none text-muted-foreground">
                    {section.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
