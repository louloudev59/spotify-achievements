import React from "react";
import { SidebarPage } from "./components/SidebarPage";
import "./css/app.module.scss";

if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    localStorage.setItem("debug_app_crash", `${e.message} at ${e.filename}:${e.lineno}:${e.colno}\n${e.error?.stack || ""}`);
  });
  window.addEventListener("unhandledrejection", (e) => {
    localStorage.setItem("debug_app_crash", `Unhandled Rejection: ${e.reason?.message || String(e.reason)}\n${e.reason?.stack || ""}`);
  });
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    localStorage.setItem("debug_react_crash", `${error.message}\n${error.stack}\nComponent Stack:\n${errorInfo.componentStack}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "40px",
          color: "#fff",
          background: "#121212",
          fontFamily: "monospace",
          height: "100vh",
          overflowY: "auto"
        }}>
          <h1 style={{ color: "#ff5555", fontSize: "24px", marginBottom: "20px" }}>🚨 Crash de l'application Achievements</h1>
          <p style={{ fontSize: "14px", marginBottom: "15px" }}>Une erreur React s'est produite lors du rendu :</p>
          <div style={{
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "6px",
            padding: "20px",
            whiteSpace: "pre-wrap",
            fontSize: "12px",
            lineHeight: "1.6",
            color: "#ff8888",
            marginBottom: "20px"
          }}>
            <strong>{this.state.error?.message}</strong>
            {"\n\n"}
            {this.state.error?.stack}
          </div>
          {this.state.errorInfo && (
            <details open>
              <summary style={{ cursor: "pointer", color: "#1db954", marginBottom: "10px" }}>Component Stack Trace</summary>
              <pre style={{
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "6px",
                padding: "20px",
                whiteSpace: "pre-wrap",
                fontSize: "11px",
                color: "#ccc"
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#ff5555",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Réinitialiser le LocalStorage et recharger
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

class App extends React.Component<{}, {}> {
  render() {
    return (
      <ErrorBoundary>
        <SidebarPage />
      </ErrorBoundary>
    );
  }
}

export default App;
