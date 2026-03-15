import React from 'react'
import ReactDOM from 'react-dom/client'
import MemoryMirror from './App.jsx'
import './styles/index.css'

const errorFallbackStyles = {
  wrapper: { minHeight: '100vh', background: '#060d1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Georgia, serif', color: '#fff', textAlign: 'center' },
  icon: { fontSize: 48, marginBottom: 20 },
  heading: { fontSize: 24, marginBottom: 12 },
  message: { color: '#74C69D', marginBottom: 24 },
  button: { background: '#2C5F2E', border: 'none', borderRadius: 12, padding: '12px 28px', color: '#fff', cursor: 'pointer', fontSize: 16 },
};

/**
 * ErrorBoundary catches unhandled React rendering errors and displays a
 * user-friendly dark-themed fallback UI with a page-refresh option.
 * Without this, any rendering error would leave the user with a blank screen.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={errorFallbackStyles.wrapper}>
          <div style={errorFallbackStyles.icon}>💙</div>
          <h2 style={errorFallbackStyles.heading}>Memory Mirror</h2>
          <p style={errorFallbackStyles.message}>Something went wrong loading the app. Please refresh the page.</p>
          <button onClick={() => window.location.reload()} style={errorFallbackStyles.button}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <MemoryMirror />
    </ErrorBoundary>
  </React.StrictMode>,
)
