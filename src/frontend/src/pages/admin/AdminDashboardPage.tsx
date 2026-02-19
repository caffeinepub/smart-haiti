import { useGetGalleryImages, useGetVideos, useGetBlogPosts, useGetEvents, useGetContactSubmissions } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Video, FileText, Calendar, Mail } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: images } = useGetGalleryImages();
  const { data: videos } = useGetVideos();
  const { data: posts } = useGetBlogPosts();
  const { data: events } = useGetEvents();
  const { data: submissions } = useGetContactSubmissions();

  const stats = [
    { label: 'Gallery Images', value: images?.length || 0, icon: Image },
    { label: 'Videos', value: videos?.length || 0, icon: Video },
    { label: 'Blog Posts', value: posts?.length || 0, icon: FileText },
    { label: 'Events', value: events?.length || 0, icon: Calendar },
    { label: 'Contact Messages', value: submissions?.length || 0, icon: Mail },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
