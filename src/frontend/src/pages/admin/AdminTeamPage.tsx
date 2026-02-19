import { useState } from 'react';
import { useGetTeamMembers, useAddTeamMember, useDeleteTeamMember } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';

export default function AdminTeamPage() {
  const { data: members, isLoading } = useGetTeamMembers();
  const addMember = useAddTeamMember();
  const deleteMember = useDeleteTeamMember();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !bio.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    try {
      let photo: ExternalBlob | undefined;
      if (file) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        photo = ExternalBlob.fromBytes(bytes);
      }

      await addMember.mutateAsync({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        role: role.trim(),
        bio: bio.trim(),
        photo,
      });

      toast.success('Team member added successfully!');
      setOpen(false);
      setName('');
      setRole('');
      setBio('');
      setFile(null);
    } catch (error) {
      console.error('Add team member error:', error);
      toast.error('Failed to add team member');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      await deleteMember.mutateAsync(id);
      toast.success('Team member deleted successfully!');
    } catch (error) {
      console.error('Delete team member error:', error);
      toast.error('Failed to delete team member');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Director, Mentor" required />
              </div>
              <div>
                <Label htmlFor="bio">Bio *</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} required />
              </div>
              <div>
                <Label htmlFor="file">Photo (optional)</Label>
                <Input id="file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : 'Add Team Member'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members?.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={member.photo?.getDirectURL() || '/assets/generated/staff-placeholder.dim_300x300.png'}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{member.bio}</p>
                </div>
              </div>
              <Button variant="destructive" size="sm" className="w-full mt-3" onClick={() => handleDelete(member.id)}>
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
