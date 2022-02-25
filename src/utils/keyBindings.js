export default function handleKeyBindings(node, keys, event = "click") {
  const handleKeyBinding = (e) => {
    const isBind =
      keys.filter((x) => {
        if (
          (typeof x === "string" && e[x] === true) ||
          (typeof x === "number" && e.which === x)
        )
          return x;
      }).length === keys.length;

    if (isBind) {
      setTimeout(() => {
        node.dispatchEvent(new CustomEvent(event));
      }, 10);
    }
  };

  window.addEventListener("keyup", handleKeyBinding, true);

  return {
    destroy() {
      window.removeEventListener("keyup", handleKeyBinding, true);
    },
  };
}
