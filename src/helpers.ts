export function clearArray(arr) {
  return arr.splice(0, arr.length);
}

export const outerHeight = (el) => {
  let height = el.offsetHeight;
  let style = window.getComputedStyle(el);
  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
};
