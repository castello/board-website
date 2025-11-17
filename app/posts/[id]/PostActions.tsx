'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PostActionsProps {
  postId: number;
}

export default function PostActions({ postId }: PostActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex gap-4">
      <Link
        href="/"
        className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-center"
      >
        목록으로
      </Link>
      <Link
        href={`/posts/${postId}/edit`}
        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
      >
        수정
      </Link>
      <button
        onClick={handleDelete}
        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        삭제
      </button>
    </div>
  );
}
