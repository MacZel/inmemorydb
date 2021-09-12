import {
  blue,
  green,
  red,
  yellow,
} from "https://deno.land/std@0.105.0/fmt/colors.ts";

import { Terminal } from "../shared/io/terminal.ts";
import { InMemoryDB } from "./db.ts";

enum CommandKey {
  BEGIN = "BEGIN",
  COMMIT = "COMMIT",
  COUNT = "COUNT",
  DELETE = "DELETE",
  GET = "GET",
  ROLLBACK = "ROLLBACK",
  SET = "SET",
}

const KEY_FORMAT = "[a-zA-Z][a-zA-Z0-9]*";
const KEY_TYPE = "string";
const VALUE_FORMAT = "[0-9]+";
const VALUE_TYPE = "int";

const COMMAND_PATTERNS = {
  [CommandKey.BEGIN]: CommandKey.BEGIN,
  [CommandKey.COMMIT]: CommandKey.COMMIT,
  [CommandKey.COUNT]: `${CommandKey.COUNT} (${VALUE_FORMAT})`,
  [CommandKey.DELETE]: `${CommandKey.DELETE} (${KEY_FORMAT})`,
  [CommandKey.GET]: `${CommandKey.GET} (${KEY_FORMAT})`,
  [CommandKey.ROLLBACK]: CommandKey.ROLLBACK,
  [CommandKey.SET]: `${CommandKey.SET} (${KEY_FORMAT}) (${VALUE_FORMAT})`,
};
const getCommandRegExp = (commandKey: CommandKey) => {
  const commandPattern = COMMAND_PATTERNS[commandKey];
  return new RegExp(`^${commandPattern}$`);
};

export class InMemoryDBCli extends Terminal {
  private readonly STARTUP_LINES = [
    "Demo In-memory database.",
    `Available commands: ${Object.values(CommandKey).join(", ")}.`,
  ];

  public constructor(private readonly db: InMemoryDB) {
    super();
  }

  public async run() {
    await this.printMultiline(this.STARTUP_LINES, { formatter: green });

    while (true) {
      const line = await this.read();

      this.lineHandler(line);
    }
  }

  private lineHandler(line: string) {
    switch (line.split(" ")[0]) {
      case CommandKey.BEGIN:
        if (line.match(getCommandRegExp(CommandKey.BEGIN))) {
          this.db.begin();
        } else {
          this.error(`Invalid query. Try: ${CommandKey.BEGIN}`);
        }
        break;
      case CommandKey.COMMIT:
        if (line.match(getCommandRegExp(CommandKey.COMMIT))) {
          !this.db.commit() &&
            this.warn("NO TRANSACTIONS");
        } else {
          this.error(`Invalid query. Try: ${CommandKey.COMMIT}`);
        }
        break;
      case CommandKey.COUNT:
        const countArgs = line.match(getCommandRegExp(CommandKey.COUNT));
        if (countArgs) {
          const value = this.db.count(parseInt(countArgs[1]));
          this.info(value.toString());
        } else {
          this.error(
            `Invalid query. Try: ${CommandKey.COUNT} <value: ${VALUE_TYPE}>`,
          );
        }
        break;
      case CommandKey.DELETE:
        const deleteArgs = line.match(getCommandRegExp(CommandKey.DELETE));
        if (deleteArgs) {
          !this.db.delete(deleteArgs[1]) &&
            this.warn("NULL");
        } else {
          this.error(
            `Invalid query. Try: ${CommandKey.DELETE} <key: ${KEY_TYPE}>`,
          );
        }
        break;
      case CommandKey.GET:
        const getArgs = line.match(getCommandRegExp(CommandKey.GET));
        if (getArgs) {
          const value = this.db.get(getArgs[1]);
          value?.toString() ? this.info(value.toString()) : this.warn("NULL");
        } else {
          this.error(
            `Invalid query. Try: ${CommandKey.GET} <key: ${KEY_TYPE}>`,
          );
        }
        break;
      case CommandKey.ROLLBACK:
        if (line.match(getCommandRegExp(CommandKey.ROLLBACK))) {
          !this.db.rollback() &&
            this.warn("NO TRANSACTIONS");
        } else {
          this.error(`Invalid query. Try: ${CommandKey.ROLLBACK}`);
        }
        break;
      case CommandKey.SET:
        const setArgs = line.match(getCommandRegExp(CommandKey.SET));
        if (setArgs) {
          this.db.set(setArgs[1], parseInt(setArgs[2]));
        } else {
          this.error(
            `Invalid query. Try: ${CommandKey.SET} <key: ${KEY_TYPE}> <value: ${VALUE_TYPE}>`,
          );
        }
        break;

      default:
        this.error("Unknown operation");
        break;
    }
  }

  private info(line: string) {
    this.printLine(line, { formatter: blue });
  }

  private warn(line: string) {
    this.printLine(line, { formatter: yellow });
  }

  private error(line: string) {
    this.printLine(line, { formatter: red });
  }
}
