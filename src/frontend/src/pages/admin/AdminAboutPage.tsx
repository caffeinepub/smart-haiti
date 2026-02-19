import { useState } from 'react';
import { useGetAboutSections, useAddAboutSection, useDeleteAboutSection } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';

export default function AdminAboutPage() {
  const { data: sections, isLoading } = useGetAboutSections();
  const addSection = useAddAboutSection();
  const deleteSection = useDeleteAboutSection();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    try {
      let image: ExternalBlob | undefined;
      if (file) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        image = ExternalBlob.fromBytes(bytes);
      }

      await addSection.mutateAsync({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        content: content.trim(),
        image,
      });

      toast.success('About section added successfully!');
      setOpen(false);
      setTitle('');
      setContent('');
      setFile(null);
    } catch (error) {
      console.error('Add about section error:', error);
      toast.error('Failed to add about section');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    try {
      await deleteSection.mutateAsync(id);
      toast.success('Section deleted successfully!');
    } catch (error) {
      console.error('Delete section error:', error);
      toast.error('Failed to delete section');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">About Sections Management</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add About Section</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Our Mission, Our Vision" required />
              </div>
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} required />
              </div>
              <div>
                <Label htmlFor="file">Image (optional)</Label>
                <Input id="file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : 'Add Section'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {sections?.map((section) => (
          <Card key={section.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{section.content}</p>
                  {section.image && (
                    <p className="text-xs text-muted-foreground mt-2">✓ Has image</p>
                  )}
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(section.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
