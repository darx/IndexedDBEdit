export default function clickOutside(node) {
  const handleClick = (event) => {
    if (!node.contains(event.target)) {
      setTimeout(() => {
        node.dispatchEvent(new CustomEvent("outclick"));
      }, 10);
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
};