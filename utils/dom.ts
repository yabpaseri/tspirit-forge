/**
 * メソッドチェーン可能な DOM 要素ビルダー
 */
class UIBuilder<K extends keyof HTMLElementTagNameMap> {
  #e: HTMLElementTagNameMap[K];

  constructor(tag: K) {
    this.#e = document.createElement(tag);
  }

  id(id: string) {
    this.#e.id = id;
    return this;
  }

  classes(...classes: string[]) {
    this.#e.classList.add(...classes);
    return this;
  }

  text(content: string) {
    this.#e.textContent = content;
    return this;
  }

  style(fn: (css: CSSStyleDeclaration) => void) {
    fn(this.#e.style);
    return this;
  }

  append(...nodes: (string | Node)[]) {
    this.#e.append(...nodes);
    return this;
  }

  prepend(...nodes: (string | Node)[]) {
    this.#e.prepend(...nodes);
    return this;
  }

  appendTo(parent: HTMLElement) {
    parent.append(this.#e);
    return this;
  }

  prependTo(parent: HTMLElement) {
    parent.prepend(this.#e);
    return this;
  }

  done(): HTMLElementTagNameMap[K] {
    return this.#e;
  }
}

export const ui = <K extends keyof HTMLElementTagNameMap>(tag: K) => new UIBuilder(tag);
