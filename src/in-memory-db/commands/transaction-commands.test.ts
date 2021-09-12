import { assertEquals } from "https://deno.land/std@0.105.0/testing/asserts.ts";

import { Stack } from "../../shared/data-structures/stack.ts";
import { Transaction } from "../transaction.ts";
import { TransactionCommands } from "./transaction-commands.ts";

Deno.test(".begin() - should push new transaction when transactions stack is empty", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  const commands = new TransactionCommands(
    valueStore,
    valueCount,
    transactions,
  );

  commands.begin();

  assertEquals(transactions.peek(), new Transaction({}, { 23: 2, 24: 1 }));
});

Deno.test(".begin() - should push transaction with current transaction snapshots when transactions stack is not empty", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  transactions.push(
    new Transaction({ "b": 24, "d": 25 }, { 23: 1, 24: 2, 25: 1 }),
  );
  const commands = new TransactionCommands(
    valueStore,
    valueCount,
    transactions,
  );

  commands.begin();

  assertEquals(
    transactions.peek(),
    new Transaction({ "b": 24, "d": 25 }, { 23: 1, 24: 2, 25: 1 }),
  );
});

Deno.test(".commit() - should return 'false' when transactions stack is empty", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  const commands = new TransactionCommands(
    valueStore,
    valueCount,
    transactions,
  );

  assertEquals(commands.commit(), false);
});

Deno.test(".commit() - should return 'true' when transactions stack is not empty and commit pending transactions", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  transactions.push(
    new Transaction({ "a": null, "b": 24, "d": 25 }, { 23: 0, 24: 2, 25: 1 }),
  );
  const commands = new TransactionCommands(
    valueStore,
    valueCount,
    transactions,
  );

  assertEquals(commands.commit(), true);
  assertEquals(valueStore, { "b": 24, "c": 24, "d": 25 });
  assertEquals(valueCount, { 24: 2, 25: 1 });
  assertEquals(transactions.peek(), undefined);
});

Deno.test(".rollback() - should return 'false' when transactions stack is empty", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  const commands = new TransactionCommands(
    valueStore,
    valueCount,
    transactions,
  );

  assertEquals(commands.rollback(), false);
});

Deno.test(".rollback() - should return 'true' when transactions stack is not empty and rollback last transaction", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  transactions.push(
    new Transaction({ "a": null, "b": 24, "d": 25 }, { 23: 0, 24: 2, 25: 1 }),
  );
  const commands = new TransactionCommands(
    valueStore,
    valueCount,
    transactions,
  );

  assertEquals(commands.rollback(), true);
  assertEquals(transactions.peek(), undefined);
});
