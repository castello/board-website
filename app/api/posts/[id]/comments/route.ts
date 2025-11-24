import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/posts/[id]/comments - 특정 게시글의 모든 댓글 조회
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/posts/[id]/comments - 새 댓글 생성
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { author, content } = body;

    if (!author || !content) {
      return NextResponse.json(
        { error: 'Author and content are required' },
        { status: 400 }
      );
    }

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        post_id: id,
        author,
        content,
      })
      .select()
      .single();

    if (error) throw error;

    // 자동 응답 시스템: 게시글 작성자가 자동으로 감사 댓글 작성
    try {
      // 게시글 작성자 조회
      const { data: post } = await supabase
        .from('posts')
        .select('author')
        .eq('id', id)
        .single();

      // 댓글 작성자가 게시글 작성자와 다른 경우에만 자동 응답
      if (post && post.author !== author) {
        const autoReplyMessages = [
          '댓글 감사합니다! 🙏',
          '의견 감사드립니다!',
          '소중한 댓글 감사합니다!',
          '댓글 남겨주셔서 감사해요!',
          '관심 가져주셔서 감사합니다! 😊',
        ];

        // 랜덤 메시지 선택
        const randomMessage = autoReplyMessages[
          Math.floor(Math.random() * autoReplyMessages.length)
        ];

        // 자동 응답 댓글 생성 (에러가 나도 원래 댓글은 성공)
        await supabase
          .from('comments')
          .insert({
            post_id: id,
            author: post.author,
            content: randomMessage,
          });
      }
    } catch (autoReplyError) {
      // 자동 응답 실패해도 원래 댓글은 성공으로 처리
      console.error('Auto-reply failed:', autoReplyError);
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
