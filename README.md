# In-memory DB

Having fun recreating basic Redis functionality in TypeScript. Furthermore exploring Deno.
DB interface accepts strings as keys and integers as values.
Supported commands: BEGIN, COMMIT, COUNT, DELETE, GET, ROLLBACK, SET.

## Setup
### Installation

Follow [Deno installation manual](https://deno.land/manual/getting_started/installation)

### Running CLI

Run `deno run src/main.ts`

### Running tests

Run `deno test`

## Querying database

Querying in-memory database is possible either directly through instantiation of the `InMemoryDB` class:
```typescript
    import { InMemoryDB } from "./in-memory-db/db.ts";

    const db = new InMemoryDB();

    db.set("a", 23);
    const a = db.get("a");
```
Another option is to use the CLI:
Run `deno run src/main.ts`
In response you should be presented with the database terminal:
```bash
Demo In-memory database.
Available commands: BEGIN, COMMIT, COUNT, DELETE, GET, ROLLBACK, SET.

```

### BEGIN

Marks the beginning of the transaction block. You are able to have nested transaction blocks.
TS:
```typescript
    db.begin()
```

CLI:
```bash
BEGIN
```

### COMMIT

Commits all open transactions. If no transaction is present "NO TRANSACTIONS" is returned.
TS:
```typescript
    db.commit()
```

CLI:
```bash
COMMIT
```

### COUNT

Returns the value count. That is how many database records hold the specific value.
TS:
```typescript
    db.count("a")
```

CLI:
```bash
COUNT a
```

### DELETE

Deletes the record. If no record is present "NULL" is returned.
TS:
```typescript
    db.delete("a")
```

CLI:
```bash
DELETE a
```

### GET

Returns the records value. If no record is present "NULL" is returned.
TS:
```typescript
    db.get("a")
```

CLI:
```bash
GET a
```

### ROLLBACK

Rollbacks recent open transaction. If no transaction is present "NO TRANSACTIONS" is returned.
TS:
```typescript
    db.rollback()
```

CLI:
```bash
ROLLBACK
```


### SET

Sets the record.
TS:
```typescript
    db.set("a", 23)
```

CLI:
```bash
SET a 23
```
