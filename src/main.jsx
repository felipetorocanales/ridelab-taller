import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', fontFamily: 'sans-serif', textAlign: 'center', background: '#F8F9FA', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyCenter: 'center' }}>
          <div style={{ maxWidth: '420px', background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px' }}>RIDE LAB | Taller</h2>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '12px' }}>Ocurrió un problema al cargar la aplicación.</p>
            {this.state.error && (
              <pre style={{ fontSize: '11px', color: '#DC2626', background: '#FEE2E2', padding: '10px', borderRadius: '8px', textAlign: 'left', overflowX: 'auto', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              style={{ padding: '10px 18px', background: '#0F172A', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Reiniciar y volver al inicio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
