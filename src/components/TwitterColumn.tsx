'use client';

import React, { useEffect, useState } from 'react';

export default function TwitterColumn() {
  const [isLoading, setIsLoading] = useState(true);
  const [widgetStatus, setWidgetStatus] = useState<string>('initializing');

  useEffect(() => {
    // Load the Twitter widget script
    const script = document.createElement('script');
    script.src = 'https://widgets.sociablekit.com/twitter-list/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Function to check if widget content exists
    const checkWidgetContent = () => {
      const widgetElement = document.querySelector('.sk-ww-twitter-list');
      const iframeElement = widgetElement?.querySelector('iframe');
      const hasContent = widgetElement && (widgetElement.children.length > 1 || iframeElement !== null);
      
      if (hasContent) {
        setWidgetStatus('loaded');
        setIsLoading(false);
      } else {
        setWidgetStatus('waiting');
      }
    };

    // Check widget content periodically
    const contentChecker = setInterval(checkWidgetContent, 1000);
    
    // Initial loading timeout
    const loadingTimeout = setTimeout(() => {
      checkWidgetContent();
      if (widgetStatus !== 'loaded') {
        setWidgetStatus('timeout');
        setIsLoading(false);
      }
    }, 10000);

    // Cleanup
    return () => {
      clearInterval(contentChecker);
      clearTimeout(loadingTimeout);
    };
  }, [widgetStatus]);

  const handleRetry = () => {
    setIsLoading(true);
    setWidgetStatus('initializing');
    
    // Remove existing widget
    const widgetElement = document.querySelector('.sk-ww-twitter-list');
    if (widgetElement) {
      widgetElement.innerHTML = '';
    }
    
    // Re-add the script
    const script = document.createElement('script');
    script.src = 'https://widgets.sociablekit.com/twitter-list/widget.js';
    script.async = true;
    document.body.appendChild(script);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-purple-700">Twitter</h2>
      <div className="bg-white rounded-lg shadow p-4">
        {isLoading && (
          <div className="text-gray-600 mb-4">
            <div className="animate-pulse">Loading Twitter feed...</div>
            <div className="text-sm text-gray-400 mt-1">
              Status: {widgetStatus}
            </div>
          </div>
        )}
        {!isLoading && widgetStatus !== 'loaded' && (
          <div className="text-gray-600 mb-4">
            <div className="text-red-600">Widget failed to load properly.</div>
            <button 
              onClick={handleRetry}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Retry Loading
            </button>
            <div className="text-sm text-gray-400 mt-1">
              Status: {widgetStatus}
            </div>
          </div>
        )}
        <div 
          key="twitter-widget"
          className='sk-ww-twitter-list' 
          data-embed-id='25504159'
          style={{ minHeight: '500px' }}
        />
      </div>
    </div>
  );
} 