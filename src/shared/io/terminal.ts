import { EOL } from "https://deno.land/std@0.105.0/fs/eol.ts";

interface PrintOptions {
  eol?: EOL | string;
  formatter?: (str: string) => string;
}

export class Terminal {
  public async prompt(message: string = ""): Promise<string> {
    await this.printLine(message + ":", { eol: " " });
    return await this.read();
  }

  public async printMultiline(
    lines: string[],
    options?: PrintOptions,
  ): Promise<void> {
    const eol = options?.eol ?? EOL.CRLF;
    await this.printLine(lines.join(eol), options);
  }

  public async printLine(line: string, options?: PrintOptions): Promise<void> {
    const formattedLine = options?.formatter ? options.formatter(line) : line;
    const eol = options?.eol ?? EOL.CRLF;
    await this.write(formattedLine + eol);
  }

  public async read(): Promise<string> {
    const buffer = new Uint8Array(1024);
    const endIndex = <number> await Deno.stdin.read(buffer);
    return new TextDecoder().decode(buffer.subarray(0, endIndex)).trim();
  }

  public async write(line: string): Promise<void> {
    await Deno.stdout.write(new TextEncoder().encode(line));
  }
}
