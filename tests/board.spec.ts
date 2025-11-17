import { test, expect } from '@playwright/test';

test.describe('게시판 기능 테스트', () => {
  test('메인 페이지 로드', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('게시판');
    await expect(page.getByRole('link', { name: '글쓰기' })).toBeVisible();
  });

  test('게시글 작성 플로우', async ({ page }) => {
    // 메인 페이지로 이동
    await page.goto('/');

    // 글쓰기 버튼 클릭
    await page.getByRole('link', { name: '글쓰기' }).click();
    await expect(page).toHaveURL('/posts/new');

    // 폼 작성
    await page.getByLabel('제목').fill('테스트 게시글');
    await page.getByLabel('작성자').fill('테스터');
    await page.getByLabel('내용').fill('이것은 Playwright 테스트로 작성된 게시글입니다.');

    // 작성하기 버튼 클릭
    await page.getByRole('button', { name: '작성하기' }).click();

    // 메인 페이지로 리다이렉트되었는지 확인
    await expect(page).toHaveURL('/');

    // 작성한 게시글이 목록에 표시되는지 확인
    await expect(page.locator('text=테스트 게시글')).toBeVisible();
  });

  test('게시글 상세 보기', async ({ page }) => {
    await page.goto('/');

    // 첫 번째 게시글 클릭
    const firstPost = page.locator('a[href^="/posts/"]').first();
    await firstPost.click();

    // 상세 페이지 요소 확인
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('link', { name: '목록으로' })).toBeVisible();
    await expect(page.getByRole('link', { name: '수정' })).toBeVisible();
    await expect(page.getByRole('button', { name: '삭제' })).toBeVisible();
  });

  test('게시글 수정', async ({ page }) => {
    await page.goto('/');

    // 첫 번째 게시글 클릭
    await page.locator('a[href^="/posts/"]').first().click();

    // 수정 버튼 클릭
    await page.getByRole('link', { name: '수정' }).click();

    // 제목 수정
    const titleInput = page.getByLabel('제목');
    await titleInput.clear();
    await titleInput.fill('수정된 제목');

    // 수정하기 버튼 클릭
    await page.getByRole('button', { name: '수정하기' }).click();

    // 상세 페이지로 돌아왔는지 확인
    await expect(page.locator('h1')).toContainText('수정된 제목');
  });

  test('게시글 삭제', async ({ page }) => {
    await page.goto('/');

    // 게시글 개수 확인
    const initialCount = await page.locator('a[href^="/posts/"]').count();

    if (initialCount > 0) {
      // 첫 번째 게시글 클릭
      await page.locator('a[href^="/posts/"]').first().click();

      // 삭제 확인 다이얼로그 처리
      page.on('dialog', dialog => dialog.accept());

      // 삭제 버튼 클릭
      await page.getByRole('button', { name: '삭제' }).click();

      // 메인 페이지로 리다이렉트되었는지 확인
      await expect(page).toHaveURL('/');
    }
  });
});
