export const createElementNode = (tag: keyof HTMLElementTagNameMap, classes?: string[]) => {
    const node = document.createElement(tag)
    classes.forEach(clas => {
      node.classList.add(clas + 'ex')
    });
    return node
  }