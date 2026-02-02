import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="content-wrapper">{children}</div>
      </main>

      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            var(--gray-50) 0%,
            var(--gray-100) 100%
          );
        }

        .main-content {
          flex: 1;
          overflow-y: auto;
          width: 100%;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: var(--spacing-xl) var(--spacing-xl);
        }

        @media (max-width: 768px) {
          .content-wrapper {
            padding: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
}
