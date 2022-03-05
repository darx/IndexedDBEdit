export default function debounce(fn, wait, callFirst) {
  let timeout = null;
  let debounced = null;

  const clear = () => {
    if (timeout) {
      clearTimeout(timeout);

      debounced = null;
      timeout = null;
    }
  };

  const flush = () => {
    const call = debounced;
    clear();

    if (call) call();
  };

  const debounceWrapper = function () {
    if (!wait) return fn.apply(this, arguments);

    const context = this;
    const args = arguments;
    const callNow = callFirst && !timeout;

    clear();

    debounced = () => fn.apply(context, args);

    timeout = setTimeout(() => {
      timeout = null;

      if (!callNow) {
        let call = debounced;
        debounced = null;

        return call();
      }
    }, wait);

    if (callNow) return debounced();
  };

  debounceWrapper.flush = flush;
  debounceWrapper.cancel = clear;

  return debounceWrapper;
};