import { Mixed } from "https://deno.land/x/class_mixins@v0.1.3/index.ts";

import { TransactionCrudCommands } from "./commands/transaction-crud-commands.ts";
import { TransactionCommands } from "./commands/transaction-commands.ts";

export class InMemoryDB
  extends Mixed(TransactionCrudCommands, TransactionCommands) {}
