import { useGetContactSubmissions, useDeleteContactSubmission } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminContactSubmissionsPage() {
  const { data: submissions, isLoading } = useGetContactSubmissions();
  const deleteSubmission = useDeleteContactSubmission();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      await deleteSubmission.mutateAsync(id);
      toast.success('Submission deleted successfully!');
    } catch (error) {
      console.error('Delete submission error:', error);
      toast.error('Failed to delete submission');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const sortedSubmissions = submissions?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contact Submissions</h2>

      {sortedSubmissions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No contact submissions yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{submission.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      From: {submission.name} ({submission.email})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(submission.date).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(submission.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
