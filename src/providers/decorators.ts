export function singleton<T extends (...params: never[]) => unknown>(fn: T): T {
  let called = false;

  return ((...args) => {
    if (called) {
      return;
    }

    called = true;
    return fn(...args);
  }) as T;
}

export function debounce<T extends (...params: never[]) => unknown>(fn: T, delay: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  }) as T;
}

export function cache<T extends (...params: P) => R, P extends never[], R>(fn: T): T {
  let lastArgs: P;
  let lastResult: R;
  return ((...args: P) => {
    if (
      args.length !== lastArgs?.length
      || args.some((arg, i) => arg !== lastArgs[i])
    ) {
      lastArgs = args;
      lastResult = fn(...args);
    }

    return lastResult;
  }) as T;
}

/*
  The following are currently unused, but potentially useful in the future
*/

export function throttle<T extends (...params: unknown[]) => unknown>(fn: T, delay: number): T {
  let timeout: NodeJS.Timeout | undefined;
  return ((...args) => {
    if (timeout) {
      return;
    }

    timeout = setTimeout(() => {
      timeout = undefined;
      fn(...args);
    }, delay);
  }) as T;
}

function memoize<T extends (...params: unknown[]) => unknown>(fn: T): T {
  const cache = new Map();

  return ((...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }

    return cache.get(key) as unknown;
  }) as T;
}

function retry<T extends (...params: unknown[]) => unknown>(fn: T, { retries = 3, delay = 1000 } = {}): T {
  return ((...args) => {
    try {
      return fn(...args);
    } catch (error) {
      if (retries > 0) {
        retries--;
        setTimeout(() => retry(fn, { retries, delay })(...args), delay);
      } else {
        throw error;
      }
    }
  }) as T;
}

export default {
  singleton,
  debounce,
  cache,
  throttle,
  memoize,
  retry,
};
