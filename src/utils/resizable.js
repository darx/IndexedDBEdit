export default function resizable(element, postion) {
  const map = { right: "east", left: "west", top: "north", bottom: "south" };
  const postions = !postion ? Object.keys(map) : [].concat(postion);

  const grabbers = postions.map((x) => {
    const elem = document.createElement("div");

    elem.direction = map[x];
    elem.classList.add("grabber", x);

    return elem;
  });

  let active = null;
  let initialPos = null;
  let initialRect = null;

  const onMouseDown = (e) => {
    active = e.target;

    const rect = element.getBoundingClientRect();
    const parent = element.parentElement.getBoundingClientRect();

    initialRect = {
      width: rect.width,
      height: rect.height,
      left: rect.left - parent.left,
      top: rect.top - parent.top,
    };

    initialPos = { x: e.pageX, y: e.pageY };
    active.classList.add("selected");
  };

  const onMouseUp = () => {
    if (!active) return;

    active.classList.remove("selected");

    active = null;
    initialPos = null;
    initialRect = null;
  };

  const onMove = (e) => {
    if (!active) return;

    let delta;
    const direction = active.direction;

    switch (direction) {
      case "north":
        delta = initialPos.y - e.pageY;
        element.style.top = initialRect.top - delta + "px";
        element.style.height = initialRect.height + delta + "px";
        break;
      case "east":
        delta = e.pageX - initialPos.x;
        element.style.width = initialRect.width + delta + "px";
        break;
      case "south":
        delta = e.pageY - initialPos.y;
        element.style.height = initialRect.height + delta + "px";
        break;
      case "west":
        delta = initialPos.x - e.pageX;
        element.style.left = initialRect.left - delta + "px";
        element.style.width = initialRect.width + delta + "px";
        break;
    }
  };

  grabbers.forEach((grabber) => {
    element.appendChild(grabber);
    grabber.addEventListener("mousedown", onMouseDown);
  });

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onMouseUp);

  return {
    destroy() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", onMouseDown);

      grabbers.forEach((grabber) => element.removeChild(grabber));
    },
  };
}
