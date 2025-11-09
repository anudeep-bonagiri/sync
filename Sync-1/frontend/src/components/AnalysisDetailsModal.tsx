import React, { useEffect, useState } from 'react';
import { X, Clock, AlertTriangle, CheckCircle } from './icons';
import { syncAPI, type NetworkAnalysisResult } from '../services/apiClient';

interface AnalysisDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  networkAnalysis?: NetworkAnalysisResult;
  analysisTimestamp?: number;
}

interface DetailedAnalysisData {
  timestamp: number;
  insights: string;
  anomalies: string;
  regionalBreakdown: string;
  sentimentAnalysis: string;
  diagnosticNotes: string;
  fullAnalysis: string;
}

export const AnalysisDetailsModal: React.FC<AnalysisDetailsModalProps> = ({
  isOpen,
  onClose,
  networkAnalysis,
  analysisTimestamp,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<DetailedAnalysisData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const fetchDetailedAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await syncAPI.getDetailedAnalysis(networkAnalysis);

      if (result.success && result.data) {
        setAnalysisData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch detailed analysis');
      }
    } catch (err) {
      console.error('Error fetching detailed analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to load detailed analysis');
    } finally {
      setLoading(false);
    }
  };

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Fetch data if we don't have it yet
      if (!analysisData && !loading && !error) {
        fetchDetailedAnalysis();
      }
    } else {
      // Reset data when closing
      setIsVisible(false);
      setExpandedSections({}); // Reset expanded sections
      setTimeout(() => {
        setAnalysisData(null);
        setError(null);
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Format timestamp
  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Toggle section expansion
  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Format analysis text for better readability
  const formatAnalysisText = (
    text: string, 
    maxLength: number = 500, 
    sectionKey: string,
    isExpanded: boolean
  ): { content: React.ReactNode; isTruncated: boolean; originalLength: number } => {
    if (!text) return { content: null, isTruncated: false, originalLength: 0 };
    
    const originalLength = text.length;
    const shouldTruncate = !isExpanded && originalLength > maxLength;

    // Clean up markdown artifacts first
    let cleanedText = text
      // Remove all quadruple asterisks first (common LLM formatting mistake)
      .replace(/\*\*\*\*/g, '')
      // Remove triple asterisks
      .replace(/\*\*\*/g, '')
      // Normalize line endings
      .replace(/\r\n/g, '\n')
      // Handle **text** (double asterisks for bold) - do this before single asterisk
      .replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')
      // Remove leading asterisks from lines (but preserve bullet lists)
      .replace(/^(\s*)\*+(\s+)(?![-•])/gm, '$1')
      // Remove trailing asterisks from lines
      .replace(/\s*\*+$/gm, '')
      // Clean up isolated asterisks (not part of bold or lists)
      .replace(/\s+\*\s+/g, ' ')
      .replace(/\s+\*(\w)/g, ' $1')
      .replace(/(\w)\*\s+/g, '$1 ')
      // Remove excessive line breaks
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Store original text for comparison
    const originalCleanedText = cleanedText;
    
    // Truncate if too long and not expanded
    let isTruncated = false;
    if (shouldTruncate && cleanedText.length > maxLength) {
      isTruncated = true;
      let truncated = cleanedText.substring(0, maxLength);
      // Try to cut at a sentence boundary
      const lastPeriod = truncated.lastIndexOf('.');
      const lastNewline = truncated.lastIndexOf('\n');
      const cutPoint = Math.max(lastPeriod, lastNewline);
      if (cutPoint > maxLength * 0.7) {
        truncated = truncated.substring(0, cutPoint + 1);
      }
      cleanedText = truncated;
    }

    // Split into blocks (paragraphs or lists)
    const lines = cleanedText.split('\n');
    const blocks: Array<{ type: 'paragraph' | 'list' | 'header'; content: string[] }> = [];
    let currentBlock: { type: 'paragraph' | 'list' | 'header'; content: string[] } | null = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        // Empty line - finish current block
        if (currentBlock && currentBlock.content.length > 0) {
          blocks.push(currentBlock);
          currentBlock = null;
        }
        return;
      }

      // Check if it's a header
      if (/^#{1,3}\s/.test(trimmed)) {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'header', content: [trimmed] };
        blocks.push(currentBlock);
        currentBlock = null;
        return;
      }

      // Check if it's a list item
      const isListItem = /^[-•*]\s/.test(trimmed) || /^\d+[.)]\s/.test(trimmed);
      
      if (isListItem) {
        if (currentBlock?.type === 'list') {
          currentBlock.content.push(trimmed);
        } else {
          if (currentBlock) blocks.push(currentBlock);
          currentBlock = { type: 'list', content: [trimmed] };
        }
      } else {
        // Regular text
        if (currentBlock?.type === 'list') {
          blocks.push(currentBlock);
          currentBlock = { type: 'paragraph', content: [trimmed] };
        } else if (currentBlock?.type === 'paragraph') {
          currentBlock.content.push(trimmed);
        } else {
          currentBlock = { type: 'paragraph', content: [trimmed] };
        }
      }
    });

    // Add last block
    if (currentBlock && currentBlock.content.length > 0) {
      blocks.push(currentBlock);
    }

    // Limit number of blocks to keep it concise (only if not expanded)
    const displayBlocks = isExpanded ? blocks : blocks.slice(0, 8);

    // Determine if we need expansion
    const needsExpansion = originalLength > maxLength;
    const shouldShowExpand = !isExpanded && needsExpansion;
    const shouldShowCollapse = isExpanded && needsExpansion;

    // Render blocks
    const blockElements = displayBlocks.map((block, idx) => {
      const isLastBlock = idx === displayBlocks.length - 1;
      const shouldAppendEllipsis = shouldShowExpand && isLastBlock;

      if (block.type === 'header') {
        let headerText = block.content[0].replace(/^#{1,3}\s+/, '');
        // Remove any remaining markdown
        headerText = headerText.replace(/<strong>(.*?)<\/strong>/g, '$1');
        return (
          <h4 key={idx} className="font-semibold text-gray-900 dark:text-white text-base mt-4 mb-2 first:mt-0">
            {headerText}
          </h4>
        );
      }

      if (block.type === 'list') {
        // Limit list items
        const listItems = block.content.slice(0, 5);
        const isLastItem = (itemIdx: number) => itemIdx === listItems.length - 1;
        
        return (
          <ul key={idx} className="list-disc list-outside space-y-1.5 ml-4 pl-2">
            {listItems.map((item, itemIdx) => {
              let cleaned = item.replace(/^[-•*]\s+/, '').replace(/^\d+[.)]\s+/, '');
              // Clean up any remaining asterisks
              cleaned = cleaned
                .replace(/\*\*\*\*/g, '')
                .replace(/\*\*\*/g, '')
                .replace(/\*\*/g, '')
                .trim();
              
              const isLast = isLastItem(itemIdx) && shouldAppendEllipsis;
              
              // Check if there are HTML tags to render
              const hasHtmlTags = /<[^>]+>/.test(cleaned);
              
              if (hasHtmlTags) {
                return (
                  <li 
                    key={itemIdx} 
                    className="text-gray-700 dark:text-[#D1D5DB] leading-relaxed text-sm pl-1"
                  >
                    <span dangerouslySetInnerHTML={{ __html: cleaned }} />
                    {isLast && (
                      <span
                        onClick={() => toggleSection(sectionKey)}
                        className="text-[#2979FF] hover:text-[#1E6FE8] cursor-pointer font-medium underline ml-1"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleSection(sectionKey);
                          }
                        }}
                      >
                        ...
                      </span>
                    )}
                  </li>
                );
              } else {
                return (
                  <li 
                    key={itemIdx} 
                    className="text-gray-700 dark:text-[#D1D5DB] leading-relaxed text-sm pl-1"
                  >
                    {cleaned}
                    {isLast && (
                      <span
                        onClick={() => toggleSection(sectionKey)}
                        className="text-[#2979FF] hover:text-[#1E6FE8] cursor-pointer font-medium underline ml-1"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleSection(sectionKey);
                          }
                        }}
                      >
                        ...
                      </span>
                    )}
                  </li>
                );
              }
            })}
          </ul>
        );
      }

      // Paragraph
      let paraText = block.content.join(' ').trim();
      // Clean up any remaining asterisks that weren't converted to HTML
      paraText = paraText
        .replace(/\*\*\*\*/g, '') // Remove quadruple
        .replace(/\*\*\*/g, '') // Remove triple
        .replace(/\*\*/g, '') // Remove double (already processed, but clean up any leftovers)
        .replace(/\s+\*\s+/g, ' ') // Remove isolated asterisks with spaces
        .replace(/\s+\*/g, ' ') // Remove trailing asterisks after spaces
        .replace(/\*\s+/g, ' ') // Remove leading asterisks before spaces
        .replace(/\s+/g, ' ') // Normalize multiple spaces
        .trim();
      
      // Only use dangerouslySetInnerHTML if there are actual HTML tags
      const hasHtmlTags = /<[^>]+>/.test(paraText);
      
      if (hasHtmlTags) {
        return (
          <p 
            key={idx} 
            className="text-gray-700 dark:text-[#D1D5DB] leading-relaxed text-sm"
          >
            <span dangerouslySetInnerHTML={{ __html: paraText }} />
            {shouldAppendEllipsis && (
              <span
                onClick={() => toggleSection(sectionKey)}
                className="text-[#2979FF] hover:text-[#1E6FE8] cursor-pointer font-medium underline ml-1"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSection(sectionKey);
                  }
                }}
              >
                ...
              </span>
            )}
          </p>
        );
      } else {
        return (
          <p 
            key={idx} 
            className="text-gray-700 dark:text-[#D1D5DB] leading-relaxed text-sm"
          >
            {paraText}
            {shouldAppendEllipsis && (
              <span
                onClick={() => toggleSection(sectionKey)}
                className="text-[#2979FF] hover:text-[#1E6FE8] cursor-pointer font-medium underline ml-1"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSection(sectionKey);
                  }
                }}
              >
                ...
              </span>
            )}
          </p>
        );
      }
    });

    const content = <div className="space-y-3">{blockElements}</div>;

    return {
      content,
      isTruncated: shouldShowExpand,
      shouldShowCollapse,
      originalLength
    };
  };

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
        className={`relative bg-white dark:bg-[#1A1A1A] rounded-xl w-full max-w-[700px] max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Detailed AI Analysis
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#9A9A9A]">
              <Clock className="w-4 h-4" />
              <span>
                Analysis generated: {formatTimestamp(analysisData?.timestamp || analysisTimestamp)}
              </span>
            </div>
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
              <p className="text-gray-600 dark:text-[#B3B3B3]">Generating detailed analysis...</p>
              <p className="text-sm text-gray-500 dark:text-[#9A9A9A] mt-2">
                This may take a few moments
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-semibold">Error Loading Analysis</h3>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              <button
                onClick={fetchDetailedAnalysis}
                className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Data Sources - Always visible */}
          {(loading || error || analysisData) && (
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-white/10">
              <p className="text-xs text-gray-500 dark:text-[#767676] mb-2">
                Data sources used for analysis:
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-[#9A9A9A]">
                <a 
                  href="https://outages.report" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#2979FF] hover:underline transition-colors"
                >
                  outages.report
                </a>
                <span className="text-gray-300 dark:text-[#555555]">•</span>
                <a 
                  href="https://downdetector.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#2979FF] hover:underline transition-colors"
                >
                  downdetector.com
                </a>
                <span className="text-gray-300 dark:text-[#555555]">•</span>
                <a 
                  href="https://developers.google.com/youtube/v3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#2979FF] hover:underline transition-colors"
                >
                  YouTube Data API v3
                </a>
                <span className="text-gray-300 dark:text-[#555555]">•</span>
                <a 
                  href="https://developer.twitter.com/en/docs/twitter-api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#2979FF] hover:underline transition-colors"
                >
                  X Data API
                </a>
                <span className="text-gray-300 dark:text-[#555555]">•</span>
                <span>Google Gemini API</span>
              </div>
            </div>
          )}

          {!loading && !error && analysisData && (
            <div className="space-y-5">
              {/* Insights Section */}
              {analysisData.insights && (() => {
                const sectionKey = 'insights';
                const isExpanded = expandedSections[sectionKey] || false;
                const { content, isTruncated, shouldShowCollapse } = formatAnalysisText(analysisData.insights, 400, sectionKey, isExpanded);
                return (
                  <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-5 border border-green-200/50 dark:border-green-800/30">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-[#00C853] flex-shrink-0" />
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Key Insights
                      </h3>
                    </div>
                    <div className="text-gray-700 dark:text-[#D1D5DB]">
                      {content}
                      {shouldShowCollapse && (
                        <button
                          onClick={() => toggleSection(sectionKey)}
                          className="mt-2 text-[#2979FF] hover:text-[#1E6FE8] text-sm font-medium underline transition-colors"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  </section>
                );
              })()}

              {/* Anomalies Section */}
              {analysisData.anomalies && (() => {
                const sectionKey = 'anomalies';
                const isExpanded = expandedSections[sectionKey] || false;
                const { content, isTruncated, shouldShowCollapse } = formatAnalysisText(analysisData.anomalies, 400, sectionKey, isExpanded);
                return (
                  <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-5 border border-amber-200/50 dark:border-amber-800/30">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-[#FF6D00] flex-shrink-0" />
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Anomalies Detected
                      </h3>
                    </div>
                    <div className="text-gray-700 dark:text-[#D1D5DB]">
                      {content}
                      {shouldShowCollapse && (
                        <button
                          onClick={() => toggleSection(sectionKey)}
                          className="mt-2 text-[#2979FF] hover:text-[#1E6FE8] text-sm font-medium underline transition-colors"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  </section>
                );
              })()}

              {/* Regional Breakdown Section */}
              {analysisData.regionalBreakdown && (() => {
                const sectionKey = 'regional';
                const isExpanded = expandedSections[sectionKey] || false;
                const { content, isTruncated, shouldShowCollapse } = formatAnalysisText(analysisData.regionalBreakdown, 400, sectionKey, isExpanded);
                return (
                  <section className="bg-gray-50 dark:bg-[#111111] rounded-lg p-5 border border-gray-200 dark:border-white/10">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                      Regional Breakdown
                    </h3>
                    <div className="text-gray-700 dark:text-[#D1D5DB]">
                      {content}
                      {shouldShowCollapse && (
                        <button
                          onClick={() => toggleSection(sectionKey)}
                          className="mt-2 text-[#2979FF] hover:text-[#1E6FE8] text-sm font-medium underline transition-colors"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  </section>
                );
              })()}

              {/* Sentiment Analysis Section */}
              {analysisData.sentimentAnalysis && (() => {
                const sectionKey = 'sentiment';
                const isExpanded = expandedSections[sectionKey] || false;
                const { content, isTruncated, shouldShowCollapse } = formatAnalysisText(analysisData.sentimentAnalysis, 400, sectionKey, isExpanded);
                return (
                  <section className="bg-gray-50 dark:bg-[#111111] rounded-lg p-5 border border-gray-200 dark:border-white/10">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                      Customer Impact
                    </h3>
                    <div className="text-gray-700 dark:text-[#D1D5DB]">
                      {content}
                      {shouldShowCollapse && (
                        <button
                          onClick={() => toggleSection(sectionKey)}
                          className="mt-2 text-[#2979FF] hover:text-[#1E6FE8] text-sm font-medium underline transition-colors"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  </section>
                );
              })()}

              {/* Diagnostic Notes Section */}
              {analysisData.diagnosticNotes && (() => {
                const sectionKey = 'diagnostic';
                const isExpanded = expandedSections[sectionKey] || false;
                const { content, isTruncated, shouldShowCollapse } = formatAnalysisText(analysisData.diagnosticNotes, 400, sectionKey, isExpanded);
                return (
                  <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-5 border border-blue-200/50 dark:border-blue-800/30">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                      Recommendations
                    </h3>
                    <div className="text-gray-700 dark:text-[#D1D5DB]">
                      {content}
                      {shouldShowCollapse && (
                        <button
                          onClick={() => toggleSection(sectionKey)}
                          className="mt-2 text-[#2979FF] hover:text-[#1E6FE8] text-sm font-medium underline transition-colors"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  </section>
                );
              })()}

              {/* Fallback: Show full analysis if sections are empty */}
              {!analysisData.insights && 
               !analysisData.anomalies && 
               !analysisData.regionalBreakdown && 
               !analysisData.sentimentAnalysis && 
               !analysisData.diagnosticNotes && 
               analysisData.fullAnalysis && (() => {
                const sectionKey = 'fullAnalysis';
                const isExpanded = expandedSections[sectionKey] || false;
                const { content, isTruncated, shouldShowCollapse } = formatAnalysisText(analysisData.fullAnalysis, 600, sectionKey, isExpanded);
                return (
                  <section className="bg-gray-50 dark:bg-[#111111] rounded-lg p-5 border border-gray-200 dark:border-white/10">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                      Analysis Summary
                    </h3>
                    <div className="text-gray-700 dark:text-[#D1D5DB]">
                      {content}
                      {shouldShowCollapse && (
                        <button
                          onClick={() => toggleSection(sectionKey)}
                          className="mt-2 text-[#2979FF] hover:text-[#1E6FE8] text-sm font-medium underline transition-colors"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  </section>
                );
              })()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 dark:border-white/10">
          <p className="text-xs text-gray-400 dark:text-[#767676]">
            Analysis powered by LLM with context from multiple data sources
          </p>
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

