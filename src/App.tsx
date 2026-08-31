import { Component, type ReactNode } from "react";
import Home from "./pages/Home";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Erro inesperado no app:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, textAlign: "center", fontFamily: "sans-serif" }}>
          <h2>Ops, algo deu errado.</h2>
          <p>Recarregue a página e tente novamente. Se o problema continuar, avise o suporte.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, padding: "10px 20px", cursor: "pointer" }}
          >
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  );
}
