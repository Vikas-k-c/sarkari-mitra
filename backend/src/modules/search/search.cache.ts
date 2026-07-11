export class SearchCache {
  private static cache: Map<string, { data: any; timestamp: number }> = new Map();
  private static TTL = 5 * 60 * 1000; // 5 minutes

  static generateKey(params: any): string {
    return JSON.stringify({
      q: params.q || '',
      mode: params.mode || 'full',
      categoryId: params.categoryId || '',
      state: params.state || '',
      governmentLevel: params.governmentLevel || '',
      ministry: params.ministry || '',
      page: params.page || 1,
      limit: params.limit || 10
    });
  }

  static get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  static set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  static clear(): void {
    this.cache.clear();
  }
}
