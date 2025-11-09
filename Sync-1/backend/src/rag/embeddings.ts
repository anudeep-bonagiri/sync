/**
 * Embeddings - Simplified embedding system for RAG
 * Uses basic TF-IDF-like scoring for hackathon
 * Can be upgraded to real embeddings (Gemini or NVIDIA) later
 */

export class EmbeddingService {
  /**
   * Generate a simple embedding-like vector for text
   * This is a simplified version using word frequency
   * For production, use Gemini embeddings or NVIDIA embeddings
   */
  async embed(text: string): Promise<number[]> {
    // Simplified embedding: bag-of-words approach
    const words = this.tokenize(text);
    const wordCounts = new Map<string, number>();

    words.forEach((word) => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });

    // Create a fixed-size vector (128 dimensions for simplicity)
    const vector = new Array(128).fill(0);

    // Hash words to vector positions
    wordCounts.forEach((count, word) => {
      const hash = this.hashWord(word);
      const index = hash % 128;
      vector[index] += count;
    });

    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map((val) => (magnitude > 0 ? val / magnitude : 0));
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have same length');
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      magnitudeA += vecA[i] * vecA[i];
      magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Calculate BM25-like relevance score (keyword-based)
   * This is fast and works well for hackathons
   */
  calculateRelevance(query: string, document: string): number {
    const queryWords = this.tokenize(query);
    const docWords = this.tokenize(document);

    if (docWords.length === 0) return 0;

    // Count query word occurrences in document
    let matches = 0;
    const docWordSet = new Set(docWords);

    queryWords.forEach((word) => {
      if (docWordSet.has(word)) {
        matches++;
      }
    });

    // Simple relevance: (matches / query length) * log(doc length + 1)
    const relevance = (matches / queryWords.length) * Math.log(docWords.length + 1);

    return relevance;
  }

  /**
   * Tokenize text into words
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2); // Filter out short words
  }

  /**
   * Simple hash function for words
   */
  private hashWord(word: string): number {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      const char = word.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

// Singleton instance
let embeddingService: EmbeddingService | null = null;

export function getEmbeddingService(): EmbeddingService {
  if (!embeddingService) {
    embeddingService = new EmbeddingService();
  }
  return embeddingService;
}
