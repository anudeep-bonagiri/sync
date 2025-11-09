import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, TrendingUp, Users, Target } from './icons';
import { syncAPI } from '../services/apiClient';

interface ChurnInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  timeRange?: '24h' | '7d' | '1m' | '1y';
}

interface ChurnInsightData {
  category: string;
  explanation: string;
  whyLeaving?: string[];
  whyJoining?: string[];
  patterns?: string[];
  sentimentClusters?: string[];
  opportunities?: string[];
  insights?: string[];
  timestamp: number;
}

export const ChurnInsightsModal: React.FC<ChurnInsightsModalProps> = ({
  isOpen,
  onClose,
  category,
  timeRange,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insightData, setInsightData] = useState<ChurnInsightData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const fetchChurnInsights = async () => {
    if (!category) return;

    setLoading(true);
    setError(null);

    try {
      const result = await syncAPI.getChurnInsights(category, timeRange);

      if (result.success && result.data) {
        setInsightData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch churn insights');
      }
    } catch (err) {
      console.error('Error fetching churn insights:', err);
      setError(err instanceof Error ? err.message : 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen && category) {
      setIsVisible(true);
      // Fetch data when modal opens
      fetchChurnInsights();
    } else {
      // Reset data when closing
      setIsVisible(false);
      setTimeout(() => {
        setInsightData(null);
        setError(null);
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, category]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative bg-white dark:bg-[#1A1A1A] rounded-xl w-full max-w-[800px] max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Churn & Loyalty Insights{timeRange ? `: ${timeRange.toUpperCase()}` : ''}
            </h2>
            <p className="text-sm text-gray-500 dark:text-[#9A9A9A]">
              {timeRange ? `Analyzing trends for the ${timeRange} period • ` : ''}AI-powered analysis with RAG context
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors text-gray-500 dark:text-[#9A9A9A] hover:text-gray-900 dark:hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#E20074] mb-4"></div>
              <p className="text-gray-600 dark:text-[#B3B3B3]">Generating AI insights...</p>
              <p className="text-sm text-gray-500 dark:text-[#9A9A9A] mt-2">
                Analyzing customer patterns with LLM + RAG
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-semibold">Error Loading Insights</h3>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              <button
                onClick={fetchChurnInsights}
                className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && insightData && (
            <div className="space-y-6">
              {/* Main Explanation */}
              {insightData.explanation && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#2979FF]" />
                    Overview
                  </h3>
                  <div className="bg-gray-50 dark:bg-[#111111] rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-[#B3B3B3] whitespace-pre-wrap leading-relaxed">
                      {insightData.explanation}
                    </p>
                  </div>
                </section>
              )}

              {/* Why Customers Are Leaving */}
              {insightData.whyLeaving && insightData.whyLeaving.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#FF6D00]" />
                    Why Customers Are Leaving Competitor Carriers
                  </h3>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <ul className="space-y-2">
                      {insightData.whyLeaving.map((reason, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-[#B3B3B3] flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Why Customers Are Joining */}
              {insightData.whyJoining && insightData.whyJoining.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#1DE55A]" />
                    Why Customers Are Joining T-Mobile
                  </h3>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <ul className="space-y-2">
                      {insightData.whyJoining.map((reason, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-[#B3B3B3] flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Common Patterns */}
              {insightData.patterns && insightData.patterns.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#E20074]" />
                    Common Patterns & Motivations
                  </h3>
                  <div className="bg-gray-50 dark:bg-[#111111] rounded-lg p-4">
                    <ul className="space-y-2">
                      {insightData.patterns.map((pattern, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-[#B3B3B3] flex items-start gap-2">
                          <span className="text-[#E20074] mt-1">•</span>
                          <span>{pattern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Sentiment Clusters */}
              {insightData.sentimentClusters && insightData.sentimentClusters.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Sentiment Clusters
                  </h3>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <ul className="space-y-2">
                      {insightData.sentimentClusters.map((cluster, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-[#B3B3B3] flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{cluster}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Opportunities */}
              {insightData.opportunities && insightData.opportunities.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#00C853]" />
                    Opportunities for Retention & Acquisition
                  </h3>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <ul className="space-y-2">
                      {insightData.opportunities.map((opportunity, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-[#B3B3B3] flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Additional Insights */}
              {insightData.insights && insightData.insights.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Additional Insights from RAG System
                  </h3>
                  <div className="bg-gray-50 dark:bg-[#111111] rounded-lg p-4">
                    <ul className="space-y-2">
                      {insightData.insights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-[#B3B3B3] flex items-start gap-2">
                          <span className="text-[#2979FF] mt-1">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#3A3A3A] text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

