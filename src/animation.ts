import {
  animate,
  AnimationControls,
  AnimationOptionsWithOverrides,
  ElementOrSelector,
  timeline,
} from "motion";
import { getXAttr } from "./tickerDomUtils";

const animationOptions: AnimationOptionsWithOverrides = {
  duration: 1,
  easing: "linear",
};

export function translateXY(
  element: ElementOrSelector,
  amount: [number, number],
  onFinished?: (value) => void
) {
  let animation = animate(
    element,
    {
      x: `${amount[0]}px`,
      y: `${amount[1]}px`,
    },
    animationOptions
  );

  if (onFinished) animation.finished.then(onFinished);
}

// tmp
export function translateX(
  element: ElementOrSelector,
  amount: number,
  onFinished?: (value) => void
) {
  let animation = animate(
    element,
    {
      x: `${amount}px`,
    },
    animationOptions
  );

  if (onFinished) animation.finished.then(onFinished);

  return animation;
}

export function translateAllX(
  elements: HTMLCollection,
  getAmount: (element: Element) => number,
  onFinished?: (value) => void
) {
  const sequences: Parameters<typeof timeline>[0] = [];

  Array.from(elements).forEach((e) => {
    sequences.push([e, { x: `${getAmount(e)}px` }, { at: "<" }]);
  });

  const animation = timeline(sequences, {
    defaultOptions: animationOptions,
  });

  if (onFinished) animation.finished.then(onFinished);
}

export function setX(element: ElementOrSelector, amount: number) {
  let animation = animate(
    element,
    {
      x: `${amount}px`,
    },
    {
      easing: "linear",
      duration: 0,
    }
  );

  animation.finish();
}
