import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-xl border border-neutral-200 text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 font-display">
                Kuch Samasya Aa Gayi (Unexpected Error)
              </h2>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                App ko reload karein ya thodi der baad prayas karein. Data safe hai.
              </p>
            </div>
            {this.state.error && (
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] font-mono text-neutral-600 text-left overflow-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="w-full py-3 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload App</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
