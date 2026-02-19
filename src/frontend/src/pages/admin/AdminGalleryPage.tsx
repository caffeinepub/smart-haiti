import { useState } from 'react';
import { useGetGalleryImages, useAddGalleryImage, useUpdateGalleryImage, useDeleteGalleryImage } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';

export default function AdminGalleryPage() {
  const { data: images, isLoading } = useGetGalleryImages();
  const addImage = useAddGalleryImage();
  const deleteImage = useDeleteGalleryImage();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [school, setSchool] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim() || !school.trim() || !category.trim()) {
      toast.error('Please fill in all fields and select an image');
      return;
    }

    setUploading(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);

      await addImage.mutateAsync({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        description: description.trim(),
        school: school.trim(),
        category: category.trim(),
        image: blob,
      });

      toast.success('Image added successfully!');
      setOpen(false);
      setTitle('');
      setDescription('');
      setSchool('');
      setCategory('');
      setFile(null);
    } catch (error) {
      console.error('Add image error:', error);
      toast.error('Failed to add image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      await deleteImage.mutateAsync(id);
      toast.success('Image deleted successfully!');
    } catch (error) {
      console.error('Delete image error:', error);
      toast.error('Failed to delete image');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Gallery Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="school">School *</Label>
                <Input id="school" value={school} onChange={(e) => setSchool(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., conference, mentorship" required />
              </div>
              <div>
                <Label htmlFor="file">Image *</Label>
                <Input id="file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
              </div>
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</> : 'Add Image'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images?.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-4">
              <img src={image.image.getDirectURL()} alt={image.title} className="w-full h-48 object-cover rounded mb-3" />
              <h3 className="font-semibold">{image.title}</h3>
              <p className="text-sm text-muted-foreground">{image.school}</p>
              <Button variant="destructive" size="sm" className="mt-3 w-full" onClick={() => handleDelete(image.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
