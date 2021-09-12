import { assertEquals } from "https://deno.land/std@0.105.0/testing/asserts.ts";

import { InMemoryDB } from "./db.ts";

Deno.test("scenario 1", () => {
  const db = new InMemoryDB();

  db.set("a", 1);

  assertEquals(db.get("a"), 1);
});

Deno.test("scenario 2", () => {
  const db = new InMemoryDB();

  assertEquals(db.get("a"), null);
});

Deno.test("scenario 3", () => {
  const db = new InMemoryDB();

  db.set("a", 1);

  assertEquals(db.delete("a"), true);
});

Deno.test("scenario 4", () => {
  const db = new InMemoryDB();

  assertEquals(db.delete("a"), false);
});

Deno.test("scenario 5", () => {
  const db = new InMemoryDB();

  db.set("a", 10);
  db.set("b", 20);
  db.set("c", 10);
  db.set("d", 10);

  assertEquals(db.count(10), 3);
  assertEquals(db.count(20), 1);
});

Deno.test("scenario 6", () => {
  const db = new InMemoryDB();

  assertEquals(db.count(10), 0);
});

Deno.test("scenario 7", () => {
  const db = new InMemoryDB();

  db.set("a", 10);
  db.set("b", 10);
  db.set("c", 10);
  db.set("a", 20);

  assertEquals(db.count(10), 2);
  assertEquals(db.count(20), 1);
});

Deno.test("scenario 8", () => {
  const db = new InMemoryDB();

  db.set("a", 10);
  db.set("b", 10);
  db.set("c", 10);
  db.set("d", 20);
  db.delete("a");
  db.delete("b");
  db.delete("c");
  db.delete("d");

  assertEquals(db.count(10), 0);
  assertEquals(db.count(20), 0);
});

Deno.test("scenario 9", () => {
  const db = new InMemoryDB();

  db.set("a", 10);
  db.set("b", 20);
  db.delete("b");

  assertEquals(db.commit(), false);
  assertEquals(db.rollback(), false);
});

Deno.test("scenario 10", () => {
  const db = new InMemoryDB();

  db.set("a", 10);
  db.begin();
  db.set("a", 20);
  db.set("b", 20);

  assertEquals(db.get("a"), 20);
  assertEquals(db.get("b"), 20);
  assertEquals(db.count(10), 0);
  assertEquals(db.count(20), 2);
});

Deno.test("scenario 11", () => {
  const db = new InMemoryDB();

  db.set("a", 10);
  db.begin();
  db.delete("a");

  assertEquals(db.get("a"), null);
  assertEquals(db.count(10), 0);
});

Deno.test("scenario 12", () => {
  const db = new InMemoryDB();

  db.set("a", 10);
  db.begin();
  db.set("a", 20);
  db.begin();
  db.set("a", 30);

  assertEquals(db.get("a"), 30);
  assertEquals(db.count(10), 0);
  assertEquals(db.count(20), 0);
  assertEquals(db.count(30), 1);
});

Deno.test("scenario 13", () => {
  const db = new InMemoryDB();

  db.set("a", 10);
  db.begin();
  db.set("a", 20);
  db.set("b", 20);
  db.rollback();

  assertEquals(db.get("a"), 10);
  assertEquals(db.get("b"), null);
  assertEquals(db.count(10), 1);
  assertEquals(db.count(20), 0);
});

Deno.test("scenario 14", () => {
  const db = new InMemoryDB();

  db.set("a", 10);
  db.begin();
  db.delete("a");
  db.rollback();

  assertEquals(db.get("a"), 10);
  assertEquals(db.count(10), 1);
});

Deno.test("scenario 15", () => {
  const db = new InMemoryDB();

  db.set("a", 10);
  db.begin();
  db.set("a", 20);
  db.begin();
  db.set("a", 30);
  db.rollback();

  assertEquals(db.get("a"), 20);
  assertEquals(db.count(10), 0);
  assertEquals(db.count(20), 1);
  assertEquals(db.count(30), 0);
});

Deno.test("scenario 16", () => {
  const db = new InMemoryDB();

  db.set("a", 10);
  db.begin();
  db.set("a", 20);
  db.begin();
  db.delete("a");
  db.set("b", 20);
  db.commit();

  assertEquals(db.get("a"), null);
  assertEquals(db.get("b"), 20);
  assertEquals(db.count(10), 0);
  assertEquals(db.count(20), 1);
  assertEquals(db.rollback(), false);
});
