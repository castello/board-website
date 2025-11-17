import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditForm from './EditForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPost({ params }: PageProps) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
  });

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
