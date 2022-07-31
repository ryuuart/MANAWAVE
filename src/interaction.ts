/**
 * Josh W. Comeau's debounce function.
 * Used to invoke callback after user stops interacting.
 *
 * See more:
 * {@link https://www.joshwcomeau.com/snippets/javascript/debounce/}
 *
 * @param {Function} callback The function that will be invoked after wait clears
 * @param {number} wait The duration / delay in milliseconds
 * @returns {Function} Modified callback function that applies the debouncing
 */
export const debounce = (callback, wait) => {
  let timeoutId: number | undefined = undefined;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};
