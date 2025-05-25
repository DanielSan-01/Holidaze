import React from 'react';
import { LineWave } from 'react-loader-spinner';

export default function Loader({ 
  visible = true, 
  size = 80, 
  color = "var(--button-main)", // Use primary color variable
  text = "Loading...",
  overlay = false 
}) {
  if (!visible) return null;

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-3">
      <LineWave
        height={size}
        width={size}
        color={color}
        ariaLabel="line-wave-loading"
        visible={visible}
      />
      {text && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  // If overlay is true, show as full-screen overlay
  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  // Otherwise, show inline
  return (
    <div className="flex items-center justify-center p-8">
      {loaderContent}
    </div>
  );
} 