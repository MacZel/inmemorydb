import { Mixed } from "https://deno.land/x/class_mixins@v0.1.3/index.ts";

import { Stack } from "../../shared/data-structures/stack.ts";
import { Transaction } from "../transaction.ts";
import { Count, Key, Value, ValueCount, ValueStore } from "../types.ts";
import { BasicCrudCommands } from "./basic-crud-commands.ts";

export interface TransactionCrudCommands extends BasicCrudCommands {}

export class TransactionCrudCommands extends Mixed(BasicCrudCommands)
  implements TransactionCrudCommands {
  public constructor(
    protected valueStore: ValueStore = {},
    protected valueCount: ValueCount = {},
    protected transactions: Stack<Transaction> = new Stack<Transaction>(),
  ) {
    super();
  }

  public count(value: Value): Count {
    const transaction = this.transactions.peek();

    if (!transaction) return super.count(value);

    return value in transaction.valueCount ? transaction.valueCount[value] : 0;
  }

  public delete(key: Key): boolean {
    const transaction = this.transactions.pop();

    if (!transaction) return super.delete(key);

    if (key in transaction.valueStore) {
      const { [key]: deletedValue } = transaction.valueStore;
      if (deletedValue !== null) transaction.valueCount[deletedValue] -= 1;
    } else if (key in this.valueStore) {
      const { [key]: deletedValue } = this.valueStore;
      if (deletedValue !== null) transaction.valueCount[deletedValue] -= 1;
    } else return false;

    transaction.valueStore[key] = null;

    this.transactions.push(transaction);
    return true;
  }

  public get(key: Key): Value | null {
    const transaction = this.transactions.peek();

    if (!transaction) return super.get(key);

    return key in transaction.valueStore ? transaction.valueStore[key] : null;
  }

  public set(key: Key, value: Value): void {
    const transaction = this.transactions.pop();

    if (!transaction) {
      super.set(key, value);
      return;
    }

    const prevTransactionValue = transaction.valueStore[key];
    const prevValue = this.valueStore[key];
    if (
      key in transaction.valueStore && prevTransactionValue !== value &&
      prevTransactionValue !== null
    ) {
      transaction.valueCount[prevTransactionValue] -= 1;
    } else if (
      key in this.valueStore && prevValue !== value && prevValue !== null
    ) {
      transaction.valueCount[prevValue] -= 1;
    }

    transaction.valueStore[key] = value;
    transaction.valueCount[value] = value in transaction.valueCount
      ? transaction.valueCount[value] + 1
      : 1;

    this.transactions.push(transaction);
  }
}
