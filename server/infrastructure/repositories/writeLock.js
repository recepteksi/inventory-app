// Serialize JSON file writes to prevent race conditions on concurrent requests.
let chain = Promise.resolve();

export function withLock(fn) {
  const result = chain.then(() => fn());
  // Swallow errors on chain to prevent permanent rejection — caller gets the real error via result
  chain = result.catch(() => {});
  return result;
}
