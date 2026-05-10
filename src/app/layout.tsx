import type { Metadata } from "next";
import "./globals.css";
import { ApiKeyProvider } from "@/context/ApiKeyContext";
import ApiKeyBanner from "@/components/layout/ApiKeyBanner";
import AdminAction from "@/components/admin/AdminAction";

export const metadata: Metadata = {
  title: "SPO BMC Generator | 사회적 비즈니스 모델 캔버스 생성기",
  description: "AI를 사용하여 전통적 BMC와 사회적(SPO) BMC를 생성하고 공유하세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ApiKeyProvider>
          <ApiKeyBanner />
          <AdminAction />
          <div className="layout-container">
            <header className="global-header">
              <div className="container">
                <nav className="nav">
                  <div className="logo">
                    <span className="logo-icon">🚀</span>
                    <span className="logo-text">SPO BMC Generator</span>
                  </div>
                  <div className="nav-links">
                    <a href="/">생성하기</a>
                    <a href="/gallery">둘러보기</a>
                  </div>
                </nav>
              </div>
            </header>
            
            <main className="main-content">
              {children}
            </main>
            
            <footer className="global-footer">
              <div className="container">
                <p>© 2026 SPO BMC Generator. All rights reserved.</p>
                <p className="footer-muted">사회적 목적 조직(SPO)을 위한 비즈니스 모델 혁신 도구</p>
              </div>
            </footer>
          </div>
        </ApiKeyProvider>
      </body>
    </html>
  );
}
