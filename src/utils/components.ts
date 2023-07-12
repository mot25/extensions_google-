export const createElementNode = (tag: keyof HTMLElementTagNameMap, classes?: string[]) => {
  const node = document.createElement(tag)
  classes?.forEach(clas => {
    node.classList.add(clas)
  });
  return node
}
export class RenderWarningTextInPopup {
  private warningText: string
  private body = document.body
  constructor(message: string) {
      this.warningText = message;
  }

  render() {
      const wrapperWarnign = createElementNode('div', ['wrapperWarnign'])
      const warningText = createElementNode('span', ['warningText'])
      warningText.innerText = this.warningText
      wrapperWarnign.append(warningText)
      this.body.appendChild(wrapperWarnign);
      setTimeout(() => {
          wrapperWarnign.remove()
      }, 3000)
  }
}