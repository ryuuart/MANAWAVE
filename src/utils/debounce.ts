/**
 * Josh W. Comeau's debounce
 *
 * @param callback callback to invoke
 * @param wait time to wait until callback invoked
 * @returns a modified function that debounces the original callback
 */
export const debounce = (callback: () => any, wait: number) => {
    let timeoutId: number;
    return (...args: []) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
};
