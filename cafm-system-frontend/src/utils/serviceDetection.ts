/**
 * Service Detection Utilities
 * Provides intelligent service type detection for ticket creation
 * This is a completely new utility that doesn't affect existing functionality
 */

export interface ServiceDetectionResult {
  category: number;
  categoryText: string;
  confidence: number;
  matchedKeywords: string[];
  relevanceScore: number;
}

export interface ServiceDetectionConfig {
  enabled: boolean;
  minConfidence: number;
  debounceMs: number;
  minTextLength: number;
}

// Default configuration - can be overridden
export const DEFAULT_DETECTION_CONFIG: ServiceDetectionConfig = {
  enabled: true,
  minConfidence: 30, // Minimum confidence percentage to show suggestions
  debounceMs: 500,   // Debounce delay for real-time detection
  minTextLength: 5   // Minimum text length to trigger detection
};

// Category mappings for frontend display
export const CATEGORY_MAPPINGS = {
  1: { name: 'General', color: '#6c757d', icon: '📋' },
  2: { name: 'Plumbing', color: '#0066cc', icon: '🔧' },
  3: { name: 'Electrical', color: '#ffc107', icon: '⚡' },
  4: { name: 'HVAC', color: '#17a2b8', icon: '❄️' },
  5: { name: 'Cleaning', color: '#28a745', icon: '🧹' },
  6: { name: 'Security', color: '#dc3545', icon: '🔒' },
  7: { name: 'IT', color: '#6f42c1', icon: '💻' },
  8: { name: 'Maintenance', color: '#fd7e14', icon: '🔨' },
  9: { name: 'Safety', color: '#e83e8c', icon: '⚠️' },
  10: { name: 'Other', color: '#6c757d', icon: '📝' }
};

/**
 * Get category information by ID
 */
export const getCategoryInfo = (categoryId: number) => {
  return CATEGORY_MAPPINGS[categoryId as keyof typeof CATEGORY_MAPPINGS] || CATEGORY_MAPPINGS[1];
};

/**
 * Format confidence percentage for display
 */
export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence)}%`;
};

/**
 * Get confidence level description
 */
export const getConfidenceLevel = (confidence: number): { level: string; color: string } => {
  if (confidence >= 80) return { level: 'High', color: '#28a745' };
  if (confidence >= 60) return { level: 'Medium', color: '#ffc107' };
  if (confidence >= 40) return { level: 'Low', color: '#fd7e14' };
  return { level: 'Very Low', color: '#dc3545' };
};

/**
 * Check if detection should be triggered based on configuration
 */
export const shouldTriggerDetection = (
  text: string, 
  config: ServiceDetectionConfig = DEFAULT_DETECTION_CONFIG
): boolean => {
  return config.enabled && 
         text.length >= config.minTextLength && 
         text.trim().length > 0;
};

/**
 * Filter detection results based on minimum confidence
 */
export const filterResultsByConfidence = (
  results: ServiceDetectionResult[], 
  minConfidence: number = DEFAULT_DETECTION_CONFIG.minConfidence
): ServiceDetectionResult[] => {
  return results.filter(result => result.confidence >= minConfidence);
};

/**
 * Get the best detection result (highest confidence)
 */
export const getBestDetectionResult = (results: ServiceDetectionResult[]): ServiceDetectionResult | null => {
  if (!results || results.length === 0) return null;
  return results.reduce((best, current) => 
    current.confidence > best.confidence ? current : best
  );
};

/**
 * Create a fallback detection result for when no detection is available
 */
export const createFallbackResult = (): ServiceDetectionResult => ({
  category: 1, // General
  categoryText: 'General',
  confidence: 0,
  matchedKeywords: [],
  relevanceScore: 0
});

/**
 * Safely handle detection errors with graceful fallback
 */
export const handleDetectionError = (error: any, fallbackResult?: ServiceDetectionResult): ServiceDetectionResult => {
  console.warn('Service detection error (graceful fallback):', error);
  return fallbackResult || createFallbackResult();
};

/**
 * Debounce function for real-time detection
 */
export const createDetectionDebouncer = (
  callback: (text: string) => void,
  delay: number = DEFAULT_DETECTION_CONFIG.debounceMs
) => {
  let timeoutId: number;

  return (text: string) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(text), delay);
  };
};

/**
 * Validate detection result structure
 */
export const isValidDetectionResult = (result: any): result is ServiceDetectionResult => {
  return result &&
         typeof result.category === 'number' &&
         typeof result.categoryText === 'string' &&
         typeof result.confidence === 'number' &&
         Array.isArray(result.matchedKeywords) &&
         typeof result.relevanceScore === 'number';
};

/**
 * Convert backend API response to frontend detection result
 */
export const convertApiResponseToDetectionResult = (apiResponse: any): ServiceDetectionResult => {
  try {
    return {
      category: apiResponse.category || 1,
      categoryText: apiResponse.categoryText || 'General',
      confidence: (apiResponse.relevance || 0) * 100, // Convert 0-1 to 0-100
      matchedKeywords: apiResponse.keyword ? apiResponse.keyword.split(', ') : [],
      relevanceScore: apiResponse.relevance || 0
    };
  } catch (error) {
    return handleDetectionError(error);
  }
};
