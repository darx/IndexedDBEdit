export default function clickOutside(node: Element) {
  const handleClick = (event: Event) => {
    if (!node.contains(event.target as Element)) {
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