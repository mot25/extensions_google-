export const createElementNode = (tag: keyof HTMLElementTagNameMap, classes?: string[]) => {
  const node = document.createElement(tag)
  classes?.forEach(clas => {
    node.classList.add(clas)
  });
  return node
}

export class useState<T> {
  value: T
  private cb: VoidFunction
  private initialValue: T
  constructor(value: T, cb?: VoidFunction) {
    this.value = value;
    this.initialValue = value;
    this.cb = cb;

  }

  update(newValue: T) {
    this.value = newValue;
    this.cb && this.cb()
  }

  reset() {
    this.value = this.initialValue;
  }
}