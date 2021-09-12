import { Count, Key, Value, ValueCount, ValueStore } from "../types.ts";

export interface BasicCrudCommands {
  get(key: Key): Value | null;
  set(key: Key, value: Value): void;
  delete(key: Key): boolean;
  count(value: Value): Count;
}

export class BasicCrudCommands implements BasicCrudCommands {
  public constructor(
    protected valueStore: ValueStore = {},
    protected valueCount: ValueCount = {},
  ) {}

  public count(value: Value): Count {
    return value in this.valueCount ? this.valueCount[value] : 0;
  }

  public delete(key: Key): boolean {
    if (!(key in this.valueStore)) return false;

    const deletedValue = this.valueStore[key];
    delete this.valueStore[key];
    if (deletedValue !== null) this.valueCount[deletedValue] -= 1;

    return true;
  }

  public get(key: Key): Value | null {
    return key in this.valueStore ? this.valueStore[key] : null;
  }

  public set(key: Key, value: Value): void {
    const prevValue = this.valueStore[key];
    if (key in this.valueStore && prevValue !== value && prevValue !== null) {
      this.valueCount[prevValue] -= 1;
    }

    this.valueStore[key] = value;
    this.valueCount[value] = value in this.valueCount
      ? this.valueCount[value] + 1
      : 1;
  }
}
