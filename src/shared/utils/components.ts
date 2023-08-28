export const createElementNode = (
  tag: keyof HTMLElementTagNameMap,
  classes?: string[]
) => {
  const node = document.createElement(tag);
  classes?.forEach(clas => {
    node.classList.add(clas);
  });
  return node;
};
export class RenderWarningTextInPopup {
  private warningText: string;
  private body = document.body;
  constructor(message: string) {
    this.warningText = message;
  }

  render() {
    const wrapperWarning = createElementNode('div', ['wrapperWarning']);
    const warningText = createElementNode('span', ['warningText']);
    warningText.innerText = this.warningText;
    wrapperWarning.append(warningText);
    this.body.appendChild(wrapperWarning);
    setTimeout(() => {
      wrapperWarning.remove();
    }, 3000);
  }
}
