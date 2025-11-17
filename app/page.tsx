import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database';

export const dynamic = 'force-dynamic';

type Post = Tables<'posts'>;

export default async function Home() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">게시판</h1>
          <Link
            href="/posts/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            글쓰기
          </Link>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            게시글이 없습니다. 첫 번째 글을 작성해보세요!
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post: Post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>작성자: {post.author}</span>
                  <span>
                    {new Date(post.created_at || '').toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
