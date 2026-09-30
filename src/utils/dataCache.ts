import React, {} from 'react';
// Generic cache utility for storing and retrieving data with expiration
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export class DataCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  set<T>(
    key: string,
    data: T, ttl = 300000): void { // Default 5 minutes
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };
    this.cache.set(key, entry);
  }

  get<T>(
    key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(
    key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(
    key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Fix for iterable iterator handling
  *[Symbol.iterator](): Iterator<[string, CacheEntry<any>]> {
    // Use Array.from to convert the map entries to an array first
    const entries = Array.from(this.cache.entries());
    for (const [key, value] of entries) {
      yield [key, value];
    }
  }

  // Alternative implementation if the above doesn't work
  getAllEntries(): [string, CacheEntry<any>][] {
    return Array.from(this.cache.entries());
  }

  // Method to get all keys in the cache
  getKeys(): IterableIterator<string> {
    return this.cache.keys();
  }
}

export default new DataCache();
