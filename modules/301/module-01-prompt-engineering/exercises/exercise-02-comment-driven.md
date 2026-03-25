# Exercise 2: Comment-Driven Completion

## Objective

Use structured comments to guide Copilot's inline code completions through complex logic.

---

## Part A: Signature-First Development

Create a new file called `rateLimiter.ts` and type only the signature below. Then pause and let Copilot suggest the implementation.

```typescript
interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (req: Request) => string;
}

interface RateLimitResult {
  allowed: boolean;
  remainingRequests: number;
  retryAfterMs: number | null;
}

/**
 * Sliding-window rate limiter using a token bucket algorithm.
 * Tracks request counts per client key within a configurable time window.
 */
function createRateLimiter(options: RateLimiterOptions): {
  check: (req: Request) => RateLimitResult;
  reset: (key: string) => void;
  getStats: () => Map<string, { count: number; windowStart: number }>;
}
```

**Observe:** How much of the implementation did Copilot get right from the signature alone?

---

## Part B: Comment-Driven Completion

Now create `retryWithBackoff.js` and write **only the comments**. Pause after each comment block to let Copilot complete the code:

```javascript
/**
 * Retry an async operation with exponential backoff and jitter.
 *
 * @param {() => Promise<any>} operation - The async function to retry
 * @param {object} options - Retry configuration
 * @param {number} options.maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} options.baseDelayMs - Initial delay in milliseconds (default: 1000)
 * @param {number} options.maxDelayMs - Maximum delay cap (default: 30000)
 * @param {(error: Error) => boolean} options.shouldRetry - Predicate to decide if error is retryable
 * @returns {Promise<any>} Result of the operation
 * @throws {Error} Last error if all retries exhausted
 */
async function retryWithBackoff(operation, options = {}) {
  // 1. Destructure options with defaults: maxRetries=3, baseDelayMs=1000, maxDelayMs=30000

  // 2. Initialize attempt counter and lastError variable

  // 3. Loop from 0 to maxRetries (inclusive)

    // 3a. Try executing the operation and return result on success

    // 3b. On failure, store the error as lastError

    // 3c. If shouldRetry is provided and returns false, throw immediately

    // 3d. If this was the last attempt, throw the error

    // 3e. Calculate delay: baseDelayMs * 2^attempt (exponential backoff)

    // 3f. Cap the delay at maxDelayMs

    // 3g. Add jitter: multiply delay by a random factor between 0.5 and 1.5

    // 3h. Wait for the calculated delay using a promise-based setTimeout

  // 4. If we somehow exit the loop, throw lastError
}
```

**Try it:** After Copilot fills in each step, check if the implementation matches the comment's intent.

---

## Part C: Example-Driven Completion

Create `parseConfig.js` with two examples, then let Copilot generalize:

```javascript
/**
 * Parse environment variable strings into typed values.
 *
 * Examples:
 *   parseEnvValue("true")         → true (boolean)
 *   parseEnvValue("42")           → 42 (number)
 *   parseEnvValue("hello,world")  → ["hello", "world"] (array)
 *   parseEnvValue("3.14")         → 3.14 (number)
 *   parseEnvValue("")             → null
 *   parseEnvValue("null")         → null
 *   parseEnvValue("some string")  → "some string" (string)
 */
function parseEnvValue(value) {
```

**Observe:** Does Copilot handle all the example cases? What about edge cases not listed?

---

## Discussion Points

- Which technique (signature-first, comment-driven, example-driven) gave the best results?
- How does the quality of your comments affect the quality of completions?
- When would you choose inline completions over Chat for complex logic?
