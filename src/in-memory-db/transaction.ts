import { ValueCount, ValueStore } from "./types.ts";

export class Transaction {
  private valueStoreSnapshot: ValueStore;
  private valueCountSnapshot: ValueCount;

  public constructor(valueStore: ValueStore, valueCount: ValueCount) {
    this.valueStoreSnapshot = valueStore;
    this.valueCountSnapshot = valueCount;
  }

  public get valueStore(): ValueStore {
    return this.valueStoreSnapshot;
  }

  public get valueCount(): ValueCount {
    return this.valueCountSnapshot;
  }
}
