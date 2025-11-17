import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import EditForm from './EditForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPost({ params }: PageProps) {
  const { id } = await params;
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">글 수정</h1>
        </div>

        <EditForm post={post} />
      </div>
    </div>
  );
}
