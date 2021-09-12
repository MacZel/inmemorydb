export interface IStack<TItem> {
  push(item: TItem): number;
  pop(): TItem | undefined;
  peek(): TItem | undefined;
  readonly length: number;
  [Symbol.iterator](): Iterator<TItem>;
}

export class Stack<TItem> implements IStack<TItem> {
  private items: TItem[];

  public constructor(iterable: Iterable<TItem> = []) {
    this.items = [...iterable];
  }

  public *[Symbol.iterator]() {
    for (const item of this.items) yield item;
  }

  public get length(): number {
    return this.items.length;
  }

  public push(...items: TItem[]): number {
    return this.items.push(...items);
  }

  public peek(): TItem | undefined {
    return this.items[this.items.length - 1];
  }

  public pop(): TItem | undefined {
    return this.items.pop();
  }
}
