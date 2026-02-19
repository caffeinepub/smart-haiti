import { useGetVideos } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { Play } from 'lucide-react';

function extractVideoId(url: string): { platform: 'youtube' | 'vimeo' | null; id: string | null } {
  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return { platform: 'youtube', id: youtubeMatch[1] };
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return { platform: 'vimeo', id: vimeoMatch[1] };
  }

  return { platform: null, id: null };
}

export default function VideosPage() {
  const { data: videos, isLoading } = useGetVideos();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-12 w-64 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Conference Videos</h1>
          <p className="text-lg opacity-90">Watch our inspiring conferences and events</p>
        </div>
      </section>

      {/* Videos Grid */}
      <div className="container mx-auto px-4 py-16">
        {!videos || videos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No videos available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const { platform, id } = extractVideoId(video.url);
              const thumbnailUrl = video.thumbnail
                ? video.thumbnail.getDirectURL()
                : platform === 'youtube'
                  ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
                  : platform === 'vimeo'
                    ? `https://vumbnail.com/${id}.jpg`
                    : '/assets/generated/sponsor-placeholder.dim_200x200.png';

              return (
                <div
                  key={video.id}
                  className="group cursor-pointer bg-card rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedVideo(video.url);
                    setSelectedTitle(video.title);
                  }}
                >
                  <div className="relative aspect-video bg-muted">
                    <img src={thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="h-8 w-8 text-primary ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTitle}</DialogTitle>
          </DialogHeader>
          {selectedVideo && (() => {
            const { platform, id } = extractVideoId(selectedVideo);
            if (platform === 'youtube' && id) {
              return (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              );
            } else if (platform === 'vimeo' && id) {
              return (
                <div className="aspect-video">
                  <iframe
                    src={`https://player.vimeo.com/video/${id}`}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              );
            }
            return <p className="text-muted-foreground">Unable to load video</p>;
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
