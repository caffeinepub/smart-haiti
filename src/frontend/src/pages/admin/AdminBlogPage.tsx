import { useState } from 'react';
import { useGetBlogPosts, useAddBlogPost, useDeleteBlogPost } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';

export default function AdminBlogPage() {
  const { data: posts, isLoading } = useGetBlogPosts();
  const addPost = useAddBlogPost();
  const deletePost = useDeleteBlogPost();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let featuredImage: ExternalBlob | undefined;
      if (file) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        featuredImage = ExternalBlob.fromBytes(bytes);
      }

      await addPost.mutateAsync({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        date: new Date().toISOString(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        featuredImage,
      });

      toast.success('Blog post added successfully!');
      setOpen(false);
      setTitle('');
      setContent('');
      setAuthor('');
      setTags('');
      setFile(null);
    } catch (error) {
      toast.error('Failed to add blog post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deletePost.mutateAsync(id);
      toast.success('Post deleted!');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Blog Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <Label>Author *</Label>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} required />
              </div>
              <div>
                <Label>Content *</Label>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} required />
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="education, mentorship" />
              </div>
              <div>
                <Label>Featured Image</Label>
                <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <Button type="submit" className="w-full">Add Post</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4 flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-muted-foreground">{post.author} • {new Date(post.date).toLocaleDateString()}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
