"use client";
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Canvas Render Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-red-50 text-red-800 p-8 text-center rounded-xl border border-red-200">
          <span className="text-4xl mb-4">⚠️</span>
          <h2 className="text-lg font-bold mb-2">Canvas Crashed!</h2>
          <p className="text-sm mb-4">An element has invalid properties that broke the renderer.</p>
          <div className="flex gap-4">
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="bg-red-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-red-500 shadow"
            >
              Try Again
            </button>
            <p className="py-2 text-sm font-bold text-red-900">💡 Tip: Press Ctrl + Z to undo your last change.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}