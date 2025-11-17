import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PostActions from './PostActions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetail({ params }: PageProps) {
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
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex justify-between items-center text-sm text-gray-600 mb-6 pb-4 border-b">
            <span>작성자: {post.author}</span>
            <div className="flex gap-4">
              <span>작성일: {new Date(post.createdAt).toLocaleString('ko-KR')}</span>
              {post.updatedAt !== post.createdAt && (
                <span>수정일: {new Date(post.updatedAt).toLocaleString('ko-KR')}</span>
              )}
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="whitespace-pre-wrap text-gray-800">{post.content}</p>
          </div>

          <PostActions postId={post.id} />
        </div>
      </div>
    </div>
  );
}
