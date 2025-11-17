# MCP (Model Context Protocol) 설정 가이드

이 프로젝트는 Playwright MCP 서버를 통해 브라우저 자동화 테스트를 지원합니다.

## MCP란?

MCP(Model Context Protocol)는 AI 애플리케이션이 외부 도구 및 데이터 소스와 통신할 수 있게 해주는 프로토콜입니다.

## Playwright MCP 서버

Playwright MCP 서버를 사용하면 Claude나 다른 AI 도구가 다음 작업을 수행할 수 있습니다:

- 웹 페이지 탐색 및 스크린샷
- 폼 작성 및 제출
- 버튼 클릭 및 상호작용
- E2E 테스트 자동화

## Claude Desktop에서 설정하기

### 1. Claude Desktop 설정 파일 위치

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### 2. 설정 파일 편집

설정 파일을 열고 다음 내용을 추가합니다:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@executeautomation/playwright-mcp-server"
      ],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true"
      }
    }
  }
}
```

기존 설정이 있다면 `mcpServers` 객체 안에 `playwright` 항목을 추가하세요.

### 3. Claude Desktop 재시작

설정 파일을 저장한 후 Claude Desktop을 완전히 종료하고 다시 시작합니다.

### 4. 연결 확인

Claude Desktop을 열고 채팅창에서 다음과 같이 확인할 수 있습니다:
- 좌측 하단에 🔌 아이콘이 표시되면 MCP 서버가 연결된 것입니다
- "playwright 도구를 사용해서 웹사이트를 테스트해줘" 같은 명령을 시도해보세요

## 프로젝트 로컬 설정

이 프로젝트의 `mcp.json` 파일은 참조용입니다. 실제로 MCP 서버를 사용하려면 위의 Claude Desktop 설정이 필요합니다.

## Playwright 사용 예시

Claude에게 다음과 같은 작업을 요청할 수 있습니다:

```
이 게시판 웹사이트를 테스트해줘:
1. localhost:3001 접속
2. "글쓰기" 버튼 클릭
3. 제목과 내용 입력
4. 게시글 작성
5. 스크린샷 캡처
```

## Headless 모드 설정

브라우저를 보면서 테스트하려면:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@executeautomation/playwright-mcp-server"
      ],
      "env": {
        "PLAYWRIGHT_HEADLESS": "false"
      }
    }
  }
}
```

## 문제 해결

### MCP 서버가 연결되지 않을 때

1. Claude Desktop을 완전히 종료하고 재시작
2. 설정 파일의 JSON 문법이 올바른지 확인
3. 터미널에서 직접 실행해보기:
   ```bash
   npx -y @executeautomation/playwright-mcp-server
   ```

### 권한 오류

macOS에서 권한 오류가 발생하면:
```bash
sudo npm install -g @executeautomation/playwright-mcp-server
```

## 추가 리소스

- [MCP 공식 문서](https://modelcontextprotocol.io/)
- [Playwright 문서](https://playwright.dev/)
- [Claude Desktop 설정 가이드](https://docs.anthropic.com/claude/docs)
