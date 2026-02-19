import { useState } from 'react';
import { useGetSponsors, useAddSponsor, useDeleteSponsor } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';

export default function AdminSponsorsPage() {
  const { data: sponsors, isLoading } = useGetSponsors();
  const addSponsor = useAddSponsor();
  const deleteSponsor = useDeleteSponsor();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !website.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    try {
      let logo: ExternalBlob | undefined;
      if (file) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        logo = ExternalBlob.fromBytes(bytes);
      }

      await addSponsor.mutateAsync({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        description: description.trim(),
        website: website.trim(),
        logo,
      });

      toast.success('Sponsor added successfully!');
      setOpen(false);
      setName('');
      setDescription('');
      setWebsite('');
      setFile(null);
    } catch (error) {
      console.error('Add sponsor error:', error);
      toast.error('Failed to add sponsor');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return;
    try {
      await deleteSponsor.mutateAsync(id);
      toast.success('Sponsor deleted successfully!');
    } catch (error) {
      console.error('Delete sponsor error:', error);
      toast.error('Failed to delete sponsor');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Sponsors Management</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Sponsor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Sponsor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
              </div>
              <div>
                <Label htmlFor="website">Website URL *</Label>
                <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" required />
              </div>
              <div>
                <Label htmlFor="file">Logo (optional)</Label>
                <Input id="file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : 'Add Sponsor'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sponsors?.map((sponsor) => (
          <Card key={sponsor.id}>
            <CardContent className="p-4">
              <div className="w-full h-24 flex items-center justify-center bg-muted rounded mb-3">
                <img
                  src={sponsor.logo?.getDirectURL() || '/assets/generated/sponsor-placeholder.dim_200x200.png'}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain p-2"
                />
              </div>
              <h3 className="font-semibold">{sponsor.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{sponsor.description}</p>
              <p className="text-xs text-muted-foreground mt-2 truncate">{sponsor.website}</p>
              <Button variant="destructive" size="sm" className="w-full mt-3" onClick={() => handleDelete(sponsor.id)}>
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
