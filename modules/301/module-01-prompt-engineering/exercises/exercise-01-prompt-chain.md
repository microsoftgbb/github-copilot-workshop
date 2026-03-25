# Exercise 1: Single Prompt vs. Prompt Chain

## Objective

See how breaking a complex task into a chain of prompts produces dramatically better results than a single prompt.

---

## Part A: Single Prompt (The Baseline)

Open Copilot Chat and paste this single prompt:

```
Build me a caching layer in JavaScript with TTL support, LRU eviction,
max size limits, and cache statistics tracking.
```

**Observe:** The output is functional but generic — likely a single file with everything mixed together, no clear separation of concerns, and minimal error handling.

---

## Part B: Prompt Chain (The Upgrade)

Now use these prompts **one at a time**, waiting for each response before sending the next:

### Step 1 — Define the interface

```
Design a TypeScript interface for a Cache<K, V> with these operations:
- get(key): returns the value or undefined
- set(key, value, ttlMs?): stores a value with optional TTL
- delete(key): removes an entry
- has(key): checks existence
- clear(): removes all entries
- stats(): returns hit count, miss count, eviction count, and size

Do not implement it yet — just define the interface and the CacheStats type.
```

### Step 2 — Implement the core

```
Now implement an LRUCache<K, V> class that implements the Cache interface
you just defined. Use a Map for O(1) lookups (Map preserves insertion order
in JS, so the oldest entry is first). Implement LRU eviction when the cache
exceeds maxSize.
```

### Step 3 — Add TTL support

```
Add TTL support to the LRUCache. Each entry should store its expiration
timestamp. On get(), check if the entry has expired — if so, delete it
and count it as a miss. Add a periodic cleanup method that removes all
expired entries.
```

### Step 4 — Add tests

```
Write Jest tests for the LRUCache covering:
1. Basic get/set/delete operations
2. LRU eviction when maxSize is exceeded
3. TTL expiration (use jest.advanceTimersByTime)
4. Stats tracking accuracy
5. Edge case: getting an expired entry returns undefined
```

### Step 5 — Refine

```
Review the LRUCache implementation for thread-safety concerns in a
Node.js context. Are there any race conditions with the periodic
cleanup timer? Add proper cleanup/dispose methods.
```

---

## Discussion Points

- How did the chain output compare to the single prompt?
- Which step benefited most from having prior context?
- What would happen if you reordered the steps?
