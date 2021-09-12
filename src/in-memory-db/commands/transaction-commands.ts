import { Stack } from "../../shared/data-structures/stack.ts";
import { Transaction } from "../transaction.ts";
import { ValueCount, ValueStore } from "../types.ts";

export interface TransactionCommands {
  begin(): void;
  commit(): boolean;
  rollback(): boolean;
}

export class TransactionCommands implements TransactionCommands {
  public constructor(
    protected valueStore: ValueStore = {},
    protected valueCount: ValueCount = {},
    protected transactions: Stack<Transaction> = new Stack<Transaction>(),
  ) {}

  public begin(): void {
    const transaction = this.transactions.peek();

    if (!transaction) {
      this.transactions.push(new Transaction({}, { ...this.valueCount }));
    } else {
      this.transactions.push(
        new Transaction({ ...transaction.valueStore }, {
          ...transaction.valueCount,
        }),
      );
    }
  }

  public commit(): boolean {
    const transaction = this.transactions.pop();

    if (!transaction) {
      return false;
    }

    for (const [key, value] of Object.entries(transaction.valueStore)) {
      if (value === null) {
        delete this.valueStore[key];
      } else {
        this.valueStore[key] = value;
      }
    }

    for (
      const [value, count] of Object.entries(transaction.valueCount).map((
        [value, count],
      ) => [parseInt(value), count])
    ) {
      if (count === 0) {
        delete this.valueCount[value];
      } else {
        this.valueCount[value] = count;
      }
    }

    while (this.transactions.peek()) {
      this.transactions.pop();
    }
    return true;
  }

  public rollback(): boolean {
    const transaction = this.transactions.pop();

    return Boolean(transaction);
  }
}
