import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PostActions from './PostActions';
import CommentSection from './CommentSection';
import type { Tables } from '@/types/database';

interface PageProps {
  params: Promise<{ id: string }>;
}

type Post = Tables<'posts'>;
type Comment = Tables<'comments'>;

export default async function PostDetail({ params }: PageProps) {
  const { id } = await params;

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (!post) {
    notFound();
  }

  // Increment view count
  await supabase
    .from('posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('id', id);

  // Get comments
  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', id)
    .order('created_at', { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex justify-between items-center text-sm text-gray-600 mb-6 pb-4 border-b">
            <div className="flex gap-4">
              <span>작성자: {post.author}</span>
              <span>조회수: {(post.view_count || 0) + 1}</span>
            </div>
            <div className="flex gap-4">
              <span>작성일: {new Date(post.created_at || '').toLocaleString('ko-KR')}</span>
              {post.updated_at !== post.created_at && (
                <span>수정일: {new Date(post.updated_at || '').toLocaleString('ko-KR')}</span>
              )}
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="whitespace-pre-wrap text-gray-800">{post.content}</p>
          </div>

          <PostActions postId={post.id} />
        </div>

        <CommentSection postId={post.id} initialComments={comments || []} />
      </div>
    </div>
  );
}
