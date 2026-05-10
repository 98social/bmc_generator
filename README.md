# SPO BMC Generator

사회적 목적 조직(SPO) 및 일반 기업을 위한 비즈니스 모델 캔버스(BMC) 자동 생성 서비스입니다. 사용자의 간단한 입력만으로 Google Gemini AI를 활용하여 전통적 9블록 BMC와 사회적 11블록 BMC를 동시에 생성하고, 논리적 타당성 피드백과 익명 커뮤니티 의견 기능을 제공합니다.

---

## 🚀 로컬 실행 방법 (테스트 모드)

로컬에서 DB 연결 없이 테스트하려면 `Mock 모드`를 사용할 수 있습니다.

1. **환경 변수 설정**: 루트 디렉토리에 `.env.local` 파일을 생성하고 다음을 입력합니다.
   ```env
   NEXT_PUBLIC_USE_MOCK=true
   ADMIN_PASSWORD=your_admin_password
   ```
2. **의존성 설치 및 실행**:
   ```bash
   npm install
   npm run dev
   ```
3. 브라우저에서 `http://localhost:3000`으로 접속합니다. (입력한 데이터는 로컬의 `data/mock-db.json`에 저장됩니다)

---

## 🌐 배포 가이드 (GitHub + Supabase + Vercel)

이 프로젝트를 실제 라이브 서비스로 배포하기 위한 전체 단계입니다.

### 1단계: GitHub에 코드 푸시하기

먼저 프로젝트를 자신의 GitHub 저장소에 업로드합니다.

1. [GitHub](https://github.com/)에 로그인하여 새로운 Repository를 생성합니다.
2. 터미널에서 다음 명령어를 실행하여 코드를 푸시합니다:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SPO BMC Generator"
   git branch -M main
   git remote add origin https://github.com/사용자이름/저장소이름.git
   git push -u origin main
   ```

### 2단계: Supabase 데이터베이스 세팅

실제 사용자 데이터를 저장하고 실시간 댓글 기능을 지원하기 위해 Supabase를 설정합니다.

1. [Supabase](https://supabase.com/)에 가입하고 **New Project**를 생성합니다.
2. 프로젝트 생성 후, 좌측 메뉴의 **SQL Editor**로 이동합니다.
3. 이 프로젝트에 포함된 `supabase/migrations/001_init.sql` 파일의 전체 내용을 복사하여 SQL Editor에 붙여넣고 **Run(실행)** 합니다. (테이블 생성 및 권한 설정 완료)
4. 좌측 톱니바퀴 아이콘(Project Settings) > **API** 메뉴로 이동합니다.
5. **Project URL**과 **anon/public Key** 값을 복사해 둡니다.

### 3단계: Vercel에 배포하기

Vercel을 통해 Next.js 프로젝트를 클라우드에 배포합니다.

1. [Vercel](https://vercel.com/)에 가입하고 **Add New... > Project**를 클릭합니다.
2. 1단계에서 생성한 GitHub 저장소를 **Import** 합니다.
3. **Environment Variables (환경 변수)** 섹션을 열고 다음 값들을 추가합니다:
   - `NEXT_PUBLIC_SUPABASE_URL`: (2단계에서 복사한 Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (2단계에서 복사한 anon Key)
   - `ADMIN_PASSWORD`: (본인이 사용할 관리자 삭제용 암호)
   - *(주의: `NEXT_PUBLIC_USE_MOCK` 변수는 추가하지 않거나 `false`로 설정해야 실제 DB에 연결됩니다.)*
4. **Deploy** 버튼을 클릭합니다.
5. 배포가 완료되면 발급된 도메인(예: `https://bmc-generator.vercel.app`)으로 접속하여 서비스를 확인합니다.

---

## 💡 환경 변수 보안 및 Vercel 설정 안내

**Q. `.env.local` 파일을 GitHub에 올려도 되나요?**  
**A. 절대 안 됩니다!** 실제 비밀번호나 키값이 들어있는 `.env.local` 파일은 깃허브에 올라가지 않도록 `.gitignore`에 설정되어 있습니다. 반면, `.env.example` 파일은 "어떤 변수가 필요한지" 구조만 알려주는 **빈 껍데기 템플릿**이므로 깃허브에 공유되어도 안전합니다.

**Q. 그렇다면 Vercel에는 어떻게 환경 변수를 전달하나요?**  
**A. Vercel 웹 대시보드에 직접 입력합니다.** 
Vercel은 깃허브 코드를 가져갈 때 `.env.local` 파일을 가져가지 않습니다. 대신 아래와 같이 안전하게 변수를 주입합니다:
1. Vercel 웹사이트 로그인 후 배포된 프로젝트 세팅 메뉴로 들어갑니다.
2. `Settings` > `Environment Variables` 탭을 엽니다.
3. 표에 정리된 변수명(`NEXT_PUBLIC_SUPABASE_URL` 등)과 실제 발급받은 값을 입력창에 직접 넣고 **Save** 합니다.
4. 설정 후 `Deployments` 탭에서 **Redeploy(재배포)**를 누르면, Vercel 서버 내부에서만 이 변수들을 읽어들여 안전하게 서비스가 구동됩니다.

| 변수명 | 설명 | 비고 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Vercel 배포 시 필수 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 프로젝트 Anon Key | Vercel 배포 시 필수 |
| `ADMIN_PASSWORD` | 부적절한 캔버스/댓글 삭제용 암호 | 웹 UI 관리자 인증 시 사용 |
| `NEXT_PUBLIC_USE_MOCK` | 로컬 DB 생략 여부 (`true` / `false`) | Vercel 배포 시 설정하지 않거나 `false`로 설정 |

*(Gemini API Key는 서버 환경 변수에 일절 저장되지 않으며, 서비스 이용자가 브라우저 UI에서 직접 발급받아 입력하도록 완전히 분리되어 있습니다.)*

