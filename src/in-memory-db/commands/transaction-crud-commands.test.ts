import { assertEquals } from "https://deno.land/std@0.105.0/testing/asserts.ts";

import { Stack } from "../../shared/data-structures/stack.ts";
import { Transaction } from "../transaction.ts";
import { TransactionCrudCommands } from "./transaction-crud-commands.ts";

Deno.test(".count() - should call parent count method when transactions stack is empty", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  const commands = new TransactionCrudCommands(
    valueStore,
    valueCount,
    transactions,
  );

  assertEquals(commands.count(23), 2);
});

Deno.test(".count() - should return value count from transaction when transactions stack is not empty", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  transactions.push(
    new Transaction({ "b": 24, "d": 25 }, { 23: 1, 24: 2, 25: 1 }),
  );
  const commands = new TransactionCrudCommands(
    valueStore,
    valueCount,
    transactions,
  );

  assertEquals(commands.count(23), 1);
  assertEquals(commands.count(26), 0);
});

Deno.test(".delete() - should call parent delete method when transactions stack is empty", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  const commands = new TransactionCrudCommands(
    valueStore,
    valueCount,
    transactions,
  );

  assertEquals(commands.delete("a"), true);
  assertEquals(valueStore, { "b": 23, "c": 24 });
  assertEquals(valueCount, { 23: 1, 24: 1 });
});

Deno.test(".delete() - should decrement value count and unset value store when key value pair is present in transaction", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  transactions.push(
    new Transaction({ "b": 24, "d": 25 }, { 23: 1, 24: 2, 25: 1 }),
  );
  const commands = new TransactionCrudCommands(
    valueStore,
    valueCount,
    transactions,
  );

  assertEquals(commands.delete("b"), true);
  assertEquals(
    transactions.peek(),
    new Transaction({ "b": null, "d": 25 }, { 23: 1, 24: 1, 25: 1 }),
  );
});

Deno.test(".delete() - should decrement value count and unset value store when key value pair is present in value store", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  transactions.push(
    new Transaction({ "d": 25 }, { 23: 1, 24: 1, 25: 1 }),
  );
  const commands = new TransactionCrudCommands(
    valueStore,
    valueCount,
    transactions,
  );

  assertEquals(commands.delete("b"), true);
  assertEquals(
    transactions.peek(),
    new Transaction({ "b": null, "d": 25 }, { 23: 0, 24: 1, 25: 1 }),
  );
});

Deno.test(".get() - should call parent get method when transactions stack is empty", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  const commands = new TransactionCrudCommands(
    valueStore,
    valueCount,
    transactions,
  );

  assertEquals(commands.get("b"), 23);
});

Deno.test(".get() - should return value from transaction when transactions stack is not empty", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  transactions.push(
    new Transaction({ "d": 25 }, { 23: 1, 24: 1, 25: 1 }),
  );
  const commands = new TransactionCrudCommands(
    valueStore,
    valueCount,
    transactions,
  );

  assertEquals(commands.get("d"), 25);
});

Deno.test(".get() - should return 'null' when key is not present in the transaction", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  transactions.push(
    new Transaction({ "d": 25 }, { 23: 1, 24: 1, 25: 1 }),
  );
  const commands = new TransactionCrudCommands(
    valueStore,
    valueCount,
    transactions,
  );

  assertEquals(commands.get("b"), null);
});

Deno.test(".set() - should call parent set method when transactions stack is empty", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  const commands = new TransactionCrudCommands(
    valueStore,
    valueCount,
    transactions,
  );

  commands.set("b", 24);

  assertEquals(valueStore, { "a": 23, "b": 24, "c": 24 });
  assertEquals(valueCount, { 23: 1, 24: 2 });
});

Deno.test(".set() - should decrement/initialize value count in transaction when key value pair is present in transaction", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  transactions.push(
    new Transaction({ "d": 25 }, { 23: 1, 24: 1, 25: 1 }),
  );
  const commands = new TransactionCrudCommands(
    valueStore,
    valueCount,
    transactions,
  );

  commands.set("d", 26);

  assertEquals(
    transactions.peek(),
    new Transaction({ "d": 26 }, { 23: 1, 24: 1, 25: 0, 26: 1 }),
  );
});

Deno.test(".set() - should decrement/initialize value count in transaction when key value pair is present in value store", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const transactions = new Stack<Transaction>();
  transactions.push(
    new Transaction({ "d": 25 }, { 23: 1, 24: 1, 25: 1 }),
  );
  const commands = new TransactionCrudCommands(
    valueStore,
    valueCount,
    transactions,
  );

  commands.set("b", 26);

  assertEquals(
    transactions.peek(),
    new Transaction({ "b": 26, "d": 25 }, { 23: 0, 24: 1, 25: 1, 26: 1 }),
  );
});
