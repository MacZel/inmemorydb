import { assertEquals } from "https://deno.land/std@0.105.0/testing/asserts.ts";

import { BasicCrudCommands } from "./basic-crud-commands.ts";

Deno.test(".count() - should return value count", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const commands = new BasicCrudCommands(valueStore, valueCount);

  assertEquals(commands.count(23), 2);
  assertEquals(commands.count(24), 1);
  assertEquals(commands.count(25), 0);
});

Deno.test(".delete() - should return 'false' when key not present in value store without modifications to value store and value count", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const commands = new BasicCrudCommands(valueStore, valueCount);

  assertEquals(commands.delete("d"), false);
  assertEquals(valueStore, { "a": 23, "b": 23, "c": 24 });
  assertEquals(valueCount, { 23: 2, 24: 1 });
});

Deno.test(".delete() - should return 'true' when key present in value store with modifications to value store and value count", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const commands = new BasicCrudCommands(valueStore, valueCount);

  assertEquals(commands.delete("a"), true);
  assertEquals(valueStore, { "b": 23, "c": 24 });
  assertEquals(valueCount, { 23: 1, 24: 1 });
});

Deno.test(".get() - should return value when key present in value store", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const commands = new BasicCrudCommands(valueStore, valueCount);

  assertEquals(commands.get("a"), 23);
});

Deno.test(".get() - should return 'null' when key not present in value store", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const commands = new BasicCrudCommands(valueStore, valueCount);

  assertEquals(commands.get("d"), null);
});

Deno.test(".set() - should decrement and initialize value count on key value pair change in value store", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const commands = new BasicCrudCommands(valueStore, valueCount);

  commands.set("a", 25);

  assertEquals(valueStore, { "a": 25, "b": 23, "c": 24 });
  assertEquals(valueCount, { 23: 1, 24: 1, 25: 1 });
});

Deno.test(".set() - should increment value count on new key value pair", () => {
  const valueStore = { "a": 23, "b": 23, "c": 24 };
  const valueCount = { 23: 2, 24: 1 };
  const commands = new BasicCrudCommands(valueStore, valueCount);

  commands.set("d", 24);

  assertEquals(valueStore, { "a": 23, "b": 23, "c": 24, "d": 24 });
  assertEquals(valueCount, { 23: 2, 24: 2 });
});
