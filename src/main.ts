import { InMemoryDB } from "./in-memory-db/db.ts";
import { InMemoryDBCli } from "./in-memory-db/cli.ts";

const db = new InMemoryDB();
const cli = new InMemoryDBCli(db);

cli.run();
