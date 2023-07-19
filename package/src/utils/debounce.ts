/**!
 * Debounce 1.0.1
 * https://github.com/deepakshrma/30-seconds-of-typescript
 *
 * Copyright 2020, Deepak Vishwakarma. All rights reserved.
 * Subject to the MIT License at https://github.com/deepakshrma/30-seconds-of-typescript/blob/master/LICENSE
 */

/**
 * Creates a debounced function that delays invoking the provided function until at least `ms` milliseconds have elapsed since the last time it was invoked.
 *
 * Each time the debounced function is invoked, clear the current pending timeout with `clearTimeout()` and use `setTimeout()` to create a new timeout that delays invoking the function until at least `ms` milliseconds has elapsed. Use `Function.prototype.apply()` to apply the `this` context to the function and provide the necessary arguments.
 * Omit the second argument, `ms`, to set the timeout at a default of 0 ms.
 *
 * @param fn { Function }
 * @param ms {number} @default 300ms
 */
export function debounce(fn: Function, ms = 300) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
}
