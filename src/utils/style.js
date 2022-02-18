export default function style(elem, initialStyleSet) {
  function update(newStyleSet) {
    for (var CamelCasedName in newStyleSet) {
      if (newStyleSet.hasOwnProperty(CamelCasedName)) {
        elem.style[CamelCasedName] = newStyleSet[CamelCasedName];
      }
    }
  }

  update(initialStyleSet);
  return { update: update };
};
